# SRS — Technical & System Requirements

For Faras Hazid Portfolio (rebuild v2). Supersedes the v1 "Focal Hyperspace" plumbing notes where they conflict.

---

## 1. System overview

```
Browser (React SPA)
  ├─ static pages / components (public + admin)
  ├─ apiService.ts  →  fetch('/api/*')   Express server (Vercel serverless)
  │                    └─ @supabase/supabase-js server client (service-role preferred)
  └─ lib/supabase.ts directly (anon client) — redundancy tier
Supabase (project ndxaweoilmihmlzqulpo, region ap-northeast-2)
  └─ Postgres tables (public). Storage bucket: m2.
```

Two write paths today (`apiService.ts`): direct client first, then HTTP `/api/*` fallback. **Refactor target**: HTTP server is primary for writes (`messages`, `estimates`, upserts) so service-role key stays server-only; client anon writes remove. Reason: anon-is-through RLS (see §6).

## 2. Env (`server.ts`, `.env.local`)

`server.ts` `getServerSupabase()` priority: `SUPABASE_URL|VITE_SUPABASE_URL`, key `SUPABASE_SERVICE_ROLE_KEY|SUPABASE_ANON_KEY|VITE_SUPABASE_ANON_KEY`.

Verify `.env` has real values before claiming "connected" in dashboard.

| Var | Required | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | yes (prod) | SPA client |
| `VITE_SUPABASE_ANON_KEY` | yes | SPA client |
| `SUPABASE_URL` | server | GET / supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | server (preferred) | trusted writes |
| `GEMINI_API_KEY` | unused ships | legacy |
| `APP_URL` | prod | OAuth/callback refs |

Precedence for server client: `SUPABASE_URL` > `VITE_SUPABASE_URL`, key: `SERVICE_ROLE` > `ANON` > `VITE_ANON`.

## 3. API surface (Express, `server.ts`)

| Method | Path | In → Out | Notes |
|---|---|---|---|
| GET | `/api/health` | status/database/supabaseConnected | liveness |
| GET | `/api/supabase/config` | configured/url-mask/hasServiceRoleKey | mask URL first 15 chars |
| POST | `/api/contact` | name,email,phone,projectType,budget,message → `messages` | validates name/email/message |
| POST | `/api/estimates` | clientName/Email/Phone,serviceType,deliverables,urgency,estimatedPrice,notes → `estimates` | |
| GET | `/api/projects` | list (created_at desc) → source local/supabase | |
| POST | `/api/projects` | upsert PROJECT by id | | 
| DELETE | `/api/projects/:id` | remove | |
| POST | `/api/projects/seed` | bulk upsert | |
| GET | `/api/messages` | list messages desc | admin-only once auth'd |

Contract: camelCase request, snake_case rows. Non-2xx → `{ error }`.

## 4. Data contracts

`projects` columns: `id`(text PK), `title`, `subtitle`, `category`, `thumbnail`, `images`(text[]), `client`, `year`, `role`, `summary`, `problem_statement`, `workflow_steps`(jsonb), `solution`, `results`(text[]), `tools`(text[]), `live_url`, `featured`, `created_at`, `updated_at`.

`messages`: `id uuid pk`, `name`, `email`, `phone`, `project_type`, `budget`, `message`, `status`('unread'), `created_at`.

`estimates`: `id uuid pk`, `client_name`, `client_email`, `client_phone`, `service_type`, `deliverables text[]`, `urgency`, `estimated_price`, `notes`, `status`('pending'), `created_at`.

`site_settings`: `id 'default'` singleton + `hero_title`, `hero_subtitle`, `about_bio`, `contact_email`, `contact_phone`, `whatsapp_number`, `avatar_url`, `cv_download_url*`, `social_links`(jsonb), `updated_at`. Local state mirrors this on `clayfolio_site_settings`.

### localStorage cache keys (client)
`clayfolio_lang|page|theme|projects|packages|services|experiences|skills|faqs|estimator_services|estimator_scopes|estimator_timelines|site_settings|messages|analytics`

Supabase fetch merges over cache when length/first-load. **Known debt**: localStorage is currently the *primary* store and cache at once (initial state is default from `initialData.ts`, then optionally Supabase). See PRD §6 for the source-of-truth decision (`m2`: Supabase-primary, localStorage \(\sim\) cache).

## 5. Theme (+ i18n)

- `html[data-theme=light|dark]`, set in `<head>` inline script to avoid FOUC; `AppContext` toggles `theme` state + writes localStorage `clayfolio_theme`.
- 4 locales; store in `clayfolio_lang`; precedence `url.hash` → saved → 'en'. `[dir=rtl]` on `document.documentElement` for `ar`.
- `dataTranslations.ts` returns pre-translated strings per locale; missing → `en` fallback.

## 6. Security

1. **RLS `messages`/`estimates`**: revoke `FOR ALL USING (true)`; add policy service-role only. Public never reads them. Dashboard reads via authenticated server call (`/api/messages`) or a proper storage-backed check.
2. Admin PIN lives in the client bundle — it is **not** a security boundary; it's a hiding gate. Real boundary = RLS + service-role-only server.
3. No secrets in `VITE_*`; `SUPABASE_SERVICE_ROLE_KEY` only server-side.
4. `messages`/`estimates` rows not returned to anonymous endpoints (except admin with token).

## 7. Performance

- Lazy-load `Hero3D` (`React.lazy` on route/page) so `three.js` splits out of the main chunk.
- DevicePixelRatio cap `2`, cleanup `renderer.dispose()` on unmount.
- All arrays/orders client-filter from cached data when pagination not needed; Supabase queries push ordering server-side.
- Images: width/height attributes (except data-URL uploads from the legacy flow).

## 8. Quality gates

- `npm run lint` → `tsc --noEmit`.
- `npm run build` → vite build + esbuild server bundle.
- Migration backout: legacy `clay-*` kept in `index.css` until last page uses it (see DESIGN.md §9).

## 9. Prereq TODOs before first deploy
1. npm install (done).
2. Create `.env.local` with URL + anon key; confirm `/api/health` `supabaseConnected:true`.
3. Revoke anon `FOR ALL` on `messages`/`estimates` (supabase.sql-editor or management-API).
4. Vercel: build `npm run build`, start `node dist/server.cjs`, env same keys.