import { Button } from '@chakra-ui/react'
import PricingApi from 'api/PricingApi'
import { useMutation } from 'react-query'

interface IProps {
  productId: string
}

function UpgradePricingPlanButton({ productId }: IProps) {
  const upgradeMutation = useMutation(PricingApi.createCheckoutSessionURL)

  function onUpgrade() {
    upgradeMutation.mutate(productId, {
      onSuccess: (checkoutSessionUrl: string) => {
        window.location.replace(checkoutSessionUrl)
      },
    })
  }

  return (
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
  )
}

export default UpgradePricingPlanButton
