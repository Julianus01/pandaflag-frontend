import { ApiQueryId } from 'api/ApiQueryId'
import OrganizationsApi from 'api/OrganizationsApi'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { IStoreState } from 'redux/store'
import RoutePage from './RoutePage'

function CreateOrganizationRoute(props: RouteProps) {
  const user = useSelector((state: IStoreState) => state.auth.user)
  const organization = useSelector((state: IStoreState) => state.configuration.organization)

  const organizationQuery = useQuery(ApiQueryId.getOrganization, OrganizationsApi.getOrganization)

  if (!user) {
    return <Redirect to={RoutePage.login()} />
  }

  if (organizationQuery.isLoading) {
    return null
  }

  if (!user?.emailVerified) {
    return <Redirect to={RoutePage.emailVerification()} />
  }

  if (!!organization) {
    return <Redirect to={RoutePage.createFirstProject()} />
  }

  return <Route {...props} />
}

export default CreateOrganizationRoute
