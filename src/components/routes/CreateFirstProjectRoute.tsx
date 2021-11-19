import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi from 'api/ProjectsApi'
import { useAuth } from 'hooks/auth/useAuth'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

function CreateFirstProjectRoute(props: RouteProps) {
  const { isAuthenticated, user } = useAuth()
  const organization = useSelector((state: IStoreState) => state.configuration.organization)
  const { data: projects, isLoading: projectsLoading } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  if (!isAuthenticated) {
    return <Redirect to={RoutePage.login()} />
  }

  if (isAuthenticated && !user?.email_verified) {
    return <Redirect to={RoutePage.emailVerification()} />
  }

  if (!organization) {
    return <Redirect to={RoutePage.createOrganization()} />
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
