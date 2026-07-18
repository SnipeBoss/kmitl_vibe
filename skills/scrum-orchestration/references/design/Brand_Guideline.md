# Brand Guideline — tokens used in code

Derived from the org agent-skill SOP (Phase 2 — Design). These are the only tokens allowed in the frontend; **reuse these — never invent new ones**. Layout language, rhythm, and elevation philosophy come from [Style_Apple.md](Style_Apple.md); the tokens below are what you type into Tailwind classes.

## Colors

| Role | Hex | Tailwind |
|---|---|---|
| Primary | `#2563EB` | `blue-600` — buttons, links |
| Primary Hover | `#1D4ED8` | `blue-700` — hover states |
| Primary Active | `#1E40AF` | `blue-800` — active states |
| Success | `#10B981` | `emerald-500` |
| Warning | `#F59E0B` | `amber-500` |
| Error | `#EF4444` | `red-500` |
| Info | `#3B82F6` | `blue-500` |
| Background | `#F8FAFC` | `gray-50` — page canvas |
| Card | `#FFFFFF` | `white` — cards, panels |
| Text Primary | `#111827` | `gray-900` — body, headings |
| Text Secondary | `#6B7280` | `gray-500` — captions, metadata |
| Text Muted | `#9CA3AF` | `gray-400` |
| Border | `#E5E7EB` | `gray-200` — dividers, inputs |

One accent only (Apple principle): every interactive element uses Primary blue — no second accent color exists.

## Typography — IBM Plex Sans / IBM Plex Sans Thai

| Level | Size / Weight |
|---|---|
| Page title (H1) | 24px Bold (700) |
| Section title (H2) | 18–20px SemiBold (600) |
| Card title (H3) | 16px SemiBold (600) |
| Body | 14px Regular (400) |
| Labels | 12px Medium (500) |
| Button text | 14px SemiBold (600) |
| Caption / helper | 11px Medium, text-secondary |

## Spacing, radius & layout

- **Card padding:** small/filters `p-4` (16px) · main cards `p-6` (24px) · hero `p-8` (32px)
- **Gaps:** icon+text `gap-2` (8px) · elements in card `gap-3` (12px) · grid/form `gap-4` (16px) · between sections `space-y-6` (24px)
- **Border radius:** cards/buttons `rounded-lg` (8px) · large cards `rounded-xl` (12px) · modals `rounded-2xl` (16px)
- **Top navigation:** height 64px, white background with shadow, sticky
- **Content:** max width 1280px; padding Desktop 32px / Tablet 24px / Mobile 16px
- **Elevation:** follow Style_Apple's one-shadow philosophy — surface-color change and hairline borders for hierarchy, not stacked shadows

## Responsive breakpoints (mobile-first)

Desktop 1440px+ (full layout, 32px padding) · Tablet 768–1024px (24px padding) · Mobile <768px (single column, hamburger menu, 16px). Layout must hold at **375px**.

## Component & accessibility rules (binding)

- Tailwind utility classes only — never inline `style={{}}` (exception: dynamic values not expressible as classes); `clsx` for conditional classes
- Convert reusable elements to components (`Button/Primary`, `Input/Default`)
- Semantic HTML first (`<button>`/`<a>`/`<form>`); Tab-reachable + Enter/Space-activatable; visible focus rings; colour never the sole signal
- Every async surface needs **loading + empty + error** states
- Press state: `transform: scale(0.95)` micro-interaction (from Style_Apple)
- Export screens PNG @2x, icons/logos SVG; commit design assets with a design README

## Design gate (Gate 2 — UI portion)

✅ colors/typography/spacing match this guideline · ✅ Tab + Enter/Space works · ✅ 375px layout doesn't break · ✅ loading/empty/error states present · ✅ no inline styles for class-expressible values · ✅ Style_Apple.md + this file were read before the UI work started
