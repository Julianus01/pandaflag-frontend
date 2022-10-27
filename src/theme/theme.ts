import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const fonts = {
  heading: 'Inter, sans-serif',
  body: 'Inter, sans-serif',
}

const components = {
  Button: {
    defaultProps: {
      size: 'sm',
    },
  },
}

const colors = {
  blackAndWhite: {
    // 50: '#f2f2f2',
    // 100: '#d9d9d9',
    200: '#ffffff',
    300: '#ffffff',
    // 400: '#8c8c8c',
    500: '#0d0d0d',
    600: '#0d0d0d',
    700: '#404040',
    // 800: '#262626',
    // 900: '#0d0d0d',
  },
}

const theme = extendTheme({ config, fonts, components, colors })
export default theme
