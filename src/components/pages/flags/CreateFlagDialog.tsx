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
import FlagsApi from 'api/FlagsApi'
import { ChangeEvent, useState, KeyboardEvent, useRef } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import CommonUtils from 'utils/CommonUtils'

interface Props {
  isOpen: boolean
  onClose: () => void
}

function CreateFlagDialog({ isOpen, onClose }: Props) {
  const inputRef = useRef()
  const queryClient = useQueryClient()
  const [flagName, setFlagName] = useState<string>('')

  const createFlagMutation = useMutation(FlagsApi.createFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getFlags)
      setFlagName('')
      onClose()
    },
  })

  function onFlagNameChange(event: ChangeEvent<HTMLInputElement>) {
    setFlagName(event.target.value)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    CommonUtils.stopPropagation(event)

    if (event.key === 'Enter' && flagName.length >= 3) {
      createFlag()
    }
  }

  function createFlag() {
    // TODO: Check name of flag and show error ( can't save if it already exists )
    createFlagMutation.mutate(flagName.trim())
  }

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={inputRef as any}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      autoFocus={false}
      closeOnOverlayClick={!createFlagMutation.isLoading}
      closeOnEsc
    >
      <AlertDialogOverlay />

      <AlertDialogContent border="1px" borderColor="gray.200">
        <AlertDialogHeader>Add Flag</AlertDialogHeader>

        <AlertDialogBody>
          <Input
            ref={inputRef as any}
            onKeyDown={onKeyDown}
            value={flagName}
            onChange={onFlagNameChange}
            mb={4}
            variant="filled"
            placeholder="Flag Name"
          />
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button
            minWidth="120px"
            onClick={createFlag}
            loadingText="Creating"
            disabled={flagName.length < 3 || createFlagMutation.isLoading}
            colorScheme="blue"
            isLoading={createFlagMutation.isLoading}
          >
            Add
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateFlagDialog
