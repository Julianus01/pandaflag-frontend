import { ApiQueryId } from 'api/ApiQueryId'
import PricingApi, { IPrice } from 'api/PricingApi'
import { createContext, ReactNode } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

export type IPricesContext = UseQueryResult<IPrice[], unknown>

const PricesContext = createContext<IPricesContext>(null as any)

export interface IPricesContextProps {
  children: ReactNode
}

const PricesContextProvider = ({ children }: IPricesContextProps) => {
  const user = useSelector((state: IStoreState) => state.auth.user)
  const pricesQuery = useQuery(ApiQueryId.getPrices, PricingApi.getPrices, { enabled: !!user })

  return <PricesContext.Provider value={pricesQuery}>{children}</PricesContext.Provider>
}

export { PricesContextProvider }
export default PricesContext
