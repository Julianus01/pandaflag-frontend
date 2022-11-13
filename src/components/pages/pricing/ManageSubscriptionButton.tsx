import { Button } from '@chakra-ui/react'
import PricingApi from 'api/PricingApi'
import { useMutation } from 'react-query'

function ManageSubscriptionButton() {
  const manageSubscriptionMutation = useMutation(PricingApi.createPortalSessionURL)

  function onManageSubscription() {
    manageSubscriptionMutation.mutate(undefined, {
      onSuccess: (portalSessionUrl: string) => {
        window.open(portalSessionUrl, '_blank')
      },
    })
  }

  return (
    <Button onClick={onManageSubscription} variant="outline" colorScheme="green" size="md" w="100%">
      Manage subscription
    </Button>
  )
}

export default ManageSubscriptionButton
