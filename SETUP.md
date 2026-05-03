# 3749 App - Database Setup Guide

## Quick Start with Supabase (Recommended)

Supabase is a free PostgreSQL database service that's perfect for development and small deployments.

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to initialize (5-10 minutes)
5. Go to **Project Settings** → **Database** → Copy the **Connection String**

### Step 2: Update .env File
Replace the DATABASE_URL in `.env` with your Supabase connection string:

```bash
# Example (replace with your actual values):
DATABASE_URL="postgresql://postgres:YourPassword@db.xxxxxxxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:YourPassword@db.xxxxxxxx.supabase.co:5432/postgres"
```

### Step 3: Run Database Migrations
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed the database with a test owner account
npx prisma db seed
```

### Step 4: Set Up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Create **OAuth 2.0 Client ID** (Application type: Web application)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy the **Client ID** and **Client Secret** to `.env`:

```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Step 5: Generate NextAuth Secret
```bash
# Generate a random secret
openssl rand -base64 32

# Copy the output to .env:
NEXTAUTH_SECRET=<paste-the-random-string-here>
```

### Step 6: Build & Run
```bash
# Install dependencies (if not done)
npm install

# Build the project
npm run build

# Start development server
npm run dev
```

The app will be running at `http://localhost:3000`

---

## Alternative: Local PostgreSQL with Docker

If you prefer running PostgreSQL locally:

```bash
# Install Docker: https://www.docker.com/products/docker-desktop

# Start PostgreSQL
docker run --name 3749-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=3749-app \
  -p 5432:5432 \
  -d postgres:15

# Update .env:
DATABASE_URL="postgresql://postgres:password@localhost:5432/3749-app"
DIRECT_URL="postgresql://postgres:password@localhost:5432/3749-app"
```

---

## First Time Setup Checklist

- [ ] Database (Supabase, Docker, or other PostgreSQL)
- [ ] DATABASE_URL in `.env`
- [ ] `npx prisma db push`
- [ ] Google OAuth credentials
- [ ] GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in `.env`
- [ ] NEXTAUTH_SECRET in `.env`
- [ ] `npm run build` succeeds
- [ ] `npm run dev` and app loads at localhost:3000

---

## Troubleshooting

### "Error: @prisma/client did not initialize yet"
- **Cause**: DATABASE_URL is missing or invalid
- **Fix**: Check that `DATABASE_URL` in `.env` is correct and the database is accessible

### "Failed to collect page data"
- **Cause**: Database connection failed during build
- **Fix**: Ensure your PostgreSQL database is running and accessible

### "Cannot find module '@/lib/auth'"
- **Cause**: TypeScript paths not configured
- **Fix**: This should be already configured. If not, check `tsconfig.json` has `"paths": { "@/*": ["./src/*"] }`

### "NextAuth callback failed"
- **Cause**: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing/incorrect
- **Fix**: Verify credentials in Google Cloud Console and update `.env`

---

## Production Deployment

When deploying to Vercel:

1. Add environment variables in Vercel project settings:
   - `DATABASE_URL` (use Supabase PostgreSQL URL)
   - `NEXTAUTH_URL` (your production domain, e.g., https://3749app.vercel.app)
   - `NEXTAUTH_SECRET` (generate a new one)
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

2. Update Google OAuth redirect URI to your production domain

3. Push to GitHub and Vercel will auto-deploy

---

For more help, see: https://supabase.com/docs or https://nextjs.org/docs
