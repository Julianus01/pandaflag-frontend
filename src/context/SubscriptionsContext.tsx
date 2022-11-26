import { ApiQueryId } from 'api/ApiQueryId'
import PricingApi, { ISubscription, SubscriptionStatus } from 'api/PricingApi'
import { createContext, ReactNode, useContext, useMemo } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import { FreePricingPlanProduct, FreeSubscription } from 'utils/PricingUtils'
import PricesContext from './PricesContext'

export type ISubscriptionsContext = UseQueryResult<ISubscription[], unknown> & {
  activeSubscription: ISubscription
}

const SubscriptionsContext = createContext<ISubscriptionsContext>(null as any)

export interface ISubscriptionsContextProps {
  children: ReactNode
}

const SubscriptionsContextProvider = ({ children }: ISubscriptionsContextProps) => {
  const pricesQuery = useContext(PricesContext)
  const organization = useSelector((state: IStoreState) => state.configuration.organization)

  const subscriptionsQuery = useQuery(
    [ApiQueryId.getSubscriptions, organization?.id, organization?.customerId],
    PricingApi.getActiveSubscriptions,
    {
      enabled: !!organization?.customerId,
    }
  )

  const activeSubscription = useMemo(() => {
    if (!subscriptionsQuery.data?.length || !pricesQuery.data?.length) {
      return FreeSubscription
    }

    const firstActiveSubscription = subscriptionsQuery.data.find(
      (subscription) => subscription.status === SubscriptionStatus.active
    )

    if (!firstActiveSubscription) {
      return FreeSubscription
    }

    const foundPrice = pricesQuery.data.find((product) => product.product.id === firstActiveSubscription.plan.product)
    if (!foundPrice) {
      return { ...firstActiveSubscription, metadata: FreePricingPlanProduct.metadata }
    }

    return { ...firstActiveSubscription, metadata: foundPrice.product.metadata }
  }, [pricesQuery.data, subscriptionsQuery.data])

  return (
    <SubscriptionsContext.Provider value={{ ...subscriptionsQuery, activeSubscription: activeSubscription }}>
      {children}
    </SubscriptionsContext.Provider>
  )
}

export { SubscriptionsContextProvider }
export default SubscriptionsContext
