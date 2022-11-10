import { Box, Skeleton } from '@chakra-ui/react'

function LoadingPage() {
  return (
    <Box marginTop="20vh" display="flex" alignItems="center" justifyContent="center">
      <Box maxWidth="300px" width="100%">
        <Skeleton mb={2} height="30px" />
        <Skeleton mb={2} height="30px" />
        <Skeleton mb={2} height="30px" />
      </Box>
    </Box>
  )
}

export default LoadingPage
