import { Redirect, RouteProps } from 'react-router-dom'
import RoutePage from './RoutePage'
import NavigationRoute from './NavigationRoute'
import { useAuth } from 'hooks/auth/useAuth'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

function AuthenticatedRoute(props: RouteProps) {
  const { isAuthenticated, user } = useAuth()
  const organization = useSelector((state: IStoreState) => state.configuration.organization)

  if (!isAuthenticated) {
    return <Redirect to={RoutePage.login()} />
  }

  if (isAuthenticated && !user?.email_verified) {
    return <Redirect to={RoutePage.emailVerification()} />
  }

  if (!organization) {
    return <Redirect to={RoutePage.createOrganizationAndProject()} />
  }

  return <NavigationRoute {...props} />
}

export default AuthenticatedRoute
