import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase credentials safely from env or import.meta.env
const getSupabaseCredentials = () => {
  const url = 
    (typeof process !== 'undefined' && process.env && process.env.SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) ||
    (import.meta.env && import.meta.env.VITE_SUPABASE_URL) || '';

  const key = 
    (typeof process !== 'undefined' && process.env && process.env.SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY) ||
    (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || '';

  return { url, key };
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  const { url, key } = getSupabaseCredentials();
  if (url && key) {
    try {
      supabaseInstance = createClient(url, key);
      return supabaseInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
};

export const isSupabaseConnected = (): boolean => {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key);
};

// SQL Schema Definition for Supabase Database setup
export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- FOCAL HYPERSPACE / FARAS HAZID PORTFOLIO FULL CMS SCHEMA
-- Paste and Run this in Supabase SQL Editor
-- WARNING: This will DROP existing tables and build a clean schema!
-- ========================================================

-- 0. CLEAN RESET (DROP TABLES IF THEY ALREADY EXIST)
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.estimator_services CASCADE;
DROP TABLE IF EXISTS public.estimator_scopes CASCADE;
DROP TABLE IF EXISTS public.estimator_timelines CASCADE;
DROP TABLE IF EXISTS public.experiences CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.estimates CASCADE;

-- 1. Site Settings & Profile Info
CREATE TABLE public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  hero_title TEXT DEFAULT 'Hi, I''m Faras Hazid 👋',
  hero_subtitle TEXT DEFAULT 'UI/UX Designer & Creative Tech Specialist',
  about_bio TEXT DEFAULT 'Passionate designer crafting high-converting digital products.',
  contact_email TEXT DEFAULT 'faras@example.com',
  contact_phone TEXT DEFAULT '+6285143541287',
  whatsapp_number TEXT DEFAULT '6285143541287',
  avatar_url TEXT DEFAULT '',
  cv_download_url TEXT DEFAULT '',
  cv_download_url_indo TEXT DEFAULT '',
  cv_download_url_eng TEXT DEFAULT '',
  social_links JSONB DEFAULT '{"github":"","linkedin":"","behance":"","dribbble":"","instagram":""}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL,
  thumbnail TEXT,
  images TEXT[] DEFAULT '{}',
  client TEXT,
  year TEXT,
  role TEXT,
  summary TEXT,
  problem_statement TEXT,
  workflow_steps JSONB DEFAULT '[]'::jsonb,
  solution TEXT,
  results TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Pricing Packages Table
CREATE TABLE public.packages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  timeline TEXT,
  features TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Calculator Estimator Service Packages & Deliverables
CREATE TABLE public.estimator_services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  base_usd NUMERIC NOT NULL DEFAULT 200,
  base_idr NUMERIC NOT NULL DEFAULT 3000000,
  icon TEXT DEFAULT 'Sparkles',
  deliverables TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Calculator Estimator Scope Multipliers
CREATE TABLE public.estimator_scopes (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  mult NUMERIC NOT NULL DEFAULT 1.0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Calculator Estimator Timeline Multipliers
CREATE TABLE public.estimator_timelines (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  mult NUMERIC NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Experiences (CV & Career History)
CREATE TABLE public.experiences (
  id TEXT PRIMARY KEY,
  period TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  highlights TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Skills & Proficiencies
CREATE TABLE public.skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Design',
  level INT DEFAULT 90,
  icon TEXT DEFAULT 'Figma',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Contact Messages Inquiries
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_type TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Project Estimator Submissions Log
CREATE TABLE public.estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  service_type TEXT NOT NULL,
  deliverables TEXT[] DEFAULT '{}',
  urgency TEXT,
  estimated_price NUMERIC,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimator_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimator_scopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimator_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;

-- CREATE FULL PERMISSIVE POLICIES FOR PORTFOLIO CMS MANAGEMENT
CREATE POLICY "Public All site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All packages" ON public.packages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All estimator_services" ON public.estimator_services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All estimator_scopes" ON public.estimator_scopes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All estimator_timelines" ON public.estimator_timelines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All estimates" ON public.estimates FOR ALL USING (true) WITH CHECK (true);
`;

