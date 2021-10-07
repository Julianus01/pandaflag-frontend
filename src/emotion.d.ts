import '@emotion/react';
import { Theme as ChakraTheme } from '@chakra-ui/theme'

declare module '@emotion/react' {
  export interface Theme extends ChakraTheme { }
}