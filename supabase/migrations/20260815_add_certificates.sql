-- ============================================================
-- 2026-08-15 — add certificates table (About page "Learning")
-- Paste & run once in Supabase SQL Editor (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT DEFAULT '',
  year TEXT DEFAULT '',
  image TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public All certificates" ON public.certificates;
CREATE POLICY "Public All certificates" ON public.certificates FOR ALL USING (true) WITH CHECK (true);