# Admin Panel

Route prefix: `/navitecs-control-admin/`

## Auth
- HMAC-signed session cookie `nca_sess` (set in `src/lib/adminAuth.ts`)
- `src/middleware.ts` guards all `/navitecs-control-admin/*` except `/login` and `/setup`
- Setup page (`/setup`) self-disables once any admin user exists

## Key files
| File | Purpose |
|------|---------|
| `src/lib/adminAuth.ts` | Session cookie creation/validation |
| `src/lib/rateLimit.ts` | In-memory sliding-window rate limiter |
| `src/app/api/setup/superadmin/route.ts` | One-time superadmin creation |
| `src/app/api/admin/login/route.ts` | Login endpoint |
| `scripts/seed-superadmin.ts` | CLI recovery tool (`npx tsx scripts/seed-superadmin.ts`) |
| `src/components/admin/SetupClient.tsx` | Setup UI |

## Roles
`superadmin` > `admin`. Stored in `AdminUser` table (MariaDB via Prisma).

## DB adapter
`@prisma/adapter-mariadb` — env vars: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`.
