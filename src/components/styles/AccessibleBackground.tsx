import { Box } from '@chakra-ui/layout'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'

const AccessibleBackground = styled(Box)`
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[900])(theme)};
`

export default AccessibleBackground
