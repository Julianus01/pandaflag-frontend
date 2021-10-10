import {
  Box,
  Button,
  forwardRef,
  Heading,
  Icon,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import BoxedPage from 'components/styles/BoxedPage'
import moment from 'moment'
import { FiMinus } from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import CreateProjectDialog from './projects/CreateProjectDialog'

interface IRemoveButtonProps {
  projectId: string
}

const RemoveButton = forwardRef(({ projectId }: IRemoveButtonProps, ref) => {
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
      ref={ref}
      disabled={deleteMutation.isLoading}
      onClick={deleteProject}
      size="xs"
      aria-label="delete"
      icon={deleteMutation.isLoading ? <Spinner size="xs" /> : <Icon as={FiMinus} strokeWidth={2.4} />}
    />
  )
})

function ProjectsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data: projects } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading flex={1} mb={10} as="h3" size="lg">
          Projects
        </Heading>

        <Button onClick={onOpen} colorScheme="blue">
          Add Project
        </Button>
      </Box>

      <Box border="1px" borderRadius="lg" borderColor="gray.200" background="white">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>

              <Th>Created at</Th>

              <Th />
            </Tr>
          </Thead>

          <Tbody>
            {projects?.map((project: IProject) => (
              <Tr key={project.id}>
                <Td>{project.name}</Td>

                <Td>{moment.unix(project.createdAt).format('Do MMM YYYY')}</Td>

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

      <CreateProjectDialog isOpen={isOpen} onClose={onClose} />
    </BoxedPage>
  )
}

export default ProjectsPage
