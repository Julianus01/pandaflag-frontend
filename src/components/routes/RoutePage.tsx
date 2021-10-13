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

function flag(id: string) {
  return `/flags/${id}`
}

function rawFlag() {
  return `/flags/:id`
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
  rawFlag,
  settings,
  projects,
  createFirstProject,
}

export default RoutePage
