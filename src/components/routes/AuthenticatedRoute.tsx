import { Redirect, RouteProps } from 'react-router-dom'
import RoutePage from './RoutePage'
import NavigationRoute from './NavigationRoute'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi from 'api/ProjectsApi'

function AuthenticatedRoute(props: RouteProps) {
  const user = useSelector((state: IStoreState) => state.auth.user)
  const organization = useSelector((state: IStoreState) => state.configuration.organization)
  const { data: projects, isLoading: projectsLoading } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  if (!user) {
    return <Redirect to={RoutePage.login()} />
  }

  if (!user?.emailVerified) {
    return <Redirect to={RoutePage.emailVerification()} />
  }

  if (!organization) {
    return <Redirect to={RoutePage.createOrganization()} />
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
