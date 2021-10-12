import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import { IFlag } from 'api/FlagsApi'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import FlagRow from './FlagRow'

interface IProps {
  flags: IFlag[]
}

function FlagsTable({ flags }: IProps) {
  return (
    <CustomTable variant="simple">
      <TableHead>
        <Tr>
          <Th textTransform="capitalize">Name</Th>
          <Th textTransform="capitalize">Active</Th>
          <Th textTransform="capitalize" isNumeric>
            Created at
          </Th>
          <Th />
        </Tr>
      </TableHead>

      <Tbody>
        {flags?.map((flag: IFlag) => (
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
