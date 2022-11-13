import { IUser } from 'redux/ducks/authDuck'
import store from 'redux/store'
import { IOrganization } from './OrganizationsApi'

const BaseUrl = process.env.REACT_APP_PANDAFLAG_API_URL_BASE as string

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
  createCheckoutSessionURL,
  createPortalSessionURL,
}

export default PricingApi
