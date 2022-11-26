import { Box, Heading, Text, Tag, TagLabel } from '@chakra-ui/react'
import { IPrice } from 'api/PricingApi'
import { MemberType } from 'api/UsersApi'
import SubscriptionsContext from 'context/SubscriptionsContext'
import { useIsCurrentUserMemberType } from 'hooks/userHooks'
import { useContext } from 'react'
import styled from 'styled-components/macro'
import PricingPlanButton from '../pricing/PricingPlanButton'

interface IProps {
  price: IPrice
}

function OrganizationPricingPlan({ price }: IProps) {
  const isAdmin = useIsCurrentUserMemberType(MemberType.admin)
  const { activeSubscription } = useContext(SubscriptionsContext)

  return (
    <Box>
      <Box>
        <Header mb={6}>
          <Box flex="1">
            <Heading mb="1" as="h4" size="md">
              {price.product.name}
            </Heading>

            <Tag
              visibility={price.product.id === activeSubscription.plan.product ? 'visible' : 'hidden'}
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
              {/* 0€/ */}
              {price.unit_amount / 100}€/
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
            {price.product.metadata.projectsLimit}
          </Heading>

          <Text fontSize="sm" mt="1" color="gray.500">
            Project
          </Text>
        </Box>

        <Box mb="2" display="flex">
          <Heading mr="2" as="h4" size="md">
            {price.product.metadata.environmentsLimit}
          </Heading>

          <Text fontSize="sm" mt="1" color="gray.500">
            Environments
          </Text>
        </Box>

        <Box mb="6" display="flex">
          <Heading mr="2" as="h4" size="md">
            {price.product.metadata.membersLimit}
          </Heading>

          <Text fontSize="sm" mt="1" color="gray.500">
            Team Members
          </Text>
        </Box>

        {isAdmin && <PricingPlanButton product={price.product} />}
      </Box>
    </Box>
  )
}

export default OrganizationPricingPlan

const Header = styled(Box)`
  display: flex;
  align-items: center;
`
