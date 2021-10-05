import { Redirect, RouteProps, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

function AuthenticatedRoute(props: RouteProps) {
  const { isAuthenticated } = useAuth0()

  if (!isAuthenticated) {
    return <Redirect to="/login" />
  }

  return <Route {...props} />
}

export default AuthenticatedRoute
