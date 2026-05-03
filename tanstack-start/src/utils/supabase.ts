/// <reference types="vite/client" />
import { getCookies, setCookie } from '@tanstack/react-start/server'
import { createServerClient } from '@supabase/ssr'
import type { CookieSerializeOptions } from 'cookie'

function envFirst(...keys: string[]): string | undefined {
  for (const key of keys) {
    const v = process.env[key]
    if (typeof v === 'string' && v.trim().length > 0) {
      return v.trim()
    }
  }
  try {
    const e = import.meta.env as Record<string, string | undefined>
    for (const key of keys) {
      const v = e[key]
      if (typeof v === 'string' && v.trim().length > 0) {
        return v.trim()
      }
    }
  } catch {
    /* import.meta unavailable in some tooling contexts */
  }
  return undefined
}

function isValidHttpUrl(value: string | undefined) {
  if (!value) {
    return false
  }

  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false
    }

    const placeholderHosts = new Set([
      'your-project-ref.supabase.co',
      'your-project-url',
      'pleasechangeme',
    ])

    return !placeholderHosts.has(url.hostname.toLowerCase())
  } catch {
    return false
  }
}

function resolveSupabaseEnv() {
  const supabaseUrl = envFirst(
    'SUPABASE_URL',
    'VITE_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
  )
  const supabaseAnonKey = envFirst(
    'SUPABASE_ANON_KEY',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_SUPABASE_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  )
  return { supabaseUrl, supabaseAnonKey }
}

export function getSupabaseServerClient() {
  const { supabaseUrl, supabaseAnonKey } = resolveSupabaseEnv()

  if (!isValidHttpUrl(supabaseUrl) || !supabaseAnonKey) {
    return null
  }

  return createServerClient(supabaseUrl!, supabaseAnonKey, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }))
      },
      setAll(
        cookies: Array<{
          name: string
          value: string
          options: CookieSerializeOptions
        }>,
      ) {
        // Supabase SSR requires full cookie options (path, maxAge, httpOnly, …).
        // Omitting them causes broken sessions, refresh failures, and "random" logouts.
        for (const { name, value, options } of cookies) {
          setCookie(name, value, options)
        }
      },
    },
  })
}
