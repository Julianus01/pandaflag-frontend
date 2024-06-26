import {
  Avatar,
  Heading,
  Box,
  Tag,
  TagLabel,
  FormControl,
  IconButton,
  FormLabel,
  Text,
  Button,
  Icon,
  useColorMode,
} from '@chakra-ui/react'
import { GoogleAuthProvider, EmailAuthProvider } from '@firebase/auth'
import AuthApi from 'api/AuthApi'
import UsersApi from 'api/UsersApi'
import BoxedPage from 'components/styles/BoxedPage'
import Section from 'components/styles/Section'
import { useCurrentUserMemberType } from 'hooks/userHooks'
import { FaGoogle } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import { IUser, authActions } from 'redux/ducks/authDuck'
import { IStoreState } from 'redux/store'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import ThemeButton from 'theme/ThemeButton'
import { UserUtils } from 'utils/UserUtils'
import ProfileChangePasswordButton from './profile/ProfileChangePasswordButton'

function userDisplayName(user: IUser) {
  if (user.displayName) {
    return user.displayName
  }

  const email = user.email as string
  return email.substr(0, email.indexOf('@'))
}

function userContainsProviderId(user: IUser, providerId: string) {
  let found = false

  user.providerData.forEach((providerData) => {
    if (providerData.providerId === providerId) {
      found = true
    }
  })

  return found
}

function ProfilePage() {
  const dispatch = useDispatch()
  const { colorMode } = useColorMode()
  const user = useSelector((state: IStoreState) => state.auth.user)
  const memberType = useCurrentUserMemberType()
  const hasGoogleProvider = userContainsProviderId(user as IUser, GoogleAuthProvider.PROVIDER_ID)
  const hasEmailProvider = userContainsProviderId(user as IUser, EmailAuthProvider.PROVIDER_ID)

  async function onConnectGoogleAccount() {
    const userCredential = await AuthApi.loginWithGoogleCredential()
    dispatch(authActions.authStateChanged(userCredential.user))
    UsersApi.updateUser(userCredential.user)
  }

  return (
    <BoxedPage>
      <Heading flex={1} mb={10} as="h3" size="lg">
        Profile
      </Heading>

      <Box mb={10} display="flex">
        <Avatar name={userDisplayName(user as IUser)} size="lg" shadow="lg" src={user?.photoURL as string} />

        <Box display="flex" flexDirection="column" justifyContent="center" ml={4}>
          <Heading mb={1} fontWeight="semibold" size="md">
            {userDisplayName(user as IUser)}
          </Heading>

          <Box>
            <Tag
              size="md"
              borderRadius="md"
              variant="subtle"
              colorScheme={UserUtils.getMemberTypeColorSchema(memberType)}
            >
              <TagLabel textTransform="capitalize">{memberType}</TagLabel>
            </Tag>
          </Box>
        </Box>
      </Box>

      <Section py="8" px="6" mb={4}>
        <FormControl mb={6} id="email">
          <FormLabel mb={1} fontSize="sm" color="gray.500">
            Email
          </FormLabel>

          <Text fontWeight="semibold">{user?.email}</Text>
        </FormControl>

        <Box mb={6} display="flex" alignItems="center">
          <Box flex={1}>
            <FormControl id="password">
              <FormLabel fontSize="sm" color="gray.500">
                Password
              </FormLabel>

              {hasEmailProvider ? (
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
              ) : (
                <Text fontWeight="semibold">Setup a password</Text>
              )}
            </FormControl>
          </Box>

          <ProfileChangePasswordButton hasEmailProvider={hasEmailProvider} />
        </Box>

        <Box display="flex" alignItems="center">
          <FormControl id="email">
            <FormLabel mb={1} fontSize="sm" color="gray.500">
              Google account
            </FormLabel>

            <Text fontWeight="semibold">{hasGoogleProvider ? 'Connected' : 'Not connected'}</Text>
          </FormControl>

          {!hasGoogleProvider && (
            <Box ml="auto">
              <Button leftIcon={<FaGoogle />} width="100%" onClick={onConnectGoogleAccount}>
                connect
              </Button>
            </Box>
          )}
        </Box>
      </Section>

      <Section py="8" px="6" mb={4}>
        <Heading as="h5" size="sm">
          Theme
        </Heading>

        <Box display="flex" alignItems="center">
          <Text color="gray.500">{colorMode === 'light' ? 'Light' : 'Dark'}</Text>

          <Box ml="auto">
            <IconButton aria-label="theme-button" icon={<ThemeButton />} />
          </Box>
        </Box>
      </Section>

      <Box display="flex" justifyContent="center">
        <Button leftIcon={<Icon as={FiLogOut} />} onClick={AuthApi.logout}>
          Logout
        </Button>
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
