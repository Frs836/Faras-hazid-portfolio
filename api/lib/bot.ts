import express from 'express';

// ------------------------------------------------------------------
// FARASBOT — Telegram admin assistant (private, webhook mode).
// Full CRUD over the same Supabase tables the public site uses.
// Registered from api/index.ts with injected dependencies (no circular imports).
// ------------------------------------------------------------------

type Deps = {
  getServerSupabase: () => any;
  requireAdmin: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
  log: (...args: any[]) => void;
};

const BOT_TOKEN = () => process.env.TELEGRAM_BOT_TOKEN || '';
const ALLOWED = () =>
  (process.env.TELEGRAM_ALLOWED_CHAT_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

// In-memory step-session for guided /baru flows (resets on cold start —
// acceptable for a single admin; re-type the command if it stalls).
const sessions = new Map<string, { resource: string; field: string; id?: string; data: any }>();

async function tgReq(method: string, payload: Record<string, any>) {
  if (!BOT_TOKEN()) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN()}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => null);
    return json;
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

const send = (chatId: number, text: string, extra: Record<string, any> = {}) =>
  tgReq('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', ...extra });

const kb = (rows: any[][]) => ({ inline_keyboard: rows });

const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const cap = (s: string, n = 350) => (s.length > n ? s.slice(0, n) + '…' : s);

