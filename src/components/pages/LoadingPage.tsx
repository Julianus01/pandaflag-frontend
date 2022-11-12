import { Box, Skeleton } from '@chakra-ui/react'
import PandaflagLogoSideText from 'components/shared/PandaflagLogoSideText'

function LoadingPage() {
  return (
    <>
      <Box display="flex" justifyContent="center">
        <a href={process.env.REACT_APP_PANDAFLAG_APP_URL as string}>
          <PandaflagLogoSideText mx="auto" mt={6} />
        </a>
      </Box>

      <Box marginTop="15vh" display="flex" alignItems="center" justifyContent="center">
        <Box maxWidth="300px" width="100%">
          <Skeleton mb={2} height="30px" />
          <Skeleton mb={2} height="30px" />
          <Skeleton mb={2} height="30px" />
        </Box>
      </Box>
    </>
  )
}

export default LoadingPage
