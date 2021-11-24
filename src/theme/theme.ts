import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const fonts = {
  heading: 'Manrope, sans-serif',
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
  blue: {
    50: '#80aff9',
   100: '#669ef8',
   200: '#4d8ef7',
   300: '#337ef5',
   400: '#1a6ef4',
   500: '#005ef3',
   
   600: '#0055db',
   700: '#004bc2',
   800: '#0042aa',
   900: '#003892',
  }
}

const theme = extendTheme({ config, fonts, components, colors })
export default theme
