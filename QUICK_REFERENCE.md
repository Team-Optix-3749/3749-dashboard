# Quick Reference - The 3749 App

## 🚀 First Time Setup (5 minutes)

```bash
# 1. Clone and install
git clone <your-repo> 3749-app
cd 3749-app
npm install

# 2. Create .env file (see SETUP.md for details)
# Set: DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

# 3. Set up database
npx prisma db push
npx prisma db seed

# 4. Run dev server
npm run dev
# Opens http://localhost:3000
```

## 📱 Daily Development

```bash
npm run dev           # Start development server (http://localhost:3000)
npm run build         # Test production build
npm run lint          # Check TypeScript and formatting
npx prisma studio    # Browse database with UI
```

## 🗄️ Database Commands

```bash
npx prisma db push       # Sync schema with database (USE THIS)
npx prisma migrate dev   # Create and apply migration
npx prisma db seed       # Run seed script
npx prisma studio       # Open database browser
```

## 👤 Roles & Permissions

**Roles** (in order of power):
- OWNER - Full control
- OFFICER - Most management capabilities
- LEADERSHIP - Limited management + viewing
- MEMBER - Basic viewing and data entry
- PENDING - New user awaiting verification

**Check permission in code:**
```typescript
const canEdit = await hasPermission(userId, "EDIT_BUDGET")
if (!canEdit) return 403  // Forbidden
```

## 🔐 How to Add a Protected Page

```typescript
// src/app/(app)/my-page/page.tsx
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function MyPage() {
  // 1. Check user is logged in
  const session = await getServerSession(authOptions)
  if (!session || !session.user) redirect("/login")
  
  // 2. Check user is verified
  if (!session.user.isVerified) redirect("/pending")
  
  // 3. Check permission (optional)
  const canView = await hasPermission(session.user.id as string, "YOUR_PERMISSION")
  if (!canView) redirect("/dashboard")
  
  return (
    <div>
      <h1>Your Page - {session.user.name}</h1>
    </div>
  )
}
```

## 🔗 How to Add a Protected API Route

```typescript
// src/app/api/my-route/route.ts
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"
import { db } from "@/lib/db"
import { mySchema } from "@/lib/validations/my-validation"

export async function POST(req: Request) {
  // Layer 1: Check authenticated
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Layer 2: Check verified
  if (!session.user.isVerified) {
    return Response.json({ error: "Not verified" }, { status: 403 })
  }
  
  // Layer 3: Check permission
  const canDo = await hasPermission(session.user.id as string, "REQUIRED_PERM")
  if (!canDo) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }
  
  // Parse & validate request
  const parsed = mySchema.safeParse(await req.json())
  if (!parsed.success) {
    return Response.json({ error: parsed.error }, { status: 400 })
  }
  
  // Do something with database
  const result = await db.myModel.create({
    data: {
      ...parsed.data,
      createdBy: session.user.id
    }
  })
  
  return Response.json(result, { status: 201 })
}
```

## 🎨 Design System

**Colors** (CSS variables in globals.css):
- `--background`: Dark bg
- `--surface`: Cards/containers  
- `--surface-elevated`: Elevated components
- `--border`: Border color
- `--blue-primary`: Main accent (221° 83% 53%)
- `--text-primary`: Main text (95% brightness)
- `--text-secondary`: Secondary text (65% brightness)

**Spacing**: Tailwind default (4px base)
**Typography**: Geist font (installed via Next.js)
**Dark mode**: Only - no light theme toggle

## 📦 Common npm Commands

```bash
npm install package-name          # Add package
npm run dev                        # Start development server
npm run build                      # Build for production
npm run build && npm start         # Build and run production build
npm run lint                       # Run TypeScript and ESLint
npx prisma studio                 # Open database UI
npm audit                          # Check for vulnerabilities
```

## 🆘 Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `@prisma/client did not initialize` | DATABASE_URL missing/invalid | Check .env DATABASE_URL |
| `Cannot find module '@/lib/auth'` | Path alias not working | Verify tsconfig.json paths |
| `NextAuth callback failed` | Google OAuth credentials wrong | Check GOOGLE_CLIENT_ID/SECRET in .env |
| `Port 3000 already in use` | Another app using port | `kill -9 $(lsof -t -i :3000)` or use PORT=3001 npm run dev |
| `Prisma schema validation error` | Invalid schema syntax | Run `npx prisma validate` to see errors |

## 📚 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 💡 Tips

- Always run `npm run build` before pushing to make sure it compiles
- Use `npx prisma studio` to debug database data
- Check `.env` is in `.gitignore` (never commit secrets!)
- Use `console.log` in server components/routes for debugging (see terminal)
- React Server Components run on the server - direct database access is safe
- Client Components (marked with `'use client'`) run in browser - never access db directly

---

For detailed setup, see [SETUP.md](./SETUP.md). For full documentation, see [README-NEW.md](./README-NEW.md).
