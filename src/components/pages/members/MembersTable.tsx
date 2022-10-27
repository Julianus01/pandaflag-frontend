import { Table, Tbody, Th, Thead, Tr, Box } from '@chakra-ui/react'
import { IMember } from 'api/UsersApi'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import MemberRow from './MemberRow'

interface IProps {
  members: IMember[]
}

function MembersTable({ members }: IProps) {
  return (
    <CustomTable variant="simple">
      <TableHead>
        <Tr>
          <Th textTransform="capitalize">
            <Box ml="26px">Name</Box>
          </Th>

          <Th textTransform="capitalize">Photo</Th>

          <Th textTransform="capitalize" isNumeric>
            Created at
          </Th>

          <Th textTransform="capitalize" />
        </Tr>
      </TableHead>

      <Tbody>
        {members.map((member: IMember) => (
          <MemberRow key={member.uid} member={member} />
        ))}
      </Tbody>
    </CustomTable>
  )
}

export default MembersTable

const TableHead = styled(Thead)`
  background: ${({ theme }) => applyColorMode(theme.colors.gray[100], theme.colors.gray[900])(theme)};
`

const CustomTable = styled(Table)`
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[800])(theme)};
`
