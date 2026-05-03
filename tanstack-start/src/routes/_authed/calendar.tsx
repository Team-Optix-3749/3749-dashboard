import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/calendar')({
  component: CalendarPage,
})

function CalendarPage() {
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-semibold">Calendar</h1>
      <p>Team events, meetings, and deadlines.</p>
    </div>
  )
}
