import { Thead } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'

const TableHead = styled(Thead)`
  background: ${({ theme }) => applyColorMode(theme.colors.gray[100], '#12141c')(theme)};
`

export default TableHead
