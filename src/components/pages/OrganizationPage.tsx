import { Heading } from '@chakra-ui/react'
import BoxedPage from 'components/styles/BoxedPage'
import React from 'react'

function OrganizationPage() {
  return (
    <BoxedPage>
      <Heading flex={1} mb={10} as="h3" size="lg">
        Organization
      </Heading>
    </BoxedPage>
  )
}

export default OrganizationPage
