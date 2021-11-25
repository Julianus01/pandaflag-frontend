import { Box, Heading, Text, Tag, TagLabel, Button } from '@chakra-ui/react'
import styled from 'styled-components/macro'

function OrganizationPricingPlan() {
  return (
    <Container>
      <Header mb={6}>
        <Box flex="1">
          <Heading mb="1" as="h4" size="md">
            Free
          </Heading>

          <Tag size="sm" borderRadius="md" variant="subtle" colorScheme="green">
            <TagLabel>active</TagLabel>
          </Tag>
        </Box>

        <Box>
          <Heading textAlign="right" as="h4" size="md">
            0€/
          </Heading>

          <Text fontSize="xs" color="gray.500" textAlign="right">
            monthly
          </Text>
        </Box>
      </Header>

      <Box mb="2" display="flex">
        <Text fontSize="sm" mt="1" color="gray.500">
          Unlimited flags
        </Text>
      </Box>

      <Box mb="2" display="flex">
        <Heading mr="2" as="h4" size="md">
          1
        </Heading>

        <Text fontSize="sm" mt="1" color="gray.500">
          Project
        </Text>
      </Box>

      <Box mb="2" display="flex">
        <Heading mr="2" as="h4" size="md">
          1
        </Heading>

        <Text fontSize="sm" mt="1" color="gray.500">
          Team Member
        </Text>
      </Box>

      <Box mb={6} display="flex">
        <Heading mr="2" as="h4" size="md">
          2
        </Heading>

        <Text fontSize="sm" mt="1" color="gray.500">
          Default Environments
        </Text>
      </Box>

      <Button variant="outline" disabled colorScheme="green" size="md" w="100%">
        Selected
      </Button>
    </Container>
  )
}

export default OrganizationPricingPlan

const Container = styled(Box)``

const Header = styled(Box)`
  display: flex;
  align-items: center;
`
