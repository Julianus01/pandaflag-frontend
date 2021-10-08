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

function featureFlags() {
  return `/feature-flags`
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
  featureFlags,
  settings,
  projects,
  createFirstProject,
}

export default RoutePage
