import { Heading, HeadingProps } from '@chakra-ui/react'

function getTitle() {
  if (process.env.NODE_ENV === 'development') {
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
