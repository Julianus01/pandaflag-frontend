import { Table } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'

const TableWithBackground = styled(Table)`
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[900])(theme)};
`

export default TableWithBackground
