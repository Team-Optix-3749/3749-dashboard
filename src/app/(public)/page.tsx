import React from "react"

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <section className="max-w-4xl w-full text-center">
        <h1 className="text-9xl font-display text-[hsl(var(--blue-primary))] leading-none">3749</h1>
        <p className="mt-4 text-xl text-muted-foreground">Team Optix — The 3749 App</p>
        <p className="mt-6 text-sm text-secondary-foreground">Private team dashboard for finance, build-hours, OPI, sponsors, and scheduling.</p>
      </section>
    </main>
  )
}
