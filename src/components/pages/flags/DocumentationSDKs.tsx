import { Box, Text, Image } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { FiExternalLink } from 'react-icons/fi'
import ReactLogoPNG from 'assets/images/react-logo.png'
import JSLogoPNG from 'assets/images/js-logo.png'
import AccessibleBackground from 'components/styles/AccessibleBackground'

const DocumentationSDKs = () => {
  return (
    <Box display="flex">
      <SDKContainer
        onClick={() => window?.open?.('https://github.com/Julianus01/pandaflag-react', '_blank')?.focus()}
        cursor="pointer"
        display="flex"
        alignItems="center"
        mr={2}
        flex={1}
        shadow="xs"
      >
        <Image height="50px" src={ReactLogoPNG} alt="React Logo" />

        <Box ml={2}>
          <Box display="flex" alignItems="center">
            <Title mr={1}>React SDK</Title>

            <FiExternalLink />
          </Box>

          <Text fontSize="sm" color="gray.500">
            Make your frontend life easier
          </Text>
        </Box>
      </SDKContainer>

      <SDKContainer
        onClick={() => window?.open?.('https://github.com/Julianus01/pandaflag-node', '_blank')?.focus()}
        cursor="pointer"
        display="flex"
        alignItems="center"
        ml={2}
        flex={1}
        shadow="xs"
      >
        <Image height="40px" objectFit="cover" src={JSLogoPNG} alt="React Logo" />

        <Box ml={2}>
          <Box display="flex" alignItems="center">
            <Title mr={1}>Node.js SDK</Title>

            <FiExternalLink />
          </Box>

          <Text fontSize="sm" color="gray.500">
            Faster development with our library
          </Text>
        </Box>
      </SDKContainer>
    </Box>
  )
}

export default DocumentationSDKs

const Title = styled(Text)`
  font-weight: semibold;
`

const SDKContainer = styled(AccessibleBackground)`
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space[3]};

  :hover {
    ${Title}, svg {
      color: ${({ theme }) => theme.colors.blue[500]};
    }
  }
`
