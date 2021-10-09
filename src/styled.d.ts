import 'styled-components';
import { Theme as ChakraTheme } from '@chakra-ui/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends ChakraTheme { }
}