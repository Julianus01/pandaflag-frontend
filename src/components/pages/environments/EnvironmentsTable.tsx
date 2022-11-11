import { Tbody, Th, Tr, Box } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import { IEnvironment } from 'api/EnvironmentsApi'
import Table from 'components/styles/Table'
import Thead from 'components/styles/Thead'
import { useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import EnvironmentUtils from 'utils/EnvironmentsUtils'
import EnvironmentRow from './EnvironmentRow'

function immutablySwapItems(items: IEnvironment[], firstIndex: number, secondIndex: number) {
  // Constant reference - we can still modify the array itself
  const results = items.slice()
  const firstItem = items[firstIndex]
  results[firstIndex] = items[secondIndex]
  results[secondIndex] = firstItem

  return results
}

interface IProps {
  environments: IEnvironment[]
}

function EnvironmentTable({ environments }: IProps) {
  const project = useSelector((state: IStoreState) => state.configuration.project)
  const queryClient = useQueryClient()

  function moveUp(index: number) {
    const newEnvironments = immutablySwapItems(environments, index, index - 1)
    queryClient.setQueryData([ApiQueryId.getEnvironments, project?.id], () => newEnvironments)
    EnvironmentUtils.saveEnvironmentsOrderToLs(project?.id as string, newEnvironments)
  }

  function moveDown(index: number) {
    const newEnvironments = immutablySwapItems(environments, index, index + 1)
    queryClient.setQueryData([ApiQueryId.getEnvironments, project?.id], () => newEnvironments)
    EnvironmentUtils.saveEnvironmentsOrderToLs(project?.id as string, newEnvironments)
  }

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th width="1%"></Th>

          <Th textTransform="capitalize">
            <Box>Name</Box>
          </Th>

          <Th textTransform="capitalize" isNumeric>
            Color
          </Th>

          <Th />
        </Tr>
      </Thead>

      <Tbody>
        {environments.map((environment: IEnvironment, index: number) => (
          <EnvironmentRow
            isFirst={index === 0}
            isLast={index === environments.length - 1}
            moveDown={() => moveDown(index)}
            moveUp={() => moveUp(index)}
            key={environment.name}
            environment={environment}
          />
        ))}
      </Tbody>
    </Table>
  )
}

export default EnvironmentTable
