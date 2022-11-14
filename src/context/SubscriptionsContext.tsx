import { ApiQueryId } from 'api/ApiQueryId'
import PricingApi, { ISubscription } from 'api/PricingApi'
import { createContext, ReactNode } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

export type ISubscriptionsContext = UseQueryResult<ISubscription[], unknown>

const SubscriptionsContext = createContext<ISubscriptionsContext>(null as any)

export interface ISubscriptionsContextProps {
  children: ReactNode
}

const SubscriptionsContextProvider = ({ children }: ISubscriptionsContextProps) => {
  const organization = useSelector((state: IStoreState) => state.configuration.organization)

  const subscriptionsQuery = useQuery(
    [ApiQueryId.getSubscriptions, organization?.id, organization?.customerId],
    PricingApi.getActiveSubscriptions,
    {
      enabled: !!organization?.customerId,
    }
  )

  console.log('Query')
  console.log(subscriptionsQuery)

  return <SubscriptionsContext.Provider value={subscriptionsQuery}>{children}</SubscriptionsContext.Provider>
}

export { SubscriptionsContextProvider }
export default SubscriptionsContext
