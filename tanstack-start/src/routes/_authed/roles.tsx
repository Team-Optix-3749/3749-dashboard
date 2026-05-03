import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/roles')({
  component: RolesPage,
})

function RolesPage() {
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-semibold">Roles</h1>
      <p>Role hierarchy, assignments, and special permissions.</p>
    </div>
  )
}
