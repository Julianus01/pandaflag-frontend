import {
  Box,
  Button,
  Icon,
  IconButton,
  Popover,
  PopoverTrigger,
  Spinner,
  Td,
  Tr,
  useDisclosure,
  PopoverContent,
  Text,
  PopoverBody,
  Tooltip,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import moment from 'moment'
import { FiMinus } from 'react-icons/fi'
import { useMutation, useQueryClient } from 'react-query'

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

interface IProps {
  project: IProject
}

function ProjectRow({ project }: IProps) {
  return (
    <Tr>
      <Td fontSize="sm">{project.name}</Td>

      <Td fontSize="sm" isNumeric>
        {moment.unix(project.createdAt).format('Do MMM YYYY')}
      </Td>

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
  )
}

export default ProjectRow
