import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Login } from '../components/Login'
import { getSupabaseServerClient } from '../utils/supabase'

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    if (!supabase) {
      return {
        error: true as const,
        message:
          'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY (or legacy anon JWT) in tanstack-start/.env.',
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
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
          'Supabase auth is unreachable. Check SUPABASE_URL and SUPABASE_ANON_KEY in tanstack-start/.env.',
      }
    }

    return { error: false as const }
  })

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})
