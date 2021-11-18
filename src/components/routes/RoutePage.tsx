function root() {
  return `/`
}

function login() {
  return `/login`
}

function emailVerification() {
  return `/email-verification`
}

function flags() {
  return `/flags`
}

function flag(name: string) {
  return `/flags/${name}`
}

function projects() {
  return `/projects`
}

function createOrganizationAndProject() {
  return `/create-organization-and-project`
}

function profile() {
  return `/profile`
}

const RoutePage = {
  root,
  login,
  emailVerification,
  flags,
  flag,
  projects,
  createOrganizationAndProject,
  profile,
}

export default RoutePage
