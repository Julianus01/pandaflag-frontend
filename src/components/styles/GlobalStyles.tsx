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
          overflow-y: overlay;
          overflow-x: hidden;
        }

        * {
          ::-webkit-scrollbar {
            background-color: transparent;
            width: 6px;
          }

          ::-webkit-scrollbar-track {
            background-color: transparent;
          }

          ::-webkit-scrollbar-thumb {
            background-color: #babac0;
            border-radius: 16px;
            border: 4px solid #fff;
          }

          ::-webkit-scrollbar-button {
            display: none;
          }

          ::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0);
            border-radius: 16px;
            border: 5px solid transparent;
          }

          :hover::-webkit-scrollbar-thumb {
            background-color: #a0a0a5;
          }
        }
      `}
    />
  )
}

export default GlobalStyles
