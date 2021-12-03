import { ApiQueryId } from 'api/ApiQueryId'
import EnvironmentsApi, { IEnvironment } from 'api/EnvironmentsApi'
import { createContext, ReactNode } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

export type IEnvironmentsContext = UseQueryResult<IEnvironment[], unknown>

const EnvironmentsContext = createContext<IEnvironmentsContext>(null as any)

export interface IEnvironmentsContextProps {
  children: ReactNode
}

const EnvironmentsContextProvider = ({ children }: IEnvironmentsContextProps) => {
  const project = useSelector((state: IStoreState) => state.configuration.project)
  const environmentsQuery = useQuery([ApiQueryId.getEnvironments, project?.id], EnvironmentsApi.getEnvironments, {
    enabled: !!project?.id,
  })

  return <EnvironmentsContext.Provider value={environmentsQuery}>{children}</EnvironmentsContext.Provider>
}

export { EnvironmentsContextProvider }
export default EnvironmentsContext
