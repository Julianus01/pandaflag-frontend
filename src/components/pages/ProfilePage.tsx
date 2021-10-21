import { Heading } from '@chakra-ui/react'
import BoxedPage from 'components/styles/BoxedPage'

function ProfilePage() {
  return (
    <BoxedPage>
      <Heading flex={1} mb={10} as="h3" size="lg">
        Profile
      </Heading>
    </BoxedPage>
  )
}

export default ProfilePage
