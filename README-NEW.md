# The 3749 App - FIRST Robotics Team Management Platform

A comprehensive, production-ready web application for managing Team 3749's operations including OPI submissions, build hours tracking, finances, sponsors, members, and more.

## Features

- **Dashboard** - Team overview with key metrics and quick actions
- **Finance Module** - Budget tracking, transactions, expense reports, and grant management
- **Sponsors** - Manage sponsor relationships, deadlines, and communications with Kanban view
- **OPI (Optix Passion Initiative)** - Submit and track passion projects with approval workflows
- **Build Hours** - Track team build sessions with geolocation and leaderboards
- **Members** - Manage team roster with roles and permissions
- **Calendar** - Upcoming events and competition schedules
- **Competition Schedule** - Organize and manage competitions
- **Roles & Permissions** - Granular role-based access control (OWNER, OFFICER, LEADERSHIP, MEMBER)
- **Settings** - User profile and team configuration
- **Authentication** - Secure login with Google OAuth 2.0 and NextAuth.js

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js App Router, NextAuth.js v4, Prisma ORM
- **Database**: PostgreSQL (Supabase recommended)
- **UI Components**: shadcn/ui, Lucide React, Recharts
- **State Management**: React Context, SWR for data fetching
- **Validation**: React Hook Form, Zod
- **Tables**: TanStack Table v8
- **Calendar**: FullCalendar (planned)
- **Drag & Drop**: @dnd-kit
- **Maps**: React Leaflet (planned)

## Quick Start

### Prerequisites
- Node.js 18+
- npm 10+
- PostgreSQL database (get free one from [Supabase](https://supabase.com))
- Google OAuth credentials (from [Google Cloud Console](https://console.cloud.google.com))

### Setup

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd 3749-dashboard
   npm install
   ```

2. **Configure environment variables**
   - Copy `.env` template or follow [SETUP.md](./SETUP.md)
   - Add DATABASE_URL (PostgreSQL connection string)
   - Add Google OAuth credentials
   - Generate NEXTAUTH_SECRET

3. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed  # Optional: create test owner account
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   App runs at http://localhost:3000

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Detailed Setup

See [SETUP.md](./SETUP.md) for comprehensive database and Google OAuth setup instructions.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Authenticated app routes
│   │   ├── dashboard/
│   │   ├── finance/
│   │   ├── sponsors/
│   │   ├── opi/
│   │   ├── build-hours/
│   │   ├── calendar/
│   │   ├── schedule/
│   │   ├── members/
│   │   ├── roles/
│   │   ├── settings/
│   │   └── pending/       # Verification pending page
│   ├── (public)/          # Public routes
│   │   ├── page.tsx       # Landing page
│   │   └── login/         # Login page
│   └── api/               # API routes
│       ├── auth/          # NextAuth handler
│       ├── members/
│       ├── opi/
│       └── sponsors/
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Prisma singleton
│   ├── permissions.ts     # Permission matrix and checker
│   ├── utils.ts           # Utility functions
│   └── validations/       # Zod schemas
├── hooks/                 # React hooks
├── styles/                # Global styles & design tokens
└── types/                 # TypeScript types
```

## Permissions System

The app uses a role-based permission matrix:

| Permission | OWNER | OFFICER | LEADERSHIP | MEMBER | PENDING |
|-----------|-------|---------|------------|--------|---------|
| VIEW_FINANCE | ✅ | ✅ | ✅ | ❌ | ❌ |
| EDIT_BUDGET | ✅ | ✅ | ❌ | ❌ | ❌ |
| SUBMIT_OPI | ✅ | ✅ | ✅ | ✅ | ❌ |
| VIEW_MEMBERS | ✅ | ✅ | ✅ | ❌ | ❌ |
| VERIFY_MEMBER | ✅ | ✅ | ❌ | ❌ | ❌ |

Plus special permissions for OPI, BUILD_PERMS, FINANCE_PERMS, SPONSOR_PERMS, SCHEDULE_PERMS.

## Security

- All API routes enforce 3-layer security:
  1. Session validation (user logged in)
  2. Verification check (email verified)
  3. Permission check (role-based access)
- Passwords never stored; Google OAuth only
- Server-side permission enforcement
- No sensitive data in client-side code

## Development

### Create a new API route

```typescript
// src/app/api/example/route.ts
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return new Response('Unauthorized', { status: 401 })
  if (!session.user.isVerified) return new Response('Not verified', { status: 403 })
  
  const canDo = await hasPermission(session.user.id as string, "REQUIRED_PERMISSION")
  if (!canDo) return new Response('Forbidden', { status: 403 })
  
  // Your logic here
}
```

## Environment Variables

See `.env` or `.env.example` for complete list. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - App URL (http://localhost:3000 for dev)
- `NEXTAUTH_SECRET` - Random secret for session encryption
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

## Deployment

Deployable to Vercel, Netlify, AWS, or any Node.js hosting.

**Vercel recommended** (works out of box):
```bash
git push origin main  # Auto-deploys from GitHub
```

See [SETUP.md](./SETUP.md#production-deployment) for production checklist.

## Contributing

Team members: follow the permission model and always validate on server side.

## License

See [LICENSE](./LICENSE)

## Support

- **Setup help**: See [SETUP.md](./SETUP.md)
- **Issues**: Create an issue in GitHub
- **Docs**: Check Next.js, Prisma, and NextAuth.js documentation
