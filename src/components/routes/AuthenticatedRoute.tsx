import { Redirect, RouteProps } from 'react-router-dom'
import RoutePage from './RoutePage'
import NavigationRoute from './NavigationRoute'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi from 'api/ProjectsApi'

interface ProjectRouteProps extends RouteProps {
  organizationId: string
}

function ProjectRoute(props: ProjectRouteProps) {
  const { data: projects, isLoading: projectsLoading } = useQuery(
    [ApiQueryId.getProjects, props.organizationId],
    () => ProjectsApi.getProjectsByOrganizationId(props.organizationId),
    {
      cacheTime: 0,
    }
  )

  if (projectsLoading) {
    return null
  }

  if (!projects?.length) {
    return <Redirect to={RoutePage.createFirstProject()} />
  }

  return <NavigationRoute {...props} />
}

function OrganizationRoute(props: RouteProps) {
  const organization = useSelector((state: IStoreState) => state.configuration.organization)

  if (!organization) {
    return null
  }

  return <ProjectRoute organizationId={organization.id} {...props} />
}

function AuthenticatedRoute(props: RouteProps) {
  const user = useSelector((state: IStoreState) => state.auth.user)

  if (!user) {
    return <Redirect to={RoutePage.login()} />
  }

  if (!user?.emailVerified) {
    return <Redirect to={RoutePage.emailVerification()} />
  }

  return <OrganizationRoute {...props} />
}

export default AuthenticatedRoute
