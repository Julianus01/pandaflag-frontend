import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi from 'api/ProjectsApi'
import { ChangeEvent, useState, KeyboardEvent, useRef } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import CommonUtils from 'utils/CommonUtils'

interface Props {
  isOpen: boolean
  onClose: () => void
}

function ProjectsPage({ isOpen, onClose }: Props) {
  const inputRef = useRef()
  const queryClient = useQueryClient()
  const [projectName, setProjectName] = useState<string>('')

  const createProjectMutation = useMutation(ProjectsApi.createProject, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getProjects)
      setProjectName('')
      onClose()
    },
  })

  function onProjectNameChange(event: ChangeEvent<HTMLInputElement>) {
    setProjectName(event.target.value)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    CommonUtils.stopPropagation(event)

    if (event.key === 'Enter') {
      createProject()
    }
  }

  function createProject() {
    // TODO: Check name of project and show error ( can't save if it already exists )
    createProjectMutation.mutate(projectName)
  }

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={inputRef as any}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      autoFocus={false}
      closeOnOverlayClick={!createProjectMutation.isLoading}
      closeOnEsc
    >
      <AlertDialogOverlay />

      <AlertDialogContent border="1px" borderColor="gray.200">
        <AlertDialogHeader>Add project</AlertDialogHeader>

        <AlertDialogBody>
          <Input
            ref={inputRef as any}
            onKeyDown={onKeyDown}
            value={projectName}
            onChange={onProjectNameChange}
            mb={4}
            variant="filled"
            placeholder="Project Name"
          />
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button
            onClick={createProject}
            loadingText="Creating"
            disabled={projectName.length < 3 || createProjectMutation.isLoading}
            colorScheme="blue"
            isLoading={createProjectMutation.isLoading}
          >
            Create
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ProjectsPage
