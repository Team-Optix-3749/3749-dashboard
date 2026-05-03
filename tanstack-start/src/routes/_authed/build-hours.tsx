import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/build-hours')({
  component: BuildHoursPage,
})

function BuildHoursPage() {
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-semibold">Build Hours</h1>
      <p>Session check-in/check-out and progress tracking.</p>
    </div>
  )
}
