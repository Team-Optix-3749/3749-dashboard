import React from "react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg" style={{ background: 'hsl(var(--card))' }}>
        <h2 className="text-2xl mb-4">Sign in to The 3749 App</h2>
        <button className="px-4 py-2 rounded bg-white text-black">Continue with Google</button>
        <p className="mt-3 text-sm text-muted-foreground">Access restricted to verified team members. New members require officer approval.</p>
      </div>
    </div>
  )
}
