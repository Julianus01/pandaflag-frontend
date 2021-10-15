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
import { useUpdateEffect } from 'react-use'

interface Props {
  project: IProject
  isOpen: boolean
  onClose: () => void
}

function EditProjectDialog({ project, isOpen, onClose }: Props) {
  const inputRef = useRef()
  const queryClient = useQueryClient()
  const toast = useToast()

  const [projectName, setProjectName] = useState<string>(project.name)
  const [error, setError] = useState<string | undefined>(undefined)
  const doesProjectAlreadyExist = useProjectAlreadyExists()

  const updateProjectMutation = useMutation(ProjectsApi.updateProject, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getProjects)
      setProjectName('')
      onClose()

      toast({
        title: `Updated successfully`,
        position: 'top',
        isClosable: true,
        variant: 'subtle',
        status: 'success',
      })
    },
  })

  useUpdateEffect(() => {
    setProjectName(project.name)
  }, [project.name])

  function _onClose() {
    onClose()
    setProjectName('')
    setError(undefined)
  }

  function onProjectNameChange(event: ChangeEvent<HTMLInputElement>) {
    setProjectName(event.target.value)

    if (error) {
      setError(undefined)
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && projectName.length >= 3) {
      updateProject()
    }
  }

  function updateProject() {
    const name = projectName.trim()

    if (doesProjectAlreadyExist(name)) {
      setError('A project with this name already exists')
      return
    }

    updateProjectMutation.mutate({ ...project, name })
  }

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={inputRef as any}
      onClose={_onClose}
      isOpen={isOpen}
      isCentered
      autoFocus={false}
      closeOnOverlayClick={!updateProjectMutation.isLoading}
      closeOnEsc
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Edit project</AlertDialogHeader>

        <AlertDialogBody>
          <FormControl mb={4} isInvalid={Boolean(error)}>
            <Input
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
            minWidth="120px"
            onClick={updateProject}
            loadingText="Updating"
            disabled={
              projectName.length < 3 || updateProjectMutation.isLoading || projectName.trim() === project.name.trim()
            }
            colorScheme="blue"
            isLoading={updateProjectMutation.isLoading}
          >
            Update
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EditProjectDialog
