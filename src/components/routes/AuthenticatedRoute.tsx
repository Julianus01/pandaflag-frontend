import { Redirect, RouteProps } from 'react-router-dom'
import RoutePage from './RoutePage'
import NavigationRoute from './NavigationRoute'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi from 'api/ProjectsApi'
import { useAuth } from 'hooks/authHooks'

function AuthenticatedRoute(props: RouteProps) {
  const { isAuthenticated, user } = useAuth()
  const { data: projects, isLoading: projectsLoading } = useQuery(ApiQueryId.getProjects, () =>
    ProjectsApi.getProjects(user.id)
  )

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
