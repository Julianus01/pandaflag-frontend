import store from 'redux/store'

const PandaflagDevelopmentOrgId = 'ZIxcs0zFIsDxQIe0Usy7'
const PandaflagProductionOrgId = 'DUEJ18weCR85tfLuNIat'

export interface IQuota {
  projects: number
  members: number
  environments: number
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
