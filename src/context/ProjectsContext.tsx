import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IEnvironment, IProject } from 'api/ProjectsApi'
import { useAuth } from 'hooks/authHooks'
import { createContext, ReactNode, useState } from 'react'
import { useQuery } from 'react-query'
import LSUtils from 'utils/LSUtils'

const initialState = {
  selectedProject: undefined,
  updateProject: () => null,

  environment: 'development',
  updateEnvironment: () => null,
}

interface IProjectsContextState {
  selectedProject: IProject | undefined
  updateProject: (project: IProject) => void

  environment: IEnvironment
  updateEnvironment: (environment: IEnvironment) => void
}

const ProjectsContext = createContext<IProjectsContextState>(initialState)

interface IProps {
  children: ReactNode
}

function ProjectsContextProvider({ children }: IProps) {
  const { user } = useAuth()
  const [selectedProject, setSelectedProject] = useState<IProject | undefined>(undefined)
  const [environment, setEnvironment] = useState<IEnvironment>('')

  useQuery([ApiQueryId.getProjects, user?.id], ProjectsApi.getProjects, {
    onSuccess: (projects: IProject[]) => {
      // TODO: Fix updating when creating/removing projects

      const lastProjectName: string = LSUtils.lastProjectName()
      const lastEnvironment: IEnvironment = LSUtils.lastEnvironment()

      if (!selectedProject && lastProjectName) {
        const foundProject = projects.find((project: IProject) => project.name === lastProjectName)

        if (foundProject) {
          setSelectedProject(foundProject)
        } else {
          setSelectedProject(projects[0])
          LSUtils.removeLastProjectName()
        }
      } else {
        setSelectedProject(projects[0])
      }

      if (!environment.length && lastEnvironment) {
        const foundEnvironment = ['production', 'development'].find(
          (environment: IEnvironment) => environment === lastEnvironment
        ) as IEnvironment | undefined

        if (foundEnvironment) {
          setEnvironment(foundEnvironment)
        } else {
          setEnvironment('development')
          LSUtils.removeLastEnvironment()
        }
      } else {
        setEnvironment('development')
      }
    },
  })

  function updateProject(project: IProject) {
    setSelectedProject(project)
    LSUtils.saveLastProjectName(project.name)
  }

  function updateEnvironment(environment: IEnvironment) {
    setEnvironment(environment)
    LSUtils.saveLastEnvironment(environment)
  }

  return (
    <ProjectsContext.Provider value={{ selectedProject, updateProject, environment, updateEnvironment }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export default ProjectsContext
export { ProjectsContextProvider }
