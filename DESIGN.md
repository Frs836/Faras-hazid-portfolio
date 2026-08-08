# FARAS HAZID — Design System

Version: 2.0 (WIP redesign)
Scope: Public portfolio (4 lang) + hidden CMS dashboard.
Status: replaces the legacy "claymorphic" system (`.clay-*` classes) in phases.

---

## 1. Direction

**Editorial creative-studio**, not template-scarecrow.

- Reference mood: `ohhmydesign.com` (type-driven, uppercase, mono meta, grain, marquee) and `lorolabs.ai` (restrained, numbered sections, calm hero, premium 3D).
- Kill the clay look: no pastel glossy 3D blobs, no blue-600 gradients, no pill-everything, no rounded-heavy cards.
- The site should read as *designed by the designer it sells*.

### Anti-patterns (legacy list — do not reintroduce)

1. Anything from the old `.clay-card` / `.clay-button` class set (delete incrementally as pages migrate).
2. `bg-gradient-to-br from-white via-sky-50 to-blue-100` pastel boxes.
3. `rounded-[1.75rem]` as a default card radius. Cards barely exist; when they do, they are flat panels with hairline borders.
4. `animate-ping` pulsing dots that scream "template".
5. Redundant nested shadows. One layer max.
6. Uppercase blue link-text headings in every section (title case only via display type).

---

## 2. Theme

Two themes. **Default = light.** Toggle in navbar, persisted to `localStorage.clayfolio_theme`.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FAF9F6` (paper) | `#0A0A0B` (ink) |
| `--bg-2` | `#F1EFEA` | `#101012` |
| `--surface` | `#FFFFFF` | `#151517` |
| `--fg` | `#101010` | `#F4F4F2` |
| `--fg-muted` | `#6E6B66` | `#9C9C96` |
| `--fg-faint` | `#A6A69E` | `#5C5C57` |
| `--border` | `#E5E2DA` | `#26262B` |
| `--accent` | `#E08A20` | `#F5A93A` |
| `--accent-ink` | `#331E00` | `#2A1800` |
| `--accent-strong` | `#9A5C00` | `#E8A336` |
| `--accent-2` | `#7C5CFF` | `#9D85FF` |

Palette is **logo-driven**: gold (`--accent`) is the signature — from the FH logo's warm "H" edge + galaxy starburst. Violet (`--accent-2`) mirrors the logo's cool "H". `--accent-strong` is the darker gold used when accent acts as *text/glyph on a surface* (legibility ≥ 4.5:1 on light). `--accent-ink` is text stacked on accent blocks.

`prefers-reduced-motion`: disable all tween/parallax/3D drift.

---

## 3. Typography

- **Display**: `Space Grotesk` — headlines, hero, section numbers, logo.
- **Sans**: `Inter` — body, UI.
- **Mono**: `JetBrains Mono` — labels, meta, status, keys, small caps feel.

Scale (clamp-based, mobile-first):

| Role | Sizing |
|---|---|
| Display (hero) | `clamp(3rem, 9vw, 9rem)` / tight |
| H1 | `clamp(2.25rem, 6vw, 4.5rem)` / 1.02 |
| H2 | `clamp(1.75rem, 4vw, 3rem)` / 1.05 |
| H3 | `1.25rem` / 1.15 |
| Body | `1rem` / 1.65 |
| Caption / label | `0.75rem`, mono, `0.14em` tracking, uppercase |

Rules:
- Headlines use `font-weight 500-700` (Space Grotesk is heavy at 700; avoid 900 everywhere).
- Uppercase is a **label language**, never for headlines in RTL/AR rendering (Arabic never uppercases; labels use letter-spacing carefully, AR gets spacing 0).
- Never shrink body below `0.875rem`.

---

## 4. Color usage

- 95% of UI is `--bg` / `--fg` / `--border`. Gray is warm (`#6E6B66`-family), not cool slate.
- Accent reserved for: selection, active nav underline, "open for work" dot, keyword/mono chips, hover underline-on-text.
- Gradients: one allowed signature — radial dark "vignette" using `--accent-2` at ~2% alpha behind the hero; nothing else.

