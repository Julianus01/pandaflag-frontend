import { IProject } from 'api/ProjectsApi'
import ProjectsContext from 'context/ProjectsContext'
import { useContext } from 'react'

type IUseProjectAlreadyExists = (name: string) => boolean

function useProjectAlreadyExists(): IUseProjectAlreadyExists {
  const { data: projects } = useContext(ProjectsContext)

  return function (name: string) {
    const found = projects?.find((project: IProject) => project.name.toLowerCase() === name.toLowerCase())
    return Boolean(found)
  }
}

export default useProjectAlreadyExists
