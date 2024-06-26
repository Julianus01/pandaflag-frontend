import {
  Button,
  Heading,
  Input,
  Text,
  Box,
  Spinner,
  Skeleton,
  Tag,
  TagLabel,
  InputGroup,
  InputLeftElement,
  Icon,
} from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { ChangeEvent, useState, KeyboardEvent, useEffect } from 'react'
import { useTemporaryMessage } from 'hooks/common/useTemporaryMessage'
import { NavLink, Redirect, useHistory, useParams } from 'react-router-dom'
import OrganizationsApi, { IOrganization } from 'api/OrganizationsApi'
import { FiMail, FiKey } from 'react-icons/fi'
import { ICredentials } from './LoginPage'
import * as yup from 'yup'
import AuthApi from 'api/AuthApi'
import UsersApi, { IMemberRelation, MemberType } from 'api/UsersApi'
import { UserCredential } from '@firebase/auth'
import PandaflagLogoSideText from 'components/shared/PandaflagLogoSideText'
import ThemeButton from 'theme/ThemeButton'
import Section from 'components/styles/Section'
import RoutePage from 'components/routes/RoutePage'
import { FaGoogle } from 'react-icons/fa'
import store from 'redux/store'
import { useQuery, useQueryClient } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'

function addMemberToOrganization(organization: IOrganization, memberRelation: IMemberRelation): IOrganization {
  return { ...organization, members: [...organization.members, memberRelation] } as IOrganization
}

const DefaultCredentials: ICredentials = {
  email: '',
  password: '',
}

const ValidationSchema = yup.object().shape({
  Password: yup.string().min(6).required(),
  Email: yup.string().email().required(),
})

// Use old api instead of react-query because this route needs to be logged out
// in order for "continue with google" to work
// For google, we need to login the user to get credentials, then based on them,
// continue and update organization with new member or logout
// When logging out, we have queryClient.resetQueries() in App.tsx
// Which resets the query and
function useOrganizationById(orgId: string) {
  const [organization, setOrganization] = useState<IOrganization | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function getOrganization() {
      setIsLoading(true)
      const data = await OrganizationsApi.getOrganizationById(orgId)

      setOrganization(data)
      setIsLoading(false)
    }

    getOrganization()
  }, [orgId])

  return { organization, isLoading }
}

interface IParams {
  orgId: string
}

