import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  Stack,
  Switch,
  Text,
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
  const [addForAll, setAddForAll] = useState<boolean>(true)

  const createFlagMutation = useMutation(FlagsApi.createFlag, { onSuccess })
  const createFlagForAllMutation = useMutation(FlagsApi.createFlagForAllEnvironments, { onSuccess })

  function onSuccess() {
    queryClient.invalidateQueries(ApiQueryId.getFlags)
    setFlagName('')
    onClose()
  }

  function onFlagNameChange(event: ChangeEvent<HTMLInputElement>) {
    setFlagName(event.target.value)
  }

  function toggleAddForAll() {
    setAddForAll(!addForAll)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    CommonUtils.stopPropagation(event)

    if (event.key === 'Enter' && flagName.length >= 3) {
      createFlag()
    }
  }

  function createFlag() {
    // TODO: Check name of flag and show error ( can't save if it already exists )
    if (addForAll) {
      createFlagForAllMutation.mutate(flagName.trim())
    } else {
      createFlagMutation.mutate(flagName.trim())
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
      closeOnOverlayClick={!createFlagMutation.isLoading}
      closeOnEsc
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Add Flag</AlertDialogHeader>

        <AlertDialogBody>
          <Input
            ref={inputRef as any}
            onKeyDown={onKeyDown}
            value={flagName}
            onChange={onFlagNameChange}
            mb={4}
            variant="filled"
            placeholder="Ex: photo_editor"
          />

          <Stack alignItems="flex-end" direction="row">
            <Text>Add flag for all environments</Text>

            <Switch isChecked={addForAll} onChange={toggleAddForAll} colorScheme="blue" />
          </Stack>
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
