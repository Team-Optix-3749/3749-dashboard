import { Card } from "@/components/ui/card";

export function DashboardPage() {
  return (
    <main className="container py-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
      </header>

      <Card className="p-4">
        <h2 className="mt-0 text-lg font-medium text-foreground">System Status</h2>
        <p className="text-sm text-muted-foreground">
          Minimal rebuild complete: auth + protected dashboard routes are active.
        </p>
      </Card>
    </main>
  );
}
