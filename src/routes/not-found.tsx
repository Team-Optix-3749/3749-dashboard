import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home as HomeIcon } from "lucide-react";
import { Button, Card } from "@heroui/react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-4xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full border border-separator/80 bg-surface/90 p-8 shadow-none">
        <Card.Header className="gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-muted">404</p>
          <Card.Title className="text-3xl">Page not found</Card.Title>
          <Card.Description>
            The route you requested does not exist. Return to the dashboard or go back to the
            previous page.
          </Card.Description>
        </Card.Header>

        <Card.Content className="grid gap-4 sm:grid-cols-[1.4fr_1fr] sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-separator px-3 py-1 text-xs font-medium text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Unknown route
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              If you expected this page to exist, check the URL or route registration.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <Button onPress={() => navigate({ to: "/" })} variant="secondary">
              <HomeIcon className="mr-2" />
              Go to dashboard
            </Button>
            <Button variant="outline" onPress={() => window.history.back()}>
              <ArrowLeft className="mr-2" />
              Go back
            </Button>
          </div>
        </Card.Content>
      </Card>
    </main>
  );
}
