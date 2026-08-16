import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

export const config = {
  maxDuration: 60,
};

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

export const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

// ------------------------------------------------------------------
// ADMIN AUTH — HMAC-signed stateless token, PIN verified server-side.
// Token dies at TTL (12h); rotated secret rotates all tokens.
// ------------------------------------------------------------------
const ADMIN_PIN = process.env.ADMIN_PIN || 'clay2026';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'dev-only-secret-rotate-me';
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

const attemptStore = new Map<string, { count: number; firstAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

const clientIp = (req: express.Request) =>
  (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ||
  req.socket.remoteAddress ||
  'unknown';

function rateLimited(req: express.Request): boolean {
  const ip = clientIp(req);
  const now = Date.now();
  const rec = attemptStore.get(ip);
  if (!rec || now - rec.firstAt > WINDOW_MS) {
    attemptStore.set(ip, { count: 1, firstAt: now });
    return false;
  }
  rec.count += 1;
  attemptStore.set(ip, rec);
  return rec.count > MAX_ATTEMPTS;
}

function signToken(expiresAt: number): string {
  const payload = `${expiresAt}:${crypto.randomBytes(6).toString('hex')}`;
  const sig = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
  if (sig !== expected) return false;
  const expiresAt = Number(payload.split(':')[0]);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

// Middleware: gate admin-only routes.
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : (req.query.token as string | undefined);
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  next();
}

// ------------------------------------------------------------------
// ADMIN PIN — stored as scrypt hash in admin_config (DB), so admins
// can rotate the PIN in-app. ADMIN_PIN env is used only as first-run
// fallback and is migrated into the DB on first successful login or
// PIN change.
// ------------------------------------------------------------------
const PIN_KEY_LEN = 64;

function hashPin(pin: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pin, salt, PIN_KEY_LEN).toString('hex');
  return { salt, hash };
}

function verifyPinAgainst(pin: string, salt: string, hash: string): boolean {
  try {
    const candidate = crypto.scryptSync(pin, salt, PIN_KEY_LEN);
    const expected = Buffer.from(hash, 'hex');
    return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
  } catch {
    return false;
  }
}

async function getAdminPinConfig() {
  const supabase = getServerSupabase();
  if (!supabase) return null;
  try {
    const { data } = await supabase
      .from('admin_config')
      .select('pin_salt, pin_hash')
      .eq('id', 'admin')
      .maybeSingle();
    if (data && data.pin_salt && data.pin_hash) return data;
  } catch {
    /* not configured yet */
  }
  return null;
}

async function saveAdminPin(pin: string): Promise<boolean> {
  const supabase = getServerSupabase();
  if (!supabase) return false;
  const { salt, hash } = hashPin(pin);
  const { error } = await supabase
    .from('admin_config')
    .upsert(
      { id: 'admin', pin_salt: salt, pin_hash: hash, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    );
  return !error;
}

async function adminPinMatches(pin: string): Promise<boolean> {
  const cfg = await getAdminPinConfig();
  if (cfg) return verifyPinAgainst(pin, cfg.pin_salt, cfg.pin_hash);
  return pin === ADMIN_PIN;
}

// ------------------------------------------------------------------
// LEAD NOTIFICATION — push a formatted alert to the admin's Telegram.
// Free, gated on env; silently degrades when not configured.
// ------------------------------------------------------------------
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
  } catch (err: any) {
    console.error('Telegram notification error:', err.message);
  }
}

// ------------------------------------------------------------------
// PUBLIC RATE LIMIT — curb spam on public write endpoints (30 req/min/IP)
// ------------------------------------------------------------------
const publicStore = new Map<string, { count: number; firstAt: number }>();

function publicRateLimited(req: express.Request): boolean {
  const ip = clientIp(req);
  const now = Date.now();
  const rec = publicStore.get(ip);
  if (!rec || now - rec.firstAt > 60 * 1000) {
    publicStore.set(ip, { count: 1, firstAt: now });
    return false;
  }
  rec.count += 1;
  publicStore.set(ip, rec);
  return rec.count > 30;
}

// Helper to get server-side Supabase client
function getServerSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      return createClient(url, key);
    } catch (err) {
      console.warn('Error instantiating Supabase server client:', err);
    }
  }
  return null;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  const supabase = getServerSupabase();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    backend: 'Express Node.js',
    database: 'Supabase PostgreSQL',
    supabaseConnected: Boolean(supabase),
  });
});

// 2. Supabase configuration status
app.get('/api/supabase/config', (req, res) => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const hasKey = Boolean(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);

  res.json({
    configured: Boolean(url && hasKey),
    url: url ? `${url.substring(0, 15)}...` : null,
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
});

// 2b. Admin PIN verification → short-lived HMAC token
app.post('/api/admin/verify', async (req, res) => {
  const { pin } = req.body || {};
  if (typeof pin !== 'string' || pin.length === 0) {
    return res.status(400).json({ error: 'PIN required.' });
  }
  if (rateLimited(req)) {
    return res.status(429).json({ error: 'Too many attempts. Try again in 10 minutes.' });
  }
  const ok = await adminPinMatches(pin);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid PIN.' });
  }
  // First successful login with the env fallback → migrate into DB so
  // the PIN is persistent and UI-rotatable from now on.
  if (!(await getAdminPinConfig())) {
    await saveAdminPin(pin);
  }
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  res.json({ success: true, token: signToken(expiresAt), expiresAt });
});

// 2c. Change admin PIN — requires a valid admin token + current PIN
app.post('/api/admin/change-pin', requireAdmin, async (req, res) => {
  const { currentPin, newPin } = req.body || {};
  if (typeof newPin !== 'string' || newPin.length < 6) {
    return res.status(400).json({ error: 'PIN baru minimal 6 karakter.' });
  }
  if (typeof currentPin !== 'string' || currentPin.length === 0) {
    return res.status(400).json({ error: 'PIN saat ini wajib diisi.' });
  }
  if (rateLimited(req)) {
    return res.status(429).json({ error: 'Too many attempts. Try again in 10 minutes.' });
  }
  const curOk = await adminPinMatches(currentPin);
  if (!curOk) {
    return res.status(401).json({ error: 'PIN saat ini salah.' });
  }
  if (newPin === currentPin) {
    return res.status(400).json({ error: 'PIN baru harus berbeda dari PIN lama.' });
  }
  const saved = await saveAdminPin(newPin);
  if (!saved) {
    return res.status(503).json({ error: 'Database admin_config tidak tersedia.' });
  }
  res.json({ success: true, message: 'Admin PIN updated.' });
});

// 3. Submit contact inquiry
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, projectType, budget, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  if (publicRateLimited(req)) {
    return res.status(429).json({ error: 'Too many submissions. Try again later.' });
  }

  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          name,
          email,
          phone: phone || null,
          project_type: projectType || null,
          budget: budget || null,
          message,
          status: 'unread'
        }])
        .select();

      if (error) {
        console.error('Supabase message insert error:', error);
        return res.status(500).json({ error: error.message, savedToSupabase: false });
      }

      void sendTelegram(
        `<b>🆕 Lead Baru — Kontak</b>\n` +
        `👤 <b>${esc(name)}</b>\n` +
        `📧 ${esc(email)}${phone ? `\n📞 ${esc(phone)}` : ''}\n` +
        `🧩 Layanan: ${esc(projectType || '-')}\n` +
        `💰 Budget: ${esc(budget || '-')}\n` +
        `💬 ${esc(message).slice(0, 300) || '-'}`
      );

      return res.json({ success: true, message: 'Inquiry saved to Supabase successfully.', data: data?.[0] });
    } catch (err: any) {
      console.error('Server error saving contact message:', err);
    }
  }

  // Fallback response when Supabase credentials are pending
  res.json({
    success: true,
    savedToSupabase: false,
    message: 'Message received by backend service (Supabase config pending in .env).',
    timestamp: new Date().toISOString(),
  });
});

// 4. Submit estimate calculation
app.post('/api/estimates', async (req, res) => {
  const { clientName, clientEmail, clientPhone, serviceType, deliverables, urgency, estimatedPrice, estimatedPriceIdr, notes } = req.body;

  if (!clientName || !serviceType || (!clientEmail && !clientPhone)) {
    return res.status(400).json({ error: 'Client name, service type, and a contact (email or phone) are required.' });
  }
  if (publicRateLimited(req)) {
    return res.status(429).json({ error: 'Too many submissions. Try again later.' });
  }

  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .insert([{
          client_name: clientName,
          client_email: clientEmail || (clientPhone ? `wa:${clientPhone}` : null),
          client_phone: clientPhone || null,
          service_type: serviceType,
          deliverables: deliverables || [],
          urgency: urgency || 'Standard',
          estimated_price: estimatedPrice || 0,
          estimated_price_idr: estimatedPriceIdr || null,
          notes: notes || null,
          status: 'pending'
        }])
        .select();

      if (error) {
        console.error('Supabase estimate insert error:', error);
        return res.status(500).json({ error: error.message, savedToSupabase: false });
      }

      void sendTelegram(
        `<b>🆕 Lead Baru — Estimasi</b>\n` +
        `👤 <b>${esc(clientName)}</b>\n` +
        `📧 ${esc(clientEmail || clientPhone || '-')}\n` +
        `🧩 Layanan: ${esc(serviceType)}\n` +
        `⏱ Urgensi: ${esc(urgency || '-')}\n` +
        `💵 Est. Harga: ${esc(estimatedPrice || 0)} USD${estimatedPriceIdr ? ` / ${esc(estimatedPriceIdr)} IDR` : ''}\n` +
        `📦 Deliverables: ${(deliverables || []).length} item\n` +
        `📝 ${esc(notes || '-').slice(0, 300)}`
      );

      return res.json({ success: true, message: 'Estimate saved to Supabase successfully.', data: data?.[0] });
    } catch (err: any) {
      console.error('Server error saving estimate:', err);
    }
  }

  res.json({
    success: true,
    savedToSupabase: false,
    message: 'Estimate logged successfully.',
  });
});

