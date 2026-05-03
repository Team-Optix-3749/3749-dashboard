import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p>Personal profile, notifications, and team preferences.</p>
    </div>
  )
}
