import { Redirect, RouteProps } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import RoutePage from './RoutePage'
import NavigationRoute from './NavigationRoute'

function AuthenticatedRoute(props: RouteProps) {
  const { isAuthenticated, user } = useAuth0()

  if (!isAuthenticated) {
    return <Redirect to={RoutePage.login()} />
  }

  if (isAuthenticated && !user?.email_verified) {
    return <Redirect to={RoutePage.emailVerification()} />
  }

  return <NavigationRoute {...props} />
}

export default AuthenticatedRoute
