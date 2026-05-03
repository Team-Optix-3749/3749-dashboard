import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/members')({
  component: MembersPage,
})

function MembersPage() {
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-semibold">Members</h1>
      <p>Member directory, verification queue, and profiles.</p>
    </div>
  )
}
