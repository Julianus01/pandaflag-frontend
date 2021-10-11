import { useColorMode } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components/macro'
import theme from './theme'

interface IProps {
  children: ReactNode
}

function StyledThemeProvider({ children }: IProps) {
  const { colorMode } = useColorMode()

  return <ThemeProvider theme={{ ...theme, colorMode } as any}>{children}</ThemeProvider>
}

export default StyledThemeProvider

export function applyColorMode(lightValue: string, darkValue: string) {
  return function (theme: any) {
    if (theme.colorMode === 'light') {
      return lightValue
    }

    return darkValue
  }
}
