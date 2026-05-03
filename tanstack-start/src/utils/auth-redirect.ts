/**
 * Resolve a safe in-app path for post-login redirects (blocks open redirects).
 * Accepts `/dashboard` or a full URL on the same origin when called from the browser.
 */
export function safeInternalPath(raw: string | undefined, fallback = '/'): string {
  if (!raw || typeof raw !== 'string') {
    return fallback
  }
  const t = raw.trim()

  if (t.startsWith('http://') || t.startsWith('https://')) {
    try {
      const u = new URL(t)
      if (typeof window !== 'undefined') {
        const here = `${window.location.protocol}//${window.location.host}`
        if (`${u.protocol}//${u.host}` !== here) {
          return fallback
        }
      } else if (
        u.hostname !== 'localhost' &&
        u.hostname !== '127.0.0.1'
      ) {
        return fallback
      }
      const path = `${u.pathname}${u.search}`
      if (path.startsWith('/') && !path.startsWith('//')) {
        return path
      }
    } catch {
      return fallback
    }
    return fallback
  }

  if (!t.startsWith('/') || t.startsWith('//')) {
    return fallback
  }
  return t
}
