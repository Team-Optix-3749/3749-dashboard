/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { createServerFn } from '@tanstack/react-start'
import * as React from 'react'
import { DefaultCatchBoundary } from '../components/DefaultCatchBoundary'
import { NotFound } from '../components/NotFound'
import appCss from '../styles/app.css?url'
import { seo } from '../utils/seo'
import { getSupabaseServerClient } from '../utils/supabase'

const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return null
  }

  const { data, error: _error } = await supabase.auth.getUser()

  if (!data.user?.email) {
    return null
  }

  return {
    email: data.user.email,
  }
})

export const Route = createRootRoute({
  beforeLoad: async () => {
    try {
      const user = await fetchUser()

      return {
        user,
      }
    } catch {
      return {
        user: null,
      }
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title:
          'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <ErrorDocument>
        <DefaultCatchBoundary {...props} />
      </ErrorDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  const { user } = Route.useRouteContext()

  return (
    <AppShell user={user}>
      <Outlet />
    </AppShell>
  )
}

function AppShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: { email: string } | null
}) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="p-2 flex flex-wrap gap-2 text-sm">
          <Link
            to="/"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{' '}
          {user ? (
            <>
              <Link to="/dashboard" activeProps={{ className: 'font-bold' }}>
                Dashboard
              </Link>
              <Link to="/finance" activeProps={{ className: 'font-bold' }}>
                Finance
              </Link>
              <Link to="/sponsors" activeProps={{ className: 'font-bold' }}>
                Sponsors
              </Link>
              <Link to="/opi" activeProps={{ className: 'font-bold' }}>
                OPI
              </Link>
              <Link to="/build-hours" activeProps={{ className: 'font-bold' }}>
                Build Hours
              </Link>
              <Link to="/calendar" activeProps={{ className: 'font-bold' }}>
                Calendar
              </Link>
              <Link to="/schedule" activeProps={{ className: 'font-bold' }}>
                Schedule
              </Link>
              <Link to="/members" activeProps={{ className: 'font-bold' }}>
                Members
              </Link>
              <Link to="/roles" activeProps={{ className: 'font-bold' }}>
                Roles
              </Link>
              <Link to="/settings" activeProps={{ className: 'font-bold' }}>
                Settings
              </Link>
            </>
          ) : null}
          <div className="ml-auto">
            {user ? (
              <>
                <span className="mr-2">{user.email}</span>
                <Link to="/logout">Logout</Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  search={{ redirect: undefined }}
                  className="mr-3"
                >
                  Sign up
                </Link>
                <Link to="/login" search={{ redirect: undefined }}>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <hr />
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}

function ErrorDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="p-2 flex flex-wrap gap-2 text-sm">
          <Link
            to="/"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link to="/signup" search={{ redirect: undefined }}>
            Sign up
          </Link>
          <Link to="/login" search={{ redirect: undefined }}>
            Login
          </Link>
        </div>
        <hr />
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
