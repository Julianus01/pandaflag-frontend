import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useAuth } from 'hooks/auth/useAuth'

function EmailVerificationRoute(props: RouteProps) {
  const user = useAuth()

  if (!user || user?.emailVerified) {
    return <Redirect to={RoutePage.root()} />
  }

  return <Route {...props} />
}

export default EmailVerificationRoute
