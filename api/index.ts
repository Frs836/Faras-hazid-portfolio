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