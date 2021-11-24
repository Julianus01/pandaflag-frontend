import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useAuth } from 'hooks/auth/useAuth'

function RedirectAuthenticatedRoute(props: RouteProps) {
  const user = useAuth()

  if (user) {
    if (!user?.emailVerified) {
      return <Redirect to={RoutePage.emailVerification()} />
    }

    return <Redirect to={RoutePage.flags()} />
  }

  return <Route {...props} />
}

export default RedirectAuthenticatedRoute
