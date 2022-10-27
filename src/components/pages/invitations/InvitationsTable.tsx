import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import { IInvitation } from 'api/InvitationApi'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import InvitationRow from './InvitationRow'

interface IProps {
  invitations: IInvitation[]
}

function InvitationsTable({ invitations }: IProps) {
  return (
    <CustomTable variant="simple">
      <TableHead>
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
      </TableHead>

      <Tbody>
        {invitations.map((invitation: IInvitation) => (
          <InvitationRow key={invitation.id} invitation={invitation} />
        ))}
      </Tbody>
    </CustomTable>
  )
}

export default InvitationsTable

const TableHead = styled(Thead)`
  background: ${({ theme }) => applyColorMode(theme.colors.gray[100], theme.colors.gray[900])(theme)};
`

const CustomTable = styled(Table)`
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[800])(theme)};
`
