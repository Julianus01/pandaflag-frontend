import {
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Box,
} from '@chakra-ui/react'
import { IEnvironment } from 'api/ProjectsApi'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import EnvironmentRow from './EnvironmentRow'

interface IProps {
  environments: IEnvironment[]
}

function EnvironmentTable({ environments }: IProps) {
  return (
    <CustomTable variant="simple">
      <TableHead>
        <Tr>
          <Th textTransform="capitalize">
            <Box>Name</Box>
          </Th>

          <Th textTransform="capitalize" isNumeric>
            Color
          </Th>
        </Tr>
      </TableHead>

      <Tbody>
        {environments.map((environment: IEnvironment) => (
          <EnvironmentRow key={environment.name} environment={environment} />
        ))}
      </Tbody>
    </CustomTable>
  )
}

export default EnvironmentTable

const TableHead = styled(Thead)`
  background: ${({ theme }) => applyColorMode(theme.colors.gray[100], theme.colors.gray[900])(theme)};
`

const CustomTable = styled(Table)`
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[800])(theme)};
`
