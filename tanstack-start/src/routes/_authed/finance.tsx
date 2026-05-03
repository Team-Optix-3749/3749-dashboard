import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/finance')({
  component: FinancePage,
})

function FinancePage() {
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-semibold">Finance</h1>
      <p>Budget, transactions, and expense workflows.</p>
    </div>
  )
}
