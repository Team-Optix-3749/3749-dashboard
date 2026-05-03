import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Team overview and requirement progress live here.</p>
    </div>
  )
}
