import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react'
import BoxedPage from 'components/styles/BoxedPage'
import CreateFeatureFlagDialog from './feature-flags/CreateFeatureFlagDialog'

function FeatureFlagsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading flex={1} mb={10} as="h3" size="lg">
          Feature Flags
        </Heading>

        <Button onClick={onOpen} colorScheme="blue">
          Add Feature Flag
        </Button>
      </Box>

      <CreateFeatureFlagDialog isOpen={isOpen} onClose={onClose} />
    </BoxedPage>
  )
}

export default FeatureFlagsPage
