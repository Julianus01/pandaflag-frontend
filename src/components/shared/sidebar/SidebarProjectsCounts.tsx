import { Tag } from '@chakra-ui/react'
import { useContext } from 'react'
import ProjectsContext from 'context/ProjectsContext'

function ProjectsCount() {
  const { data: projects } = useContext(ProjectsContext)

  if (projects?.length === 1) {
    return null
  }

  return <Tag fontSize="xs">{projects?.length}</Tag>
}

export default ProjectsCount
