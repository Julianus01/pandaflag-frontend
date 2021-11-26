import { Heading, HeadingProps } from '@chakra-ui/react'

function getTitle() {
  if (process.env.REACT_APP_STAGE === 'development') {
    return 'pandaflag DEV'
  }
  
  return 'pandaflag'
}

function PandaflagLogo(props: HeadingProps) {
  return (
    <Heading fontWeight="semibold" as="h4" size="md" {...props}>
      {getTitle()}
    </Heading>
  )
}

export default PandaflagLogo
