import { Box } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'

const TableContainer = styled(Box)`
  overflow: hidden;
  overflow-x: auto;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: ${({ theme }) => `1px solid ${applyColorMode(theme.colors.gray[200], theme.colors.whiteAlpha[200])(theme)}`};
`

export default TableContainer
