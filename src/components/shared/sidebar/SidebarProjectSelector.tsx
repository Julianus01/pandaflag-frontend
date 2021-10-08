import { Box } from '@chakra-ui/layout'
import { Text, Heading, Icon } from '@chakra-ui/react'
import styled from '@emotion/styled/macro'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi from 'api/ProjectsApi'
import ProjectsContext from 'context/ProjectsContext'
import { useContext } from 'react'
import { HiSelector } from 'react-icons/hi'
import { useQuery } from 'react-query'

function SidebarProjectSelector() {
  const projectsContext = useContext(ProjectsContext)
  // const { data: projects } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  return (
    <Container>
      <Box flex="1">
        <Text fontSize="xs" color="gray.500" fontWeight="medium">
          selected project
        </Text>

        <Heading as="h5" size="sm">
          {projectsContext.selected?.name}
        </Heading>
      </Box>

      <Box display="flex" alignItems="center">
        <Icon w={6} h={6} as={HiSelector} />
      </Box>
    </Container>
  )
}

export default SidebarProjectSelector

const Container = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  display: flex;
  user-select: none;

  :hover {
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`
