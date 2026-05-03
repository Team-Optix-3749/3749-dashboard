import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/schedule')({
  component: SchedulePage,
})

function SchedulePage() {
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-semibold">Competition Schedule</h1>
      <p>Event timelines, rostering, and logistics.</p>
    </div>
  )
}
