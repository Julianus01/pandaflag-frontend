import { IPrice, IProduct, IProductDb, ISubscription, SubscriptionStatus } from 'api/PricingApi'

const FreePricingPlanID = 'free-plan'

export const FreePricingPlanProduct: IProduct = {
  id: FreePricingPlanID,
  object: 'product',
  active: true,
  created: 1668374351,
  default_price: '',
  metadata: {
    environmentsLimit: 2,
    membersLimit: 2,
    projectsLimit: 1,
  },
  name: 'Free',
  updated: 1669472686,
}

export const FreePrice: IPrice = {
  id: 'free-price',
  object: 'price',
  active: true,
  billing_scheme: 'per_unit',
  created: -8640000000000000,
  currency: 'eur',
  unit_amount: 0,
  unit_amount_decimal: '0',
  product: FreePricingPlanProduct,
}

export const FreeSubscription: ISubscription = {
  id: 'free-subscription',
  customer: '',
  current_period_start: -8640000000000000,
  current_period_end: 8640000000000000,
  plan: {
    id: 'price-free',
    active: true,
    product: FreePricingPlanID,
    currency: 'eur',
    amount: 0,
    amount_decimal: '0',
    created: -8640000000000000,
    interval: 'month',
  },
  metadata: FreePricingPlanProduct.metadata,
  status: 'active' as SubscriptionStatus,
}

function mapProductMetadata(product: IProductDb): IProduct {
  return {
    ...product,
    metadata: {
      projectsLimit: Number(product.metadata.projectsLimit),
      environmentsLimit: Number(product.metadata.environmentsLimit),
      membersLimit: Number(product.metadata.membersLimit),
    },
  }
}

export const PricingUtils = {
  mapProductMetadata,
}
