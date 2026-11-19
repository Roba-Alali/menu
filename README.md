# Qlub White-Label Platform — Foundation

A multi-tenant restaurant SaaS foundation built with Next.js, TypeScript, Supabase and Tailwind CSS.

## Included in this foundation
- Premium dark landing page and Qlub-inspired visual direction.
- Platform admin dashboard concept with sample tenant records.
- Public restaurant menu demo.
- Supabase browser/server client helpers.
- Initial PostgreSQL schema for tenants, team members, branches, categories, products, modifiers, domains, QR codes and orders.
- Tenant membership helpers and initial Row Level Security policies.
- Environment variable template.

## Requirements
- Node.js 20.9+
- npm
- A Supabase project

## Run locally
```bash
npm install
cp .env.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```
Open http://localhost:3000.

The landing page works without Supabase credentials. Database-backed functions are not yet wired to the UI.

## Supabase setup
1. Create a new Supabase project.
2. Open SQL Editor.
3. Review and run `supabase/schema.sql`.
4. Copy project URL and anon key into `.env.local`.
5. Create the first owner account through Supabase Auth.
6. Insert/update that user's row in `public.profiles` with `platform_role = 'owner'` using the Supabase SQL editor.

## Routes
- `/` — platform marketing page
- `/admin` — platform dashboard concept (sample data)
- `/demo` — public restaurant menu concept

## Deployment direction
Deploy the Next.js app to a supported Next.js host. For Cloudflare, use the current OpenNext Cloudflare adapter and follow its deployment guide; do not deploy this project as a static site because tenant routing and server-side operations are planned.

## Important production work still required
This is a foundation build, not a production-ready ordering platform. Before onboarding real customers:
- Implement login, session refresh, password reset, invitation flow and MFA policy.
- Build server-side tenant resolution for subdomains and custom domains.
- Enforce and test tenant authorization for every query and mutation.
- Review and harden RLS policies; create explicit policies for public menu reads and server-validated order creation.
- Add CRUD screens and server actions/API routes for all modules.
- Add file upload validation, malware/content checks, size limits and private/public bucket policies.
- Implement order pricing on the server (never trust client totals), inventory/availability checks, idempotency and rate limits.
- Add audit logs, backups, monitoring, domain verification and operational alerts.
- Add payment provider integration only when the business selects a provider and country.
- Conduct security review and automated tests before production launch.

## Data isolation model
Every tenant-owned record carries `restaurant_id`. Restaurant users are linked through `restaurant_members`. RLS policies are an additional enforcement layer; server-side authorization must also verify the authenticated user's membership and role. Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.
