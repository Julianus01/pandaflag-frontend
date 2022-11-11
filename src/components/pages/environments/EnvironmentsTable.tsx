import { Tbody, Th, Tr, Box } from '@chakra-ui/react'
import { IEnvironment } from 'api/EnvironmentsApi'
import Table from 'components/styles/Table'
import Thead from 'components/styles/Thead'
import EnvironmentRow from './EnvironmentRow'

interface IProps {
  environments: IEnvironment[]
}

function EnvironmentTable({ environments }: IProps) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th width="100%" textTransform="capitalize">
            <Box>Name</Box>
          </Th>

          <Th textTransform="capitalize" isNumeric>
            Color
          </Th>

          <Th />
        </Tr>
      </Thead>

      <Tbody>
        {environments.map((environment: IEnvironment) => (
          <EnvironmentRow key={environment.name} environment={environment} />
        ))}
      </Tbody>
    </Table>
  )
}

export default EnvironmentTable
