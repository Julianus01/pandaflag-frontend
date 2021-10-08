import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi from 'api/ProjectsApi'
import { useAuth0 } from '@auth0/auth0-react'

function CreateFirstProjectRoute(props: RouteProps) {
  const { isAuthenticated, user } = useAuth0()
  const { data: projects, isLoading } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  if (!isAuthenticated) {
    return <Redirect to={RoutePage.login()} />
  }

  if (isAuthenticated && !user?.email_verified) {
    return <Redirect to={RoutePage.emailVerification()} />
  }

  if (isLoading) {
    return null
  }

  if (projects?.length) {
    return <Redirect to={RoutePage.root()} />
  }

  return <Route {...props} />
}

export default CreateFirstProjectRoute
