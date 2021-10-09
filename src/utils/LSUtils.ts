import { IEnvironment } from "api/ProjectsApi"
import { IUser } from "hooks/authHooks"

const LS_USER_KEY: string = "user"
const LS_LAST_PROJECT_NAME_KEY: string = "lastProjectName"
const LS_LAST_ENVIRONMENT_KEY: string = "lastEnvironment"

// User
function saveUser(user: IUser) {
  localStorage.setItem(LS_USER_KEY, JSON.stringify(user))
}

function removeUser() {
  localStorage.removeItem(LS_USER_KEY)
}

function globalUser(): IUser {
  const user: IUser = JSON.parse(localStorage.getItem(LS_USER_KEY) as string)
  return user
}

// Last Used Project Name
function saveLastProjectName(projectName: string) {
  localStorage.setItem(LS_LAST_PROJECT_NAME_KEY, projectName)
}

function removeLastProjectName() {
  localStorage.removeItem(LS_LAST_PROJECT_NAME_KEY)
}

function lastProjectName(): string {
  const projectName = localStorage.getItem(LS_LAST_PROJECT_NAME_KEY) as string
  return projectName
}

// Last Used Environment
function saveLastEnvironment(environment: IEnvironment) {
  localStorage.setItem(LS_LAST_ENVIRONMENT_KEY, environment)
}

function removeLastEnvironment() {
  localStorage.removeItem(LS_LAST_ENVIRONMENT_KEY)
}

function lastEnvironment(): IEnvironment {
  const environment = localStorage.getItem(LS_LAST_ENVIRONMENT_KEY) as IEnvironment
  return environment
}

const LSUtils = {
  // User
  saveUser,
  removeUser,
  globalUser,

  // Last Project Name
  saveLastProjectName,
  removeLastProjectName,
  lastProjectName,

  // Last Environment
  saveLastEnvironment,
  removeLastEnvironment,
  lastEnvironment
}

export default LSUtils