import { createFileRoute, Link } from '@tanstack/react-router'
import * as React from 'react'
import { getSupabaseBrowserClient } from '~/utils/supabase-browser'
import { safeInternalPath } from '~/utils/auth-redirect'

export const Route = createFileRoute('/auth/callback')({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === 'string' ? search.code : undefined,
    next: typeof search.next === 'string' ? search.next : undefined,
    error: typeof search.error === 'string' ? search.error : undefined,
    error_description:
      typeof search.error_description === 'string'
        ? search.error_description
        : undefined,
  }),
  component: AuthCallbackPage,
})

function AuthCallbackPage() {
  const { code, next, error: oauthError, error_description } = Route.useSearch()
  const [message, setMessage] = React.useState<string | null>(null)
  const [state, setState] = React.useState<'idle' | 'working' | 'done'>('idle')

  React.useEffect(() => {
    if (oauthError || error_description) {
      const detail = error_description
        ? decodeURIComponent(error_description.replace(/\+/g, ' '))
        : oauthError
      setMessage(detail ?? 'Sign-in was cancelled or failed.')
      setState('done')
      return
    }

    if (!code) {
      setMessage('Missing OAuth code. Try signing in again.')
      setState('done')
      return
    }

    let cancelled = false
    setState('working')

    try {
      const supabase = getSupabaseBrowserClient()

      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ error }) => {
          if (cancelled) return
          if (error) {
            setMessage(error.message ?? 'Could not complete sign-in.')
            setState('done')
            return
          }
          const dest = safeInternalPath(next, '/dashboard')
          window.location.assign(dest)
        })
        .catch(() => {
          if (!cancelled) {
            setMessage('Something went wrong completing sign-in.')
            setState('done')
          }
        })
    } catch (error) {
      if (!cancelled) {
        setMessage(
          error instanceof Error ? error.message : 'Something went wrong completing sign-in.',
        )
        setState('done')
      }
    }

    return () => {
      cancelled = true
    }
  }, [code, next, oauthError, error_description])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center text-zinc-200">
      {state === 'working' && !message ? (
        <>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-sm text-zinc-400">Completing sign-in…</p>
        </>
      ) : (
        <>
          <p className="text-sm text-red-400">{message}</p>
          <Link
            to="/login"
            search={{ redirect: undefined }}
            className="mt-6 text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            Back to login
          </Link>
        </>
      )}
    </div>
  )
}
