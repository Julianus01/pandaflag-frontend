import { Heading, Box, Spinner } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import UsersApi, { IMember } from 'api/UsersApi'
import TableContainer from 'components/shared/TableContainer'
import BoxedPage from 'components/styles/BoxedPage'
import SkeletonTable from 'components/styles/SkeletonTable'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import MembersTable from './members/MembersTable'

function MembersPage() {
  const user = useSelector((state: IStoreState) => state.auth.user)
  const membersQuery = useQuery(ApiQueryId.getMembers, UsersApi.getOrganizationMembers)

  const membersWithUserInFront = membersQuery.data?.sort((firstMember: IMember, secondMember: IMember) =>
    firstMember.uid === user?.uid ? -1 : secondMember.uid === user?.uid ? 1 : 0
  )

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading flex={1} mb={10} as="h3" size="lg">
          Members
          {membersQuery.isLoading && <Spinner colorScheme="primary" ml={6} size="sm" />}
        </Heading>
      </Box>

      {membersQuery.isLoading && <SkeletonTable />}

      {!membersQuery.isLoading && Boolean(membersWithUserInFront?.length) && (
        <TableContainer>
          <MembersTable members={membersWithUserInFront as IMember[]} />
        </TableContainer>
      )}
    </BoxedPage>
  )
}

export default MembersPage
