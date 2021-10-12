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
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi from 'api/FlagsApi'
import { ChangeEvent, useState, KeyboardEvent, useRef } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import CommonUtils from 'utils/CommonUtils'
import _ from 'lodash/fp'

interface Props {
  isOpen: boolean
  onClose: () => void
  doesFlagAlreadyExist: (flagName: string) => boolean
}

function CreateFlagDialog({ isOpen, onClose, doesFlagAlreadyExist }: Props) {
  const inputRef = useRef()
  const queryClient = useQueryClient()

  const [flagName, setFlagName] = useState<string>('')
  const [addForAll, setAddForAll] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const createFlagMutation = useMutation(FlagsApi.createFlag, { onSuccess })
  const createFlagForAllMutation = useMutation(FlagsApi.createFlagForAllEnvironments, { onSuccess })

  function onSuccess() {
    queryClient.invalidateQueries(ApiQueryId.getFlags)
    onClose()
    resetState()
  }

  function _onClose() {
    onClose()
    resetState()
  }

  function resetState() {
    setFlagName('')
    setAddForAll(false)
    setError(undefined)
  }

  function onFlagNameChange(event: ChangeEvent<HTMLInputElement>) {
    setFlagName(event.target.value)

    if (error) {
      setError(undefined)
    }
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
    const name = _.snakeCase(flagName)

    if (doesFlagAlreadyExist(name)) {
      setError('A flag with this name already exists')
      return
    }

    if (addForAll) {
      createFlagForAllMutation.mutate(name)
    } else {
      createFlagMutation.mutate(name)
    }
  }

  const isLoading = createFlagMutation.isLoading || createFlagForAllMutation.isLoading

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={inputRef as any}
      onClose={_onClose}
      isOpen={isOpen}
      isCentered
      autoFocus={false}
      closeOnOverlayClick={!isLoading}
      closeOnEsc
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Add Flag</AlertDialogHeader>

        <AlertDialogBody>
          <Text color="gray.500" mb={2} fontSize="sm">
            Flag will be transformed into <i>snake_case</i> for easy api access
          </Text>

          <FormControl mb={10} isInvalid={Boolean(error)}>
            <Input
              ref={inputRef as any}
              onKeyDown={onKeyDown}
              value={flagName}
              onChange={onFlagNameChange}
              variant="filled"
              placeholder="Ex: photo_editor"
            />

            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>

          <Stack alignItems="flex-end" direction="row">
            <Switch isChecked={addForAll} onChange={toggleAddForAll} colorScheme="blue" />

            <Text>Add flag for all environments</Text>
          </Stack>
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button
            minWidth="120px"
            onClick={createFlag}
            loadingText="Adding"
            disabled={flagName.length < 3 || isLoading}
            colorScheme="blue"
            isLoading={isLoading}
          >
            Add
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateFlagDialog
