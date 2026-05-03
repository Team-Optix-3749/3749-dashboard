# Supabase authentication setup (3749 App / TanStack Start)

Use this checklist so **email/password**, **Google OAuth**, and **PKCE redirect** work end-to-end.

## 1. Environment (`tanstack-start/.env`)

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_KEY=sb_publishable_...   # or legacy anon JWT (eyJ...)
```

Restart `npm run dev` after changes.

## 2. Site URL and redirect URLs

In **Supabase Dashboard → Authentication → URL Configuration**:

| Setting | Local development |
|--------|-------------------|
| **Site URL** | `http://localhost:3000` |
| **Additional Redirect URLs** | `http://localhost:3000/auth/callback` |

Add production URLs when you deploy (same path: `/auth/callback`).

The app sends users to:

`http://localhost:3000/auth/callback?next=/dashboard`

Supabase must allow that redirect origin.

## 3. Google OAuth

### Supabase

**Authentication → Providers → Google**: enable and paste **Client ID** and **Client Secret** from Google Cloud.

### Google Cloud Console

1. **APIs & Services → Credentials → OAuth 2.0 Client IDs** (Web application).
2. **Authorized JavaScript origins**:  
   - `http://localhost:3000`  
   - (production) `https://your-domain`
3. **Authorized redirect URIs** — include **Supabase’s** callback (not your app’s):

   `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

   Replace `YOUR_PROJECT_REF` with the subdomain from `VITE_SUPABASE_URL`.

Save both Supabase and Google. Propagation can take a minute.

## 4. Email / templates screen (your screenshot)

Those rows (**Confirm sign up**, **Magic link**, **Reset password**, etc.) are **dashboard toggles and templates**, not SQL.

- **Confirm sign up**: if enabled, users must click the email link before signing in. For fast local testing, you can disable confirmation under **Authentication → Providers → Email** (or adjust **Confirm email** behavior per Supabase docs).
- **Magic link**: optional; this app uses password + Google, not magic links by default.
- **Reset password**: enable if you add a “Forgot password” flow later.

Optional SQL below only applies if you want a **`profiles`** row for every new user (not required for login itself).

## 5. Optional: `profiles` table + trigger

Run in **SQL Editor** only if you want a profile row synced from `auth.users`:

```sql
-- Optional profile row per auth user
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

If you use this, add an **INSERT** policy or insert only via trigger (`security definer` trigger already inserts).

## 6. Smoke test

1. Open `http://localhost:3000/signup` → **Continue with Google** or email sign-up.
2. After Google, you should land on `/auth/callback` briefly, then **`/dashboard`** (or your `next` path).
3. Sign out → **Login** → repeat.

If OAuth fails with redirect errors, recheck **Redirect URLs** in Supabase and **Authorized redirect URIs** in Google (must include Supabase `/auth/v1/callback`).
