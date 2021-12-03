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
  Switch,
  Text,
  FormLabel,
  Tag,
  Box,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi from 'api/FlagsApi'
import { ChangeEvent, useState, KeyboardEvent, useRef } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import _ from 'lodash/fp'
import AutoTextArea from 'components/styles/AutoTextarea'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import styled from 'styled-components/macro'
import ReactGa from 'react-ga'
import { GaActionFlag, GaCategory } from 'utils/GaUtils'
import { IEnvironment } from 'api/EnvironmentsApi'

interface Props {
  isOpen: boolean
  onClose: () => void
  doesFlagAlreadyExist: (flagName: string) => boolean
}

function CreateFlagDialog({ isOpen, onClose, doesFlagAlreadyExist }: Props) {
  const inputRef = useRef()
  const queryClient = useQueryClient()
  const project = useSelector((state: IStoreState) => state.configuration.project)
  const environment = useSelector((state: IStoreState) => state.configuration.environment)

  const [flagName, setFlagName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
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
    setDescription('')
    setAddForAll(false)
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

  function toggleAddForAll() {
    setAddForAll(!addForAll)
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

    if (addForAll) {
      createFlagForAllMutation.mutate(params)
    } else {
      createFlagMutation.mutate(params)
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
            Environment
          </Text>

          {!addForAll && (
            <Tag mb={4} variant="subtle" colorScheme={environment?.color}>
              {environment?.name}
            </Tag>
          )}

          {addForAll && (
            <AllTagsContainer>
              {project?.environments.map((environment: IEnvironment) => (
                <Tag key={environment.name} variant="subtle" colorScheme={environment?.color}>
                  {environment?.name}
                </Tag>
              ))}
            </AllTagsContainer>
          )}

          <Text color="gray.500" mb={2} fontSize="sm">
            Flag will be transformed into <i>snake_case</i> for easy api access
          </Text>

          <FormControl mb={10} isInvalid={Boolean(error)}>
            <Input
              disabled={isLoading}
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

          <FormControl display="flex" alignItems="center">
            <Switch id="add-for-all" mr={2} isChecked={addForAll} onChange={toggleAddForAll} colorScheme="blue" />

            <FormLabel cursor="pointer" fontWeight="normal" htmlFor="add-for-all" mb="0">
              Add flag for all environments
            </FormLabel>
          </FormControl>
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

const AllTagsContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.space[3]};

  > span {
    margin-right: ${({ theme }) => theme.space[1]};
    margin-bottom: ${({ theme }) => theme.space[1]};
  }
`
