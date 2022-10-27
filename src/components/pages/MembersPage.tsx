import { Heading, TableContainer, Thead, Skeleton, Td, Tbody, Table, Th, Tr } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import UsersApi, { IMember } from 'api/UsersApi'
import BoxedPage from 'components/styles/BoxedPage'
import { useQuery } from 'react-query'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import MembersTable from './members/MembersTable'

function SkeletonTable() {
  return (
    <TableContainer>
      <CustomTable variant="simple">
        <TableHead>
          <Row>
            <Th width="100%" textTransform="capitalize">
              Name
            </Th>
          </Row>
        </TableHead>

        <Tbody>
          <Row>
            <Td>
              <Skeleton height="24px" />
            </Td>
          </Row>
        </Tbody>
      </CustomTable>
    </TableContainer>
  )
}

function MembersPage() {
  const membersQuery = useQuery([ApiQueryId.getMembers], UsersApi.getOrganizationMembers)

  return (
    <BoxedPage>
      <Heading flex={1} mb={10} as="h3" size="lg">
        Members
      </Heading>

      {membersQuery.isLoading && <SkeletonTable />}

      {!membersQuery.isLoading && Boolean(membersQuery.data?.length) && (
        <TableContainer>
          <MembersTable members={membersQuery.data as IMember[]} />
        </TableContainer>
      )}
    </BoxedPage>
  )
}

export default MembersPage

const TableHead = styled(Thead)`
  background: ${({ theme }) => applyColorMode(theme.colors.gray[100], theme.colors.gray[900])(theme)};
`

const CustomTable = styled(Table)`
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[800])(theme)};
`

const Row = styled(Tr)`
  :last-child {
    > td {
      border: 0;
    }
  }
`
