import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import ProjectsApi, { IProject } from '../../api/ProjectsApi'

function AppPage() {
  const [projects, setProjects] = useState<IProject[]>([])

  const { logout } = useAuth0()

  useEffect(() => {
    async function getProducts() {
      const projects = await ProjectsApi.getProjects()
      setProjects(projects)
    }

    getProducts()
  }, [])

  return (
    <div>
      Application Page
      <button onClick={() => logout()}>logout</button>
      <h2>Projects</h2>
      {projects.map((project: IProject) => (
        <div key={project.name}>Name: {project.name}</div>
      ))}
    </div>
  )
}

export default AppPage
