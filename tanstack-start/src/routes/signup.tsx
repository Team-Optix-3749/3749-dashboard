import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import * as React from 'react'
import { useMutation } from '~/hooks/useMutation'
import { AuthDivider, AuthShell } from '~/components/auth-shell'
import { GoogleAuthButton } from '~/components/google-auth-button'
import { safeInternalPath } from '~/utils/auth-redirect'
import { getSupabaseServerClient } from '~/utils/supabase'

export const signupFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (d: { email: string; password: string; redirectUrl?: string }) => d,
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    if (!supabase) {
      return {
        error: true as const,
        message:
          'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in tanstack-start/.env.',
      }
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })
      if (error) {
        return {
          error: true as const,
          message: error.message,
        }
      }
    } catch {
      return {
        error: true as const,
        message:
          'Supabase auth is unreachable. Check your URL and publishable key in tanstack-start/.env.',
      }
    }

    return {
      error: false as const,
      redirectUrl: data.redirectUrl || '/dashboard',
    }
  })

export const Route = createFileRoute('/signup')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect:
      typeof search.redirect === 'string' && search.redirect.length > 0
        ? search.redirect
        : undefined,
  }),
  component: SignupComp,
})

function SignupComp() {
  const { redirect } = Route.useSearch()
  const next = safeInternalPath(redirect, '/dashboard')
  const [matchError, setMatchError] = React.useState<string | null>(null)

  const signupMutation = useMutation({
    fn: signupFn,
    onSuccess: async ({ data }) => {
      if (data && 'error' in data && data.error === false) {
        window.location.assign(data.redirectUrl)
      }
    },
  })

  return (
    <AuthShell
      title="Create your account"
      subtitle="Use Google or email. Officers verify new members after sign-up."
      footer={
        <span>
          Already have an account?{' '}
          <Link
            to="/login"
            search={{ redirect }}
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Sign in
          </Link>
        </span>
      }
    >
      <GoogleAuthButton label="Continue with Google" afterPath={next} />

      <AuthDivider />

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const password = formData.get('password') as string
          const confirm = formData.get('confirm') as string

          if (password !== confirm) {
            setMatchError('Passwords do not match.')
            return
          }
          setMatchError(null)

          signupMutation.mutate({
            data: {
              email: formData.get('email') as string,
              password,
              redirectUrl: next,
            },
          })
        }}
      >
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-zinc-400">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-blue-500/30 focus:border-blue-500 focus:ring-2"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium text-zinc-400"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-blue-500/30 focus:border-blue-500 focus:ring-2"
          />
        </div>
        <div>
          <label
            htmlFor="confirm"
            className="block text-xs font-medium text-zinc-400"
          >
            Confirm password
          </label>
          <input
            type="password"
            name="confirm"
            id="confirm"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-blue-500/30 focus:border-blue-500 focus:ring-2"
          />
        </div>

        {matchError ? (
          <p className="text-sm text-red-400">{matchError}</p>
        ) : null}
        {signupMutation.data?.error ? (
          <p className="text-sm text-red-400">{signupMutation.data.message}</p>
        ) : null}

        <button
          type="submit"
          disabled={signupMutation.status === 'pending'}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {signupMutation.status === 'pending' ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-zinc-500">
        By signing up you agree to follow team policies. Access is granted after
        officer verification when enabled.
      </p>
    </AuthShell>
  )
}
