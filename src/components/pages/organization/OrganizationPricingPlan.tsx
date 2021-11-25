import { Box, Heading, Text, Tag, TagLabel, Button } from '@chakra-ui/react'
import styled from 'styled-components/macro'

export enum PricingPlan {
  free = 'free',
  paid = 'paid',
}

interface IProps {
  pricingPlan: PricingPlan
}

function OrganizationPricingPlan({ pricingPlan }: IProps) {
  const isFreePricingPlan: boolean = pricingPlan === PricingPlan.free

  return (
    <Container>
      <Header mb={6}>
        <Box flex="1">
          <Heading mb="1" as="h4" size="md">
            {isFreePricingPlan ? 'Free' : 'Business'}
          </Heading>

          <Tag
            visibility={isFreePricingPlan ? 'visible' : 'hidden'}
            size="sm"
            borderRadius="md"
            variant="subtle"
            colorScheme="green"
          >
            <TagLabel>active</TagLabel>
          </Tag>
        </Box>

        <Box>
          <Heading textAlign="right" as="h4" size="md">
            {isFreePricingPlan ? '0€/' : 'X€/'}
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
          {isFreePricingPlan ? '1' : 'X'}
        </Heading>

        <Text fontSize="sm" mt="1" color="gray.500">
          Project
        </Text>
      </Box>

      <Box mb="2" display="flex">
        <Heading mr="2" as="h4" size="md">
          {isFreePricingPlan ? '1' : 'X'}
        </Heading>

        <Text fontSize="sm" mt="1" color="gray.500">
          Team Member
        </Text>
      </Box>

      <Box mb={6} display="flex">
        <Heading mr="2" as="h4" size="md">
          {isFreePricingPlan ? '2' : 'X'}
        </Heading>

        <Text fontSize="sm" mt="1" color="gray.500">
          Default Environments
        </Text>
      </Box>

      {isFreePricingPlan && (
        <Button variant="outline" disabled colorScheme="green" size="md" w="100%">
          Selected
        </Button>
      )}

      {!isFreePricingPlan && (
        <Button disabled colorScheme="green" size="md" w="100%">
          Upgrade
        </Button>
      )}
    </Container>
  )
}

export default OrganizationPricingPlan

const Container = styled(Box)``

const Header = styled(Box)`
  display: flex;
  align-items: center;
`
