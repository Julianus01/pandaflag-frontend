import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import OrganizationsApi from 'api/OrganizationsApi'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

function CreateOrganizationRoute(props: RouteProps) {
  const user = useSelector((state: IStoreState) => state.auth.user)
  const { data: organization, isLoading: organizationLoading } = useQuery(
    ApiQueryId.getOrganization,
    OrganizationsApi.getOrganization
  )

  if (!user) {
    return <Redirect to={RoutePage.login()} />
  }

  if (!user?.emailVerified) {
    return <Redirect to={RoutePage.emailVerification()} />
  }

  if (organizationLoading) {
    return null
  }

  if (!!organization) {
    return <Redirect to={RoutePage.createFirstProject()} />
  }

  return <Route {...props} />
}

export default CreateOrganizationRoute
