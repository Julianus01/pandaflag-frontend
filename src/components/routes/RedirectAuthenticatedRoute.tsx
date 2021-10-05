import { Redirect, RouteProps, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

function RedirectAuthenticatedRoute(props: RouteProps) {
  const { isAuthenticated } = useAuth0()

  if (isAuthenticated) {
    return <Redirect to="/app" />
  }

  return <Route {...props} />
}

export default RedirectAuthenticatedRoute
