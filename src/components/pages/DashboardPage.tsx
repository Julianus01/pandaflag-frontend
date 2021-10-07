import { useAuth0 } from '@auth0/auth0-react'
import { Button, Heading, Input } from '@chakra-ui/react'
import BoxedPage from 'components/styles/BoxedPage'
import { useEffect, useState } from 'react'
import ProjectsApi, { IProject } from '../../api/ProjectsApi'

function DashboardPage() {
  const { logout } = useAuth0()
  const [projects, setProjects] = useState<IProject[]>([])

  useEffect(() => {
    async function getProducts() {
      const projects = await ProjectsApi.getProjects()
      setProjects(projects)
    }

    getProducts()
  }, [])

  return (
    <BoxedPage>
      <Heading as="h3" size="lg">
        Dashboard
      </Heading>

      <Button onClick={() => logout({ returnTo: window.location.origin })}>Logout</Button>

      <Input my={10} variant="outline" background="white" placeholder="Filled" />

      <h2>Projects</h2>

      {projects.map((project: IProject) => (
        <div key={project.name}>Name: {project.name}</div>
      ))}
    </BoxedPage>
  )
}

export default DashboardPage
