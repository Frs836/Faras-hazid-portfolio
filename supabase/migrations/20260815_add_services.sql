-- ============================================================
-- 2026-08-15 — add services table (ServicesPage "What I do")
-- Paste & run once in Supabase SQL Editor (idempotent).
-- Safe to run even if the table already exists (adds missing cols).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  icon TEXT DEFAULT 'Sparkles',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- An existing services table may predate the icon/deliverables columns.
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'Sparkles';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS deliverables TEXT[] DEFAULT '{}';

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
-- Content is public (same posture as projects/skills); admin edits go through
-- the dashboard. Lead/estimate/event tables remain insert-only for anon.
DROP POLICY IF EXISTS "Public All services" ON public.services;
CREATE POLICY "Public All services" ON public.services FOR ALL USING (true) WITH CHECK (true);