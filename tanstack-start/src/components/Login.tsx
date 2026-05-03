import { Link } from '@tanstack/react-router'
import { useMutation } from '~/hooks/useMutation'
import { loginFn } from '~/routes/_authed'
import { AuthDivider, AuthShell } from '~/components/auth-shell'
import { GoogleAuthButton } from '~/components/google-auth-button'
import { safeInternalPath } from '~/utils/auth-redirect'

export function Login({ redirectTo }: { redirectTo?: string }) {
  const next = safeInternalPath(redirectTo, '/dashboard')

  const loginMutation = useMutation({
    fn: loginFn,
    onSuccess: async (ctx) => {
      if (!ctx.data?.error) {
        window.location.assign(next)
      }
    },
  })

  return (
    <AuthShell
      title="Sign in"
      subtitle="The 3749 App — verified team members only."
      footer={
        <span>
          No account?{' '}
          <Link
            to="/signup"
            search={{ redirect: redirectTo }}
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Create one
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
          loginMutation.mutate({
            data: {
              email: formData.get('email') as string,
              password: formData.get('password') as string,
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
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-blue-500/30 focus:border-blue-500 focus:ring-2"
          />
        </div>

        {loginMutation.data?.error ? (
          <p className="text-sm text-red-400">{loginMutation.data.message}</p>
        ) : null}

        <button
          type="submit"
          disabled={loginMutation.status === 'pending'}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loginMutation.status === 'pending' ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  )
}
