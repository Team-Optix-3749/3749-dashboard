import { Link } from '@tanstack/react-router'
import { ArrowLeft, Home as HomeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function NotFoundPage() {
  return (
    <main className="container flex min-h-dvh items-center justify-center py-10">
      <Card className="w-full max-w-xl overflow-hidden p-0">
        <div className="border-b px-6 py-5">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground">404</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Page not found</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            The route you requested does not exist. Return to the dashboard or go back to the previous page.
          </p>
        </div>

        <div className="grid gap-4 px-6 py-6 sm:grid-cols-[1.4fr_1fr] sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs font-medium text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Unknown route
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              If you expected this page to exist, check the URL or route registration.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <Button asChild variant="default" size="lg" className="w-full sm:w-auto">
              <Link to="/dashboard">
                <HomeIcon className="mr-2" />
                Go to dashboard
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2" />
              Go back
            </Button>
          </div>
        </div>
      </Card>
    </main>
  )
}
