# Styling

- **Tailwind CSS v4** with `@tailwindcss/postcss`
- CSS entry: `src/styles/index.css` → `fonts.css`, `tailwind.css`, `theme.css`
- Design tokens in `src/styles/theme.css` via `@theme inline`
- Brand gradient: `#00AEEF` (cyan) → `#00FF9C` (green)
- Always dark (`bg-black`) — never switch to light defaults

## Animations
Framer Motion v12 (`motion` package). Import from `"framer-motion"`.
Used for: page transitions, `layoutId="activeNav"` indicator, staggered reveals.

## Component library
Prefer **shadcn/ui** wrappers in `src/components/ui/` (Radix UI + Tailwind).
MUI (`@mui/material`) is installed but shadcn is the preferred abstraction.
