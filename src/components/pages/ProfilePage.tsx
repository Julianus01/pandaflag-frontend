import { Avatar, Heading, Box, Tag, TagLabel, FormControl, FormLabel, Text, Button } from '@chakra-ui/react'
import BoxedPage from 'components/styles/BoxedPage'
import Section from 'components/styles/Section'
import { useAuth } from 'hooks/authHooks'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'

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
            {auth.user?.name.substr(0, auth.user?.name.indexOf('@'))}
          </Heading>

          <Box>
            <Tag size="md" borderRadius="md" variant="subtle" colorScheme="green">
              <TagLabel>Free Plan</TagLabel>
            </Tag>
          </Box>
        </Box>
      </Box>

      <Section mb={4}>
        <FormControl mb={4} id="email">
          <FormLabel mb={1} fontSize="sm" color="gray.500">
            Email
          </FormLabel>

          <Text fontWeight="bold">{auth.user?.email}</Text>
        </FormControl>

        <FormControl id="password">
          <FormLabel fontSize="sm" color="gray.500">
            Password
          </FormLabel>

          <PasswordContainer>
            <Dot />
            <Dot />
            <Dot />
            <Dot />
            <Dot />
            <Dot />
            <Dot />
            <Dot />
            <Dot />
            <Dot />
          </PasswordContainer>
        </FormControl>
      </Section>

      <Section mb={8}>
        <FormControl id="subscription">
          <FormLabel mb={1} fontSize="sm" color="gray.500">
            Subscription
          </FormLabel>

          <Text fontWeight="bold">Free Plan</Text>
        </FormControl>
      </Section>

      <Box display="flex" justifyContent="center">
        <Button>Delete account</Button>
      </Box>
    </BoxedPage>
  )
}

export default ProfilePage

const Dot = styled(Box)`
  border-radius: 50%;
  width: 6px;
  height: 6px;
  background: ${({ theme }) => applyColorMode(theme.colors.gray[800], theme.colors.white)(theme)};
`

const PasswordContainer = styled.div`
  display: flex;

  ${Dot}:not(:last-child) {
    margin-right: ${({ theme }) => theme.space[1.5]};
  }
`
