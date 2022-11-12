import { Tbody, Th, Tr, Box } from '@chakra-ui/react'
import { IEnvironment } from 'api/EnvironmentsApi'
import Table from 'components/styles/Table'
import Thead from 'components/styles/Thead'
import EnvironmentRow from './EnvironmentRow'
import { useEnvironmentReorder } from './hooks/useEnvironmentReorder'

interface IProps {
  environments: IEnvironment[]
}

function EnvironmentTable({ environments }: IProps) {
  const environmentsReorder = useEnvironmentReorder()

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
            moveDown={() => environmentsReorder.moveLower(index)}
            moveUp={() => environmentsReorder.moveHigher(index)}
            key={environment.name}
            environment={environment}
          />
        ))}
      </Tbody>
    </Table>
  )
}

export default EnvironmentTable
