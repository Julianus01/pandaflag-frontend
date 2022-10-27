import { Heading } from '@chakra-ui/react'
import UsersApi from 'api/UsersApi'
import BoxedPage from 'components/styles/BoxedPage'
import { useEffect } from 'react'
import MembersTable from './members/MembersTable'

function MembersPage() {

  useEffect(() => {
    UsersApi.getOrganizationMembers()
  }, [])

  return (
    <BoxedPage>
      <Heading flex={1} mb={10} as="h3" size="lg">
        Members
      </Heading>

      <MembersTable />
    </BoxedPage>
  )
}

export default MembersPage
