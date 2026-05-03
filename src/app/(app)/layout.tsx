import React from "react"
import "@/styles/globals.css"

export const metadata = {
  title: "The 3749 App — Team Optix",
  description: "Complete platform for FIRST Robotics team management",
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground">
        <div className="flex min-h-screen">
          {/* Sidebar will be added here */}
          <aside className="w-72 border-r p-6" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--sidebar-bg))' }}>
            <div className="font-bold text-lg mb-8">TEAM OPTIX 3749</div>
            <nav className="space-y-2 text-sm">
              <a href="/dashboard" className="block p-2 rounded hover:bg-opacity-50">📊 Dashboard</a>
              <a href="/finance" className="block p-2 rounded hover:bg-opacity-50">💰 Finance</a>
              <a href="/sponsors" className="block p-2 rounded hover:bg-opacity-50">🏆 Sponsors</a>
              <a href="/calendar" className="block p-2 rounded hover:bg-opacity-50">📅 Calendar</a>
              <a href="/opi" className="block p-2 rounded hover:bg-opacity-50">🌟 OPI</a>
              <a href="/build-hours" className="block p-2 rounded hover:bg-opacity-50">🔨 Build Hours</a>
              <a href="/schedule" className="block p-2 rounded hover:bg-opacity-50">📋 Schedule</a>
              <a href="/members" className="block p-2 rounded hover:bg-opacity-50">👥 Members</a>
              <a href="/roles" className="block p-2 rounded hover:bg-opacity-50">🎭 Roles</a>
              <a href="/settings" className="block p-2 rounded hover:bg-opacity-50">⚙️ Settings</a>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

