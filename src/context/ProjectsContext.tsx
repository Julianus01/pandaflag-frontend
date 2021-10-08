import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import { useAuth } from 'hooks/authHooks'
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { useQuery } from 'react-query'

const initialState = {
  selected: null,
  setSelected: () => null,
}

interface IProjectsContextState {
  selected: IProject | null
  setSelected: Dispatch<SetStateAction<IProject | null>>
}

const ProjectsContext = createContext<IProjectsContextState>(initialState)

interface IProps {
  children: ReactNode
}

function ProjectsContextProvider({ children }: IProps) {
  const { user } = useAuth()
  // const { data: projects } = useQuery([ApiQueryId.getProjects, user?.id], ProjectsApi.getProjects, {
  //   enabled: Boolean(user?.id),
  // })

  const [selected, setSelected] = useState<IProject | null>(null)

  // useEffect(() => {
  //   if (projects?.length) {
  //     setSelected(projects[0])
  //   }
  // }, [projects])

  return <ProjectsContext.Provider value={{ selected, setSelected }}>{children}</ProjectsContext.Provider>
}

export default ProjectsContext
export { ProjectsContextProvider }
