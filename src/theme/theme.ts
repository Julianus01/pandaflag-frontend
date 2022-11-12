import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const fonts = {
  heading: 'Inter, sans-serif',
  body: 'Inter, sans-serif',

  // heading: 'Poppins, sans-serif',
  // body: 'Poppins, sans-serif',
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
  // primary: {
  //   50: '#EBF8FF',
  //   100: '#BEE3F8',
  //   200: '#90CDF4',
  //   300: '#63B3ED',
  //   400: '#4299E1',
  //   500: '#3182CE',
  //   600: '#2B6CB0',
  //   700: '#2C5282',
  //   800: '#2A4365',
  //   900: '#1A365D',
  // },

  // Gray
  primary: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#231F20',
    600: '#231F20',
    700: '#2D3748',
    800: '#1A202C',
    900: '#231F20',
  },

  // Attempt for black and white
  // #231F20
  // primary: {
  //   50: '#f2f2f2',
  //   100: '#d9d9d9',
  //   200: '#ffffff',
  //   300: '#ffffff',
  //   400: '#8c8c8c',
  //   500: '#231F20',
  //   600: '#231F20',
  //   700: '#404040',
  //   800: '#262626',
  //   900: '#231F20',
  // },
}

const theme = extendTheme({ config, fonts, components, colors })
export default theme
