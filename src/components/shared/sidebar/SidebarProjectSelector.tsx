import { Box } from '@chakra-ui/layout'
import { Text, Heading, Icon } from '@chakra-ui/react'
import styled from '@emotion/styled/macro'
import { HiSelector } from 'react-icons/hi'

function SidebarProjectSelector() {
  return (
    <Container>
      <Box flex="1">
        <Text fontSize="xs" color="gray.500" fontWeight="medium">
          selected project
        </Text>

        <Heading as="h5" size="sm">
          Awesome shit
        </Heading>
      </Box>

      <Box display="flex" alignItems="center">
        <Icon w={6} h={6} as={HiSelector} />
      </Box>
    </Container>
  )
}

export default SidebarProjectSelector

const Container = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: ${({ theme }) => `1px solid ${theme.colors.gray[300]}`};
  cursor: pointer;
  display: flex;
  user-select: none;

  :hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`
