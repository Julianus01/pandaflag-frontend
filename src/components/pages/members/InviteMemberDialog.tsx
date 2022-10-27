import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  Select,
  Text,
} from '@chakra-ui/react'
import UsersApi, { MemberType } from 'api/UsersApi'
import { useTemporaryMessage } from 'hooks/common/useTemporaryMessage'
import { useState, KeyboardEvent, useRef } from 'react'
import { useMutation } from 'react-query'
import { SplitbeeEvent } from 'utils/SplitbeeUtils'

const isEmailValid = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

interface IProps {
  isOpen: boolean
  onClose: () => void
}

function InviteMemberDialog({ isOpen, onClose }: IProps) {
  const inputRef = useRef()
  const temporaryMessage = useTemporaryMessage()

  const [email, setEmail] = useState<string>('')
  const [type, setType] = useState<MemberType>(MemberType.admin)

  const isValidForm = isEmailValid(email)

  const sendInvitationMutation = useMutation(UsersApi.inviteMember)

  function _onClose() {
    onClose()
    setEmail('')
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && isValidForm) {
      sendInvitation()
    }
  }

  async function sendInvitation() {
    temporaryMessage.hideMessage()

    sendInvitationMutation.mutate(email, {
      onError: (err: unknown) => {
        const error = err as Error
        temporaryMessage.showMessage(error?.message)
      },
    })
  }

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={inputRef as any}
      onClose={_onClose}
      isOpen={isOpen}
      isCentered
      autoFocus={false}
      closeOnOverlayClick={!sendInvitationMutation.isLoading}
      closeOnEsc
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Invite member</AlertDialogHeader>

        <AlertDialogBody>
          <Input
            mb={4}
            flex="1"
            disabled={sendInvitationMutation.isLoading}
            ref={inputRef as any}
            onKeyDown={onKeyDown}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            variant="filled"
            placeholder="Ex: johndoe@email.com"
          />

          <Select onChange={(event) => setType(event.target.value as MemberType)} value={type} variant="filled">
            <option value="admin">Admin</option>
          </Select>

          {!!temporaryMessage.message && <Text mt={4} ml={2} color="red.500">{temporaryMessage.message}</Text>}
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button
            data-splitbee-event={SplitbeeEvent.InviteMember}
            onClick={sendInvitation}
            loadingText="Sending invitation"
            disabled={!isValidForm || sendInvitationMutation.isLoading}
            colorScheme="blue"
            isLoading={sendInvitationMutation.isLoading}
          >
            Send invitation
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default InviteMemberDialog
