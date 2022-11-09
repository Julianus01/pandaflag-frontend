import { Heading, Box, Spinner, useClipboard, Button, Icon } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import UsersApi, { IMember } from 'api/UsersApi'
import TableContainer from 'components/shared/TableContainer'
import BoxedPage from 'components/styles/BoxedPage'
import SkeletonTable from 'components/styles/SkeletonTable'
import { FiSend } from 'react-icons/fi'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import MembersTable from './members/MembersTable'

function useInvitationLink() {
  const orgId = useSelector((state: IStoreState) => state.configuration.organization?.id)

  return `${process.env.REACT_APP_PANDAFLAG_APP_URL}/${orgId}`
}

function MembersPage() {
  const invitationLink = useInvitationLink()
  const { hasCopied, onCopy } = useClipboard(invitationLink)

  const user = useSelector((state: IStoreState) => state.auth.user)
  const membersQuery = useQuery(ApiQueryId.getMembers, () => UsersApi.getOrganizationMembers())

  const membersWithUserInFront = membersQuery.data?.sort((firstMember: IMember, secondMember: IMember) =>
    firstMember.uid === user?.uid ? -1 : secondMember.uid === user?.uid ? 1 : 0
  )

  return (
    <BoxedPage>
      <Box mb={10} display="flex">
        <Heading flex={1} as="h3" size="lg">
          Members
          {membersQuery.isLoading && <Spinner colorScheme="primary" ml={6} size="sm" />}
        </Heading>

        <Button mt="auto" onClick={onCopy} leftIcon={<Icon as={FiSend} />} size="xs">
          {hasCopied ? 'Copied link' : 'Copy invitation link'}
        </Button>
      </Box>

      {membersQuery.isLoading && <SkeletonTable />}

      {!membersQuery.isLoading && Boolean(membersWithUserInFront?.length) && (
        <>
          <TableContainer>
            <MembersTable members={membersWithUserInFront as IMember[]} />
          </TableContainer>
        </>
      )}
    </BoxedPage>
  )
}

export default MembersPage
