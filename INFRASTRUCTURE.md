# INFRASTRUCTURE — Faras Hazid Portfolio

Snapshot of the full-stack infrastructure, per-pillar status, known gaps,
and the roadmap. Kept in-repo so it ships with the codebase and every change
can be reviewed against it.

Stack: React 19 + Vite (frontend) · Express on Vercel Serverless (`/api/*`) ·
Supabase Postgres (DB + RLS) · Vercel (hosting/edge) · Git + GitHub (VCS).

---

## Pillar matrix

| # | Pillar | Status | Notes / proof |
|---|--------|--------|---------------|
| 1 | Frontend | ✅ Done | React SPA, clean-path routing (`/about/`, no `#`), i18n (EN/ID/JA/AR), 404 trap, dashboard overlay. |
| 2 | APIs & Backend Logic | ✅ Done | Express API in `api/index.ts` (`/api/health`, `/api/admin/*`, `/api/contact`, `/api/estimates`, `/api/projects`, `/api/messages`, `/api/estimates`, `/api/events`, `/api/analytics`, `/api/upload`, `/api/content`, `/api/faqs`, `/api/translate`). JSON error handler added. Integration fixes: lead ingestion deduped (server-first, client fallback), estimator + site-settings auto-persist added, packages/skills upserts column-fallback-safe. |
| 3 | Database & Storage | ✅ Done | Postgres ✅ + migrations via MCP. Uploads (images/CV/PDF) now go to **Supabase Storage** (public bucket `portfolio-assets`, admin-gated `/api/upload`, URL stored in DB) with data-URL fallback. **Pending**: run `supabase/migrations/20260815_integration_columns.sql` once to enable full package/skill/settings columns. |
| 4 | Auth & Permissions | ✅ Done | PIN server-verify + HMAC token (12h) + rate-limit. PIN rotatable in-app (scrypt in `admin_config`). RLS locked. Multi-admin (Supabase Auth) = roadmap. |
| 5 | Hosting & Deployment | ✅ Done | Vercel static + serverless function. `vercel.json` rewrites (SPA fallback + `/api`). Server envs set in Vercel project. |
| 6 | Cloud & Compute (optional) | ✅ Done | Supabase managed Postgres (Singapore region). Edge/CDN via Vercel. Edge Functions = roadmap (chatbot). |
| 7 | CI/CD & Version Control | ✅ Done | GitHub + auto-deploy on `main` push ✅. **CI gate added** — `.github/workflows/ci.yml`: `npm ci` + `tsc --noEmit` + `vite build` on every push/PR. Dependabot weekly (`.github/dependabot.yml`). |
| 8 | Security & RLS | ✅ Done | RLS: messages/estimates insert-only (anon), admin reads via service-role + HMAC. `admin_config` no public policies. Revoked anon EXECUTE on `rls_auto_enable()`. Supabase advisors = 0 lints. |
| 9 | Rate Limiting | ✅ Done | Admin verify/change-pin: 5×/10min/IP (in-memory). Public writes (`/api/contact`, `/api/estimates`, `/api/events`): 30×/min/IP. **Note:** in-memory resets on cold start — acceptable at this scale; per-IP Redis = upgrade path. |
| 10 | Caching & Scanning | ✅ Done | Cache headers in `vercel.json`: `/assets/*` immutable 1y, `/index.html` no-cache. Dependabot enabled for npm weekly. Sentry crash-reporting still on roadmap. |
| 11 | Error Tracking & Logs | ⚠️ Gap | Server `console.error` + global JSON 500 handler ✅. **No crash reporting** — add Sentry (frontend + server) for prod visibility. |
| 12 | Availability & Recovery | ⚠️ Gap | Supabase managed backups/PITR ✅. Redeploy = rollback path. No explicit RPO/RTO doc; smoke-test `/api/health` in CI. |

Legend: ✅ shipped and working · ⚠️ shipped but needs follow-up · 🔜 roadmap

---

## Known gaps → action list (in priority order)

1. **Sentry** — capture frontend + serverless errors; alert to Telegram. (Pillar 11)
2. **Multi-admin (Supabase Auth)** — when more than one admin is needed; replaces single-PIN gate. (Pillar 4)

## Roadmap — Telegram AI assistant ("FarasBot", OpenClaw-style but free)

**STATUS: MVP shipped** — private webhook bot (`/@farluxbot`) acting as a second
admin. Commands: `/menu`, `/proyek` (list/baru/tulis/hapus), `/paket` (sama),
`/lead` (list/baca/hapus), `/skill`, `/faq`, `/stats`, `/kontak`, `/help`.
Reaches the same Supabase tables as the public site. Webhook: `POST /api/bot/webhook`
(secret-token verified, chat allowlist), registration via `POST /api/bot/register`.

Remaining phases:
- **Natural Q&A**: Gemini RAG over portfolio content (key already present).
- **Search & automation**: full-text search; scheduled Edge Functions (cron).
- **Google Drive / local PC**: OAuth flow + lightweight agent loop — needs care
  with Vercel serverless time limits.

---

## Operations — runbook

**Admin login (production)**
- `https://faras-hazid-portfolio.vercel.app/null/` (or any unknown path) → fake 404
- Click the ghost icon 3× → PIN modal → dashboard opens as overlay.
- Logo (navbar) 3× also jumps to `/null/`.

**Rotate admin PIN**
- In-app: Dashboard → Pengaturan → Keamanan Akun → PIN lama + baru.
- Store = scrypt hash in `admin_config` (Supabase). Env `ADMIN_PIN` is only a
  first-run fallback until the first successful login migrates it into the DB.

**Lead alerts (Telegram)**
- Requirement: Vercel env `TELEGRAM_BOT_TOKEN` + `TELEGRAM_ADMIN_CHAT_ID`.
- Bot: `@farluxbot`. Chat ID: `8358949008`. Messaging a new bot once before wiring.
- New contact/estimate leads → instant alert to that chat; silently skipped if env unset.

**Environment variables (Vercel → Project Settings → Environment Variables)**
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (client)
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server)
- `ADMIN_SECRET` (server; must be a long random string — revokes all tokens on rotate)
- `GEMINI_API_KEY` (server)
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID` (server)
- `BOT_WEBHOOK_SECRET` (server; FarasBot webhook signing)
- `TELEGRAM_ALLOWED_CHAT_IDS` (server; comma CSV of chats allowed to talk to the bot)

**Apply schema changes**
- Full reset script: `SUPABASE_SQL_SCHEMA` (src/lib/supabase.ts) — destructive, DROPs tables.
- Incremental migrations: `supabase/migrations/` — run each **once** in Supabase SQL Editor.
- **Required once (integration):** `supabase/migrations/20260815_integration_columns.sql` —
  adds `packages.price_usd / recommended_for / period / updated_at`, `skills.color`,
  `site_settings.cv_download_url_indo / _eng`. The app works without it (fallback paths),
  but full-field persistence requires it.

**Vercel gotcha (learned the hard way)**
- Serverless functions only resolve imports that live INSIDE `api/`. A relative import
  to `src/…` or any folder outside `api/` is NOT bundled → module-load crash → every
  `/api/*` returns an empty 500. Keep all function code in `api/index.ts` (FarasBot is
  inlined there). `api/diag.ts` was used to isolate this.
