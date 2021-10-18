import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const fonts = {
  heading: 'Inter, sans-serif',
  body: 'Inter, sans-serif'
}

const theme = extendTheme({ config, fonts })
export default theme
