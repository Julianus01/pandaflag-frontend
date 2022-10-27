import { Tbody, Th, Tr } from '@chakra-ui/react'
import { IInvitation } from 'api/InvitationApi'
import Table from 'components/styles/Table'
import Thead from 'components/styles/Thead'
import InvitationRow from './InvitationRow'

interface IProps {
  invitations: IInvitation[]
}

function InvitationsTable({ invitations }: IProps) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th textTransform="capitalize">Email</Th>

          <Th textTransform="capitalize" isNumeric>
            Member Type
          </Th>

          <Th textTransform="capitalize" isNumeric>
            Created at
          </Th>

          <Th textTransform="capitalize" />
        </Tr>
      </Thead>

      <Tbody>
        {invitations.map((invitation: IInvitation) => (
          <InvitationRow key={invitation.id} invitation={invitation} />
        ))}
      </Tbody>
    </Table>
  )
}

export default InvitationsTable
