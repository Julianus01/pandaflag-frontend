import { Button, Heading, Input, Text, useToast } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import OrganizationsApi, { IOrganization } from 'api/OrganizationsApi'
import { useDispatch } from 'react-redux'
import { configurationActions } from 'redux/ducks/configurationDuck'
import AuthApi from 'api/AuthApi'
import { ApiQueryId } from 'api/ApiQueryId'

function CreateOrganizationPage() {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const toast = useToast()
  const [organizationName, setOrganizationName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const creationDisabled = organizationName.length < 3 || isLoading

  const createOrganizationMutation = useMutation(OrganizationsApi.createOrganization)

  function onOrganizationNameChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value

    if (value.length > 40) {
      return
    }

    setOrganizationName(value)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && !creationDisabled) {
      createOrganization()
    }
  }

  function createOrganization() {
    setIsLoading(true)

    createOrganizationMutation.mutate(organizationName, {
      onSuccess: (organization: IOrganization) => {
        dispatch(configurationActions.setOrganization(organization))
        queryClient.invalidateQueries(ApiQueryId.getOrganization)

        toast({
          title: `Created organization '${organizationName}'`,
          position: 'top-right',
          isClosable: true,
          variant: 'subtle',
        })
      },
    })
  }

  return (
    <Container>
      <Content>
        <CreateBox>
          <Heading mb={2} as="h4" size="md">
            Your organization
          </Heading>

          <Text color="gray.500" mb={4}>
            Under your organization, you can create projects and flags
          </Text>

          <Input
            mb={4}
            onKeyDown={onKeyDown}
            value={organizationName}
            onChange={onOrganizationNameChange}
            variant="filled"
            placeholder="Tesla or Personal"
          />

          <Button
            onClick={createOrganization}
            loadingText="Creating Organization"
            disabled={creationDisabled}
            ml="auto"
            colorScheme="blue"
            isLoading={isLoading}
          >
            Create Organization
          </Button>
        </CreateBox>
      </Content>

      <Button onClick={AuthApi.logout} mb={6} variant="ghost" mx="auto">
        Logout
      </Button>
    </Container>
  )
}

export default CreateOrganizationPage

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

const CreateBox = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
`
