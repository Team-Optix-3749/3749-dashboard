import React from "react"
import "@/styles/globals.css"

export const metadata = {
  title: "The 3749 App - Team Optix",
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
