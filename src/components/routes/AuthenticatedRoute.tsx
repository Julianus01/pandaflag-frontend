import { Redirect, RouteProps } from 'react-router-dom'
import RoutePage from './RoutePage'
import NavigationRoute from './NavigationRoute'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import { useContext } from 'react'
import ProjectsContext from 'context/ProjectsContext'

interface ProjectRouteProps extends RouteProps {
  organizationId: string
}

function ProjectRoute(props: ProjectRouteProps) {
  const { data: projects, isLoading: projectsLoading } = useContext(ProjectsContext)

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
    return <Redirect to={RoutePage.createOrganization()} />
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
