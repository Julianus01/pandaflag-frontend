import { IDbEnvironment, IEnvironment } from 'api/EnvironmentsApi'

const EnvironmentOrdersLsKey = 'environmentOrders'

export interface EnvironmentOrder {
  id: string
  order: number
}

function getEnvironmentsOrderFromLS(projectId: string): EnvironmentOrder[] {
  const ordersString = localStorage.getItem(EnvironmentOrdersLsKey)
  if (!ordersString) {
    return []
  }

  const orders = JSON.parse(ordersString)
  const projectOrders = orders[projectId]

  if (!projectOrders) {
    return []
  }

  return projectOrders
}

function saveEnvironmentsOrderToLs(projectId: string, environments: IEnvironment[] | IDbEnvironment[]) {
  const ordersString = localStorage.getItem(EnvironmentOrdersLsKey)
  const ordersLsJson = ordersString ? JSON.parse(ordersString) : {}

  const newOrders = environments.map((environment, index) => ({ id: environment.id, order: index + 1 }))
  const newProjectOrders = { ...ordersLsJson, [projectId]: newOrders }

  localStorage.setItem(EnvironmentOrdersLsKey, JSON.stringify(newProjectOrders))
}

function sortEnvironmentsWithOrderFromLS(projectId: string, environments: IEnvironment[] | IDbEnvironment[]) {
  const lsEnvironmentOrders = getEnvironmentsOrderFromLS(projectId)
  if (!lsEnvironmentOrders.length) {
    return environments
  }

  const environmentsWithPossibleOrderAttached = environments.map((environment) => {
    const foundOrder = lsEnvironmentOrders.find((lsEnvironmentOrder) => lsEnvironmentOrder.id === environment.id)
    if (foundOrder) {
      return {
        ...environment,
        order: foundOrder.order,
      }
    }

    return environment
  })

  const itemsWithOrder = environmentsWithPossibleOrderAttached.filter((item) => item.order)
  const sorted = itemsWithOrder.sort((first, second) => (first.order as number) - (second.order as number))

  const itemsWithoutOrder = environmentsWithPossibleOrderAttached.filter((item) => !item.order)

  return [...sorted, ...itemsWithoutOrder]
}

const EnvironmentUtils = {
  getEnvironmentsOrderFromLS,
  saveEnvironmentsOrderToLs,
  sortEnvironmentsWithOrderFromLS,
}

export default EnvironmentUtils
