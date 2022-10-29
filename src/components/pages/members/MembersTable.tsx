import { Tbody, Th, Tr, Box } from '@chakra-ui/react'
import { IMember, MemberType } from 'api/UsersApi'
import Table from 'components/styles/Table'
import Thead from 'components/styles/Thead'
import { useIsCurrentUserMemberType } from 'hooks/userHooks'
import MemberRow from './MemberRow'

interface IProps {
  members: IMember[]
}

function MembersTable({ members }: IProps) {
  const isAdmin = useIsCurrentUserMemberType(MemberType.admin)

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th textTransform="capitalize">
            <Box ml="26px">Name</Box>
          </Th>

          <Th textTransform="capitalize">Photo</Th>

          <Th textTransform="capitalize" isNumeric>
            Type
          </Th>

          <Th textTransform="capitalize" isNumeric>
            Created at
          </Th>

          {isAdmin && members.length > 1 && <Th />}
        </Tr>
      </Thead>

      <Tbody>
        {members.map((member: IMember) => (
          <MemberRow showDeleteAction={isAdmin && members.length > 1} key={member.uid} member={member} />
        ))}
      </Tbody>
    </Table>
  )
}

export default MembersTable
