import { Box, Heading, Text, Tag, TagLabel, Button } from '@chakra-ui/react'
import PricingApi from 'api/PricingApi'
import { useMutation } from 'react-query'
import styled from 'styled-components/macro'
import { IPricingPlan, PricingPlanName } from 'utils/PricingUtils'

interface IProps {
  pricingPlan: IPricingPlan
}

function OrganizationPricingPlan({ pricingPlan }: IProps) {
  const upgradeMutation = useMutation(PricingApi.createCheckoutSessionURL)

  function onUpgrade() {
    upgradeMutation.mutate(pricingPlan.productId, {
      onSuccess: (checkoutSessionUrl) => {
        window.location.replace(checkoutSessionUrl)
      },
    })
  }

  return (
    <Box>
      <Box filter={pricingPlan.name === PricingPlanName.ComingSoon ? 'blur(4px)' : 'none'}>
        <Header mb={6}>
          <Box flex="1">
            <Heading mb="1" as="h4" size="md">
              {pricingPlan.name}
            </Heading>

            <Tag
              // TODO: Update based on active pricing plan
              // visibility={true}
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
            {pricingPlan.quota.projects}
          </Heading>

          <Text fontSize="sm" mt="1" color="gray.500">
            Project
          </Text>
        </Box>

        <Box mb="2" display="flex">
          <Heading mr="2" as="h4" size="md">
            {pricingPlan.quota.environments}
          </Heading>

          <Text fontSize="sm" mt="1" color="gray.500">
            Environments
          </Text>
        </Box>

        <Box mb="6" display="flex">
          <Heading mr="2" as="h4" size="md">
            {pricingPlan.quota.members}
          </Heading>

          <Text fontSize="sm" mt="1" color="gray.500">
            Team Members
          </Text>
        </Box>

        {/* TODO: Do based on active one */}
        {false && (
          <Button variant="outline" disabled colorScheme="green" size="md" w="100%">
            Selected
          </Button>
        )}

        {!false && (
          // TODO: Handle disabled state based on pricing plan
          <Button
            disabled={upgradeMutation.isLoading}
            isLoading={upgradeMutation.isLoading}
            onClick={onUpgrade}
            colorScheme="green"
            size="md"
            w="100%"
          >
            Upgrade
          </Button>
        )}
      </Box>

      {pricingPlan.name === PricingPlanName.ComingSoon && <ComingSoonContainer>Coming Soon</ComingSoonContainer>}
    </Box>
  )
}

export default OrganizationPricingPlan

const Header = styled(Box)`
  display: flex;
  align-items: center;
`

const ComingSoonContainer = styled(Box)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`
