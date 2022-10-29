import { Box, Button, Heading, Input, Text, useToast } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi from 'api/ProjectsApi'
import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import AuthApi from 'api/AuthApi'
import ThemeButton from 'theme/ThemeButton'
import Section from 'components/styles/Section'

function CreateFirstProjectPage() {
  const queryClient = useQueryClient()
  const toast = useToast()

  const [projectName, setProjectName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const createProjectMutation = useMutation(ProjectsApi.createProject)

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
    createProjectMutation.mutate(projectName, {
      onSuccess: () => {
        queryClient.invalidateQueries(ApiQueryId.getProjectsByOrganizationId)

        toast({
          title: `Created project '${projectName}' 📦`,
          isClosable: true,
          variant: 'subtle',
        })
      },
    })
  }

  return (
    <Container>
      <Content>
        <ContentBox>
          <Heading mb={2} as="h4" size="md">
            Create your first project 📦
          </Heading>

          <Text color="gray.500" mb={4}>
            You can have multiple projects, create your first one
          </Text>

          <Input
            onKeyDown={onKeyDown}
            value={projectName}
            onChange={onProjectNameChange}
            mb={4}
            variant="filled"
            placeholder="Ex: Instagram, Uber, Twitter..."
          />

          <Button
            onClick={createProject}
            loadingText="Creating Project"
            disabled={projectName.length < 3 || isLoading}
            ml="auto"
            colorScheme="primary"
            isLoading={isLoading}
          >
            Create Project
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

export default CreateFirstProjectPage

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
