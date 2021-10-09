import { Box, Heading, Icon, IconButton, Spinner, Table, Tbody, Td, Th, Thead, Tooltip, Tr } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import BoxedPage from 'components/styles/BoxedPage'
import { FiMinus } from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from 'react-query'

interface IRemoveButtonProps {
  projectId: string
}

function RemoveButton({ projectId }: IRemoveButtonProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation(ProjectsApi.deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getProjects)
    },
  })

  function deleteProject() {
    deleteMutation.mutate(projectId)
  }

  return (
    <IconButton
      disabled={deleteMutation.isLoading}
      onClick={deleteProject}
      size="xs"
      aria-label="delete"
      icon={deleteMutation.isLoading ? <Spinner size="xs" /> : <Icon as={FiMinus} />}
    />
  )
}

function ProjectsPage() {
  const { data: projects } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  return (
    <BoxedPage>
      <Heading mb={10} as="h3" size="lg">
        Projects
      </Heading>

      <Box border="1px" borderRadius="lg" borderColor="gray.200" background="white">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th />
            </Tr>
          </Thead>

          <Tbody>
            {projects?.map((project: IProject) => (
              <Tr key={project.id}>
                <Td>{project.name}</Td>

                <Td isNumeric>
                  <Tooltip placement="top" label="Remove">
                    <RemoveButton projectId={project.id} />
                  </Tooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </BoxedPage>
  )
}

export default ProjectsPage
