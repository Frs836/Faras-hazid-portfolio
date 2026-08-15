import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

export const config = { maxDuration: 30 };

// Temporary diagnostic function — /api/diag
export default function handler(_req: any, res: any) {
  try {
    const sup = createClient('https://dummy.supabase.co', 'dummy-anon');
    const ai = new GoogleGenAI({ apiKey: 'dummy-key' });
    return res.json({
      ok: true,
      node: process.version,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasBotToken: !!process.env.TELEGRAM_BOT_TOKEN,
      supOk: !!sup,
      aiOk: !!ai,
    });
  } catch (e: any) {
    return res.status(500).json({ err: String(e).slice(0, 400) });
  }
}