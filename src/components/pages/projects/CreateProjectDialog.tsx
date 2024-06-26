import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import useProjectAlreadyExists from 'hooks/project/useProjectAlreadyExists'
import { ChangeEvent, useState, KeyboardEvent, useRef } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useDispatch } from 'react-redux'
import { configurationActions } from 'redux/ducks/configurationDuck'

interface Props {
  isOpen: boolean
  onClose: () => void
}

function CreateProjectDialog({ isOpen, onClose }: Props) {
  const inputRef = useRef()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const toast = useToast()

  const [projectName, setProjectName] = useState<string>('')
  const [error, setError] = useState<string | undefined>(undefined)
  const doesProjectAlreadyExist = useProjectAlreadyExists()

  const createProjectMutation = useMutation(ProjectsApi.createProject, {
    onSuccess: (newProject: IProject) => {
      queryClient.invalidateQueries(ApiQueryId.getProjectsByOrganizationId)

      toast({
        title: `Created project successfully 👍`,
        isClosable: true,
        variant: 'subtle',
        status: 'success',
      })
      dispatch(configurationActions.setProject(newProject))
      setProjectName('')
      onClose()
    },
  })

  function _onClose() {
    onClose()
    setProjectName('')
    setError(undefined)
  }

  function onProjectNameChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value

    if (value.length > 40) {
      return
    }

    setProjectName(value)

    if (error) {
      setError(undefined)
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && projectName.length >= 3) {
      createProject()
    }
  }

  function createProject() {
    const name = projectName.trim()

    if (doesProjectAlreadyExist(name)) {
      setError('A project with this name already exists')
      return
    }

    createProjectMutation.mutate(name)
  }

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={inputRef as any}
      onClose={_onClose}
      isOpen={isOpen}
      isCentered
      autoFocus={false}
      closeOnOverlayClick={!createProjectMutation.isLoading}
      closeOnEsc
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Add project</AlertDialogHeader>

        <AlertDialogBody>
          <FormControl mb={4} isInvalid={Boolean(error)}>
            <Input
              disabled={createProjectMutation.isLoading}
              ref={inputRef as any}
              isInvalid={Boolean(error)}
              onKeyDown={onKeyDown}
              value={projectName}
              onChange={onProjectNameChange}
              variant="filled"
              placeholder="Project Name"
            />

            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button
            onClick={createProject}
            loadingText="Adding Project"
            disabled={projectName.length < 3 || createProjectMutation.isLoading}
            colorScheme="primary"
            isLoading={createProjectMutation.isLoading}
          >
            Add Project
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateProjectDialog
