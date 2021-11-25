export interface IQuota {
  projects: number
  members: number
  environments: number
}

function getQuota(): IQuota {
  return {
    projects: 1,
    members: 1,
    environments: 2,
  }
}

export const PricingUtils = {
  getQuota,
}