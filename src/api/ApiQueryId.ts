export enum ApiQueryId {
  // Organization
  getOrganization = 'getOrganization',

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
  getMembers = 'getMembers'
}
