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
  // Blue
  primary: {
    50: '#EBF8FF',
    100: '#BEE3F8',
    200: '#90CDF4',
    300: '#63B3ED',
    400: '#4299E1',
    500: '#3182CE',
    600: '#2B6CB0',
    700: '#2C5282',
    800: '#2A4365',
    900: '#1A365D',
  },

  // Teal
  // primary: {
  //   50: '#E6FFFA',
  //   100: '#B2F5EA',
  //   200: '#81E6D9',
  //   300: '#4FD1C5',
  //   400: '#38B2AC',
  //   500: '#319795',
  //   600: '#2C7A7B',
  //   700: '#285E61',
  //   800: '#234E52',
  //   900: '#1D4044',
  // },

  // Attempt for black and white
  // primary: {
  //   50: '#f2f2f2',
  //   100: '#d9d9d9',
  //   200: '#ffffff',
  //   300: '#ffffff',
  //   400: '#8c8c8c',
  //   500: '#0d0d0d',
  //   600: '#0d0d0d',
  //   700: '#404040',
  //   800: '#262626',
  //   900: '#0d0d0d',
  // },
}

const theme = extendTheme({ config, fonts, components, colors })
export default theme
