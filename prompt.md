## Project Handoff: Rebuild 3749 Dashboard From Scratch

### Objective
Create a brand-new project from scratch for Team 3749 dashboard, replacing the current mixed setup. Do not migrate existing code unless explicitly useful. Prioritize a clean, working baseline.

### Non-Negotiable Requirements
- Use TanStack Start (Vite + React).
- Do not use NextAuth at all.
- Use Supabase for authentication.
- Use Drizzle ORM for database schema/migrations.
- Use shadcn/ui for component primitives with preset `--preset b2BVC6Mc6`.
- Single Node project only (no nested Node apps, no nested package.json app roots).
- Start minimal: only auth + dashboard route initially.

### Stack Requirements
- Framework: TanStack Start + TanStack Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui initialized with preset `--preset b2BVC6Mc6`
- Auth: Supabase Auth (email/password first)
- Data: Supabase Postgres + Drizzle ORM
- Package manager: npm (single lockfile)

### Scope In
- Login page
- Protected dashboard page
- Route guarding for authenticated users
- Supabase client setup (browser + server usage pattern if needed)
- Drizzle config + initial schema + migration flow
- Clean route folder organization
- Clean scripts and project structure

### Required Folder Organization
Use clear route grouping and avoid flat clutter.

- src/routes/(public)/login.tsx
- src/routes/(authed)/_authed.tsx
- src/routes/(authed)/dashboard.tsx
- src/lib/auth/
- src/lib/db/
- src/styles/

Adjust exact names as needed for TanStack conventions, but preserve grouped route intent.

### Implementation Tasks
1. Initialize a fresh TanStack Start TypeScript project at repository root.
2. Remove old Next.js/Prisma/NextAuth artifacts if present.
3. Install and configure Tailwind.
4. Initialize shadcn/ui using preset `--preset b2BVC6Mc6` and set up required aliases/config files.
5. Install Supabase SDK and wire auth helpers.
6. Install Drizzle ORM and set up:
   - drizzle.config.ts
   - schema file(s)
   - migration scripts
7. Add environment variable support:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (server-only)
   - DATABASE_URL if required by Drizzle adapter choice
8. Implement login flow with Supabase email/password.
9. Implement auth guard route wrapper for protected routes.
10. Create minimal authenticated dashboard screen.
11. Ensure project builds and runs with a single `npm install` + `npm run dev`.
12. Build key UI screens using shadcn/ui components, not custom one-off primitives.

### Package Cleanup Requirements
- Remove unused/dead dependencies.
- Avoid duplicate auth libraries.
- Do not include Next.js or NextAuth packages.
- Keep shadcn/ui dependencies aligned with Tailwind and TanStack setup.
- Keep TypeScript and React versions compatible with TanStack Start.

### Acceptance Criteria
- `npm install` succeeds without unresolved dependency errors.
- `npm run dev` starts successfully.
- Visiting protected dashboard while logged out redirects to login.
- Logging in with valid Supabase user reaches dashboard.
- Logging out returns user to login.
- No NextAuth usage anywhere in the repo.
- No nested app project structure (single project root).
- shadcn/ui is initialized with preset `--preset b2BVC6Mc6` and used in login/dashboard UI.

### Suggested Commands to Validate
- npm run dev
- npm run build
- npm run typecheck (if configured)
- npm run lint (if configured)

### Notes for the Implementing Agent
- Favor simple, explicit architecture over over-abstraction.
- Keep files small and route-local where practical.
- Add concise README setup section for env vars and first run.
- If a decision is ambiguous, prefer reliability and maintainability over novelty.
