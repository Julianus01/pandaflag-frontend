import { Box, Button, Heading, Input, Text, useToast } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { useMutation } from 'react-query'
import OrganizationsApi, { IOrganization } from 'api/OrganizationsApi'
import { useDispatch } from 'react-redux'
import { configurationActions } from 'redux/ducks/configurationDuck'
import AuthApi from 'api/AuthApi'
import ThemeButton from 'theme/ThemeButton'
import Section from 'components/styles/Section'
import PandaflagLogo from 'components/shared/PandaflagLogo'

function CreateOrganizationPage() {
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

        toast({
          title: `Created organization '${organizationName}' 🏢`,
          isClosable: true,
          variant: 'subtle',
        })
      },
    })
  }

  return (
    <Container>
      <Box display="flex" justifyContent="center">
        <a href={process.env.REACT_APP_PANDAFLAG_APP_URL as string}>
          <PandaflagLogo mx="auto" mt={6} />
        </a>
      </Box>

      <Content>
        <ContentBox>
          <Heading mb={2} as="h4" size="md">
            Your organization 🏢
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
            placeholder="Ex: Tesla, Netflix, Startup"
          />

          <Button
            onClick={createOrganization}
            loadingText="Creating Organization"
            disabled={creationDisabled}
            ml="auto"
            colorScheme="primary"
            isLoading={isLoading}
          >
            Create Organization
          </Button>
        </ContentBox>
      </Content>

      <Button onClick={AuthApi.logout} mt={24} variant="ghost" mx="auto">
        Logout
      </Button>

      <Box mx="auto" mt={6}>
        <ThemeButton />
      </Box>
    </Container>
  )
}

export default CreateOrganizationPage

const Container = styled.div`
  margin-top: 20vh;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
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
