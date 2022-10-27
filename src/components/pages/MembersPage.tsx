import { Heading, Thead, Skeleton, Td, Tbody, Table, Th, Tr, Box, Button, Icon, useDisclosure } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import InvitationApi, { IInvitation } from 'api/InvitationApi'
import UsersApi, { IMember } from 'api/UsersApi'
import TableContainer from 'components/shared/TableContainer'
import BoxedPage from 'components/styles/BoxedPage'
import { FiUser } from 'react-icons/fi'
import { useQuery } from 'react-query'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import InvitationsTable from './invitations/InvitationsTable'
import InviteMemberDialog from './members/InviteMemberDialog'
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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const membersQuery = useQuery([ApiQueryId.getMembers], UsersApi.getOrganizationMembers)
  const invitationsQuery = useQuery([ApiQueryId.getInvitations], InvitationApi.getInvitations)

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading flex={1} mb={10} as="h3" size="lg">
          Members
        </Heading>

        <Button leftIcon={<Icon as={FiUser} />} onClick={onOpen} colorScheme="blue">
          Invite member
        </Button>
      </Box>

      {membersQuery.isLoading && <SkeletonTable />}

      {!membersQuery.isLoading && Boolean(membersQuery.data?.length) && (
        <TableContainer>
          <MembersTable members={membersQuery.data as IMember[]} />
        </TableContainer>
      )}

      {Boolean(invitationsQuery.data?.length) && (
        <Box mt={10}>
          <Heading flex={1} mb={10} as="h3" size="md">
            Invitations
          </Heading>

          <TableContainer>
            <InvitationsTable invitations={invitationsQuery.data as IInvitation[]} />
          </TableContainer>
        </Box>
      )}

      <InviteMemberDialog isOpen={isOpen} onClose={onClose} />
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
