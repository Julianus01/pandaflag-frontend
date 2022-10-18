import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import { useContext } from 'react'
import ProjectsContext from 'context/ProjectsContext'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import OrganizationsApi from 'api/OrganizationsApi'

function CreateFirstProjectRoute(props: RouteProps) {
  const user = useSelector((state: IStoreState) => state.auth.user)
  const organization = useSelector((state: IStoreState) => state.configuration.organization)

  const { data: projects, isLoading: projectsLoading } = useContext(ProjectsContext)
  const { isLoading: organizationLoading } = useQuery(ApiQueryId.getOrganization, OrganizationsApi.getOrganization)

  if (!user) {
    return <Redirect to={RoutePage.login()} />
  }

  if (!user?.emailVerified) {
    return <Redirect to={RoutePage.emailVerification()} />
  }

  if (organizationLoading) {
    return null
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
