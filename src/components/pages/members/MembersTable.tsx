import { Tbody, Th, Tr, Box } from '@chakra-ui/react'
import { IMember } from 'api/UsersApi'
import Table from 'components/styles/Table'
import Thead from 'components/styles/Thead'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import MemberRow from './MemberRow'

interface IProps {
  members: IMember[]
}

function MembersTable({ members }: IProps) {
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
        </Tr>
      </Thead>

      <Tbody>
        {members.map((member: IMember) => (
          <MemberRow key={member.uid} member={member} />
        ))}
      </Tbody>
    </Table>
  )
}

export default MembersTable
