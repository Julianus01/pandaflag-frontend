import {
  Button,
  Icon,
  IconButton,
  Popover,
  PopoverTrigger,
  Spinner,
  useDisclosure,
  PopoverContent,
  Text,
  PopoverBody,
  useToast,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import { FiMinus } from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from 'react-query'

interface IProps {
  project: IProject
}

function ProjectRemoveButton({ project }: IProps) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { isFetching: projectsFetching } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)
  const deleteMutation = useMutation(ProjectsApi.deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getProjects)

      toast({
        title: `Removed project '${project.name}'`,
        position: 'top',
        isClosable: true,
        variant: 'subtle',
        status: 'success',
      })
    },
  })

  function deleteProject() {
    onClose()
    deleteMutation.mutate(project.id)
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
          <Text fontSize="sm" textAlign="left" mb="4">
            Are you sure you want to delete this project?
          </Text>

          <Button isDisabled={projectsFetching} onClick={deleteProject} size="sm" colorScheme="red" variant="ghost">
            Delete
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default ProjectRemoveButton
