import { Td, Tr, TagLabel, Tag, IconButton, Icon, Tooltip, Spinner, useToast } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { format, fromUnixTime } from 'date-fns'
import { UserUtils } from 'utils/UserUtils'
import { IInvitation } from 'api/InvitationApi'
import { FiSend } from 'react-icons/fi'
import { useMutation } from 'react-query'
import EmailApi from 'api/EmailApi'

interface IProps {
  invitation: IInvitation
}

function InvitationRow({ invitation }: IProps) {
  const toast = useToast()

  const createdAt = fromUnixTime(invitation.createdAt.seconds)
  const showYear = new Date().getFullYear() > createdAt.getFullYear()

  const resendInvitationMutation = useMutation(EmailApi.sendMemberInvitation)

  function resendInvitation() {
    resendInvitationMutation.mutate(
      { email: invitation.email, invitationId: invitation.id },
      {
        onSuccess: () => {
          toast({
            title: `Invitation sent 📬`,
            isClosable: true,
            variant: 'subtle',
          })
        },
      }
    )
  }

  return (
    <Row>
      <Td>{invitation.email}</Td>

      <Td whiteSpace="nowrap" isNumeric>
        <Tag
          size="md"
          borderRadius="md"
          variant="subtle"
          colorScheme={UserUtils.getMemberTypeColorSchema(invitation.memberType)}
        >
          <TagLabel textTransform="capitalize">{invitation.memberType}</TagLabel>
        </Tag>
      </Td>

      <Td whiteSpace="nowrap" isNumeric>
        {format(createdAt, `MMM do ${showYear ? 'uu' : ''}`)}
      </Td>

      <Td whiteSpace="nowrap" isNumeric>
        <Tooltip placement="top" label="Resend invitation">
          <IconButton
            disabled={resendInvitationMutation.isLoading || resendInvitationMutation.isSuccess}
            onClick={resendInvitation}
            size="xs"
            aria-label="resend-invitation"
            icon={resendInvitationMutation.isLoading ? <Spinner size="xs" /> : <Icon as={FiSend} />}
          />
        </Tooltip>
      </Td>
    </Row>
  )
}

export default InvitationRow

const Row = styled(Tr)`
  :last-child {
    > td {
      border: 0;
    }
  }
`
