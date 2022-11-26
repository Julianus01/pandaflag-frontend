import { Redirect, RouteProps } from 'react-router-dom'
import RoutePage from './RoutePage'
import NavigationRoute from './NavigationRoute'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import { useContext } from 'react'
import ProjectsContext from 'context/ProjectsContext'
import LoadingPage from 'components/pages/LoadingPage'
import SubscriptionsContext from 'context/SubscriptionsContext'
import PricesContext from 'context/PricesContext'

interface ProjectRouteProps extends RouteProps {
  organizationId: string
}

function ProjectRoute(props: ProjectRouteProps) {
  const projectsQuery = useContext(ProjectsContext)
  const subscriptionsQuery = useContext(SubscriptionsContext)
  const pricesQuery = useContext(PricesContext)

  if (projectsQuery.isLoading || subscriptionsQuery.isLoading || pricesQuery.isLoading) {
    return <LoadingPage />
  }

  if (!projectsQuery.data?.length) {
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
