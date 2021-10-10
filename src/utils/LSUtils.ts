import { IEnvironment } from "api/ProjectsApi"

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
function saveLastEnvironment(environment: IEnvironment) {
  localStorage.setItem(LsKey.lastEnvironment, environment)
}

function lastEnvironment(): IEnvironment {
  const environment = localStorage.getItem(LsKey.lastEnvironment) as IEnvironment
  return environment
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
  saveLastEnvironment,
  lastEnvironment
}

export default LSUtils