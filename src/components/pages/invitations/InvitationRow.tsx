import { Td, Tr, TagLabel, Tag, IconButton, Icon } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { format, fromUnixTime } from 'date-fns'
import { UserUtils } from 'utils/UserUtils'
import { IInvitation } from 'api/InvitationApi'
import { FiMail } from 'react-icons/fi'

interface IProps {
  invitation: IInvitation
}

function InvitationRow({ invitation }: IProps) {
  const createdAt = fromUnixTime(invitation.createdAt.seconds)
  const showYear = new Date().getFullYear() > createdAt.getFullYear()

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
        <IconButton size="xs" aria-label="resend-invitation" icon={<Icon as={FiMail} />} />
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
