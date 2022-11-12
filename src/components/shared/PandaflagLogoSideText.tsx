import { Image, useColorModeValue } from '@chakra-ui/react'
import { ImageProps } from '@chakra-ui/react'
import logoLightSvg from 'assets/logo/logo-side-text-md.svg'
import logoDarkSvg from 'assets/logo/logo-side-text-md-dark.svg'

function PandaflagLogoSideText({ height = '30px', ...restProps }: ImageProps) {
  const logoSvg = useColorModeValue(logoLightSvg, logoDarkSvg)

  return <Image height={height} src={logoSvg} alt="logo-side-text" {...restProps} />
}

export default PandaflagLogoSideText
