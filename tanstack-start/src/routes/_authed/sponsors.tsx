import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/sponsors')({
  component: SponsorsPage,
})

function SponsorsPage() {
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-semibold">Sponsors</h1>
      <p>Sponsor CRM, statuses, and outreach tracking.</p>
    </div>
  )
}
