function root() {
  return `/`
}

function login() {
  return `/login`
}

function emailVerification() {
  return `/email-verification`
}

function dashboard() {
  return `/dashboard`
}

function flags() {
  return `/flags`
}

function flag(name: string) {
  return `/flags/${name}`
}

function settings() {
  return `/settings`
}

function projects() {
  return `/projects`
}

function createFirstProject() {
  return `/create-first-project`
}

const RoutePage = {
  root,
  dashboard,
  login,
  emailVerification,
  flags,
  flag,
  settings,
  projects,
  createFirstProject,
}

export default RoutePage
