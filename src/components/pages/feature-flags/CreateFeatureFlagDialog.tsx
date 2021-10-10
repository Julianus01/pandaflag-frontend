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
import FeatureFlagsApi from 'api/FeatureFlagsApi'
import { ChangeEvent, useState, KeyboardEvent, useRef } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import CommonUtils from 'utils/CommonUtils'

interface Props {
  isOpen: boolean
  onClose: () => void
}

function CreateFeatureFlagDialog({ isOpen, onClose }: Props) {
  const inputRef = useRef()
  const queryClient = useQueryClient()
  const [featureFlagName, setFeatureFlagName] = useState<string>('')

  const createFeatureFlagMutation = useMutation(FeatureFlagsApi.createFeatureFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getFeatureFlags)
      setFeatureFlagName('')
      onClose()
    },
  })

  function onFeatureFlagNameChange(event: ChangeEvent<HTMLInputElement>) {
    setFeatureFlagName(event.target.value)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    CommonUtils.stopPropagation(event)

    if (event.key === 'Enter' && featureFlagName.length >= 3) {
      createFeatureFlag()
    }
  }

  function createFeatureFlag() {
    // TODO: Check name of feature flag and show error ( can't save if it already exists )
    createFeatureFlagMutation.mutate(featureFlagName.trim())
  }

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={inputRef as any}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      autoFocus={false}
      closeOnOverlayClick={!createFeatureFlagMutation.isLoading}
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
            placeholder="Feature Flag Name"
          />
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button
            minWidth="120px"
            onClick={createFeatureFlag}
            loadingText="Creating"
            disabled={featureFlagName.length < 3 || createFeatureFlagMutation.isLoading}
            colorScheme="blue"
            isLoading={createFeatureFlagMutation.isLoading}
          >
            Add
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateFeatureFlagDialog
