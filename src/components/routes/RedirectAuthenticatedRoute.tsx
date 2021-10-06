import { Redirect, RouteProps, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import RoutePage from './RoutePage'

function RedirectAuthenticatedRoute(props: RouteProps) {
  const { isAuthenticated, user } = useAuth0()

  if (isAuthenticated) {
    if (!user?.email_verified) {
      return <Redirect to={RoutePage.emailVerification()} />
    }

    return <Redirect to={RoutePage.dashboard()} />
  }

  return <Route {...props} />
}

export default RedirectAuthenticatedRoute
