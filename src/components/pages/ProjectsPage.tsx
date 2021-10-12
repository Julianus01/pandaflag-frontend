import {
  Box,
  Button,
  Heading,
  Icon,
  IconButton,
  Popover,
  PopoverTrigger,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  PopoverContent,
  Text,
  PopoverBody,
  Tooltip,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import BoxedPage from 'components/styles/BoxedPage'
import moment from 'moment'
import { FiMinus } from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import CreateProjectDialog from './projects/CreateProjectDialog'

interface IRemoveButtonProps {
  projectId: string
}

function RemoveButton({ projectId }: IRemoveButtonProps) {
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const deleteMutation = useMutation(ProjectsApi.deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getProjects)
    },
  })

  function deleteProject() {
    onClose()
    deleteMutation.mutate(projectId)
  }

  return (
    <Popover placement="left" isOpen={isOpen} onClose={onClose} returnFocusOnClose={false}>
      <PopoverTrigger>
        <IconButton
          disabled={deleteMutation.isLoading}
          onClick={onOpen}
          size="xs"
          aria-label="delete"
          icon={deleteMutation.isLoading ? <Spinner size="xs" /> : <Icon as={FiMinus} strokeWidth={2.4} />}
        />
      </PopoverTrigger>

      <PopoverContent _focus={{ boxShadow: 'none', outline: 'none' }}>
        <PopoverBody textAlign="right" shadow="lg" p="4">
          <Text textAlign="left" mb="4">
            Are you sure you want to delete this project?
          </Text>

          <Button onClick={deleteProject} size="sm" colorScheme="red" variant="ghost">
            Delete
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

function ProjectsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: projects } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  function doesProjectNameAlreadyExist(name: string): boolean {
    const found = projects?.find((project: IProject) => project.name === name)
    return Boolean(found)
  }

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

      <TableContainer>
        <CustomTable variant="simple">
          <TableHead>
            <Tr>
              <Th textTransform="capitalize">Name</Th>
              <Th textTransform="capitalize" isNumeric>
                Created at
              </Th>
              <Th textTransform="capitalize" />
            </Tr>
          </TableHead>

          <Tbody>
            {projects?.map((project: IProject) => (
              <Tr key={project.id}>
                <Td>{project.name}</Td>

                <Td isNumeric>{moment.unix(project.createdAt).format('Do MMM YYYY')}</Td>

                <Td>
                  <Box display="flex" justifyContent="flex-end">
                    <Tooltip placement="top" label="Remove">
                      <Box>
                        <RemoveButton projectId={project.id} />
                      </Box>
                    </Tooltip>
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </CustomTable>
      </TableContainer>

      <CreateProjectDialog
        doesProjectNameAlreadyExist={doesProjectNameAlreadyExist}
        isOpen={isOpen}
        onClose={onClose}
      />
    </BoxedPage>
  )
}

export default ProjectsPage

const TableContainer = styled.div`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: ${({ theme }) => `1px solid ${applyColorMode(theme.colors.gray[200], theme.colors.whiteAlpha[200])(theme)}`};
`

const TableHead = styled(Thead)`
  background: ${({ theme }) => applyColorMode(theme.colors.gray[100], theme.colors.gray[900])(theme)};
`

const CustomTable = styled(Table)`
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[800])(theme)};
`