export function registerBotRoutes(app: express.Express, deps: Deps) {
  const { getServerSupabase, requireAdmin, log } = deps;
  const WEBHOOK_SECRET = () => process.env.BOT_WEBHOOK_SECRET || '';

  const canUse = (chatId: number | undefined) =>
    !!chatId && ALLOWED().includes(String(chatId));

  // ---- data helpers (service role, straight from the same tables) ----
  const db = () => getServerSupabase();

  async function listProjects() {
    const { data } = await db().from('projects').select('*').order('created_at', { ascending: false });
    return data || [];
  }
  async function listPackages() {
    const { data } = await db().from('packages').select('*').order('created_at');
    return data || [];
  }
  async function listLeads(unreadOnly = true) {
    let q = db().from('messages').select('*').order('created_at', { ascending: false });
    if (unreadOnly) q = q.eq('status', 'unread');
    const { data } = await q;
    return data || [];
  }

  // ---- rendering ----
  const projectLine = (p: any) =>
    `${p.featured ? '⭐ ' : ''}<b>${esc(p.title)}</b> [${esc(p.category || '-')}] — ${esc(p.year || '-')}\nID: <code>${p.id}</code>`;

  const packageLine = (pkg: any) =>
    `<b>${esc(pkg.title)}</b> — ${pkg.price_usd ? `$${pkg.price_usd}` : ''} ${pkg.price ? esc(pkg.price) : ''}\nID: <code>${pkg.id}</code>`;

  async function renderMenu(chatId: number) {
    const k = kb([
      [
        { text: '📁 Proyek', callback_data: 'menu:projects' },
        { text: '🎁 Paket', callback_data: 'menu:packages' },
      ],
      [
        { text: '💬 Leads', callback_data: 'menu:leads' },
        { text: '📊 Stats', callback_data: 'menu:stats' },
      ],
      [
        { text: '🎨 Skill', callback_data: 'menu:skills' },
        { text: '❓ FAQ', callback_data: 'menu:faqs' },
        { text: '📞 Kontak', callback_data: 'menu:contact' },
      ],
    ]);
    await send(chatId, 'FarasBot — Admin Panel Kilat.\n\nPilih menu di bawah, atau ketik /help buat daftar command.', k);
  }

  async function showProjects(chatId: number) {
    const projects = await listProjects();
    if (!projects.length) return send(chatId, 'Belum ada proyek.');
    const k = kb(projects.slice(0, 6).map((p) => [{ text: `📁 ${p.title}`, callback_data: `proj:${p.id}` }]));
    await send(chatId, `📁 <b>Proyek (${projects.length})</b>\n\n${projects.map(projectLine).join('\n\n')}`, k);
  }

  async function showPackages(chatId: number) {
    const pkgs = await listPackages();
    if (!pkgs.length) return send(chatId, 'Belum ada paket.');
    await send(chatId, `🎁 <b>Paket (${pkgs.length})</b>\n\n${pkgs.map(packageLine).join('\n\n')}\n\n<code>/paket baru</code> buat tambah.`);
  }

  async function showLeads(chatId: number) {
    const leads = await listLeads(true);
    if (!leads.length) return send(chatId, 'Tidak ada lead baru. 🎉');
    await send(
      chatId,
      `💬 <b>Lead belum dibaca (${leads.length})</b>\n\n` +
        leads
          .slice(0, 8)
          .map(
            (m: any) =>
              `<b>${esc(m.name)}</b> (${esc(m.email || '-')}${m.phone ? ` / ${esc(m.phone)}` : ''})\n` +
              `Layanan: ${esc(m.project_type || '-')} · Budget: ${esc(m.budget || '-')}\n` +
              `ID: <code>${m.id}</code>`
          )
          .join('\n\n'),
      kb(leads.slice(0, 6).map((m: any) => [{ text: `✓ Tandai baca ${esc(m.name)}`, callback_data: `leadread:${m.id}` }]))
    );
  }

  async function showStats(chatId: number) {
    const [projects, leads] = await Promise.all([listProjects(), listLeads(false)]);
    const unread = leads.filter((l: any) => l.status !== 'read').length;
    await send(
      chatId,
      `📊 <b>Statistik</b>\n` +
        `• Proyek: ${projects.length}\n` +
        `• Lead total: ${leads.length} (${unread} belum dibaca)\n` +
        `• Paket: ${(await listPackages()).length}\n\n` +
        `Data langsung dari database yang sama dengan situs.`
    );
  }

  async function showSkills(chatId: number) {
    const { data } = await db().from('skills').select('*').order('created_at');
    const skills = data || [];
    if (!skills.length) return send(chatId, 'Belum ada skill.');
    await send(chatId, `🎨 <b>Keahlian (${skills.length})</b>\n\n` + skills.map((s: any) => `• ${esc(s.name)} — ${s.level ?? 90}%`).join('\n'));
  }

  async function showFaqs(chatId: number) {
    const { data } = await db().from('faqs').select('*').order('sort');
    const faqs = data || [];
    if (!faqs.length) return send(chatId, 'Belum ada FAQ.');
    await send(chatId, faqs.map((f: any) => `<b>Q: ${esc(f.question?.en || '-')}</b>\n${esc(cap(f.answer?.en || ''))}`).join('\n\n'));
  }

  async function showContact(chatId: number) {
    const { data } = await db().from('site_settings').select('*').eq('id', 'default').maybeSingle();
    const s = data || {};
    await send(chatId, `📞 <b>Kontak</b>\nEmail: ${esc(s.contact_email || '-')}\nWA: ${esc(s.whatsapp_number || '-')}`);
  }

  // ---- CRUD: project / package ----
  const PROJECT_FIELDS: Record<string, (a: any, v: string) => void> = {
    title: (a, v) => (a.title = v),
    subtitle: (a, v) => (a.subtitle = v),
    category: (a, v) => (a.category = v),
    client: (a, v) => (a.client = v),
    year: (a, v) => (a.year = v),
    role: (a, v) => (a.role = v),
    liveUrl: (a, v) => (a.live_url = v),
    thumbnail: (a, v) => (a.thumbnail = v),
    summary: (a, v) => (a.summary = v),
    solution: (a, v) => (a.solution = v),
    problemStatement: (a, v) => (a.problem_statement = v),
    tools: (a, v) => (a.tools = v.split(',').map((x) => x.trim())),
    results: (a, v) => (a.results = v.split(',').map((x) => x.trim())),
    featured: (a, v) => (a.featured = ['1', 'true', 'yes', 'ya'].includes(v.toLowerCase())),
  };

  const PACKAGE_FIELDS: Record<string, (a: any, v: string) => void> = {
    title: (a, v) => (a.title = v),
    name: (a, v) => (a.title = v),
    description: (a, v) => (a.description = v),
    priceUSD: (a, v) => (a.price_usd = Number(v) || 0),
    priceIDR: (a, v) => (a.price = v),
    deliveryTime: (a, v) => (a.timeline = v),
    recommendedFor: (a, v) => (a.recommended_for = v),
    period: (a, v) => (a.period = v),
    badge: (a, v) => (a.badge = v),
    popular: (a, v) => (a.is_popular = ['1', 'true', 'yes', 'ya'].includes(v.toLowerCase())),
    features: (a, v) => (a.features = v.split(',').map((x) => x.trim())),
  };

  async function applyField(table: string, id: string, patch: Record<string, any>) {
    const { error } = await db().from(table).update(patch).eq('id', id);
    return !error;
  }

  // ---- main dispatcher ----
  async function handleText(chatId: number, text: string) {
    const [cmd, ...rest] = text.trim().split(/\s+/);
    const arg = rest.join(' ');
    const lower = cmd.toLowerCase();

    // guided-session continuation
    const session = sessions.get(String(chatId));
    if (session && !lower.startsWith('/')) {
      if (session.field === 'title') session.data.title = arg;
      else if (session.resource === 'project') PROJECT_FIELDS[session.field]?.(session.data, arg);
      else if (session.resource === 'package') PACKAGE_FIELDS[session.field]?.(session.data, arg);

      const { error } = await db().from(session.resource + 's').upsert(session.data, { onConflict: 'id' });
      sessions.delete(String(chatId));
      return send(chatId, error ? `❌ Gagal simpan: ${esc(error.message)}` : `✅ ${session.resource === 'project' ? 'Proyek' : 'Paket'} tersimpan (ID: <code>${session.data.id}</code>).\n\nUpdate field lain: <code>/${session.resource} tulis ${session.data.id} &lt;field&gt;=&lt;nilai&gt;</code>`);
    }

    if (lower === '/start' || lower === '/menu') return renderMenu(chatId);
    if (lower === '/help') {
      return send(
        chatId,
        `🤖 <b>FarasBot — command</b>\n\n` +
          `🔍 Lihat\n<code>/proyek</code> daftar proyek\n<code>/paket</code> daftar paket\n<code>/lead</code> lead belum dibaca\n<code>/skill</code> keahlian\n<code>/faq</code> FAQ\n<code>/stats</code> statistik\n<code>/kontak</code> kontak\n\n` +
          `✍️ Buat\n<code>/proyek baru</code> — panduan bertahap\n<code>/paket baru</code>\n\n` +
          `🛠 Ubah\n<code>/proyek tulis &lt;id&gt; &lt;field&gt;=&lt;nilai&gt;</code>\nfield: title, subtitle, category, client, year, role, liveUrl, thumbnail, summary, solution, tools, results, featured\n\n` +
          `<code>/paket tulis &lt;id&gt; &lt;field&gt;=&lt;nilai&gt;</code>\nfield: title, priceUSD, priceIDR, deliveryTime, recommendedFor, badge, popular, features\n\n` +
          `🗑 Hapus\n<code>/proyek hapus &lt;id&gt;</code>\n<code>/paket hapus &lt;id&gt;</code>\n<code>/lead baca &lt;id&gt;</code> · <code>/lead hapus &lt;id&gt;</code>`
      );
    }

    if (lower === '/proyek') {
      if (!arg) return showProjects(chatId);
      if (arg.startsWith('baru')) {
        sessions.set(String(chatId), { resource: 'project', field: 'title', data: { id: 'proj-' + Date.now(), title: '', category: 'UI/UX Design', featured: false } });
        return send(chatId, '✍️ Buat proyek baru.\nLangkah 1/2: kirim <b>judul proyek</b>.');
      }
      if (arg.startsWith('tulis')) {
        const [, id, kv] = arg.split(/\s+/);
        const eq = kv?.indexOf('=');
        if (!id || eq == null || eq <= 0) return send(chatId, 'Format: <code>/proyek tulis &lt;id&gt; &lt;field&gt;=&lt;nilai&gt;</code>');
        const field = kv.slice(0, eq);
        const value = kv.slice(eq + 1);
        const patch: any = {};
        PROJECT_FIELDS[field]?.(patch, value);
        if (!Object.keys(patch).length) return send(chatId, `Field <code>${field}</code> tidak dikenal.`);
        const ok = await applyField('projects', id, { ...patch, updated_at: new Date().toISOString() });
        return send(chatId, ok ? `✅ Proyek <code>${id}</code> diperbarui.` : `❌ Gagal update (ID <code>${id}</code> tidak ditemukan?).`);
      }
      if (arg.startsWith('hapus')) {
        const id = arg.split(/\s+/)[1];
        if (!id) return send(chatId, 'Format: <code>/proyek hapus &lt;id&gt;</code>');
        const { error } = await db().from('projects').delete().eq('id', id);
        return send(chatId, error ? `❌ ${esc(error.message)}` : `🗑 Proyek <code>${id}</code> dihapus.`);
      }
      const p = await db().from('projects').select('*').eq('id', arg.replace('tulis', '').trim()).maybeSingle();
      if (p.data) {
        const x = p.data;
        await send(
          chatId,
          `<b>${esc(x.title)}</b> [${esc(x.category)}] ${x.featured ? '⭐' : ''}\n` +
            `Client: ${esc(x.client || '-')} · ${esc(x.year || '-')}\n` +
            `Ringkas: ${esc(cap(x.summary || '-'))}\n` +
            `Results: ${(x.results || []).join(', ') || '-'}\nTools: ${(x.tools || []).join(', ') || '-'}\n` +
            `${x.live_url ? '🔗 ' + esc(x.live_url) : ''}`
        );
      }
      return;
    }

    if (lower === '/paket') {
      if (!arg) return showPackages(chatId);
      if (arg.startsWith('baru')) {
        sessions.set(String(chatId), { resource: 'package', field: 'title', data: { id: 'pkg-' + Date.now(), title: '', price: '', price_usd: 0 } });
        return send(chatId, '✍️ Buat paket baru.\nLangkah: kirim <b>nama paket</b>.\n\nLanjut update: <code>/paket tulis &lt;id&gt; &lt;field&gt;=&lt;nilai&gt;</code>');
      }
      if (arg.startsWith('tulis')) {
        const [, id, kv] = arg.split(/\s+/);
        const eq = kv?.indexOf('=');
        if (!id || eq == null || eq <= 0) return send(chatId, 'Format: <code>/paket tulis &lt;id&gt; &lt;field&gt;=&lt;nilai&gt;</code>');
        const field = kv.slice(0, eq);
        const value = kv.slice(eq + 1);
        const patch: any = {};
        PACKAGE_FIELDS[field]?.(patch, value);
        if (!Object.keys(patch).length) return send(chatId, `Field <code>${field}</code> tidak dikenal.`);
        const ok = await applyField('packages', id, patch);
        return send(chatId, ok ? `✅ Paket <code>${id}</code> diperbarui.` : `❌ Gagal update.`);
      }
      if (arg.startsWith('hapus')) {
        const id = arg.split(/\s+/)[1];
        if (!id) return send(chatId, 'Format: <code>/paket hapus &lt;id&gt;</code>');
        const { error } = await db().from('packages').delete().eq('id', id);
        return send(chatId, error ? `❌ ${esc(error.message)}` : `🗑 Paket <code>${id}</code> dihapus.`);
      }
    }

    if (lower === '/lead') {
      if (arg.startsWith('baca')) {
        const id = arg.split(/\s+/)[1];
        if (!id) return send(chatId, 'Format: <code>/lead baca &lt;id&gt;</code>');
        const ok = await applyField('messages', id, { status: 'read' });
        return send(chatId, ok ? `✅ Lead <code>${id}</code> ditandai dibaca.` : `❌ Gagal.`);
      }
      if (arg.startsWith('hapus')) {
        const id = arg.split(/\s+/)[1];
        if (!id) return send(chatId, 'Format: <code>/lead hapus &lt;id&gt;</code>');
        const { error } = await db().from('messages').delete().eq('id', id);
        return send(chatId, error ? `❌ ${esc(error.message)}` : `🗑 Lead <code>${id}</code> dihapus.`);
      }
      return showLeads(chatId);
    }

    if (lower === '/skill') return showSkills(chatId);
    if (lower === '/faq') return showFaqs(chatId);
    if (lower === '/stats') return showStats(chatId);
    if (lower === '/kontak') return showContact(chatId);

    await renderMenu(chatId);
  }

  // ---- webhook route ----
  app.post('/api/bot/webhook', async (req, res) => {
    const secret = req.headers['x-telegram-bot-api-secret-token'];
    if (WEBHOOK_SECRET() && secret !== WEBHOOK_SECRET()) {
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
    } else if (body.callback_query && body.callback_query.message) {
      const q = body.callback_query;
      const chatId = q.message.chat.id;
      if (!canUse(chatId)) return res.json({ ok: true });
      try {
        await tgReq('answerCallbackQuery', { callback_query_id: q.id });
      } catch {}
      const data = q.data || '';
      if (data === 'menu:projects') await showProjects(chatId);
      else if (data === 'menu:packages') await showPackages(chatId);
      else if (data === 'menu:leads') await showLeads(chatId);
      else if (data === 'menu:stats') await showStats(chatId);
      else if (data === 'menu:skills') await showSkills(chatId);
      else if (data === 'menu:faqs') await showFaqs(chatId);
      else if (data === 'menu:contact') await showContact(chatId);
      else if (data.startsWith('proj:')) log('open-project', data);
      else if (data.startsWith('leadread:')) {
        const id = data.split(':')[1];
        await applyField('messages', id, { status: 'read' });
        await send(chatId, `✅ Lead <code>${id}</code> ditandai dibaca.`);
      }
    }
    res.json({ ok: true });
  });

  // ---- register webhook (admin-only, call once after env set) ----
  app.post('/api/bot/register', requireAdmin, async (req, res) => {
    const host = (req.headers['x-forwarded-host'] as string) || '';
    const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
    const url = `${proto}://${host}/api/bot/webhook`;
    if (!BOT_TOKEN()) return res.status(501).json({ error: 'TELEGRAM_BOT_TOKEN missing.' });
    if (!WEBHOOK_SECRET()) return res.status(501).json({ error: 'BOT_WEBHOOK_SECRET missing.' });
    const r = await tgReq('setWebhook', { url, secret_token: WEBHOOK_SECRET(), drop_pending_updates: true });
    res.json({ ok: !!r?.ok, url, telegram: r });
  });
}