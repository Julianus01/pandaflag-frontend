import { IUser } from 'redux/ducks/authDuck'
import store from 'redux/store'
import { FreePrice, FreePricingPlanProduct, PricingUtils } from 'utils/PricingUtils'
import { IOrganization } from './OrganizationsApi'

const BaseUrl = process.env.REACT_APP_PANDAFLAG_API_URL_BASE as string

export interface ISubscriptionQuota {
  projectsLimit: number
  membersLimit: number
  environmentsLimit: number
}

export interface IProductDb {
  id: string
  object: string
  active: boolean
  created: number
  default_price: string
  description?: string
  metadata: {
    environmentsLimit: string
    membersLimit: string
    projectsLimit: string
  }
  name: string
  updated: number
}

export interface IProduct extends Omit<IProductDb, 'metadata'> {
  metadata: ISubscriptionQuota
}

export interface IPriceDb {
  id: string
  object: string
  active: boolean
  billing_scheme: string
  created: number
  currency: string
  unit_amount: number
  unit_amount_decimal: string
  product: IProductDb
}

export interface IPrice extends Omit<IPriceDb, 'product'> {
  product: IProduct
}

export interface ISubscriptionPlan {
  active: boolean
  amount: number
  amount_decimal: string
  created: number
  currency: string
  id: string
  interval: string
  product: string
}

export enum SubscriptionStatus {
  active = 'active',
  incomplete = 'incomplete',
  past_due = 'past_due',
}

export interface ISubscription {
  id: string
  customer: string
  current_period_start: number
  current_period_end: number
  plan: ISubscriptionPlan
  status: SubscriptionStatus
  metadata: ISubscriptionQuota
}

async function getActiveSubscriptions() {
  const user = store.getState().auth.user as IUser
  const organization = store.getState().configuration.organization as IOrganization

  const idToken = await user.getIdToken()

  const response = await fetch(`${BaseUrl}/stripe/subscriptions/${organization.customerId}`, {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })

  const json = await response.json()
  return json.data as ISubscription[]
}

async function getProducts() {
  const user = store.getState().auth.user as IUser

  const idToken = await user.getIdToken()

  const response = await fetch(`${BaseUrl}/stripe/prices`, {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })

  const json = await response.json()
  const productsDb = json.data as IProductDb[]
  const products = productsDb.map(PricingUtils.mapProductMetadata)

  return [FreePricingPlanProduct, ...products] as IProduct[]
}

async function getPrices() {
  const user = store.getState().auth.user as IUser

  const idToken = await user.getIdToken()

  const response = await fetch(`${BaseUrl}/stripe/prices`, {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })

  const json = await response.json()
  const pricesDb = json.data as IPriceDb[]
  const prices = pricesDb.map((price) => ({ ...price, product: PricingUtils.mapProductMetadata(price.product) }))

  return [FreePrice, ...prices] as IPrice[]
}

async function createCheckoutSessionURL(productId: string): Promise<string> {
  const user = store.getState().auth.user as IUser
  const organization = store.getState().configuration.organization as IOrganization

  const response = await fetch(`${BaseUrl}/stripe/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      organizationId: organization.id,
      productId: productId,
      customerId: organization.customerId,
      email: user.email,
    }),
  })

  const json: { url: string } = await response.json()
  return json.url
}

async function createPortalSessionURL(): Promise<string> {
  const organization = store.getState().configuration.organization as IOrganization

  const response = await fetch(`${BaseUrl}/stripe/create-portal-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId: organization.customerId,
    }),
  })

  const json: { url: string } = await response.json()
  return json.url
}

const PricingApi = {
  getProducts,
  getPrices,
  getActiveSubscriptions,
  createCheckoutSessionURL,
  createPortalSessionURL,
}

export default PricingApi
