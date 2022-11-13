import { IPricingPlan, PricingPlanName } from 'utils/PricingUtils'
import ManageSubscriptionButton from './ManageSubscriptionButton'
import UpgradePricingPlanButton from './UpgradePricingPlanButton'

interface IProps {
  pricingPlan: IPricingPlan
}

function PricingPlanButton({ pricingPlan }: IProps) {
  // TODO: Fix Hardcoding
  if (pricingPlan.name === PricingPlanName.Free) {
    return <ManageSubscriptionButton />
  }

  if (pricingPlan.name === PricingPlanName.Starter) {
    return <UpgradePricingPlanButton productId={pricingPlan.productId} />
  }

  return null
}

export default PricingPlanButton
