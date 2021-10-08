import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useAuth } from 'hooks/authHooks'

function EmailVerificationRoute(props: RouteProps) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || user?.email_verified) {
    return <Redirect to={RoutePage.root()} />
  }

  return <Route {...props} />
}

export default EmailVerificationRoute
