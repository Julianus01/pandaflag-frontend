import { Heading, HeadingProps } from '@chakra-ui/react'

function PandaflagLogo(props: HeadingProps) {
  return (
    <Heading fontWeight="semibold" as="h4" size="md" {...props}>
      pandaflag
    </Heading>
  )
}

export default PandaflagLogo
