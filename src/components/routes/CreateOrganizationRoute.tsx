import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useAuth } from 'hooks/auth/useAuth'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import OrganizationsApi from 'api/OrganizationsApi'

function CreateOrganizationRoute(props: RouteProps) {
  const user = useAuth()
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
