# The 3749 App

This repository now defaults to a TanStack Start + Supabase baseline.

## Runtime stack

- Framework: TanStack Start
- Data/Auth backend: Supabase
- App root: tanstack-start

## Run

```bash
cd /home/pranav/optix/3749-dashboard
npm run dev
```

The root scripts proxy into tanstack-start.

## Required Supabase env vars

Set these in tanstack-start/.env:

- SUPABASE_URL
- SUPABASE_ANON_KEY

## 3749 module routes (TanStack Start)

- /dashboard
- /finance
- /sponsors
- /opi
- /build-hours
- /calendar
- /schedule
- /members
- /roles
- /settings

Legacy Next.js scaffold remains in src for reference during migration.