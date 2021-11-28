import { Heading, HeadingProps } from '@chakra-ui/react'
import { NodeEnvironment } from 'utils/CommonUtils'

function getTitle() {
  switch (process.env.REACT_APP_STAGE) {
    case NodeEnvironment.production:
      return 'pandaflag'

    case NodeEnvironment.development:
      return 'pandaflag DEV'

    default:
      return 'pandaflag ENV'
  }
}

function PandaflagLogo(props: HeadingProps) {
  return (
    <Heading fontWeight="semibold" as="h4" size="md" {...props}>
      {getTitle()}
    </Heading>
  )
}

export default PandaflagLogo
