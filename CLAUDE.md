# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm i          # Install dependencies
npm run dev    # Start dev server (Next.js with Turbopack)
npm run build  # Production build
npm run lint   # ESLint via next lint
npm run start  # Start production server
```

No test suite is configured.

## Architecture

This is a **Next.js 16 (App Router)** website for NAVITECS, a BIM-focused engineering and architecture consultancy based in Bosnia.

### Page pattern

Every route in `src/app/` follows a split pattern:
- **`page.tsx`** — server component, exports `metadata` for SEO, renders the corresponding `*Client.tsx`
- **`src/components/pages/*Client.tsx`** — client component (`"use client"`), holds all interactive logic and UI

Dynamic route: `src/app/projects/[id]/page.tsx` → `ProjectDetailsClient.tsx`, which reads the `id` param and looks up `src/data/projects.ts`.

### Routes

| Path | Client component |
|------|-----------------|
| `/` | redirects to `/home` (root `page.tsx` renders `HomeClient`) |
| `/home` | `HomeClient.tsx` |
| `/about` | `AboutClient.tsx` |
| `/services` | `ServicesClient.tsx` |
| `/projects` | `ProjectsClient.tsx` |
| `/projects/[id]` | `ProjectDetailsClient.tsx` |
| `/careers` | `CareersClient.tsx` |
| `/careers/apply` | `ApplyClient.tsx` |
| `/contact` | `ContactClient.tsx` |
| `/admin` | plain server component, not indexed |

### Data

All project data is statically defined in `src/data/projects.ts`. Each project has an `id` (kebab-case slug), `title`, `category`, `description`, `scope`, `image` (Unsplash URL), and a `caseStudy` object with `challenge`, `solution`, and `results[]`.

### Component library

`src/components/ui/` contains the full shadcn/ui component set (Radix UI primitives + Tailwind). Use these before reaching for MUI or writing custom primitives.

MUI (`@mui/material`) and Radix UI are both installed; shadcn wrappers in `src/components/ui/` are the preferred abstraction.

### Styling

- Tailwind CSS v4 with `@tailwindcss/postcss`
- CSS entry: `src/styles/index.css` → imports `fonts.css`, `tailwind.css`, `theme.css`
- `src/styles/theme.css` defines CSS custom properties for the design system (colors, radius, typography) and registers them with `@theme inline` for Tailwind
- Brand accent colors: `#00AEEF` (cyan) and `#00FF9C` (green), used as gradient pair throughout the site
- Dark background (`bg-black`): the site is a dark-themed design; do not switch to light defaults

### Animations

Framer Motion (`motion` package v12) is used for page transitions, nav active-state indicator (`layoutId="activeNav"`), and staggered reveals. Import from `"framer-motion"`.

### Path alias

`@/*` resolves to `src/*` (configured in `tsconfig.json`).

### Key globals in `src/app/layout.tsx`

- `CustomCursor` — global custom cursor component
- `Navigation` — fixed top nav with mobile drawer
- `Footer` — site-wide footer
- `<main className="pt-20">` — 20px top padding accounts for the fixed nav height
