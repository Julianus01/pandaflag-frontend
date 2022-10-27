import { Box, Td, Tr, Avatar, TagLabel, Tag } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { format, fromUnixTime } from 'date-fns'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import { IMember } from 'api/UsersApi'
import GreenPulse from 'components/styles/GreenPulse'
import { UserUtils } from 'utils/UserUtils'

interface IProps {
  member: IMember
}

function MemberRow({ member }: IProps) {
  console.log(member)
  const currentUser = useSelector((state: IStoreState) => state.auth.user)
  const displayName = UserUtils.userDisplayName(member)

  const createdAt = fromUnixTime(member.createdAt.seconds)
  const showYear = new Date().getFullYear() > createdAt.getFullYear()

  return (
    <Row>
      <Td>
        <Box display="flex" alignItems="center">
          <GreenPulse $show={member.uid === currentUser?.uid} />

          {displayName}
        </Box>
      </Td>

      <Td>
        <Avatar name={displayName} size="sm" shadow="lg" ignoreFallback src={member?.photoURL as string} />
      </Td>

      <Td whiteSpace="nowrap" isNumeric>
        <Tag size="md" borderRadius="md" variant="subtle" colorScheme={UserUtils.getMemberTypeColorSchema(member)}>
          <TagLabel textTransform="capitalize">{member.type}</TagLabel>
        </Tag>
      </Td>

      <Td whiteSpace="nowrap" isNumeric>
        {format(createdAt, `MMM do ${showYear ? 'uu' : ''}`)}
      </Td>
    </Row>
  )
}

export default MemberRow

const Row = styled(Tr)`
  :last-child {
    > td {
      border: 0;
    }
  }
`
