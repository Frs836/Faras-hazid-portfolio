# PRD — FARAS HAZID Portfolio & Personal-Brand CMS

Status: v2 (rebuild of v1 "claymorphic")
Owner: Faras Hazid
Stack at a glance: React 19 + Vite + Tailwind v4 + Three.js + Express 5 + Supabase. Host: Vercel (not yet deployed).

---

## 1. Vision

One site that is simultaneously:
- A **portfolio** that lands freelance/remote design work for Faras Hazid (Graphic & UI/UX designer).
- A **personal brand** ("Focal Hyperspace Creative") with a transparent pricing + estimator story.
- A **headless CMS** the owner edits: projects, pricing, experiences, skills, site settings, messages, estimates — from a hidden dashboard, writing to Supabase, no dev required.

## 2. Goals / Non-goals

**Goals**
1. Premium, non-template editorial look (kill the claymorphic "AI slop").
2. Light/dark themes, default light, persisted.
3. Four languages: `en`, `id`, `ja`, `ar` (RTL for ar only).
4. One striking but calm hero 3D moment (studio-grade, not clay blobs).
5. Dashboard usable from phone: add/edit/delete + bulk sync to Supabase.
6. Messages & estimate leads land in Supabase and are viewable in the dashboard.

**Non-goals (now)**
- Full user auth for the admin (PIN gate is hidden-URL + passcode; treat as cosmetic, not security).
- Multi-user editing, audit logs, SSO.
- Payments/cart; estimator is a lead-quote tool only.
- Page analytics beyond the in-app counter (already trivial).
- Native apps or a design-system library dependency.

## 3. Users / personas

| Persona | Need | Documented as |
|---|---|---|
| Hiring manager / founder | Judge craft fast, check work, contact | New visitor, 20–60s |
| Foreign client (jp/ar/en) | Understand services + pricing currency | Multilingual guest |
| Local client (id) | WhatsApp-reach quickly, estimate a project | Primary lead |
| Faras (owner) | Update portfolio + read leads in minutes, from any browser | Superuser |

## 4. Feature scope

### 4.1 Public (m1)
- Hero: available-badge, name, role, one-line bio, 3D knot, CTAs.
- Stats (4), featured projects, workflow, estimator teaser, skills (no 3D-related junk), trust points.
- Portfolio: filter by category + search + case-study modal (meta, problem, workflow, solution, results, tools).
- About: bio, profile, CV download (2 langs), socials.
- Services: pricing packages (USD+IDR), estimator calculator.
- Contact: form → Supabase `messages` + WhatsApp deep-link + email.
- Navbar/Footer: editorial chrome, theme + language controls, hidden CMS gate on 3 clicks of logo.

### 4.2 Admin (m1)
- Gate PIN (kept; hidden behind logo click) → dashboard.
- Tabs: Projects (CRUD per case study), Packages, Calculator (services/scopes/timelines), Experiences, Skills, Messages (read/delete), Settings (hero/bio/contact/CV URLs/socials), Supabase (health, push-all-sync, copy schema), Analytics.
- Uploads: image/PDF → **data URL** (no storage bucket yet; warn for 2MB+).

### 4.3 Foundation
- i18n: ui strings + translated data (titles/summaries) with en fallback.
- Data: Supabase is the **sync target** (source-of-truth candidate, see §6).

## 5. Data model (Supabase `public`)

All tables already exist in `ndxaweoilmihmlzqulpo`; schema copy lives in `src/lib/supabase.ts` as `SUPABASE_SQL_SCHEMA`.

| Table | Purpose | Opened to public via RLS |
|---|---|---|
| `projects` | portfolio case studies | yes |
| `packages` | pricing, priceUSD/IDR | yes |
| `estimator_services` / `_scopes` / `_timelines` | calculator config | yes |
| `experiences` | career + education | yes |
| `skills` | proficiency rows | yes |
| `site_settings` | profile/hero/socials/CV | yes |
| `messages` | contact leads | **no — remove anon ALL** |
| `estimates` | quote leads | **no — remove anon ALL** |

## 6. Acceptance criteria (m1)

1. Theme toggle flips light↔dark, persists, no flash on load.
2. All 4 locales switch UI + data; `ar` renders RTL; body never `<0.875rem`.
3. `npm run lint` passes; `npm run build` passes.
4. Lead submit lands a row in `messages` (server /api/contact) and visible in dashboard tab; failure toasts gracefully.
5. Blog/admin gated: no dashboard reachable by URL, PIN required.
6. All public content reads from Supabase when env keys are set (falls back to local genre when not).
7. Lighthouse (after deploy) ≥ 90 perf, ≥ 95 a11y, mobile-first.
8. **Security**: `messages`/`estimates` anon-RLS revoked; only service-role (server) can write.

## 7. KPIs

- Time-to-first-proof on hero (< 2s); CTR CTA; contact form completion; estimate drop-off; CV download rate; bounce (desktop).

## 8. Risks

- Data-URL image bloat → RLS table limits; **plan**: bucket + signed URLs in m2.
- Express + Vite middleware on Vercel: serverless cold starts; consider splitting: Vite SPA + `/api` route, keep Express as fallback. (See SRS §deply.)
- Client bundle: three.js + react ~ 1MB; code-split `Hero3D` lazy.
- `dataTranslations` bloats initialData: schema-by-encoding via locales in-memory only, not in Supabase.

## 9. Release

Explicit owner-sign on this PRD → then DESIGN.md → then SRS.md engineering → front on. Show "old vs new" hero under way each phase. First deployment is a manual Vercel """/.../"" build to get real device feeling — early, not mostly week. Failure rollback: keep `git` history tagged `legacy-clay` before the rewrite.