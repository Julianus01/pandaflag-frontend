import { Heading, Input } from '@chakra-ui/react'
import BoxedPage from 'components/styles/BoxedPage'
import CommonUtils from 'utils/CommonUtils'

function DashboardPage() {
  return (
    <BoxedPage>
      <Heading as="h3" size="lg">
        Dashboard
      </Heading>

      <Input
        onKeyDown={CommonUtils.stopPropagation}
        my={10}
        variant="outline"
        background="white"
        placeholder="Filled"
      />
    </BoxedPage>
  )
}

export default DashboardPage
