import {
  Heading,
  Box,
  Button,
  Icon,
  useDisclosure,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Spinner,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import InvitationApi, { IInvitation } from 'api/InvitationApi'
import UsersApi, { IMember } from 'api/UsersApi'
import RoutePage from 'components/routes/RoutePage'
import TableContainer from 'components/shared/TableContainer'
import BoxedPage from 'components/styles/BoxedPage'
import Section from 'components/styles/Section'
import SkeletonTable from 'components/styles/SkeletonTable'
import { useEffect } from 'react'
import { FiUser } from 'react-icons/fi'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'
import InvitationsTable from './invitations/InvitationsTable'
import InviteMemberDialog from './members/InviteMemberDialog'
import MembersTable from './members/MembersTable'

enum TabParam {
  active = 'active',
  invitations = 'invitations',
}

interface IParams {
  tab: TabParam
}

function getInvitationsTabText(invitationsLength: number | undefined) {
  if (invitationsLength === 0) {
    return 'invitations'
  }

  if (!invitationsLength) {
    return '- invitations'
  }

  return `${invitationsLength} invitations`
}

function convertTabToIndex(tab: TabParam) {
  switch (tab) {
    case TabParam.active:
      return 0

    case TabParam.invitations:
      return 1

    default:
      return 0
  }
}

function convertIndexToTab(index: number) {
  switch (index) {
    case 0:
      return TabParam.active

    case 1:
      return TabParam.invitations

    default:
      return TabParam.active
  }
}

function MembersPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const history = useHistory()
  const params = useParams<IParams>()

  const membersQuery = useQuery(ApiQueryId.getMembers, UsersApi.getOrganizationMembers)
  const invitationsQuery = useQuery([ApiQueryId.getPendingInvitations], InvitationApi.getPendingInvitations)

  const isLoading = membersQuery.isLoading || invitationsQuery.isLoading

  function onTabChange(index: number) {
    const tab = convertIndexToTab(index)

    history.replace(RoutePage.members(tab))
  }

  useEffect(() => {
    if (!Object.values(TabParam).includes(params.tab)) {
      history.replace(RoutePage.members(TabParam.active))
    }
  }, [params, history])

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading flex={1} mb={10} as="h3" size="lg">
          Members
          {isLoading && <Spinner colorScheme="primary" ml={6} size="sm" />}
        </Heading>

        <Button leftIcon={<Icon as={FiUser} />} onClick={onOpen} colorScheme="primary">
          Invite member
        </Button>
      </Box>

      <Tabs
        index={convertTabToIndex(params.tab)}
        onChange={onTabChange}
        size="sm"
        variant="soft-rounded"
        colorScheme="primary"
      >
        <TabList>
          <Tab>active</Tab>

          <Tab>{getInvitationsTabText(invitationsQuery.data?.length)}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel pl="0" pr="0">
            {membersQuery.isLoading && <SkeletonTable />}

            {!membersQuery.isLoading && Boolean(membersQuery.data?.length) && (
              <TableContainer>
                <MembersTable members={membersQuery.data as IMember[]} />
              </TableContainer>
            )}
          </TabPanel>

          <TabPanel pl="0" pr="0">
            {invitationsQuery.isLoading && <SkeletonTable />}

            {!invitationsQuery.isLoading && Boolean(invitationsQuery.data?.length) && (
              <TableContainer>
                <InvitationsTable invitations={invitationsQuery.data as IInvitation[]} />
              </TableContainer>
            )}

            {!invitationsQuery.isLoading && !Boolean(invitationsQuery.data?.length) && (
              <Section>Invite your coworkers and deploy safer together 👨‍🦰</Section>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <InviteMemberDialog isOpen={isOpen} onClose={onClose} />
    </BoxedPage>
  )
}

export default MembersPage
