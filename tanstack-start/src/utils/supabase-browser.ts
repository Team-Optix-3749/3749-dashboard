import { createBrowserClient } from '@supabase/ssr'

export function getSupabaseBrowserClient() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key =
    import.meta.env.VITE_SUPABASE_KEY ??
    import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY in environment.',
    )
  }

  return createBrowserClient(url, key)
}
