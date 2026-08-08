import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

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

// 3. Submit contact inquiry
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, projectType, budget, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
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

// 6. Portfolio Projects UPSERT (Create / Update)
app.post('/api/projects', async (req, res) => {
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

// 7. Portfolio Projects DELETE
app.delete('/api/projects/:id', async (req, res) => {
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

// 8. Seed / Sync initial projects array to Supabase
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

// 9. Fetch Contact Messages from Supabase
app.get('/api/messages', async (req, res) => {
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

// ----------------------------------------------------
// HEADLESS CONTENT CMS — editable editorial copy + FAQs
// Each field stores per-language values {en,id,ja,ar};
// the public site displays values[activeLang] (i18n).
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

// 11. Upsert page content rows (deterministic id => idempotent)
app.post('/api/content', async (req, res) => {
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

// 12. Seed page content (same upsert, alias for dashboard "seed" action)
app.post('/api/content/seed', async (req, res) => {
  req.body = req.body;
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

// 14. Upsert FAQ
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

// 15. Delete FAQ
app.delete('/api/faqs/:id', async (req, res) => {
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

// ----------------------------------------------------
// VITE & SERVER BOOTSTRAP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Focal Hyperspace Express & Supabase Server running on http://localhost:${PORT}`);
  });
}

startServer();
