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
import { ChangeEvent, useState, KeyboardEvent, useRef } from 'react'
import CommonUtils from 'utils/CommonUtils'

interface Props {
  isOpen: boolean
  onClose: () => void
}

function CreateFeatureFlagDialog({ isOpen, onClose }: Props) {
  const inputRef = useRef()
  const [featureFlagName, setFeatureFlagName] = useState<string>('')

  function onFeatureFlagNameChange(event: ChangeEvent<HTMLInputElement>) {
    setFeatureFlagName(event.target.value)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    CommonUtils.stopPropagation(event)

    if (event.key === 'Enter') {
      // TODO: Create
    }
  }

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={inputRef as any}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      autoFocus={false}
      // closeOnOverlayClick={!createProjectMutation.isLoading}
      closeOnEsc
    >
      <AlertDialogOverlay />

      <AlertDialogContent border="1px" borderColor="gray.200">
        <AlertDialogHeader>Add Feature Flag</AlertDialogHeader>

        <AlertDialogBody>
          <Input
            ref={inputRef as any}
            onKeyDown={onKeyDown}
            value={featureFlagName}
            onChange={onFeatureFlagNameChange}
            mb={4}
            variant="filled"
            placeholder="Project Name"
          />
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button
            // onClick={() => {}}
            loadingText="Creating"
            disabled={featureFlagName.length < 3}
            colorScheme="blue"
            // isLoading={createProjectMutation.isLoading}
          >
            Create
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateFeatureFlagDialog
