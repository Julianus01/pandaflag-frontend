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
  Text,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi from 'api/FlagsApi'
import { ChangeEvent, useState, KeyboardEvent, useRef } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import _ from 'lodash/fp'
import AutoTextArea from 'components/styles/AutoTextarea'
import ReactGa from 'react-ga'
import { GaActionFlag, GaCategory } from 'utils/GaUtils'

interface Props {
  isOpen: boolean
  onClose: () => void
  doesFlagAlreadyExist: (flagName: string) => boolean
}

function CreateFlagDialog({ isOpen, onClose, doesFlagAlreadyExist }: Props) {
  const inputRef = useRef()
  const queryClient = useQueryClient()

  const [flagName, setFlagName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [error, setError] = useState<string | undefined>(undefined)

  const createFlagMutation = useMutation(FlagsApi.createFlag, { onSuccess })

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
    setDescription('')
    setError(undefined)
  }

  function formatNameSnakeCase() {
    setFlagName(_.snakeCase(flagName))
  }

  function onFlagNameChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value

    if (value.length > 40) {
      return
    }

    setFlagName(value)

    if (error) {
      setError(undefined)
    }
  }

  function onDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setDescription(event.target.value)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && flagName.length >= 3) {
      formatNameSnakeCase()
      createFlag()
    }
  }

  function createFlag() {
    const name = _.snakeCase(flagName)

    if (doesFlagAlreadyExist(name)) {
      setError('A flag with this name already exists')
      return
    }

    ReactGa.event({
      category: GaCategory.editing,
      action: GaActionFlag.create,
    })

    const params = { name, description: description.trim() }

    createFlagMutation.mutate(params)
  }

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={inputRef as any}
      onClose={_onClose}
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
          <Text color="gray.500" mb={2} fontSize="sm">
            Flag will be transformed into <i>snake_case</i> for easy api access
          </Text>

          <FormControl isInvalid={Boolean(error)}>
            <Input
              disabled={createFlagMutation.isLoading}
              onBlur={formatNameSnakeCase}
              ref={inputRef as any}
              onKeyDown={onKeyDown}
              value={flagName}
              onChange={onFlagNameChange}
              variant="filled"
              placeholder="Ex: photo_editor"
            />

            <FormErrorMessage>{error}</FormErrorMessage>

            <AutoTextArea
              mt={2}
              borderRadius="md"
              variant="filled"
              placeholder="Optional: Description"
              size="sm"
              resize="none"
              onChange={onDescriptionChange}
              value={description}
            />
          </FormControl>
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button
            onClick={createFlag}
            loadingText="Adding Flag"
            disabled={flagName.length < 3 || createFlagMutation.isLoading}
            colorScheme="blue"
            isLoading={createFlagMutation.isLoading}
          >
            Add Flag
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateFlagDialog
