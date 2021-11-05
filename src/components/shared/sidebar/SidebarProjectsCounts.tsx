import { Tag } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi from 'api/ProjectsApi'

function ProjectsCount() {
  const { data: projects } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  if(projects?.length === 1) {
    return null
  }

  return <Tag fontSize="xs">{projects?.length}</Tag>
}

export default ProjectsCount