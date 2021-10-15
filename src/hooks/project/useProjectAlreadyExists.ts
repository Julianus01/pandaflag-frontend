import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import { useQuery } from 'react-query'

type IUseProjectAlreadyExists = (name: string) => boolean

function useProjectAlreadyExists(): IUseProjectAlreadyExists {
  const { data: projects } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  return function (name: string) {
    const found = projects?.find((project: IProject) => project.name.toLowerCase() === name.toLowerCase())
    return Boolean(found)
  }
}

export default useProjectAlreadyExists
