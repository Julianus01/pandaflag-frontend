import { Avatar, Heading, Box, Tag, TagLabel, FormControl, FormLabel, Text, Button, Icon } from '@chakra-ui/react'
import BoxedPage from 'components/styles/BoxedPage'
import Section from 'components/styles/Section'
import { useAuth } from 'hooks/authHooks'
import { FiLogOut } from 'react-icons/fi'

function userDisplayName(name: string) {
  if (name.includes('@')) {
    return name.substr(0, name.indexOf('@'))
  }

  return name
}

function ProfilePage() {
  const auth = useAuth()

  return (
    <BoxedPage>
      <Heading flex={1} mb={10} as="h3" size="lg">
        Profile
      </Heading>

      <Box mb={10} display="flex">
        <Avatar size="lg" shadow="lg" ignoreFallback src={auth.user?.picture} />

        <Box display="flex" flexDirection="column" justifyContent="center" ml={4}>
          <Heading mb={1} fontWeight="semibold" size="md">
            {auth.user?.name && userDisplayName(auth.user?.name)}
          </Heading>

          <Box>
            <Tag size="md" borderRadius="md" variant="subtle" colorScheme="green">
              <TagLabel>Free Plan</TagLabel>
            </Tag>
          </Box>
        </Box>
      </Box>

      <Section mb={4}>
        <FormControl id="email">
          <FormLabel mb={1} fontSize="sm" color="gray.500">
            Email
          </FormLabel>

          <Text fontWeight="semibold">{auth.user?.email}</Text>
        </FormControl>
      </Section>

      <Section mb={8}>
        <FormControl id="subscription">
          <FormLabel mb={1} fontSize="sm" color="gray.500">
            Subscription
          </FormLabel>

          <Text fontWeight="semibold">Free Plan</Text>
        </FormControl>
      </Section>

      <Box display="flex" justifyContent="center">
        <Button leftIcon={<Icon as={FiLogOut} />} onClick={() => auth.logout({ returnTo: window.location.origin })}>
          Logout
        </Button>
      </Box>
    </BoxedPage>
  )
}

export default ProfilePage
