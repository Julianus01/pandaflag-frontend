import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useAuth } from 'hooks/auth/useAuth'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

function CreateOrganizationAndProjectRoute(props: RouteProps) {
  const { isAuthenticated, user } = useAuth()
  const organization = useSelector((state: IStoreState) => state.configuration.organization)

  if (!isAuthenticated) {
    return <Redirect to={RoutePage.login()} />
  }

  if (isAuthenticated && !user?.email_verified) {
    return <Redirect to={RoutePage.emailVerification()} />
  }

  if (!!organization) {
    return <Redirect to={RoutePage.projects()} />
  }

  return <Route {...props} />
}

export default CreateOrganizationAndProjectRoute
