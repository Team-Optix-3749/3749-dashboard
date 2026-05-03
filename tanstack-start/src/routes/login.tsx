import { createFileRoute } from '@tanstack/react-router'
import { Login } from '../components/Login'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect:
      typeof search.redirect === 'string' && search.redirect.length > 0
        ? search.redirect
        : undefined,
  }),
  component: LoginComp,
})

function LoginComp() {
  const { redirect } = Route.useSearch()

  return <Login redirectTo={redirect} />
}
