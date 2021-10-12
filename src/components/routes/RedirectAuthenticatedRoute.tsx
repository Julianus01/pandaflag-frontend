import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useAuth } from 'hooks/auth/useAuth'

function RedirectAuthenticatedRoute(props: RouteProps) {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    if (!user?.email_verified) {
      return <Redirect to={RoutePage.emailVerification()} />
    }

    return <Redirect to={RoutePage.dashboard()} />
  }

  return <Route {...props} />
}

export default RedirectAuthenticatedRoute
