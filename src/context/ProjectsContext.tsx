import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import { createContext, ReactNode } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

export type IProjectsContext = UseQueryResult<IProject[], unknown>

const ProjectsContext = createContext<IProjectsContext>(null as any)

export interface IProjectsContextProps {
  children: ReactNode
}

const ProjectsContextProvider = ({ children }: IProjectsContextProps) => {
  const organizationId = useSelector((state: IStoreState) => state.configuration.organization?.id)

  const projectsQuery = useQuery(
    [ApiQueryId.getProjectsByOrganizationId, organizationId],
    () => ProjectsApi.getProjectsByOrganizationId(organizationId as string),
    {
      enabled: !!organizationId,
    }
  )

  return <ProjectsContext.Provider value={projectsQuery}>{children}</ProjectsContext.Provider>
}

export { ProjectsContextProvider }
export default ProjectsContext
