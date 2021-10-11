import { Global, css } from '@emotion/react'
import { Theme, useColorModeValue, useTheme } from '@chakra-ui/react'

function GlobalStyles() {
  const theme: Theme = useTheme()

  const bgColor = useColorModeValue(theme.colors.gray[50], theme.colors.gray[800])

  return (
    <Global
      styles={css`
        body {
          background: ${bgColor};
        }
      `}
    />
  )
}

export default GlobalStyles
