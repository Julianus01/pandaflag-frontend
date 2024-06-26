export enum ApiQueryId {
  // Organization
  getOrganization = 'getOrganization',
  getOrganizationForInvitation = 'getOrganizationForInvitation',

  // Projects
  getProjects = 'getProjects',
  getProjectsByOrganizationId = 'getProjectsByOrganizationId',

  // Environments
  getEnvironments = 'getEnvironments',

  // Flags
  getFlags = 'getFlags',
  getFlag = 'getFlag',
  getFlagByName = 'getFlagByName',

  // Members
  getMembers = 'getMembers',
  canInviteMember = 'canInviteMember',

  // Pricing
  getSubscriptions = 'getSubscriptions',
  getProducts = 'getProducts',
  getPrices = 'getPrices'
}
