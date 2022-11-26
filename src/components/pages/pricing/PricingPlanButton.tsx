import { Button } from '@chakra-ui/react'
import { IProduct } from 'api/PricingApi'
import SubscriptionsContext from 'context/SubscriptionsContext'
import { useContext } from 'react'
import { FreePricingPlanProduct } from 'utils/PricingUtils'
import ManageSubscriptionButton from './ManageSubscriptionButton'
import UpgradePricingPlanButton from './UpgradePricingPlanButton'

interface IProps {
  product: IProduct
}

function PricingPlanButton({ product }: IProps) {
  const { activeSubscription } = useContext(SubscriptionsContext)

  // if (product.id === activeSubscription.plan.product && product.id === FreePricingPlanProduct.id) {
  //   return <div>Button</div>
  // }

  // If FREE plan active
  if (activeSubscription.plan.product === FreePricingPlanProduct.id) {
    // If FREE plan active and FREE product
    if (product.id === FreePricingPlanProduct.id) {
      return (
        <Button disabled variant="outline" colorScheme="green" size="md" w="100%">
          Selected
        </Button>
      )
    }

    // If FREE plan active and STARTER product
    return <UpgradePricingPlanButton productId={product.id} />
  }

  // If STARTER plan active and FREE product
  if (product.id === FreePricingPlanProduct.id) {
    return null
  }

  // If STARTER plan active and STARTER product
  return <ManageSubscriptionButton />
}

export default PricingPlanButton
