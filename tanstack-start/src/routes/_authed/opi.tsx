import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/opi')({
  component: OpiPage,
})

function OpiPage() {
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-semibold">OPI</h1>
      <p>Optix Passion Initiative submissions and approvals.</p>
    </div>
  )
}
