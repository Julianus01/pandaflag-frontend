import { Redirect, RouteProps, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import RoutePage from './RoutePage'

function EmailVerificationRoute(props: RouteProps) {
  const { user, isAuthenticated } = useAuth0()

  if (!isAuthenticated || user?.email_verified) {
    return <Redirect to={RoutePage.root()} />
  }

  return <Route {...props} />
}

export default EmailVerificationRoute
