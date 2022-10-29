import { Tbody, Th, Tr, Box } from '@chakra-ui/react'
import { IEnvironment } from 'api/EnvironmentsApi'
import Table from 'components/styles/Table'
import Thead from 'components/styles/Thead'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import EnvironmentRow from './EnvironmentRow'

interface IProps {
  environments: IEnvironment[]
}

function EnvironmentTable({ environments }: IProps) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th textTransform="capitalize">
            <Box>Name</Box>
          </Th>

          <Th textTransform="capitalize" isNumeric>
            Color
          </Th>
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
