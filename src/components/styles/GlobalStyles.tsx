import { Global, css } from '@emotion/react'
import { Theme, useTheme } from '@chakra-ui/react'

function GlobalStyles() {
  const theme: Theme = useTheme()

  return (
    <Global
      styles={css`
        body {
          background: ${theme.colors.gray[50]};
        }
      `}
    />
  )
}

export default GlobalStyles
