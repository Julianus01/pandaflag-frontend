import store from 'redux/store'

const PandaflagDevelopmentOrgId = 'ZIxcs0zFIsDxQIe0Usy7'
const PandaflagProductionOrgId = 'DUEJ18weCR85tfLuNIat'

export enum PricingPlanName {
  Free = 'Free',
  Starter = 'Starter',
  ComingSoon = 'Coming Soon',
}

export interface IPricingPlans {
  [name: string]: IPricingPlan
}

export interface IPricingPlan {
  name: PricingPlanName
  productId: string
  quota: IQuota
}

export interface IQuota {
  projects: number
  members: number
  environments: number
}

export const PricingPlans: IPricingPlans = {
  Free: {
    name: PricingPlanName.Free,
    productId: '',
    quota: {
      projects: 1,
      environments: 2,
      members: 2,
    },
  },
  Starter: {
    name: PricingPlanName.Starter,
    // TODO: This should be handled in process env or something
    productId: 'prod_MmYlRFZnuQZBmJ',
    quota: {
      projects: 5,
      environments: 5,
      members: 20,
    },
  },
  ComingSoon: {
    name: PricingPlanName.ComingSoon,
    productId: '',
    quota: {
      projects: 0,
      environments: 0,
      members: 0,
    },
  },
}

function getQuota(orgId?: string): IQuota {
  const organizationId = orgId || store.getState().configuration.organization?.id

  if (organizationId && [PandaflagDevelopmentOrgId, PandaflagProductionOrgId].includes(organizationId)) {
    return {
      projects: 999,
      members: 999,
      environments: 999,
    }
  }

  return {
    projects: 1,
    members: 2,
    environments: 2,
  }
}

export const PricingUtils = {
  getQuota,
}
