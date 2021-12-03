import { Route, RouteProps } from 'react-router-dom'
import styled from 'styled-components/macro'
import Sidebar from 'components/shared/sidebar/Sidebar'
import { useSelector, useDispatch } from 'react-redux'
import store, { IStoreState } from 'redux/store'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import LSUtils from 'utils/LSUtils'
import { configurationActions, IConfigurationState } from 'redux/ducks/configurationDuck'
import { useEffect } from 'react'
import AccessibleBackground from 'components/styles/AccessibleBackground'

function useInitConfigurationProject(projects: IProject[] | undefined) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!projects?.length) {
      return
    }

    const storeConfiguration = store.getState().configuration as IConfigurationState
    if (storeConfiguration.project) {
      return
    }

    const lastProjectName: string = LSUtils.lastProjectName()
    if (lastProjectName) {
      const foundProject = projects.find((project: IProject) => project.name === lastProjectName)

      if (foundProject) {
        dispatch(configurationActions.setProject(foundProject))
        return
      }

      dispatch(configurationActions.setProject(projects[0]))
      return
    }

    dispatch(configurationActions.setProject(projects[0]))
  }, [projects, dispatch])
}

function NavigationRoute(props: RouteProps) {
  const dispatch = useDispatch()
  const configuration = useSelector((state: IStoreState) => state.configuration)
  const organizationId = configuration.organization?.id

  const { data: projects } = useQuery(
    [ApiQueryId.getProjectsByOrganizationId, organizationId],
    () => ProjectsApi.getProjectsByOrganizationId(organizationId as string),
    {
      onSuccess: (projects: IProject[]) => {
        if (!configuration.project || !projects.length) {
          return
        }

        const foundProject = projects.find((project: IProject) => project.id === configuration.project?.id)
        if (!foundProject) {
          // Selected project was deleted. change selected project
          dispatch(configurationActions.setProject(projects[0]))
        }
      },
    }
  )

  useInitConfigurationProject(projects)

  if (!configuration.project) {
    return null
  }

  return (
    <Container>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>

      <Content>
        <Route {...props} />
      </Content>
    </Container>
  )
}

export default NavigationRoute

const Container = styled.div`
  width: 100%;
`

const SidebarContainer = styled(AccessibleBackground)`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  box-shadow: ${({ theme }) => theme.shadows.xs};
  z-index: 1;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* Sidebar width !! */
  margin-left: 280px;

  padding: ${({ theme }) => `0 ${theme.space[28]}`};
  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => `0 ${theme.space[16]}`};
  }
`
