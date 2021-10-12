export enum LsKey {
  lastProjectName = 'lastProjectName',
  lastEnvironment = 'lastEnvironment',
}

// Last Used Project Name
function saveLastProjectName(projectName: string) {
  localStorage.setItem(LsKey.lastProjectName, projectName)
}

function lastProjectName(): string {
  const projectName = localStorage.getItem(LsKey.lastProjectName) as string
  return projectName
}

// Last Used Environment
function saveLastEnvironmentName(name: string) {
  localStorage.setItem(LsKey.lastEnvironment, name)
}

function lastEnvironmentName(): string {
  const name = localStorage.getItem(LsKey.lastEnvironment) as string
  return name
}

function remove(lsKey: LsKey) {
  localStorage.removeItem(lsKey)
}

const LSUtils = {
  // General
  remove,

  // Last Project Name
  saveLastProjectName,
  lastProjectName,

  // Last Environment
  saveLastEnvironmentName,
  lastEnvironmentName
}

export default LSUtils