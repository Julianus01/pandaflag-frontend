import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi from 'api/ProjectsApi'
import OrganizationsApi from 'api/OrganizationsApi'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

function CreateFirstProjectRoute(props: RouteProps) {
  const user = useSelector((state: IStoreState) => state.auth.user)

  const { data: projects, isLoading: projectsLoading } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

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

  if (organizationLoading || organizationLoading) {
    return null
  }

  if (projectsLoading) {
    return null
  }

  if (projects?.length) {
    return <Redirect to={RoutePage.projects()} />
  }

  return <Route {...props} />
}

export default CreateFirstProjectRoute
