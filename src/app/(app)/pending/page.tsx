import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function PendingPage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) redirect("/login")
  if (session.user.isVerified) redirect("/dashboard")

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-lg" style={{ background: 'hsl(var(--card))' }}>
        <h1 className="text-2xl font-bold mb-4">Pending Verification</h1>
        <p className="text-muted-foreground mb-4">Your account is awaiting verification by an officer.</p>
        <div className="p-4 rounded" style={{ background: 'hsl(var(--surface))' }}>
          <p className="font-mono text-sm">{session.user.email || 'N/A'}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-4">This page auto-refreshes every 30 seconds.</p>
      </div>
    </div>
  )
}
