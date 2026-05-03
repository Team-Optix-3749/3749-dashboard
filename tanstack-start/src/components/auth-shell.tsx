import * as React from 'react'
import { Link } from '@tanstack/react-router'

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            Team Optix 3749
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
          ) : null}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl backdrop-blur">
          {children}
        </div>

        {footer ? (
          <div className="mt-6 text-center text-sm text-zinc-500">{footer}</div>
        ) : null}

        <p className="mt-8 text-center text-xs text-zinc-600">
          <Link to="/" className="text-zinc-500 hover:text-zinc-400">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}

export function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-zinc-700" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-zinc-900/80 px-2 text-zinc-500">or</span>
      </div>
    </div>
  )
}