// 5. Portfolio Projects GET API
app.get('/api/projects', async (req, res) => {
  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return res.json({ projects: data, source: 'supabase' });
      }
    } catch (err) {
      console.error('Supabase fetch projects error:', err);
    }
  }
  res.json({ projects: [], source: 'local' });
});

// 6. Portfolio Projects UPSERT (Create / Update) — ADMIN ONLY
app.post('/api/projects', requireAdmin, async (req, res) => {
  const project = req.body;
  if (!project || !project.id || !project.title) {
    return res.status(400).json({ error: 'Project ID and title are required.' });
  }

  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const row = {
        id: project.id,
        title: project.title,
        subtitle: project.subtitle || '',
        category: project.category || 'UI/UX',
        thumbnail: project.thumbnail || '',
        images: project.images || [],
        client: project.client || '',
        year: project.year || '',
        role: project.role || '',
        summary: project.summary || '',
        problem_statement: project.problemStatement || project.problem_statement || '',
        workflow_steps: project.workflowSteps || project.workflow_steps || [],
        solution: project.solution || '',
        results: project.results || [],
        tools: project.tools || [],
        live_url: project.liveUrl || project.live_url || '',
        featured: project.featured ?? false,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('projects')
        .upsert(row, { onConflict: 'id' })
        .select();

      if (error) {
        console.error('Supabase project upsert error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.json({ success: true, project: data?.[0] });
    } catch (err: any) {
      console.error('Server error saving project:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(503).json({ error: 'Supabase credentials not configured.' });
});

// 7. Projects DELETE — ADMIN ONLY
app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json({ success: true, id });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.status(503).json({ error: 'Supabase credentials not configured.' });
});

// 8. Seed / Sync initial projects (idempotent; payload = bundled seed data)
app.post('/api/projects/seed', async (req, res) => {
  const { projects } = req.body;
  if (!Array.isArray(projects) || projects.length === 0) {
    return res.status(400).json({ error: 'Projects array is required.' });
  }

  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const rows = projects.map((p: any) => ({
        id: p.id,
        title: p.title,
        subtitle: p.subtitle || '',
        category: p.category || 'UI/UX',
        thumbnail: p.thumbnail || '',
        images: p.images || [],
        client: p.client || '',
        year: p.year || '',
        role: p.role || '',
        summary: p.summary || '',
        problem_statement: p.problemStatement || p.problem_statement || '',
        workflow_steps: p.workflowSteps || p.workflow_steps || [],
        solution: p.solution || '',
        results: p.results || [],
        tools: p.tools || [],
        live_url: p.liveUrl || p.live_url || '',
        featured: p.featured ?? false,
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('projects')
        .upsert(rows, { onConflict: 'id' })
        .select();

      if (error) {
        console.error('Supabase seed projects error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.json({ success: true, count: data?.length || 0 });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.status(503).json({ error: 'Supabase credentials not configured.' });
});

// 9. Fetch Contact Messages — ADMIN ONLY
app.get('/api/messages', requireAdmin, async (req, res) => {
  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return res.json({ messages: data });
      }
    } catch (err) {
      console.error('Supabase fetch messages error:', err);
    }
  }
  res.json({ messages: [] });
});

// 9b. Mark message as read — ADMIN ONLY
app.patch('/api/messages/:id/read', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const supabase = getServerSupabase();
  if (!supabase) return res.status(503).json({ error: 'Supabase credentials not configured.' });
  try {
    const { error } = await supabase.from('messages').update({ status: 'read' }).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9c. Delete message — ADMIN ONLY
app.delete('/api/messages/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const supabase = getServerSupabase();
  if (!supabase) return res.status(503).json({ error: 'Supabase credentials not configured.' });
  try {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9d. Fetch estimate leads — ADMIN ONLY
app.get('/api/estimates', requireAdmin, async (req, res) => {
  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return res.json({ estimates: data });
    } catch (err) {
      console.error('Supabase fetch estimates error:', err);
    }
  }
  res.json({ estimates: [] });
});

// 9e. Track public analytics event (page view, project view, CV download, inquiry)
const EVENT_TYPES = ['page_visit', 'project_view', 'cv_download', 'inquiry'];

app.post('/api/events', async (req, res) => {
  const { type, page = null, label = null } = req.body || {};
  if (!EVENT_TYPES.includes(type)) {
    return res.status(400).json({ error: 'Unknown event type.' });
  }
  if (publicRateLimited(req)) {
    return res.status(429).json({ error: 'Too many requests.' });
  }
  const country = (req.headers['x-vercel-ip-country'] as string) || null;
  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('analytics_events').insert([{ event_type: type, page, label, country }]);
      if (error) {
        console.error('Supabase event insert error:', error);
        return res.status(500).json({ error: error.message });
      }
      return res.json({ success: true });
    } catch (err: any) {
      console.error('Server error tracking event:', err);
      return res.status(500).json({ error: err.message });
    }
  }
  // No DB? Accept silently so tracking degrades gracefully.
  res.json({ success: true, degraded: true });
});

// 9f. Analytics aggregate — ADMIN ONLY
app.get('/api/analytics', requireAdmin, async (req, res) => {
  const supabase = getServerSupabase();
  if (!supabase) return res.status(503).json({ error: 'Supabase credentials not configured.' });
  try {
    const [countsRes, projectsRes, countriesRes] = await Promise.all([
      supabase.from('analytics_events').select('event_type'),
      supabase.from('analytics_events').select('label').eq('event_type', 'project_view').not('label', 'is', null),
      supabase.from('analytics_events').select('country').not('country', 'is', null),
    ]);

    const counts: Record<string, number> = { page_visit: 0, project_view: 0, cv_download: 0, inquiry: 0 };
    for (const row of countsRes.data || []) {
      const t = row.event_type as string;
      if (counts[t] != null) counts[t] += 1;
    }

    const projMap = new Map<string, number>();
    for (const row of projectsRes.data || []) {
      const l = row.label as string;
      projMap.set(l, (projMap.get(l) || 0) + 1);
    }
    const topProjects = [...projMap.entries()]
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);

    const countryMap = new Map<string, number>();
    for (const row of countriesRes.data || []) {
      const c = row.country as string;
      countryMap.set(c, (countryMap.get(c) || 0) + 1);
    }
    const countries = [...countryMap.entries()]
      .map(([name, count]) => ({ country: name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    res.json({ counts, topProjects, countries });
  } catch (err: any) {
    console.error('Supabase analytics error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 9g. Asset upload (image / CV / PDF) — ADMIN ONLY.
// Uploads to a public Supabase Storage bucket, returns the public URL.
// Keeps heavy base64/data-URL payloads out of the DB and localStorage.
const ASSET_BUCKET = 'portfolio-assets';

app.post('/api/upload', requireAdmin, async (req, res) => {
  const { base64, fileType = 'application/octet-stream', folder = 'uploads' } = req.body || {};
  if (typeof base64 !== 'string' || base64.length === 0) {
    return res.status(400).json({ error: 'base64 payload required.' });
  }
  if (base64.length > 10 * 1024 * 1024) {
    return res.status(413).json({ error: 'File too large (max 10MB).' });
  }
  const buf = Buffer.from(base64, 'base64');
  const supabase = getServerSupabase();
  if (!supabase) return res.status(503).json({ error: 'Supabase credentials not configured.' });

  try {
    const { error: bucketError } = await supabase.storage.createBucket(ASSET_BUCKET, { public: true });
    if (bucketError && !String(bucketError.message).includes('already exists')) {
      console.error('Create bucket error:', bucketError.message);
    }
    const ext = (fileType.split('/')[1] || 'bin').replace(/[^a-z0-9]/gi, '').slice(0, 10) || 'bin';
    const safeFolder = String(folder).replace(/[^a-zA-Z0-9_-]/g, '');
    const objectPath = `${safeFolder}/${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;

    const { error } = await supabase.storage.from(ASSET_BUCKET).upload(objectPath, buf, {
      contentType: fileType,
      upsert: false,
    });
    if (error) return res.status(500).json({ error: error.message });

    const { data } = supabase.storage.from(ASSET_BUCKET).getPublicUrl(objectPath);
    res.json({ success: true, url: data.publicUrl });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// HEADLESS CONTENT CMS — editable editorial copy + FAQs
// ----------------------------------------------------

// 10. Fetch all page content
app.get('/api/content', async (req, res) => {
  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page')
        .order('section')
        .order('sort', { ascending: true });
      if (!error && data) return res.json({ rows: data });
    } catch (err) {
      console.error('Supabase fetch content error:', err);
    }
  }
  res.json({ rows: [] });
});

// 11. Upsert page content rows — ADMIN ONLY
app.post('/api/content', requireAdmin, async (req, res) => {
  const rows = req.body?.rows;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'rows array is required.' });
  }
  const supabase = getServerSupabase();
  if (!supabase) return res.status(503).json({ error: 'Supabase credentials not configured.' });
  try {
    const clean = rows.map((r: any) => ({
      id: r.id,
      page: r.page,
      section: r.section || 'general',
      field: r.field,
      type: r.type || 'text',
      values: r.values || {},
      sort: r.sort ?? 0,
      updated_at: new Date().toISOString(),
    }));
    const { data, error } = await supabase.from('page_content').upsert(clean, { onConflict: 'id' }).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, count: data?.length || 0 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Seed page content (bootstrap for fresh DB; bundled seed constant)
app.post('/api/content/seed', async (req, res) => {
  const rows = req.body?.rows;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'rows array is required.' });
  }
  const supabase = getServerSupabase();
  if (!supabase) return res.status(503).json({ error: 'Supabase credentials not configured.' });
  try {
    const clean = rows.map((r: any) => ({
      id: r.id,
      page: r.page,
      section: r.section || 'general',
      field: r.field,
      type: r.type || 'text',
      values: r.values || {},
      sort: r.sort ?? 0,
      updated_at: new Date().toISOString(),
    }));
    const { data, error } = await supabase.from('page_content').upsert(clean, { onConflict: 'id' }).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, count: data?.length || 0 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 13. Fetch FAQs
app.get('/api/faqs', async (req, res) => {
  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('sort', { ascending: true });
      if (!error && data) return res.json({ faqs: data });
    } catch (err) {
      console.error('Supabase fetch faqs error:', err);
    }
  }
  res.json({ faqs: [] });
});

// 14. Upsert FAQ (editor save + startup seed; content is public)
app.post('/api/faqs', async (req, res) => {
  const { id, sort, question, answer } = req.body || {};
  if (!id) return res.status(400).json({ error: 'id required.' });
  const supabase = getServerSupabase();
  if (!supabase) return res.status(503).json({ error: 'Supabase credentials not configured.' });
  try {
    const { data, error } = await supabase
      .from('faqs')
      .upsert({ id, sort: sort ?? 0, question: question || {}, answer: answer || {}, created_at: new Date().toISOString() }, { onConflict: 'id' })
      .select();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, faq: data?.[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 15. Delete FAQ — ADMIN ONLY
app.delete('/api/faqs/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const supabase = getServerSupabase();
  if (!supabase) return res.status(503).json({ error: 'Supabase credentials not configured.' });
  try {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 16. Auto-translate text via Gemini (used by dashboard editor)
app.post('/api/translate', async (req, res) => {
  const { text, target, source = 'en' } = req.body || {};
  if (!text || !target) return res.status(400).json({ error: 'text and target required.' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(501).json({ error: 'GEMINI_API_KEY not configured.' });
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const langNames: Record<string, string> = { en: 'English', id: 'Indonesian', ja: 'Japanese', ar: 'Arabic' };
    const result = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: `Translate the following text from ${langNames[source] || 'English'} to ${langNames[target] || target}. Return ONLY the translation, no quotes, no extra text.\n\n${text}`,
    });
    const translated = result.text?.trim() || text;
    res.json({ success: true, translated });
  } catch (err: any) {
    console.error('Translate error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Global error handler — uncaught async errors become clean JSON 500s
// (never leak stack traces to the client) and get logged server-side.
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled route error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

export default app;
// ------------------------------------------------------------------
// FARASBOT 2.0 — Telegram admin assistant (private, webhook mode).
// Full dashboard coverage: projects, packages, services, skills,
// experience, estimator, page content, FAQ, leads, settings, PIN.
// Inline keyboards instead of typing raw IDs (tap-to-select + steppers).
// ------------------------------------------------------------------
function tgReq(method: string, payload: Record<string, any>) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return Promise.resolve(null);
  return fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((r) => r.json())
    .catch((e) => ({ ok: false, error: e.message }));
}

const send = (chatId: number, text: string, extra: Record<string, any> = {}) =>
  tgReq('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', ...extra });

const kb = (rows: any[][]) => ({ inline_keyboard: rows });

const cap2 = (s: string, n = 300) => (s.length > n ? s.slice(0, n) + '…' : s);

// Sessions: guided multistep flows + list pagination offsets.
const sessions = new Map<string, { mode: string; data: any }>();
const getSession = (id: number) => sessions.get(String(id));
const setSession = (id: number, s: any) => sessions.set(String(id), s);
const clearSession = (id: number) => sessions.delete(String(id));

const BOT_ALLOWED = () =>
  (process.env.TELEGRAM_ALLOWED_CHAT_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);
const canUse = (chatId: number | undefined) => !!chatId && BOT_ALLOWED().includes(String(chatId));

const WEBHOOK_SECRET2 = () =>
  crypto.createHash('sha256').update(process.env.BOT_WEBHOOK_SECRET || '').digest('hex');

// ---- data helpers (service role, same tables as the site) ----
const db = () => getServerSupabase();
async function fetchAll(table: string, order: string) {
  const { data, error } = await db().from(table).select('*').order(order);
  return { rows: data || [], error };
}
async function upsert(table: string, row: Record<string, any>) {
  const { error } = await db().from(table).upsert(row, { onConflict: 'id' });
  return !error;
}
async function removeRow(table: string, id: string) {
  const { error } = await db().from(table).delete().eq('id', id);
  return !error;
}
async function patchRow(table: string, id: string, patch: Record<string, any>) {
  const { error } = await db().from(table).update(patch).eq('id', id);
  return !error;
}

const PROJECT_FIELDS: Record<string, (p: any, v: string) => void> = {
  title: (p, v) => (p.title = v),
  subtitle: (p, v) => (p.subtitle = v),
  category: (p, v) => (p.category = v),
  client: (p, v) => (p.client = v),
  year: (p, v) => (p.year = v),
  role: (p, v) => (p.role = v),
  liveUrl: (p, v) => (p.live_url = v),
  thumbnail: (p, v) => (p.thumbnail = v),
  summary: (p, v) => (p.summary = v),
  solution: (p, v) => (p.solution = v),
  problemStatement: (p, v) => (p.problem_statement = v),
  tools: (p, v) => (p.tools = v.split(',').map((x) => x.trim())),
  results: (p, v) => (p.results = v.split(',').map((x) => x.trim())),
  featured: (p, v) => (p.featured = ['1', 'true', 'yes', 'ya'].includes(v.toLowerCase())),
};

const PACKAGE_FIELDS: Record<string, (p: any, v: string) => void> = {
  title: (p, v) => (p.title = v),
  name: (p, v) => (p.title = v),
  description: (p, v) => (p.description = v),
  priceUSD: (p, v) => (p.price_usd = Number(v) || 0),
  priceIDR: (p, v) => (p.price = v),
  deliveryTime: (p, v) => (p.timeline = v),
  recommendedFor: (p, v) => (p.recommended_for = v),
  period: (p, v) => (p.period = v),
  badge: (p, v) => (p.badge = v),
  popular: (p, v) => (p.is_popular = ['1', 'true', 'yes', 'ya'].includes(v.toLowerCase())),
  features: (p, v) => (p.features = v.split(',').map((x) => x.trim())),
};

// ---------- renderers / menus ----------
function mainMenu(chatId: number) {
  return send(chatId, '🤖 <b>FarasBot 2.0 — Panel Admin</b>\nPilih modul atau ketik /help.', kb([
    [
      { text: '📁 Proyek', callback_data: 'proj:list:0' },
      { text: '🎁 Paket', callback_data: 'pkg:list:0' },
      { text: '✨ Layanan', callback_data: 'svc:list:0' },
    ],
    [
      { text: '🎨 Skill', callback_data: 'sk:list:0' },
      { text: '📄 Pengalaman', callback_data: 'xp:list:0' },
      { text: '🧮 Estimator', callback_data: 'est:main' },
    ],
    [
      { text: '📝 Konten', callback_data: 'cont:page:home' },
      { text: '❓ FAQ', callback_data: 'faq:list:0' },
      { text: '📜 Sertifikat', callback_data: 'cert:list:0' },
    ],
    [
      { text: '⚙️ Pengaturan', callback_data: 'set:main' },
      { text: '💬 Leads', callback_data: 'lead:list' },
      { text: '📊 Stats', callback_data: 'stats' },
    ],
    [
      { text: '🔑 Ganti PIN', callback_data: 'pin:start' },
    ],
  ]));
}

async function projectRows() {
  const { rows } = await fetchAll('projects', 'created_at');
  return rows;
}
async function packageRows() {
  const { rows } = await fetchAll('packages', 'created_at');
  return rows;
}

async function genericList(chatId: number, title: string, items: any[], cbPrefix: string, idKey: string, label: (x: any, i: number) => string, page: number, pageSz = 8, footerRows: any[][] = []) {
  if (!items.length) return send(chatId, `${title}\n\nBelum ada data.`);
  const pages = Math.ceil(items.length / pageSz);
  const p = Math.min(Math.max(page, 0), pages - 1);
  const slice = items.slice(p * pageSz, p * pageSz + pageSz);
  const nav: any = [];
  const navRow: any[] = [];
  if (p > 0) navRow.push({ text: '‹ Prev', callback_data: `${cbPrefix}:${p - 1}` });
  navRow.push({ text: `${p + 1}/${pages}`, callback_data: 'noop' });
  if (p < pages - 1) navRow.push({ text: 'Next ›', callback_data: `${cbPrefix}:${p + 1}` });
  if (navRow.length) nav.push(navRow);
  const rows: any[][] = slice.map((x, i) => [{ text: `${'•'} ${cap2(label(x, p * pageSz + i), 28)}`, callback_data: `${cbPrefix.replace(/:list:\d+$/, '')}:sel:${x[idKey]}` }]);
  return send(chatId, title, kb([...rows, ...nav, ...footerRows]));
}

async function showProjects(chatId: number, page = 0) {
  const items = await projectRows();
  const k = kb(items.slice(page * 6, page * 6 + 6).map((p) => [{ text: `📁 ${cap2(p.title, 28)}`, callback_data: `proj:sel:${p.id}` }]));
  const nav: any[] = [];
  if (page > 0) nav.push({ text: '‹ Prev', callback_data: `proj:list:${page - 1}` });
  if ((page + 1) * 6 < items.length) nav.push({ text: 'Next ›', callback_data: `proj:list:${page + 1}` });
  const rows: any[][] = [...items.slice(page * 6, page * 6 + 6).map((p) => [{ text: `📁 ${cap2(p.title, 28)}`, callback_data: `proj:sel:${p.id}` }])];
  if (nav.length) rows.push(nav);
  rows.push([{ text: '➕ Buat baru', callback_data: 'proj:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]);
  if (!items.length) return send(chatId, '📁 <b>Proyek</b>\nBelum ada proyek.', kb([[{ text: '➕ Buat baru', callback_data: 'proj:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]]));
  return send(chatId, `📁 <b>Proyek (${items.length})</b>`, kb(rows));
}

async function showProjectDetail(chatId: number, id: string) {
  const { data: rows } = await db().from('projects').select('*').eq('id', id).maybeSingle();
  const p = rows;
  if (!p) return send(chatId, 'Proyek tidak ditemukan.');
  await send(chatId, `<b>${esc(p.title)}</b> [${esc(p.category || '-')}] ${p.featured ? '⭐' : ''}\n${esc(p.client || '-')} · ${esc(p.year || '-')}\n${esc(cap2(p.summary || '-'))}\nID: <code>${p.id}</code>\n\n<code>/proyek tulis ${p.id} &lt;field&gt;=&lt;nilai&gt;</code> juga bisa langsung.`, kb([
    [
      { text: '✏️ Judul', callback_data: `proj:fld:${p.id}:title` },
      { text: '✏️ Sub', callback_data: `proj:fld:${p.id}:subtitle` },
      { text: '✏️ Kategori', callback_data: `proj:fld:${p.id}:category` },
    ],
    [
      { text: '✏️ Client', callback_data: `proj:fld:${p.id}:client` },
      { text: '✏️ Tahun', callback_data: `proj:fld:${p.id}:year` },
      { text: '✏️ Ringkas', callback_data: `proj:fld:${p.id}:summary` },
    ],
    [
      { text: '✏️ Solusi', callback_data: `proj:fld:${p.id}:solution` },
      { text: '✏️ Tools (csv)', callback_data: `proj:fld:${p.id}:tools` },
      { text: '📎 Thumb', callback_data: `proj:fld:${p.id}:thumbnail` },
    ],
    [
      { text: '🗑 Hapus', callback_data: `proj:del:${p.id}` },
      { text: '⬅️ Kembali', callback_data: 'proj:list:0' },
    ],
  ]));
}

export function registerBotRoutes(app: express.Express, deps: { getServerSupabase: () => any; requireAdmin: (a: any, b: any, c: any) => void; log: (...a: any[]) => void }) {
  const { log } = deps;
  const HINT = '\n\nKirim teks nilai barunya, atau <code>/batal</code> untuk keluar.';
  const fieldPrompt: Record<string, string> = {
    title: 'Judul', subtitle: 'Sub-judul', category: 'Kategori', client: 'Client', year: 'Tahun', role: 'Role',
    liveUrl: 'Link demo', thumbnail: 'URL thumbnail', summary: 'Ringkasan', solution: 'Solusi', problemStatement: 'Problem',
    tools: 'Tools (pisah koma)', results: 'Hasil (pisah koma)', featured: 'featured (1/0)',
    priceUSD: 'Harga USD', priceIDR: 'Harga IDR', description: 'Deskripsi', deliveryTime: 'Waktu pengerjaan',
    recommendedFor: 'Rekomendasi untuk', period: 'Period', badge: 'Badge', popular: 'popular (1/0)', features: 'Fitur (pisah koma)',
    issuer: 'Penerbit / Lembaga', image: 'URL gambar',
    name: 'Nama', icon: 'Icon', level: 'Proficiency (0-100)', category2: 'Kategori', company: 'Perusahaan', companyOrOrg: 'Perusahaan', period2: 'Periode', location: 'Lokasi', type: 'Tipe (work/education/leadership)',
    baseUsd: 'Harga dasar USD', baseIdrNum: 'Harga dasar IDR', label: 'Label', mult: 'Multiplier', desc2: 'Deskripsi', deliv: 'Deliverables (pisah koma)',
    email: 'Email', phone: 'Phone', wa: 'Nomor WhatsApp', avatarUrl: 'URL foto', cvIndo: 'URL CV Indonesia', cvEng: 'URL CV English',
    instagram: 'URL Instagram', dribbble: 'URL Dribbble', behance: 'URL Behance', linkedin: 'URL LinkedIn', github: 'URL GitHub',
  };

  // ---- text commands ----
  async function handleText(chatId: number, text: string) {
    const [cmd, ...rest] = text.trim().split(/\s+/);
    const arg = rest.join(' ');
    const lower = cmd.toLowerCase();

    const sess = getSession(chatId);
    if (sess && lower !== '/batal' && lower !== '/cancel' && lower !== '/menu') {
      const ok = await onSessionValue(chatId, sess, text);
      if (ok) clearSession(chatId);
      return;
    }
    clearSession(chatId);

    switch (lower) {
      case '/start':
      case '/menu':
        return mainMenu(chatId);
      case '/help':
        return send(chatId, `<b>FarasBot 2.0</b>\n\n` +
          'Menu interaktif: tap tombol di setiap pesan.\n\n' +
          '<code>/menu</code> panel utama\n<code>/proyek</code> daftar proyek\n<code>/paket</code> daftar paket\n<code>/lead</code> lead belum dibaca\n' +
          '<code>/stats</code> statistik\n<code>/konten</code> edit konten halaman\n' +
          '<b>Langsung edit:</b> <code>/proyek tulis &lt;id&gt; field=value</code>\n<code>/paket tulis &lt;id&gt; field=value</code>\n' +
          '<code>/konten home hero.title = Teks baru</code>\n<code>/batal</code> batalkan alur.');
      case '/proyek':
        if (arg.startsWith('tulis')) return handleTulis(chatId, arg, 'projects', PROJECT_FIELDS, 'proyek');
        if (arg) return showProjects(chatId);
        return showProjects(chatId);
      case '/paket':
        if (arg.startsWith('tulis')) return handleTulis(chatId, arg, 'packages', PACKAGE_FIELDS, 'paket');
        return showPackages(chatId);
      case '/skill':
        return showSkillList(chatId, 0);
      case '/cert':
        return showCertList(chatId, 0);
      case '/lead':
        return showLeads(chatId);
      case '/stats':
        return stats(chatId);
      case '/konten': {
        if (arg) {
          const m = arg.match(/^(\S+)\s+([\w.]+)\s*=\s*(.+)$/);
          if (m) {
            const page = m[1];
            const k = m[2].split('.');
            const section = k[0];
            const field = k[1];
            const value = m[3];
            const { data: rows } = await db().from('page_content').select('*').eq('page', page).eq('section', section).eq('field', field).limit(1);
            if (rows && rows[0]) {
              const ok = await patchRow('page_content', rows[0].id, { values: { ...rows[0].values, en: value }, updated_at: new Date().toISOString() });
              return send(chatId, ok ? `✅ Konten ${page}.${section}.${field} (en) tersimpan.` : '❌ Gagal simpan.');
            }
            return send(chatId, 'Field tidak ditemukan. Tap dari menu <code>/konten</code> biar lihat daftarnya.');
          }
          return showContentPage(chatId, arg);
        }
        return showContentPage(chatId, 'home');
      }
      case '/batal':
      case '/cancel':
        return send(chatId, 'Alur dibatalkan.');
      default:
        return mainMenu(chatId);
    }
  }

  async function handleTulis(chatId: number, arg: string, table: string, fields: Record<string, (r: any, v: string) => void>, label: string) {
    const [, id, kv] = arg.split(/\s+/);
    const eq = kv?.indexOf('=');
    if (!id || eq == null || eq <= 0) return send(chatId, `Format: <code>/${label} tulis &lt;id&gt; &lt;field&gt;=&lt;nilai&gt;</code>`);
    const field = kv.slice(0, eq);
    const value = kv.slice(eq + 1);
    const patch: any = {};
    fields[field]?.(patch, value);
    if (!Object.keys(patch).length) return send(chatId, `Field <code>${field}</code> tidak dikenal.`);
    const ok = await patchRow(table, id, { ...patch, updated_at: new Date().toISOString() });
    return send(chatId, ok ? `✅ ${label} <code>${id}</code> diperbarui.` : `❌ Gagal (ID <code>${id}</code>?)`);
  }

  async function onSessionValue(chatId: number, sess: { mode: string; data: any }, value: string): Promise<boolean> {
    const d = sess.data;
    switch (sess.mode) {
      case 'proj_new_title': {
        d.id = 'proj-' + Date.now(); d.title = value;
        setSession(chatId, { mode: 'proj_fld', data: { ...d, field: 'category' } });
        await send(chatId, `✏️ Judul tersimpan: <b>${cap2(value, 60)}</b>\n\nKirim <b>kategori</b> (UI/UX Design, Graphic & Brand, Social Media & Print, Mobile App):${HINT}`);
        return true;
      }
      case 'proj_fld': {
        const patch: any = {};
        PROJECT_FIELDS[d.field]?.(patch, value);
        const ok = await upsert('projects', { ...d, updated_at: new Date().toISOString(), ...patch });
        if (!ok) {
          await send(chatId, '❌ Gagal simpan. Coba lagi atau /batal.');
          return false;
        }
        setSession(chatId, { mode: 'proj_fld', data: { ...d, ...patch, field: 'next' } });
        await send(chatId, `✅ <code>${esc(d.field)}</code> tersimpan.\n\n` +
          'Lanjut isi field lain? Balas:\n<code>title</code> untuk judul\n<code>category</code> kategori\n<code>summary</code>) ringkasan\n<code>client</code> client\n<code>year</code> tahun\n<code>thumbnail</code> URL foto\n<code>selesai</code> untuk selesai.', kb([
            [{ text: '✏️ Judul', callback_data: `proj:fld:${d.id}:title` }, { text: '📎 Thumb', callback_data: `proj:fld:${d.id}:thumbnail` }],
            [{ text: '✅ Selesai', callback_data: 'proj:list:0' }],
          ]));
        return true;
      }
      case 'pkg_new_title': {
        d.id = 'pkg-' + Date.now(); d.title = value;
        await upsert('packages', d);
        setSession(chatId, { mode: 'pkg_fld', data: d });
        await send(chatId, `✅ Paket <b>${cap2(value, 50)}</b> dibuat (ID <code>${d.id}</code>).\nLanjut isi field dengan /paket tulis ${d.id} field=nilai, atau balas: ${HINT}`, kb([[{ text: '💲 Harga', callback_data: `pkg:fld:${d.id}:priceUSD` }, { text: '✅ Selesai', callback_data: 'pkg:list:0' }]]));
        return true;
      }
      case 'pkg_fld': {
        const patch: any = {};
        PACKAGE_FIELDS[d.field]?.(patch, value);
        const ok = await upsert('packages', { ...d, updated_at: new Date().toISOString(), ...patch });
        if (!ok) return Promise.resolve(send(chatId, '❌ Gagal simpan.').then(() => false));
        setSession(chatId, { mode: 'pkg_fld', data: { ...d, ...patch } });
        await send(chatId, `✅ <code>${d.field}</code> tersimpan.`);
        return true;
      }
      case 'fldint': {
        const ok = await patchRow(d.table, d.id, d.apply(value));
        await send(chatId, ok ? `✅ ${d.label} diperbarui.` : '❌ Gagal simpan.');
        return true;
      }
      case 'cont_fld': {
        const ok = await patchRow('page_content', d.id, { values: { ...d.values, [d.lang]: value }, updated_at: new Date().toISOString() });
        await send(chatId, ok ? `✅ Konten ${d.page}/${d.section}.${d.field} (${d.lang}) tersimpan.` : '❌ Gagal simpan.');
        return true;
      }
      case 'set_fld': {
        const field = d.field;
        const patch: any = {};
        if (field === 'email') patch.contact_email = value;
        else if (field === 'phone') patch.contact_phone = value;
        else if (field === 'wa') patch.whatsapp_number = value;
        else if (field === 'avatarUrl') patch.avatar_url = value;
        else if (field === 'cvIndo') patch.cv_download_url_indo = value;
        else if (field === 'cvEng') patch.cv_download_url_eng = value;
        else if (['instagram', 'dribbble', 'behance', 'linkedin', 'github'].includes(field)) {
          const { data: rows } = await db().from('site_settings').select('social_links').eq('id', 'default').maybeSingle();
          const current = rows?.social_links || {};
          patch.social_links = { ...current, [field]: value };
        } else return false;
        const ok = await patchRow('site_settings', 'default', { ...patch, updated_at: new Date().toISOString() });
        await send(chatId, ok ? `✅ Pengaturan <code>${field}</code> tersimpan.` : '❌ Gagal simpan.');
        return true;
      }
      case 'pin_cur': {
        setSession(chatId, { mode: 'pin_new', data: { cur: value } });
        await send(chatId, 'Kirim <b>PIN baru</b> (min. 6 karakter):');
        return true;
      }
      case 'pin_new': {
        const d2 = sess.data;
        if (value.length < 6) { await send(chatId, 'Minimal 6 karakter. Coba lagi atau /batal.'); return false; }
        if (value === d2.cur) { await send(chatId, 'PIN baru harus berbeda. /batal.'); return false; }
        // verify current via public endpoint, then change with admin token
        const ver = await tgReq2('adminVerify', d2.cur);
        if (!ver.ok) { await send(chatId, '❌ PIN saat ini salah. /batal.'); return false; }
        const ch = await tgReq2('adminChangePin', d2.cur, value);
        await send(chatId, ch.ok ? '✅ PIN admin berhasil diganti.' : `❌ Gagal: ${ch.error || ''}`);
        return true;
      }
      default:
        return false;
    }
  }

  // server-call equivalents for PIN flows (no extra serverless hop needed—same function)
  async function tgReq2(kind: string, a: string, b?: string) {
    try {
      if (kind === 'adminVerify') {
        const ok = await (requireAdminCheck(a));
        return { ok };
      }
      if (kind === 'adminChangePin') {
        const ok = await adminMatcher(a);
        if (!ok) return { ok: false, error: 'PIN saat ini salah' };
        const saved = await savePinHash(b || '');
        return { ok: saved };
      }
      return { ok: false };
    } catch (e: any) {
      return { ok: false, error: e.message };
    }
  }

  // ---------- callback router ----------
  async function handleCallback(chatId: number, data: string) {
    const [a, b, c, ...rest] = data.split(':');
    if (a === 'menu') return mainMenu(chatId);
    if (a === 'noop') return;

    if (a === 'proj') {
      if (b === 'list') return showProjects(chatId, Number(c) || 0);
      if (b === 'sel') return showProjectDetail(chatId, c);
      if (b === 'new') {
        setSession(chatId, { mode: 'proj_new_title', data: {} });
        return send(chatId, '✍️ <b>Buat proyek baru</b>\nKirim <b>judul proyek</b> atau /batal.');
      }
      if (b === 'fld') {
        setSession(chatId, { mode: 'proj_fld', data: { id: c, field: rest[0] } });
        return send(chatId, `✏️ ${fieldPrompt[rest[0]] || rest[0]}\nKirim nilai baru${HINT}`);
      }
      if (b === 'del') {
        const ok = await removeRow('projects', c);
        return send(chatId, ok ? `🗑 Proyek <code>${c}</code> dihapus.` : '❌ Gagal hapus.');
      }
    }
    if (a === 'pkg') {
      if (b === 'list') return showPackages(chatId, Number(c) || 0);
      if (b === 'sel') return showPackageDetail(chatId, c);
      if (b === 'new') {
        setSession(chatId, { mode: 'pkg_new_title', data: {} });
        return send(chatId, '✍️ <b>Buat paket baru</b>\nKirim <b>nama paket</b> atau /batal.');
      }
      if (b === 'fld') {
        setSession(chatId, { mode: 'fldint', data: { table: 'packages', id: c, field: rest[0], label: `Paket ${rest[0]}`, apply: (v: string) => { const p: any = {}; PACKAGE_FIELDS[rest[0]]?.(p, v); return p; } } });
        return send(chatId, `✏️ ${fieldPrompt[rest[0]] || rest[0]}\nKirim nilai baru${HINT}`);
      }
      if (b === 'del') {
        const ok = await removeRow('packages', c);
        return send(chatId, ok ? `🗑 Paket <code>${c}</code> dihapus.` : '❌ Gagal hapus.');
      }
    }
    if (a === 'svc') {
      if (b === 'list') return showServices(chatId, Number(c) || 0);
      if (b === 'sel') return showServiceDetail(chatId, c);
      if (b === 'new') {
        const id = 'srv-' + Date.now();
        await upsert('services', { id, icon: 'Sparkles', title: 'Layanan Baru', description: 'Deskripsi', deliverables: [], created_at: new Date().toISOString() });
        return showServiceDetail(chatId, id);
      }
      if (b === 'fld') {
        setSession(chatId, { mode: 'fldint', data: { table: 'services', id: c, field: rest[0], label: `Layanan ${rest[0]}`, apply: (v: string) => {
          const p: any = {};
          if (rest[0] === 'title') p.title = v;
          else if (rest[0] === 'description') p.description = v;
          else if (rest[0] === 'icon') p.icon = v;
          else if (rest[0] === 'deliv') p.deliverables = v.split(',').map((x) => x.trim());
          return p;
        } } });
        return send(chatId, `✏️ ${fieldPrompt[rest[0]] || rest[0]}\nKirim nilai baru${HINT}`);
      }
      if (b === 'del') {
        const ok = await removeRow('services', c);
        return send(chatId, ok ? `🗑 Layanan <code>${c}</code> dihapus.` : '❌ Gagal hapus.');
      }
    }
    if (a === 'sk') {
      if (b === 'list') return showSkillList(chatId, Number(c) || 0);
      if (b === 'sel') return showSkillDetail(chatId, c);
      if (b === 'new') {
        const id = 'sk-' + Date.now();
        await upsert('skills', { id, name: 'Skill Baru', category: 'Design Tools', level: 80, icon: 'Figma', created_at: new Date().toISOString() });
        return showSkillList(chatId, 0);
      }
      if (b === 'fld') {
        setSession(chatId, { mode: 'fldint', data: { table: 'skills', id: c, field: rest[0], label: `Skill ${rest[0]}`, apply: (v: string) => {
          const p: any = {};
          if (rest[0] === 'name') p.name = v;
          else if (rest[0] === 'category') p.category = v;
          else if (rest[0] === 'level') p.level = Number(v) || 0;
          else if (rest[0] === 'icon') p.icon = v;
          return p;
        } } });
        return send(chatId, `✏️ ${fieldPrompt[rest[0]] || rest[0]}\nKirim nilai baru${HINT}`);
      }
      if (b === 'del') {
        const ok = await removeRow('skills', c);
        return send(chatId, ok ? `🗑 Skill dihapus.` : '❌ Gagal hapus.');
      }
    }
    if (a === 'xp') {
      if (b === 'list') return showExperienceList(chatId, Number(c) || 0);
      if (b === 'sel') return showExperienceDetail(chatId, c);
      if (b === 'new') {
        const id = 'exp-' + Date.now();
        await upsert('experiences', { id, type: 'work', period: '2026 - Present', role: 'Role Baru', company: 'Perusahaan Baru', description: 'Deskripsi', highlights: [], created_at: new Date().toISOString() });
        return showExperienceDetail(chatId, id);
      }
      if (b === 'fld') {
        setSession(chatId, { mode: 'fldint', data: { table: 'experiences', id: c, field: rest[0], label: `Pengalaman ${rest[0]}`, apply: (v: string) => {
          const p: any = {};
          if (rest[0] === 'role') p.role = v;
          else if (rest[0] === 'company') p.company = v;
          else if (rest[0] === 'period') p.period = v;
          else if (rest[0] === 'location') p.location = v;
          else if (rest[0] === 'description') p.description = v;
          else if (rest[0] === 'type') p.type = v;
          else if (rest[0] === 'highlights') p.highlights = v.split(',').map((x) => x.trim());
          return p;
        } } });
        return send(chatId, `✏️ ${fieldPrompt[rest[0]] || rest[0]}\nKirim nilai baru${HINT}`);
      }
      if (b === 'del') {
        const ok = await removeRow('experiences', c);
        return send(chatId, ok ? '🗑 Pengalaman dihapus.' : '❌ Gagal hapus.');
      }
    }
    if (a === 'cert') {
      if (b === 'list') return showCertList(chatId, Number(c) || 0);
      if (b === 'sel') return showCertDetail(chatId, c);
      if (b === 'new') {
        const id = 'cert-' + Date.now();
        await upsert('certificates', { id, title: 'Sertifikat Baru', issuer: 'Penerbit', year: '', image: '', description: '', created_at: new Date().toISOString() });
        return showCertDetail(chatId, id);
      }
      if (b === 'fld') {
        setSession(chatId, { mode: 'fldint', data: { table: 'certificates', id: c, field: rest[0], label: `Sertifikat ${rest[0]}`, apply: (v: string) => {
          const p: any = {};
          if (rest[0] === 'title') p.title = v;
          else if (rest[0] === 'issuer') p.issuer = v;
          else if (rest[0] === 'year') p.year = v;
          else if (rest[0] === 'image') p.image = v;
          else if (rest[0] === 'description') p.description = v;
          return p;
        } } });
        return send(chatId, `✏️ ${fieldPrompt[rest[0]] || rest[0]}\nKirim nilai baru${HINT}`);
      }
      if (b === 'del') {
        const ok = await removeRow('certificates', c);
        return send(chatId, ok ? '🗑 Sertifikat dihapus.' : '❌ Gagal hapus.');
      }
    }
    if (a === 'est') {
      if (b === 'main') return estimatorMenu(chatId);
      if (b === 'svc') return showEstServices(chatId, Number(c) || 0);
      if (b === 'scop') return showEstScopes(chatId);
      if (b === 'tl') return showEstTimelines(chatId);
      if (b === 'fld') {
        setSession(chatId, { mode: 'fldint', data: { table: rest[0], id: c, field: rest[1], label: 'Estimator', apply: (v: string) => {
          const p: any = {};
          if (rest[1] === 'name') p.name = v;
          else if (rest[1] === 'baseUsd') p.base_usd = Number(v) || 0;
          else if (rest[1] === 'baseIdrNum') p.base_idr = Number(v) || 0;
          else if (rest[1] === 'label') p.label = v;
          else if (rest[1] === 'mult') p.mult = Number(v) || 1;
          else if (rest[1] === 'desc') p.description = v;
          return p;
        } } });
        return send(chatId, `✏️ ${fieldPrompt[rest[1]] || rest[1]} (${rest[0]}:<code>${c}</code>)\nKirim nilai baru${HINT}`);
      }
      if (b === 'add') {
        const id = (rest[0] === 'estimator_services' ? 'svc-' : rest[0] === 'estimator_scopes' ? 'scp-' : 'tl-') + Date.now();
        if (rest[0] === 'estimator_services') await upsert('estimator_services', { id, name: 'Layanan Baru', base_usd: 200, base_idr: 3000000, icon: 'Sparkles', deliverables: [], created_at: new Date().toISOString() });
        else if (rest[0] === 'estimator_scopes') await upsert('estimator_scopes', { id, label: 'Skop Baru', mult: 1, description: '', created_at: new Date().toISOString() });
        else await upsert('estimator_timelines', { id, label: 'Durasi Baru', mult: 1, created_at: new Date().toISOString() });
        return estimatorMenu(chatId);
      }
      if (b === 'del') {
        const ok = await removeRow(rest[0], c);
        return send(chatId, ok ? '🗑 Dihapus.' : '❌ Gagal hapus.');
      }
    }
    if (a === 'cont') {
      if (b === 'page') return showContentPage(chatId, c || 'home');
      if (b === 'fld') return showContentField(chatId, c, rest[0]);
      if (b === 'fld_lang') {
        const [page, section, field, lang, sort] = c.split('__');
        const { data: rows } = await db().from('page_content').select('*').eq('page', page).eq('section', section).eq('field', field).limit(5);
        const row = rows?.[0] || { id: `${page}__${section}__${field}__${sort || 0}`, page, section, field, type: 'text', sort: Number(sort) || 0, values: {}, updated_at: new Date().toISOString() };
        setSession(chatId, { mode: 'cont_fld', data: { id: row.id, page, section, field, lang, values: row.values } });
        return send(chatId, `📝 Edit <code>${c}</code> bahasa <b>${lang.toUpperCase()}</b>\nKirim nilai baru${HINT}`);
      }
      if (b === 'share') return contentShare(chatId);
    }
    if (a === 'faq') {
      if (b === 'list') return showFaqList(chatId, Number(c) || 0);
      if (b === 'sel') return showFaqDetail(chatId, c);
      if (b === 'new') {
        const id = 'faq-' + Date.now();
        await upsert('faqs', { id, sort: Math.floor(Date.now() / 1000), question: { en: 'Pertanyaan baru?' }, answer: { en: 'Jawaban' }, created_at: new Date().toISOString() });
        return showFaqDetail(chatId, id);
      }
      if (b === 'q') {
        setSession(chatId, { mode: 'fldint', data: { table: 'faqs', id: c, field: 'question', label: 'FAQ pertanyaan', apply: (v: string) => ({ question: { en: v } }) } });
        return send(chatId, `✏️ Pertanyaan baru${HINT}`);
      }
      if (b === 'a') {
        setSession(chatId, { mode: 'fldint', data: { table: 'faqs', id: c, field: 'answer', label: 'FAQ jawaban', apply: (v: string) => ({ answer: { en: v } }) } });
        return send(chatId, `✏️ Jawaban baru${HINT}`);
      }
      if (b === 'del') {
        const ok = await removeRow('faqs', c);
        return send(chatId, ok ? '🗑 FAQ dihapus.' : '❌ Gagal hapus.');
      }
    }
    if (a === 'lead') {
      if (b === 'list') return showLeads(chatId);
      if (b === 'read') {
        const ok = await patchRow('messages', c, { status: 'read' });
        return send(chatId, ok ? `✅ Lead <code>${c}</code> dibaca.` : '❌ Gagal.');
      }
      if (b === 'del') {
        const ok = await removeRow('messages', c);
        return send(chatId, ok ? `🗑 Lead <code>${c}</code> dihapus.` : '❌ Gagal.');
      }
    }
    if (a === 'stats') return stats(chatId);
    if (a === 'set') {
      if (b === 'main') return settingsMenu(chatId);
      if (b === 'fld') {
        setSession(chatId, { mode: 'set_fld', data: { field: c } });
        return send(chatId, `✏️ ${fieldPrompt[c] || c}\nKirim nilai baru (URL/teks)${HINT}`);
      }
    }
    if (a === 'pin') {
      if (b === 'start') {
        setSession(chatId, { mode: 'pin_cur', data: {} });
        return send(chatId, '🔑 Ganti PIN admin.\nKirim <b>PIN saat ini</b> dulu:');
      }
    }
    return mainMenu(chatId);
  }

  // ---------- views ----------
  async function showPackages(chatId: number, page = 0) {
    const items = await packageRows();
    if (!items.length) return send(chatId, '🎁 <b>Paket</b>\nBelum ada.', kb([[{ text: '➕ Buat baru', callback_data: 'pkg:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]]));
    const rows: any[][] = items.slice(page * 6, page * 6 + 6).map((p) => [{ text: `🎁 ${cap2(p.title, 30)}`, callback_data: `pkg:sel:${p.id}` }]);
    const nav: any[] = [];
    if (page > 0) nav.push({ text: '‹ Prev', callback_data: `pkg:list:${page - 1}` });
    if ((page + 1) * 6 < items.length) nav.push({ text: 'Next ›', callback_data: `pkg:list:${page + 1}` });
    if (nav.length) rows.push(nav);
    rows.push([{ text: '➕ Buat baru', callback_data: 'pkg:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]);
    return send(chatId, `🎁 <b>Paket (${items.length})</b>`, kb(rows));
  }
  async function showPackageDetail(chatId: number, id: string) {
    const { data: rows } = await db().from('packages').select('*').eq('id', id).maybeSingle();
    const p: any = rows;
    if (!p) return send(chatId, 'Paket tidak ditemukan.');
    await send(chatId, `<b>${esc(p.title || '')}</b>\n${p.price_usd ? '$' + p.price_usd + ' USD' : ''}${p.price ? ' / ' + esc(p.price) : ''}\n${esc(cap2(p.description || ''))}\nFeatures: ${(p.features || []).length} item`, kb([
      [
        { text: '💲 USD', callback_data: `pkg:fld:${p.id}:priceUSD` },
        { text: '💳 IDR', callback_data: `pkg:fld:${p.id}:priceIDR` },
        { text: '⏱ Waktu', callback_data: `pkg:fld:${p.id}:deliveryTime` },
      ],
      [
        { text: '✏️ Fitur', callback_data: `pkg:fld:${p.id}:features` },
        { text: '✏️ Desc', callback_data: `pkg:fld:${p.id}:description` },
        { text: '🏷 Badge', callback_data: `pkg:fld:${p.id}:badge` },
      ],
      [
        { text: '🗑 Hapus', callback_data: `pkg:del:${p.id}` },
        { text: '⬅️ Kembali', callback_data: 'pkg:list:0' },
      ],
    ]));
  }
  async function showServices(chatId: number, page = 0) {
    const { rows } = await fetchAll('services', 'created_at');
    if (!rows.length) return send(chatId, '✨ <b>Layanan</b>\nBelum ada.', kb([[{ text: '➕ Tambah', callback_data: 'svc:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]]));
    const r: any[][] = rows.slice(page * 6, page * 6 + 6).map((s) => [{ text: `✨ ${cap2(s.title, 30)}`, callback_data: `svc:sel:${s.id}` }]);
    const nav: any[] = [];
    if (page > 0) nav.push({ text: '‹ Prev', callback_data: `svc:list:${page - 1}` });
    if ((page + 1) * 6 < rows.length) nav.push({ text: 'Next ›', callback_data: `svc:list:${page + 1}` });
    if (nav.length) r.push(nav);
    r.push([{ text: '➕ Tambah', callback_data: 'svc:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]);
    return send(chatId, `✨ <b>Layanan (${rows.length})</b>`, kb(r));
  }
  async function showServiceDetail(chatId: number, id: string) {
    const { data: rows } = await db().from('services').select('*').eq('id', id).maybeSingle();
    const s: any = rows;
    if (!s) return send(chatId, 'Layanan tidak ditemukan.');
    await send(chatId, `<b>${esc(s.title || '')}</b>\n${esc(cap2(s.description || ''))}\nDeliverables: ${(s.deliverables || []).join(', ') || '-'}\nID: <code>${s.id}</code>`, kb([
      [
        { text: '✏️ Judul', callback_data: `svc:fld:${s.id}:title` },
        { text: '✏️ Desc', callback_data: `svc:fld:${s.id}:description` },
        { text: '📦 Deliverables', callback_data: `svc:fld:${s.id}:deliv` },
      ],
      [
        { text: '🗑 Hapus', callback_data: `svc:del:${s.id}` },
        { text: '⬅️ Kembali', callback_data: 'svc:list:0' },
      ],
    ]));
  }
  async function showSkillList(chatId: number, page = 0) {
    const { rows } = await fetchAll('skills', 'created_at');
    if (!rows.length) return send(chatId, '🎨 <b>Skill</b>\nBelum ada.', kb([[{ text: '➕ Tambah', callback_data: 'sk:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]]));
    const r: any[][] = rows.slice(page * 6, page * 6 + 6).map((s) => [{ text: `🎨 ${cap2(s.name, 30)} — ${s.level ?? 80}%`, callback_data: `sk:sel:${s.id}` }]);
    const nav: any[] = [];
    if (page > 0) nav.push({ text: '‹ Prev', callback_data: `sk:list:${page - 1}` });
    if ((page + 1) * 6 < rows.length) nav.push({ text: 'Next ›', callback_data: `sk:list:${page + 1}` });
    if (nav.length) r.push(nav);
    r.push([{ text: '➕ Tambah', callback_data: 'sk:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]);
    return send(chatId, `🎨 <b>Skill (${rows.length})</b>`, kb(r));
  }
  async function showSkillDetail(chatId: number, id: string) {
    const { data: rows } = await db().from('skills').select('*').eq('id', id).maybeSingle();
    const s: any = rows;
    if (!s) return send(chatId, 'Skill tidak ditemukan.');
    await send(chatId, `<b>${esc(s.name || '')}</b> — ${s.level ?? 80}%\n${esc(s.category || '')}\nID: <code>${s.id}</code>`, kb([
      [
        { text: '✏️ Nama', callback_data: `sk:fld:${s.id}:name` },
        { text: '✏️ Kategori', callback_data: `sk:fld:${s.id}:category` },
        { text: '📊 %', callback_data: `sk:fld:${s.id}:level` },
      ],
      [
        { text: '🗑 Hapus', callback_data: `sk:del:${s.id}` },
        { text: '⬅️ Kembali', callback_data: 'sk:list:0' },
      ],
    ]));
  }
  async function showExperienceList(chatId: number, page = 0) {
    const { rows } = await fetchAll('experiences', 'created_at');
    if (!rows.length) return send(chatId, '📄 <b>Pengalaman</b>\nBelum ada.', kb([[{ text: '➕ Tambah', callback_data: 'xp:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]]));
    const r: any[][] = rows.slice(page * 6, page * 6 + 6).map((x) => [{ text: `${x.type === 'education' ? '🎓' : '💼'} ${cap2(x.role, 28)} — ${esc(x.period || '')}`, callback_data: `xp:sel:${x.id}` }]);
    const nav: any[] = [];
    if (page > 0) nav.push({ text: '‹ Prev', callback_data: `xp:list:${page - 1}` });
    if ((page + 1) * 6 < rows.length) nav.push({ text: 'Next ›', callback_data: `xp:list:${page + 1}` });
    if (nav.length) r.push(nav);
    r.push([{ text: '➕ Tambah', callback_data: 'xp:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]);
    return send(chatId, `📄 <b>Pengalaman (${rows.length})</b>`, kb(r));
  }
  async function showExperienceDetail(chatId: number, id: string) {
    const { data: rows } = await db().from('experiences').select('*').eq('id', id).maybeSingle();
    const x: any = rows;
    if (!x) return send(chatId, 'Pengalaman tidak ditemukan.');
    await send(chatId, `💼 <b>${esc(x.role || '')}</b>\n${esc(x.company || '')} · ${esc(x.period || '')}\n${esc(cap2(x.description || ''))}\nID: <code>${x.id}</code>`, kb([
      [
        { text: '✏️ Role', callback_data: `xp:fld:${x.id}:role` },
        { text: '✏️ Perusahaan', callback_data: `xp:fld:${x.id}:company` },
        { text: '✏️ Periode', callback_data: `xp:fld:${x.id}:period` },
      ],
      [
        { text: '✏️ Tipe', callback_data: `xp:fld:${x.id}:type` },
        { text: '✏️ Desc', callback_data: `xp:fld:${x.id}:description` },
        { text: '📌 Highlight', callback_data: `xp:fld:${x.id}:highlights` },
      ],
      [
        { text: '🗑 Hapus', callback_data: `xp:del:${x.id}` },
        { text: '⬅️ Kembali', callback_data: 'xp:list:0' },
      ],
    ]));
  }
  async function estimatorMenu(chatId: number) {
    return send(chatId, '🧮 <b>Estimator</b>\nPilih bagian:', kb([
      [{ text: '📦 Opsi Layanan', callback_data: 'est:svc:0' }, { text: '📐 Skop', callback_data: 'est:scop:0' }],
      [{ text: '⏱ Durasi', callback_data: 'est:tl:0' }, { text: '⬅️ Menu', callback_data: 'menu' }],
    ]));
  }
  async function showEstServices(chatId: number, page = 0) {
    const { rows } = await fetchAll('estimator_services', 'created_at');
    if (!rows.length) return send(chatId, 'Belum ada.', kb([[{ text: '➕ Tambah', callback_data: 'est:add:estimator_services' }]]));
    const r: any[][] = rows.slice(page * 6, page * 6 + 6).map((s) => [{ text: `📦 ${cap2(s.name, 28)} — $${s.base_usd}`, callback_data: `est:fld:${s.id}:estimator_services:name` }]);
    const nav: any[] = [];
    if (page > 0) nav.push({ text: '‹ Prev', callback_data: `est:svc:${page - 1}` });
    if ((page + 1) * 6 < rows.length) nav.push({ text: 'Next ›', callback_data: `est:svc:${page + 1}` });
    if (nav.length) r.push(nav);
    r.push([{ text: '➕ Tambah', callback_data: 'est:add:estimator_services' }, { text: '⬅️ Estimator', callback_data: 'est:main' }]);
    return send(chatId, `📦 <b>Opsi Layanan Estimator (${rows.length})</b>`, kb(r));
  }
  async function showEstScopes(chatId: number) {
    const { rows } = await fetchAll('estimator_scopes', 'created_at');
    const r: any[][] = rows.map((s) => [{ text: `📐 ${cap2(s.label, 24)} — ×${s.mult}`, callback_data: `est:fld:${s.id}:estimator_scopes:label` }, { text: '×', callback_data: `est:del:${s.id}:estimator_scopes` }]);
    r.push([{ text: '➕ Tambah', callback_data: 'est:add:estimator_scopes' }, { text: '⬅️ Estimator', callback_data: 'est:main' }]);
    return send(chatId, `📐 <b>Skop (${rows.length})</b>\nTap untuk ubah label/multiplier.`, kb(r));
  }
  async function showEstTimelines(chatId: number) {
    const { rows } = await fetchAll('estimator_timelines', 'created_at');
    const r: any[][] = rows.map((s) => [{ text: `⏱ ${cap2(s.label, 24)} — ×${s.mult}`, callback_data: `est:fld:${s.id}:estimator_timelines:label` }, { text: '×', callback_data: `est:del:${s.id}:estimator_timelines` }]);
    r.push([{ text: '➕ Tambah', callback_data: 'est:add:estimator_timelines' }, { text: '⬅️ Estimator', callback_data: 'est:main' }]);
    return send(chatId, `⏱ <b>Durasi (${rows.length})</b>`, kb(r));
  }
  async function showContentPage(chatId: number, page: string) {
    const pages = ['home', 'about', 'portfolio', 'services', 'contact', 'footer', 'calc', 'nav', 'workflow', 'dual'];
    const { data: rows } = await db().from('page_content').select('*').eq('page', page).order('section').order('sort');
    if (!rows.length) return send(chatId, 'Belum ada konten halaman ini.', kb([[{ text: '⬅️ Pilih halaman', callback_data: 'cont:share' }]]));
    const groups: Record<string, typeof rows> = {};
    for (const r of rows) (groups[r.section] = groups[r.section] || []).push(r);
    const lines = Object.entries(groups).map(([sec, rr]) => {
      const fields = rr.map((x) => `<code>${x.field}</code>`).join(', ');
      return `▸ <b>${sec}</b>: ${fields}`;
    });
    await send(chatId, `📝 <b>${page}</b>\nTap field untuk edit:\n${lines.join('\n')}\n\nLangsung: <code>/konten ${page} section.field = Nilai baru</code>`, kb([
      pages.slice(0, 5).map((p) => ({ text: p.charAt(0).toUpperCase() + p.slice(1), callback_data: `cont:page:${p}` })),
      pages.slice(5).map((p) => ({ text: p.charAt(0).toUpperCase() + p.slice(1), callback_data: `cont:page:${p}` })),
    ]));
    return;
  }
  async function showContentField(chatId: number, id: string, pageHint: string) {
    const { data: rows } = await db().from('page_content').select('*').eq('id', id).maybeSingle();
    const r: any = rows;
    if (!r) return send(chatId, 'Field tidak ditemukan.');
    const kbs: any[][] = [['en', 'id', 'ja', 'ar'].map((l) => ({ text: l.toUpperCase(), callback_data: `cont:fld_lang:${r.page}__${r.section}__${r.field}__${l}__${r.sort}` }))];
    kbs.push([{ text: '⬅️ Kembali', callback_data: `cont:page:${r.page}` }]);
    return send(chatId, `📝 <b>${r.page}</b> · ${r.section}.${r.field}\nEN: <code>${r.values?.en || '-'}</code>\nID: <code>${r.values?.id || '-'}</code>\n\nPilih bahasa untuk diedit:`, kb(kbs));
  }
  function contentShare(_chatId: number) { return Promise.resolve(); }
  async function showFaqList(chatId: number, page = 0) {
    const { rows } = await fetchAll('faqs', 'sort');
    if (!rows.length) return send(chatId, '❓ <b>FAQ</b>\nBelum ada.', kb([[{ text: '➕ Tambah', callback_data: 'faq:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]]));
    const r: any[][] = rows.slice(page * 6, page * 6 + 6).map((f) => [{ text: `❓ ${cap2(f.question?.en || '', 30)}`, callback_data: `faq:sel:${f.id}` }]);
    const nav: any[] = [];
    if (page > 0) nav.push({ text: '‹ Prev', callback_data: `faq:list:${page - 1}` });
    if ((page + 1) * 6 < rows.length) nav.push({ text: 'Next ›', callback_data: `faq:list:${page + 1}` });
    if (nav.length) r.push(nav);
    r.push([{ text: '➕ Tambah', callback_data: 'faq:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]);
    return send(chatId, `❓ <b>FAQ (${rows.length})</b>`, kb(r));
  }
  async function showFaqDetail(chatId: number, id: string) {
    const { data: rows } = await db().from('faqs').select('*').eq('id', id).maybeSingle();
    const f: any = rows;
    if (!f) return send(chatId, 'FAQ tidak ditemukan.');
    await send(chatId, `<b>Q:</b> ${esc(f.question?.en || '')}\n<b>A:</b> ${esc(cap2(f.answer?.en || ''))}`, kb([
      [{ text: '✏️ Pertanyaan', callback_data: `faq:q:${f.id}` }, { text: '✏️ Jawaban', callback_data: `faq:a:${f.id}` }],
      [{ text: '🗑 Hapus', callback_data: `faq:del:${f.id}` }, { text: '⬅️ Kembali', callback_data: 'faq:list:0' }],
    ]));
  }
  async function showCertList(chatId: number, page = 0) {
    const { rows } = await fetchAll('certificates', 'created_at');
    if (!rows.length) return send(chatId, '📜 <b>Sertifikat</b>\nBelum ada.', kb([[{ text: '➕ Tambah', callback_data: 'cert:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]]));
    const r: any[][] = rows.slice(page * 6, page * 6 + 6).map((x) => [{ text: `📜 ${cap2(x.title, 30)} — ${esc(x.issuer || '')}`, callback_data: `cert:sel:${x.id}` }]);
    const nav: any[] = [];
    if (page > 0) nav.push({ text: '‹ Prev', callback_data: `cert:list:${page - 1}` });
    if ((page + 1) * 6 < rows.length) nav.push({ text: 'Next ›', callback_data: `cert:list:${page + 1}` });
    if (nav.length) r.push(nav);
    r.push([{ text: '➕ Tambah', callback_data: 'cert:new' }, { text: '⬅️ Menu', callback_data: 'menu' }]);
    return send(chatId, `📜 <b>Sertifikat (${rows.length})</b>`, kb(r));
  }
  async function showCertDetail(chatId: number, id: string) {
    const { data: rows } = await db().from('certificates').select('*').eq('id', id).maybeSingle();
    const x: any = rows;
    if (!x) return send(chatId, 'Sertifikat tidak ditemukan.');
    const kbRows: any[][] = [
      [
        { text: '✏️ Judul', callback_data: `cert:fld:${x.id}:title` },
        { text: '✏️ Penerbit', callback_data: `cert:fld:${x.id}:issuer` },
        { text: '✏️ Tahun', callback_data: `cert:fld:${x.id}:year` },
      ],
      [
        { text: '🖼 Gambar', callback_data: `cert:fld:${x.id}:image` },
        { text: '✏️ Desc', callback_data: `cert:fld:${x.id}:description` },
      ],
      [
        { text: '🗑 Hapus', callback_data: `cert:del:${x.id}` },
        { text: '⬅️ Kembali', callback_data: 'cert:list:0' },
      ],
    ];
    await send(chatId, `📜 <b>${esc(x.title || '')}</b>\n${esc(x.issuer || '')}${x.year ? ' · ' + esc(x.year) : ''}\n${esc(cap2(x.description || ''))}\n${x.image ? '🖼 ' + cap2(x.image, 60) : ''}\nID: <code>${x.id}</code>`, kb(kbRows));
  }
  async function showLeads(chatId: number) {
    const { rows } = await fetchAll('messages', 'created_at');
    const unread = rows.filter((m: any) => m.status !== 'read');
    if (!unread.length) return send(chatId, '💬 <b>Lead belum dibaca</b>\nTidak ada. 🎉', kb([[{ text: '⬅️ Menu', callback_data: 'menu' }]]));
    const r: any[][] = unread.slice(0, 8).map((m: any) => [
      { text: `${m.name} — ${m.project_type || '-'} (${esc(m.budget || '-')})`, callback_data: `noop` },
    ]);
    r.push(unread.slice(0, 5).map((m: any) => ({ text: `✓ ${cap2(m.name, 12)}`, callback_data: `lead:read:${m.id}` })));
    r.push([{ text: '⬅️ Menu', callback_data: 'menu' }]);
    return send(chatId, `💬 <b>Lead belum dibaca (${unread.length})</b>\nTap nama untuk lihat, tombol ✓ untuk tandai baca.`, kb(r));
  }
  async function stats(chatId: number) {
    const [projects, pkgs, leads] = await Promise.all([
      (await fetchAll('projects', 'created_at')).rows,
      (await fetchAll('packages', 'created_at')).rows,
      (await fetchAll('messages', 'created_at')).rows,
    ]);
    const unread = leads.filter((m: any) => m.status !== 'read').length;
    await send(chatId, `📊 <b>Statistik</b>\n• Proyek: ${projects.length}\n• Paket: ${pkgs.length}\n• Lead: ${leads.length} (${unread} belum dibaca)\n\nData live dari database yang sama dengan situs.`, kb([[{ text: '⬅️ Menu', callback_data: 'menu' }]]));
  }
  async function settingsMenu(chatId: number) {
    const { data: rows } = await db().from('site_settings').select('*').eq('id', 'default').maybeSingle();
    const s: any = rows || {};
    await send(chatId, `⚙️ <b>Pengaturan Situs</b>\n📧 ${esc(s.contact_email || '-')}\n📱 ${esc(s.whatsapp_number || '-')}\n☎️ ${esc(s.contact_phone || '-')}\n\nTap untuk ubah:`, kb([
      [
        { text: '📧 Email', callback_data: 'set:fld:email' },
        { text: '📱 WhatsApp', callback_data: 'set:fld:wa' },
        { text: '☎️ Phone', callback_data: 'set:fld:phone' },
      ],
      [
        { text: '🖼 Foto', callback_data: 'set:fld:avatarUrl' },
        { text: '📄 CV ID', callback_data: 'set:fld:cvIndo' },
        { text: '📄 CV EN', callback_data: 'set:fld:cvEng' },
      ],
      [
        { text: '📸 Instagram', callback_data: 'set:fld:instagram' },
        { text: '💠 Dribbble', callback_data: 'set:fld:dribbble' },
        { text: '💼 LinkedIn', callback_data: 'set:fld:linkedin' },
      ],
      [
        { text: '⬅️ Menu', callback_data: 'menu' },
        { text: '🔑 Ganti PIN', callback_data: 'pin:start' },
      ],
    ]));
  }

  // ---------- PIN helpers (reuse existing index auth) ----------
  async function requireAdminCheck(pin: string) {
    const cfg = await getAdminPinConfig();
    if (cfg) return verifyPinAgainst(pin, cfg.pin_salt, cfg.pin_hash);
    return pin === (process.env.ADMIN_PIN || 'clay2026');
  }
  async function adminMatcher(pin: string) { return requireAdminCheck(pin); }
  async function savePinHash(pin: string) { return saveAdminPin(pin); }

  // ---------- routes ----------
  app.post('/api/bot/webhook', async (req, res) => {
    const secret = req.headers['x-telegram-bot-api-secret-token'];
    if (WEBHOOK_SECRET2() && secret !== WEBHOOK_SECRET2()) {
      return res.status(401).json({ ok: false });
    }
    const body = req.body || {};
    if (body.message && body.message.chat) {
      const chatId = body.message.chat.id;
      if (!canUse(chatId)) {
        await send(chatId, '⛔ Akses ditolak. Bot ini pribadi.');
        return res.json({ ok: true });
      }
      if (body.message.text) {
        await handleText(chatId, body.message.text);
      }
    } else if (body.callback_query && body.callback_query.message && body.callback_query.data) {
      const q = body.callback_query;
      const chatId = q.message.chat.id;
      if (!canUse(chatId)) return res.json({ ok: true });
      try { await tgReq('answerCallbackQuery', { callback_query_id: q.id }); } catch {}
      await handleCallback(chatId, q.data);
    }
    res.json({ ok: true });
  });

  app.post('/api/bot/register', requireAdmin2lessAware, async (req, res) => {
    const host = (req.headers['x-forwarded-host'] as string) || '';
    const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
    const url = `${proto}://${host}/api/bot/webhook`;
    if (!process.env.TELEGRAM_BOT_TOKEN) return res.status(501).json({ error: 'TELEGRAM_BOT_TOKEN missing.' });
    if (!process.env.BOT_WEBHOOK_SECRET) return res.status(501).json({ error: 'BOT_WEBHOOK_SECRET missing.' });
    const r = await tgReq('setWebhook', { url, secret_token: WEBHOOK_SECRET2(), drop_pending_updates: true });
    res.json({ ok: !!r?.ok, url, telegram: r });
  });

  function requireAdmin2lessAware(req: express.Request, res: express.Response, next: express.NextFunction) {
    requireAdmin(req, res, next);
  }
}

registerBotRoutes(app, { getServerSupabase, requireAdmin, log: console.log });
