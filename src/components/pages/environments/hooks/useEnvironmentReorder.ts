import { ApiQueryId } from 'api/ApiQueryId'
import { IDbEnvironment } from 'api/EnvironmentsApi'
import EnvironmentsContext from 'context/EnvironmentsContext'
import { useContext } from 'react'
import { useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import EnvironmentUtils from 'utils/EnvironmentsUtils'

function immutablySwapItems(items: IDbEnvironment[], firstIndex: number, secondIndex: number) {
  // Constant reference - we can still modify the array itself
  const results = items.slice()
  const firstItem = items[firstIndex]
  results[firstIndex] = items[secondIndex]
  results[secondIndex] = firstItem

  return results
}

export function useEnvironmentReorder() {
  const queryClient = useQueryClient()
  const project = useSelector((state: IStoreState) => state.configuration.project)
  const { data: environments } = useContext(EnvironmentsContext)

  function isFirst(index: number) {
    return index === 0
  }

  function isLast(index: number) {
    return index === (environments as IDbEnvironment[]).length - 1
  }

  function moveHigher(index: number) {
    const newEnvironments = immutablySwapItems(environments as IDbEnvironment[], index, index - 1)
    queryClient.setQueryData([ApiQueryId.getEnvironments, project?.id], () => newEnvironments)
    EnvironmentUtils.saveEnvironmentsOrderToLs(project?.id as string, newEnvironments)
  }

  function moveLower(index: number) {
    const newEnvironments = immutablySwapItems(environments as IDbEnvironment[], index, index + 1)
    queryClient.setQueryData([ApiQueryId.getEnvironments, project?.id], () => newEnvironments)
    EnvironmentUtils.saveEnvironmentsOrderToLs(project?.id as string, newEnvironments)
  }

  return { environments, moveHigher, moveLower, isFirst, isLast }
}
