import { useAuth0 } from '@auth0/auth0-react'
import { Button, Heading, Input } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import BoxedPage from 'components/styles/BoxedPage'
import { useQuery } from 'react-query'
import CommonUtils from 'utils/CommonUtils'
import ProjectsApi, { IProject } from '../../api/ProjectsApi'

function DashboardPage() {
  const { logout } = useAuth0()
  const { data: projects } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  return (
    <BoxedPage>
      <Heading as="h3" size="lg">
        Dashboard
      </Heading>

      <Button onClick={() => logout({ returnTo: window.location.origin })}>Logout</Button>

      <Input
        onKeyDown={CommonUtils.stopPropagation}
        my={10}
        variant="outline"
        background="white"
        placeholder="Filled"
      />

      <h2>Projects</h2>

      {projects?.map((project: IProject) => (
        <div key={project.name}>Name: {project.name}</div>
      ))}
    </BoxedPage>
  )
}

export default DashboardPage
