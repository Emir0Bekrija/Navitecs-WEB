# Architecture

Next.js 16 App Router. Every route splits into:
- `src/app/**/page.tsx` — server component, exports `metadata`, renders Client
- `src/components/pages/*Client.tsx` — `"use client"`, all interactive logic

## Routes
| Path | Client |
|------|--------|
| `/` → `/home` | `HomeClient.tsx` |
| `/about` | `AboutClient.tsx` |
| `/services` | `ServicesClient.tsx` |
| `/projects` | `ProjectsClient.tsx` |
| `/projects/[id]` | `ProjectDetailsClient.tsx` (reads `src/data/projects.ts`) |
| `/careers` | `CareersClient.tsx` |
| `/careers/apply` | `ApplyClient.tsx` |
| `/contact` | `ContactClient.tsx` |
| `/navitecs-control-admin/*` | Admin panel — not indexed |

## Data
`src/data/projects.ts` — static project records: `id` (slug), `title`, `category`, `description`, `scope`, `image`, `caseStudy.{challenge,solution,results[]}`.

## Globals (`src/app/layout.tsx`)
`CustomCursor` · `Navigation` (fixed top, mobile drawer) · `Footer` · `<main className="pt-20">` (accounts for fixed nav)