---

## 5. Spacing / layout

- Grid: 12 col, max-width `100rem` (or `max-w-7xl` style, capped at `1440px`), gutter 1.25rem, section padding `clamp(4rem, 10vw, 8rem)`.
- Eyebrow `(01)` counters on every section (`Mono/Semi-Bold 0.625rem gray`).
- Hairline rule (`1px` `--border`) as the primary separator; vertical hairline grid optional in wide view.
- Card anatomy: `--surface` bg, `1px` `--border`, radius `0.5rem`; shadow only on hover on important CTA actions.

---

## 6. Motion

All durations between `160–700ms`, one easing family `cubic-bezier(0.22, 1, 0.36, 1)` ("ease-out-expo") for reveals and `cubic-bezier(0.16, 1, 0.3, 1)` for hovers.

| Move | Spec |
|---|---|
| Block reveal | translateY 24px → 0, opacity 0→1, 700ms, stagger 90ms/child |
| Hover | 200ms, transform scale(1.02) or underline slide |
| Marquee | 40s linear infinite, pause on hover |
| Theme switch | 300ms cross-fade via `transition: background-color` on `body`, `html` |
| Par 3D mouse | damp factor `0.05`, clamp ±`0.35rad` |

`requestAnimationFrame` for all loops; never `setInterval`.

---

## 7. 3D (Hero)

- Single `TorusKnot` in a **dark studio** (`RoomEnvironment` PMREM reflections, `MeshPhysicalMaterial` metalness `.85`, roughness `.18`, slight `--accent` tint).
- Auto-rotate slow (`0.15 rad/s`), mouse parallax, throttled via rAF.
- Falls back to a soft CSS gradient sphere if WebGL fails.
- **Theme-aware**: dark → body `#0A0A0B`-on-theme; light → lower contrast, relies on reflections not color.
- Never a clay donut, never pastel blobs. This is the one hero moment; keep the rest of the page 2D.

---

## 8. Components

| Component | Shape |
|---|---|
| `Navbar` | Sticky, translucent blur, hairline bottom. Left: wordmark. Center: page links w/underline on active. Right: theme, language, CMS (small). Mobile: full-screen sheet. |
| Language | Compact `EN/ID/JA/AR` segmented control (labels only, no flags). |
| Buttons | `A primary` solid `--fg` w/ hover, `--accent` text/underline variations; `B ghost` hairline. Radius `0.5rem`. |
| Cards | Above (flat, hairline). |
| Project card | Cover image (aspect 4/3, grayscale-on-guarded-hover), then `.mono-label` `category`, title `H3`, excerpt `--fg-muted`, tool list. |
| Marquee | Footer + hero bottom, `--fg`/`--fg-faint` alternating, uppercase mono 0.75rem, `◆` separators. |
| Toast | `--surface`, hairline, pop from top, `role=status`. |
| Admin | Keep a clean table/list layout, same tokens; pin to `--fg-muted` styling, no clay. |

(Tables = mobile-first, overflow-x in cards.)

---

## 8. Accessibility

- Contrast ≥ 4.5:1 body text on both themes (light: `#101010` on `#FAF9F6`; dark: `#F4F4F2` on `#0A0A0B`).
- Focus `:focus-visible` 2px `--accent` outline on everything interactive.
- All icons `aria-hidden`, text siblings required for any icon-only button.
- `prefers-reduced-motion`: kill 3D drift, marquee, reveals (keep simple opacity).
- `lang` set from active locale; `dir="rtl"` only for `ar`.
- Contrast the accent: never put `--accent` text on `--bg` where it drops below 3:1 for 0.75rem labels; fall back to `--accent-ink`-on-accent chips instead.

---

## 9. Migration plan (delete legacy)

1. Tokens + theme infra (this doc is the contract).
2. Pipeline: Navbar → Footer → Home → Portfolio/Modal → About → Services → Contact → Analytics pages.
3. Strip the `.clay-*` block from `index.css` only when the last usage is gone, so the admin panel rooftop doesn't break mid-word.

Final gate = `npm run lint` clean + no `clay-card` class in `src/components/pages`.