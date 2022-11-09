import { Heading, Box, Spinner, useClipboard, Button, Icon, Alert, AlertIcon } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import UsersApi, { IMember } from 'api/UsersApi'
import RoutePage from 'components/routes/RoutePage'
import TableContainer from 'components/shared/TableContainer'
import BoxedPage from 'components/styles/BoxedPage'
import SkeletonTable from 'components/styles/SkeletonTable'
import { FiSend } from 'react-icons/fi'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import { PricingUtils } from 'utils/PricingUtils'
import MembersTable from './members/MembersTable'

function useInvitationLink() {
  const orgId = useSelector((state: IStoreState) => state.configuration.organization?.id)

  return `${process.env.REACT_APP_PANDAFLAG_APP_URL}${RoutePage.acceptInvitationRegister(orgId as string)}`
}

function MembersPage() {
  const Quota = PricingUtils.getQuota()
  const organization = useSelector((state: IStoreState) => state.configuration.organization)
  const invitationLink = useInvitationLink()
  const { hasCopied, onCopy } = useClipboard(invitationLink)

  const user = useSelector((state: IStoreState) => state.auth.user)
  const membersQuery = useQuery(ApiQueryId.getMembers, () => UsersApi.getOrganizationMembers())

  const membersWithCurrentUserInFront = membersQuery.data?.sort((firstMember: IMember, secondMember: IMember) =>
    firstMember.uid === user?.uid ? -1 : secondMember.uid === user?.uid ? 1 : 0
  )

  const isMembersQuotaReached = (organization?.members?.length as number) >= Quota.members

  return (
    <BoxedPage>
      <Box mb={10} display="flex">
        <Heading flex={1} as="h3" size="lg">
          Members
          {membersQuery.isLoading && <Spinner colorScheme="primary" ml={6} size="sm" />}
        </Heading>

        <Button disabled={isMembersQuotaReached} mt="auto" onClick={onCopy} leftIcon={<Icon as={FiSend} />} size="xs">
          {hasCopied ? 'Copied link' : 'Copy invitation link'}
        </Button>
      </Box>

      {isMembersQuotaReached && (
        <Alert fontSize="sm" borderRadius="md" mb="6" status="info">
          <AlertIcon w="4" h="4" />
          You've reached the limit for number of team members 🧑‍💻
        </Alert>
      )}

      {membersQuery.isLoading && <SkeletonTable />}

      {!membersQuery.isLoading && Boolean(membersWithCurrentUserInFront?.length) && (
        <>
          <TableContainer>
            <MembersTable members={membersWithCurrentUserInFront as IMember[]} />
          </TableContainer>
        </>
      )}
    </BoxedPage>
  )
}

export default MembersPage
