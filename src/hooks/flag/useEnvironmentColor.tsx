import { IEnvironment } from 'api/ProjectsApi'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

function useFlagEnvironment(name: string | undefined): IEnvironment | undefined {
  const project = useSelector((state: IStoreState) => state.configuration.project)

  if (!name) {
    return undefined
  }

  return project?.environments.find((environment: IEnvironment) => environment.name === name)
}

export default useFlagEnvironment
