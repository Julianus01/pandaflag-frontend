import { Button, Heading, Input } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi from 'api/ProjectsApi'
import { useAuth } from 'hooks/auth/useAuth'
import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { applyColorMode } from 'theme/StyledThemeProvider'

function CreateFirstProjectPage() {
  const { logout } = useAuth()
  const queryClient = useQueryClient()

  const [projectName, setProjectName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      createProject()
    }
  }

  function createProject() {
    setIsLoading(true)
    createProjectMutation.mutate(projectName)
  }

  return (
    <Container>
      <Content>
        <CreateBox>
          <Heading mb={4} as="h4" size="md">
            Create your first project
          </Heading>

          <Input
            onKeyDown={onKeyDown}
            value={projectName}
            onChange={onProjectNameChange}
            mb={4}
            variant="filled"
            placeholder="Ex: Flags Investigator"
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
  /* box-shadow: ${({ theme }) => theme.shadows.lg}; */
  /* border: ${({ theme }) =>
    `1px solid ${applyColorMode(theme.colors.gray[300], theme.colors.whiteAlpha[200])(theme)}`}; */
  /* border-radius: ${({ theme }) => theme.radii.lg}; */
  /* padding: ${({ theme }) => theme.space[10]}; */
  /* background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[700])(theme)}; */
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
`
