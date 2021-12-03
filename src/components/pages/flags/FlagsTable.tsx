import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import { IDbEnvironment } from 'api/EnvironmentsApi'
import { IFlag } from 'api/FlagsApi'
import EnvironmentsContext from 'context/EnvironmentsContext'
import { useContext } from 'react'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import FlagRow from './FlagRow'

interface IProps {
  flags: IFlag[]
}

function FlagsTable({ flags }: IProps) {
  const { data: environments } = useContext(EnvironmentsContext)

  return (
    <CustomTable size="md" variant="simple">
      <TableHead>
        <Tr>
          <Th width="100%" textTransform="capitalize">
            Name
          </Th>

          {environments?.map((environment: IDbEnvironment) => (
            <Th key={environment.id} isNumeric textTransform="lowercase">
              {environment.name}
            </Th>
          ))}

          <Th />
        </Tr>
      </TableHead>

      <Tbody>
        {flags.map((flag: IFlag) => (
          <FlagRow key={flag.id} flag={flag} />
        ))}
      </Tbody>
    </CustomTable>
  )
}

export default FlagsTable

const TableHead = styled(Thead)`
  background: ${({ theme }) => applyColorMode(theme.colors.gray[100], theme.colors.gray[900])(theme)};
`

const CustomTable = styled(Table)`
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[800])(theme)};
`
