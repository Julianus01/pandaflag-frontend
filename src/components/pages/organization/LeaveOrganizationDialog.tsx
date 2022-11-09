import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import OrganizationsApi from 'api/OrganizationsApi'
import { useRef } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

interface IProps {
  isOpen: boolean
  onClose: () => void
}

function LeaveOrganizationDialog({ isOpen, onClose }: IProps) {
  const queryClient = useQueryClient()
  const organization = useSelector((state: IStoreState) => state.configuration.organization)
  const inputRef = useRef()

  const isLastMember = organization?.members?.length === 1

  const leaveOrganizationMutation = useMutation(OrganizationsApi.leaveOrganization, {
    onSuccess: () => {
      // Remove all queries and caches
      return queryClient.resetQueries()
    },
  })

  function onLeaveOrganization() {
    leaveOrganizationMutation.mutate()
  }

  return (
    <AlertDialog
      leastDestructiveRef={inputRef as any}
      motionPreset="slideInBottom"
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      autoFocus={false}
      closeOnOverlayClick={!leaveOrganizationMutation.isLoading}
      closeOnEsc
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Leave Organization 🎒?</AlertDialogHeader>

        <AlertDialogBody>
          {isLastMember && (
            <>
              Are you sure you want to leave <b>{organization?.name}</b>? <b>Everything</b> will be <b>deleted</b>
            </>
          )}

          {!isLastMember && (
            <>
              Are you sure you want to leave <b>{organization?.name}</b>?
            </>
          )}
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button mr={2} ref={inputRef as any} onClick={onClose} disabled={leaveOrganizationMutation.isLoading}>
            Cancel
          </Button>

          <Button
            onClick={onLeaveOrganization}
            loadingText="Leaving"
            disabled={leaveOrganizationMutation.isLoading}
            colorScheme="red"
            isLoading={leaveOrganizationMutation.isLoading}
          >
            Leave
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LeaveOrganizationDialog
