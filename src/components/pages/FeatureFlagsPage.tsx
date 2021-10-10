import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react'
import BoxedPage from 'components/styles/BoxedPage'
import CreateProjectDialog from './projects/CreateProjectDialog'

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

      <CreateProjectDialog isOpen={isOpen} onClose={onClose} />
    </BoxedPage>
  )
}

export default FeatureFlagsPage
