import { useAuth0 } from '@auth0/auth0-react'
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
      <p>Dashboard Page</p>
      <button onClick={() => logout({ returnTo: window.location.origin })}>logout</button>

      <h2>Projects</h2>
      {projects.map((project: IProject) => (
        <div key={project.name}>Name: {project.name}</div>
      ))}
    </div>
  )
}

export default DashboardPage
