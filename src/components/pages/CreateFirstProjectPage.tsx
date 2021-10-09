import { Button, Heading, Input, Text } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { ICreateProjectRequestParams } from 'api/ProjectsApi'
import { useAuth } from 'hooks/authHooks'
import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'

function CreateFirstProjectPage() {
  const { user, logout } = useAuth()
  const queryClient = useQueryClient()

  const [projectName, setProjectName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const createProjectMutation = useMutation(
    (params: ICreateProjectRequestParams) => ProjectsApi.createProject(params),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(ApiQueryId.getProjects)
      },
    }
  )

  function onProjectNameChange(event: ChangeEvent<HTMLInputElement>) {
    setProjectName(event.target.value)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      createProject()
    }
  }

  function createProject() {
    setIsLoading(true)
    createProjectMutation.mutate({ creatorId: user?.id as string, name: projectName })
  }

  return (
    <Container>
      <Content>
        <CreateBox>
          <Heading mb={1} as="h4" size="md">
            Hey {user?.name}
          </Heading>

          <Text mb={4} color="gray.500">
            Create your first project
          </Text>

          <Input
            onKeyDown={onKeyDown}
            value={projectName}
            onChange={onProjectNameChange}
            mb={4}
            variant="filled"
            placeholder="Project Name"
          />

          <Button
            onClick={createProject}
            loadingText="Creating"
            disabled={projectName.length < 3 || isLoading}
            ml="auto"
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

export default CreateFirstProjectPage

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
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: ${({ theme }) => `1px solid ${theme.colors.gray[300]}`};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[10]};
  background: ${({ theme }) => theme.colors.white};
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
`
