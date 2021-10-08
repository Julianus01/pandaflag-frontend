import { Redirect, RouteProps } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import RoutePage from './RoutePage'
import NavigationRoute from './NavigationRoute'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi from 'api/ProjectsApi'

function AuthenticatedRoute(props: RouteProps) {
  const { isAuthenticated, user } = useAuth0()
  const { data: projects, isLoading: projectsLoading } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  if (!isAuthenticated) {
    return <Redirect to={RoutePage.login()} />
  }

  if (isAuthenticated && !user?.email_verified) {
    return <Redirect to={RoutePage.emailVerification()} />
  }

  if (projectsLoading) {
    return null
  }

  if (!projects?.length) {
    return <Redirect to={RoutePage.createFirstProject()} />
  }

  return <NavigationRoute {...props} />
}

export default AuthenticatedRoute
