import { useAuth0 } from '@auth0/auth0-react'
import { Button, Heading } from '@chakra-ui/react'
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
    <div>
      <Heading as="h1" size="4xl">
        Dashboard Page
      </Heading>

      <Button onClick={() => logout({ returnTo: window.location.origin })}>Logout</Button>

      <h2>Projects</h2>
      {projects.map((project: IProject) => (
        <div key={project.name}>Name: {project.name}</div>
      ))}
    </div>
  )
}

export default DashboardPage
