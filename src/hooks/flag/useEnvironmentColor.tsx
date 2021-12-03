import { IEnvironment } from 'api/EnvironmentsApi'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

function useFlagEnvironment(name: string | undefined): IEnvironment | undefined {
  const project = useSelector((state: IStoreState) => state.configuration.project)

  if (!name) {
    return undefined
  }

  // TODO:
  return undefined
}

export default useFlagEnvironment