function AcceptInvitationRegisterPage() {
  const history = useHistory()
  const params = useParams<IParams>()
  const temporaryMessage = useTemporaryMessage()
  const queryClient = useQueryClient()
  const [form, setForm] = useState<ICredentials>(DefaultCredentials)
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
  const { organization, isLoading } = useOrganizationById(params.orgId)

  const canInviteMemberQuery = useQuery(
    ApiQueryId.canInviteMember,
    () => OrganizationsApi.canInviteMember(params.orgId),
    { enabled: !!params.orgId }
  )

  // Log user out for this page
  useEffect(() => {
    const user = store.getState().auth.user

    if (user) {
      AuthApi.logout()
    }
  }, [])

  function onInputChange(inputName: string) {
    return function (event: ChangeEvent<HTMLInputElement>) {
      setForm({ ...form, [inputName]: event.target.value })
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onRegister()
    }
  }

  async function onRegister() {
    try {
      temporaryMessage.hideMessage()
      const validatedForm = await ValidationSchema.validate({
        Email: form.email,
        Password: form.password,
      })

      setIsRegisterLoading(true)
      const userCredential = await AuthApi.createAccountWithEmailAndPassword(
        validatedForm.Email,
        validatedForm.Password
      )

      await updateOrganizationWithNewUser(userCredential)
      await AuthApi.sendVerificationEmail()
    } catch (err) {
      const error = err as Error
      temporaryMessage.showMessage(error.message)
      setIsRegisterLoading(false)
    }
  }

  async function onLoginWithGoogleCredential() {
    try {
      setIsGoogleLoading(true)
      temporaryMessage.hideMessage()
      const userCredential = await AuthApi.loginWithGoogleCredential()

      const userHasOrganization = await UsersApi.doesUserHaveOrganization(userCredential.user.email as string)

      if (userHasOrganization) {
        AuthApi.logout()
        setIsGoogleLoading(false)
        temporaryMessage.showMessage(
          'This account is already part of an organization. Leave that organization in order to join this one'
        )

        return
      }

      await updateOrganizationWithNewUser(userCredential)

      // Reset getOrganization so that 'isLoading' from OrganizationRoute
      // triggers, and the UI doesn't flinch with wrong screen
      queryClient.resetQueries(ApiQueryId.getOrganization)
      history.push(RoutePage.members())
    } catch (err) {
      const error = err as Error
      temporaryMessage.showMessage(error.message)
      setIsGoogleLoading(false)
    }
  }

  async function updateOrganizationWithNewUser(userCredential: UserCredential) {
    const organizationWithNewMember = addMemberToOrganization(organization as IOrganization, {
      id: userCredential.user.uid,
      type: MemberType.member,
    })

    await OrganizationsApi.updateOrganization(organizationWithNewMember)
  }

  if (canInviteMemberQuery.isLoading || isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center">
          <a href={process.env.REACT_APP_PANDAFLAG_APP_URL as string}>
            <PandaflagLogoSideText mx="auto" mt={6} />
          </a>
        </Box>

        <Content>
          <ContentBox>
            <Spinner mb={6} />

            <Skeleton mt={2} height="24px" />
            <Skeleton mt={2} height="24px" />
            <Skeleton mt={2} height="24px" />
          </ContentBox>
        </Content>
      </Container>
    )
  }

  if (!canInviteMemberQuery.data?.canInvite || !organization) {
    return <Redirect to={RoutePage.notFound()} />
  }

  return (
    <Container>
      <Box display="flex" justifyContent="center">
        <a href={process.env.REACT_APP_PANDAFLAG_APP_URL as string}>
          <PandaflagLogoSideText mx="auto" mt={6} />
        </a>
      </Box>

      <Content>
        <ContentBox>
          <Heading mb={2} as="h2" size="lg">
            Create account in {organization?.name}
          </Heading>

          <Text color="gray.500" mb={4}>
            {organization?.name} invited you to join their organization as{' '}
            <Tag size="md" borderRadius="md" variant="subtle" colorScheme="blue">
              <TagLabel textTransform="capitalize">{MemberType.member}</TagLabel>
            </Tag>
          </Text>

          <InputGroup mb={4}>
            <InputLeftElement pointerEvents="none" children={<Icon as={FiMail} />} />

            <Input
              value={form.email}
              disabled={isLoading}
              onKeyDown={onKeyDown}
              onChange={onInputChange('email')}
              variant="filled"
              placeholder="Email"
            />
          </InputGroup>

          <InputGroup mb={4}>
            <InputLeftElement pointerEvents="none" children={<Icon as={FiKey} />} />

            <Input
              value={form.password}
              disabled={isLoading}
              onKeyDown={onKeyDown}
              onChange={onInputChange('password')}
              variant="filled"
              type="password"
              placeholder="Password"
            />
          </InputGroup>

          <Button
            ml="auto"
            isLoading={isRegisterLoading}
            disabled={isRegisterLoading}
            loadingText="Create Account & Join"
            onClick={onRegister}
            colorScheme="primary"
          >
            Create Account & Join
          </Button>

          {!!temporaryMessage.message && (
            <Text flex="1" mt={4} color="red.500">
              {temporaryMessage.message}
            </Text>
          )}
        </ContentBox>
      </Content>

      <Box mt={6} mx="auto">
        <Button
          isLoading={isGoogleLoading}
          disabled={isRegisterLoading}
          leftIcon={<FaGoogle />}
          width="100%"
          onClick={onLoginWithGoogleCredential}
        >
          continue with Google
        </Button>
      </Box>

      <Text mt={24} mx="auto" color="gray.500">
        Already a member? <LoginLink to={RoutePage.acceptInvitationLogin(params.orgId)}>Log in</LoginLink>
      </Text>

      <Box mx="auto" mt={4}>
        <ThemeButton />
      </Box>
    </Container>
  )
}

export default AcceptInvitationRegisterPage

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  margin-top: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ContentBox = styled(Section).attrs({ py: 10, px: 12 })`
  display: flex;
  flex-direction: column;
  max-width: 550px;
  width: 100%;
`

const LoginLink = styled(NavLink)`
  color: ${({ theme }) => theme.colors.blue[500]};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }
`
