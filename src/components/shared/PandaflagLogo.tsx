import { Image, useColorModeValue } from '@chakra-ui/react'
import { ImageProps } from '@chakra-ui/react'
import logoLightSvg from 'assets/logo/logo.svg'
import logoDarkSvg from 'assets/logo/logo-dark.svg'

function PandaflagLogo({ height = '30px', ...restProps }: ImageProps) {
  const logoSvg = useColorModeValue(logoLightSvg, logoDarkSvg)

  return <Image height={height} src={logoSvg} alt="logo" {...restProps} />
}

export default PandaflagLogo
