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
import { ChangeEvent, useState, KeyboardEvent } from 'react'
import { useTemporaryMessage } from 'hooks/common/useTemporaryMessage'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import { NavLink, Redirect, useParams } from 'react-router-dom'
import OrganizationsApi, { IOrganization } from 'api/OrganizationsApi'
import { FiMail, FiKey } from 'react-icons/fi'
import { ICredentials } from './LoginPage'
import * as yup from 'yup'
import AuthApi from 'api/AuthApi'
import { IMemberRelation, MemberType } from 'api/UsersApi'
import { UserCredential } from '@firebase/auth'
import ThemeButton from 'theme/ThemeButton'
import Section from 'components/styles/Section'
import RoutePage from 'components/routes/RoutePage'
import { PricingUtils } from 'utils/PricingUtils'

const Quota = PricingUtils.getQuota()

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

interface IParams {
  orgId: string
}

function AcceptInvitationRegisterPage() {
  const params = useParams<IParams>()
  const temporaryMessage = useTemporaryMessage()
  const [form, setForm] = useState<ICredentials>(DefaultCredentials)
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false)

  const organizationQuery = useQuery(
    ApiQueryId.getOrganizationForInvitation,
    () => OrganizationsApi.getOrganizationById(params.orgId),
    {
      enabled: Boolean(params.orgId),
    }
  )

  const organization = organizationQuery.data

  const isMembersQuotaReached = (organization?.members?.length as number) >= Quota.members

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

  async function updateOrganizationWithNewUser(userCredential: UserCredential) {
    const organizationWithNewMember = addMemberToOrganization(organization as IOrganization, {
      id: userCredential.user.uid,
      type: MemberType.member,
    })

    await OrganizationsApi.updateOrganization(organizationWithNewMember)
  }

  if (organizationQuery.isLoading) {
    return (
      <Container>
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

  if (!organization || isMembersQuotaReached) {
    return <Redirect to={RoutePage.notFound()} />
  }

  return (
    <Container>
      <Content>
        <ContentBox>
          <Heading mb={2} as="h2" size="lg">
            Create account in {organization?.name}
          </Heading>

          <Text color="gray.500" mb={4}>
            {organization?.name} invited you to join their organization as{' '}
            <Tag size="md" borderRadius="md" variant="subtle" colorScheme="primary">
              <TagLabel textTransform="capitalize">{MemberType.member}</TagLabel>
            </Tag>
          </Text>

          <InputGroup mb={4}>
            <InputLeftElement pointerEvents="none" children={<Icon as={FiMail} />} />

            <Input
              value={form.email}
              disabled={organizationQuery.isLoading}
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
              disabled={organizationQuery.isLoading}
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
