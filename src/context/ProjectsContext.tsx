import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import { useAuth } from 'hooks/authHooks'
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { useQuery } from 'react-query'

const initialState = {
  selectedProject: null,
  setSelectedProject: () => null,

  environment: 'production',
  setEnvironment: () => null,
}

export type Environment = string

interface IProjectsContextState {
  selectedProject: IProject | null
  setSelectedProject: Dispatch<SetStateAction<IProject | null>>

  environment: Environment
  setEnvironment: Dispatch<SetStateAction<Environment>>
}

const ProjectsContext = createContext<IProjectsContextState>(initialState)

interface IProps {
  children: ReactNode
}

function ProjectsContextProvider({ children }: IProps) {
  const { user } = useAuth()
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null)
  const [environment, setEnvironment] = useState<Environment>('production')

  useQuery([ApiQueryId.getProjects, user?.id], ProjectsApi.getProjects, {
    onSuccess: (projects: IProject[]) => {
      if (projects?.length) {
        setSelectedProject(projects[0])
      }
    },
  })

  return (
    <ProjectsContext.Provider value={{ selectedProject, setSelectedProject, environment, setEnvironment }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export default ProjectsContext
export { ProjectsContextProvider }
