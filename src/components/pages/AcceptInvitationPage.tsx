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
import InvitationApi, { IInvitation, InvitationStatus } from 'api/InvitationApi'
import { useParams } from 'react-router-dom'
import OrganizationsApi, { IOrganization } from 'api/OrganizationsApi'
import { FiMail, FiKey } from 'react-icons/fi'
import { ICredentials } from './LoginPage'
import * as yup from 'yup'
import AuthApi from 'api/AuthApi'
import { IMemberRelation, MemberType } from 'api/UsersApi'

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
  invitationId: string
}

function AcceptInvitationPage() {
  const params = useParams<IParams>()
  const temporaryMessage = useTemporaryMessage()
  const [form, setForm] = useState<ICredentials>(DefaultCredentials)
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false)

  const invitationQuery = useQuery(ApiQueryId.getInvitation, () => InvitationApi.getInvitation(params.invitationId), {
    onSuccess: (data: IInvitation) => {
      setForm({ ...form, email: data.email as string })
    },
  })

  const organizationQuery = useQuery(
    ApiQueryId.getOrganization,
    () => OrganizationsApi.getOrganizationById(invitationQuery.data?.organizationId as string),
    {
      enabled: Boolean(invitationQuery.data),
    }
  )

  const invitation = invitationQuery.data
  const organization = organizationQuery.data
  const isLoading = invitationQuery.isLoading || organizationQuery.isLoading

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

      const organizationWithNewMember = addMemberToOrganization(organization as IOrganization, {
        id: userCredential.user.uid,
        type: invitation?.memberType as MemberType,
      })

      await OrganizationsApi.updateOrganization(organizationWithNewMember)
      await InvitationApi.updateInvitation({ id: params.invitationId, status: InvitationStatus.complete })
      await AuthApi.sendVerificationEmail()
    } catch (err) {
      const error = err as Error
      temporaryMessage.showMessage(error.message)
      setIsRegisterLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Container>
        <Content>
          <EmptyContent>
            <Spinner />

            <Skeleton mt={2} height="24px" />
            <Skeleton mt={2} height="24px" />
            <Skeleton mt={2} height="24px" />
          </EmptyContent>
        </Content>
      </Container>
    )
  }

  return (
    <Container>
      <Content>
        <CreateBox>
          <Heading mb={2} as="h2" size="lg">
            {organization?.name}
          </Heading>

          <Text color="gray.500" mb={4}>
            invited you to join their organization as a{' '}
            <Tag size="md" borderRadius="md" variant="subtle" colorScheme="primary">
              <TagLabel textTransform="capitalize">{invitation?.memberType}</TagLabel>
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

          <Box display="flex">
            {!!temporaryMessage.message && (
              <Text flex="1" mr={4} color="red.500">
                {temporaryMessage.message}
              </Text>
            )}

            <Button
              isLoading={isRegisterLoading}
              disabled={isRegisterLoading}
              loadingText="Creating Account"
              onClick={onRegister}
              ml="auto"
              colorScheme="primary"
            >
              Create Account
            </Button>
          </Box>
        </CreateBox>
      </Content>
    </Container>
  )
}

export default AcceptInvitationPage

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const EmptyContent = styled.div`
  max-width: 500px;
  width: 100%;
`

const CreateBox = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
`
