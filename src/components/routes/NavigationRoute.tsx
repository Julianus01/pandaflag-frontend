import { Route, RouteProps } from 'react-router-dom'
import styled from 'styled-components/macro'
import Sidebar from 'components/shared/sidebar/Sidebar'
import { useSelector, useDispatch } from 'react-redux'
import store, { IStoreState } from 'redux/store'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IEnvironment, IProject } from 'api/ProjectsApi'
import LSUtils, { LsKey } from 'utils/LSUtils'
import { configurationActions, IConfigurationState } from 'redux/ducks/configurationDuck'
import { useEffect } from 'react'
import { applyColorMode } from 'theme/StyledThemeProvider'

function useListenToProjectsAndUpdateConfiguration() {
  const dispatch = useDispatch()
  const { data: projects } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  useEffect(() => {
    if (!projects?.length) {
      return
    }

    const storeConfiguration = store.getState().configuration as IConfigurationState

    const lastProjectName: string = LSUtils.lastProjectName()
    const lastEnvironment: IEnvironment = LSUtils.lastEnvironment()

    if (!storeConfiguration.project && lastProjectName) {
      const foundProject = projects.find((project: IProject) => project.name === lastProjectName)

      if (foundProject) {
        dispatch(configurationActions.changeProject(foundProject))
      } else {
        dispatch(configurationActions.changeProject(projects[0]))
        LSUtils.remove(LsKey.lastProjectName)
      }
    } else {
      dispatch(configurationActions.changeProject(projects[0]))
    }

    if (!storeConfiguration?.environment?.length && lastEnvironment) {
      const foundEnvironment = ['production', 'development'].find(
        (environment: IEnvironment) => environment === lastEnvironment
      ) as IEnvironment | undefined

      if (foundEnvironment) {
        dispatch(configurationActions.changeEnvironment(foundEnvironment))
      } else {
        dispatch(configurationActions.changeEnvironment('development'))
        LSUtils.remove(LsKey.lastEnvironment)
      }
    } else {
      dispatch(configurationActions.changeEnvironment('development'))
    }
  }, [projects, dispatch])
}

function NavigationRoute(props: RouteProps) {
  const configuration = useSelector((state: IStoreState) => state.configuration)

  useListenToProjectsAndUpdateConfiguration()

  if (!configuration.project || !configuration.environment) {
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

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[900])(theme)};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  z-index: 1;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 276px;

  padding: ${({ theme }) => `${theme.space[14]} ${theme.space[28]}`};
  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => `${theme.space[14]} ${theme.space[16]}`};
  }
`
