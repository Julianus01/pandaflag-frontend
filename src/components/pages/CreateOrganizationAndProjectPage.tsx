import { Button, FormControl, FormLabel, Heading, Input, Text } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi from 'api/ProjectsApi'
import { useAuth } from 'hooks/auth/useAuth'
import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import Section from 'components/styles/Section'
import OrganizationsApi, { IOrganization } from 'api/OrganizationsApi'
import { useDispatch } from 'react-redux'
import { configurationActions } from 'redux/ducks/configurationDuck'

function CreateOrganizationAndProjectPage() {
  const dispatch = useDispatch()
  const { logout } = useAuth()
  const queryClient = useQueryClient()

  const [projectName, setProjectName] = useState<string>('')
  const [organizationName, setOrganizationName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const creationDisabled = projectName.length < 3 || organizationName.length < 3 || isLoading

  const createOrganizationMutation = useMutation(OrganizationsApi.createOrganization)

  const createProjectMutation = useMutation(ProjectsApi.createProject, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getProjects)
    },
  })

  function onProjectNameChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value

    if (value.length > 40) {
      return
    }

    setProjectName(value)
  }

  function onOrganizationNameChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value

    if (value.length > 40) {
      return
    }

    setOrganizationName(value)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && !creationDisabled) {
      createOrganizationAndProject()
    }
  }

  function createOrganizationAndProject() {
    setIsLoading(true)

    createOrganizationMutation.mutate(organizationName, {
      onSuccess: (organization: IOrganization) => {
        dispatch(configurationActions.setOrganization(organization))
        createProjectMutation.mutate(projectName)
      },
    })
  }

  return (
    <Container>
      <Content>
        <CreateBox>
          <Heading mb={2} as="h4" size="md">
            Your organization, your projects
          </Heading>

          <Text color="gray.500" mb={4}>
            Under your organization, you can create projects and feature flags
          </Text>

          <Section mb={4}>
            <FormControl id="subscription">
              <FormLabel mb={1} fontSize="sm" color="gray.500">
                Organization
              </FormLabel>

              <Input
                onKeyDown={onKeyDown}
                value={organizationName}
                onChange={onOrganizationNameChange}
                variant="filled"
                placeholder="Tesla or Personal"
              />
            </FormControl>
          </Section>

          <Section mb={4}>
            <FormControl id="subscription">
              <FormLabel mb={1} fontSize="sm" color="gray.500">
                Project
              </FormLabel>

              <Input
                onKeyDown={onKeyDown}
                value={projectName}
                onChange={onProjectNameChange}
                variant="filled"
                placeholder="Electric Car"
              />
            </FormControl>
          </Section>

          <Button
            onClick={createOrganizationAndProject}
            loadingText="Creating"
            disabled={creationDisabled}
            mx="auto"
            colorScheme="blue"
            isLoading={isLoading}
          >
            Create
          </Button>
        </CreateBox>
      </Content>

      <Button onClick={() => logout({ returnTo: window.location.origin })} mb={6} variant="ghost" mx="auto">
        Logout
      </Button>
    </Container>
  )
}

export default CreateOrganizationAndProjectPage

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
