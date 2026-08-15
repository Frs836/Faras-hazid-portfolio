-- ============================================================
-- 2026-08-15 — integration fixes
-- Aligns DB columns with the dashboard write paths.
-- Paste & run once in Supabase SQL Editor (idempotent).
-- ============================================================

-- packages: dashboard writes price_usd, recommended_for, period, updated_at
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS price_usd NUMERIC DEFAULT 0;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS recommended_for TEXT DEFAULT '';
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS period TEXT DEFAULT 'per project';
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- skills: dashboard writes per-skill color
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'amber';

-- site_settings: separate CV downloads (Indo vs Eng)
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cv_download_url_indo TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cv_download_url_eng TEXT DEFAULT '';