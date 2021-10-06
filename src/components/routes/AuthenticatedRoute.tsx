import { Redirect, RouteProps, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import RoutePage from './RoutePage'

function AuthenticatedRoute(props: RouteProps) {
  const { isAuthenticated, user } = useAuth0()

  if (!isAuthenticated) {
    return <Redirect to={RoutePage.login()} />
  }

  if (isAuthenticated && !user?.email_verified) {
    return <Redirect to={RoutePage.emailVerification()} />
  }

  return <Route {...props} />
}

export default AuthenticatedRoute
