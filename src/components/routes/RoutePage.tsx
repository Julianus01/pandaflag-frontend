function root() {
  return `/`
}

function login() {
  return `/login`
}

function register() {
  return `/register`
}

function emailVerification() {
  return `/email-verification`
}

function forgotPassword() {
  return `/forgot-password`
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

function environments() {
  return `/environments`
}

function organization() {
  return `/organization`
}

function createOrganization() {
  return `/create-organization`
}

function createFirstProject() {
  return `/create-first-project`
}

function profile() {
  return `/profile`
}

function feedback() {
  return `/feedback`
}

const RoutePage = {
  // Public
  root,
  login,
  register,
  emailVerification,
  forgotPassword,

  // Authenticated
  flags,
  flag,
  projects,
  environments,
  organization,
  createOrganization,
  createFirstProject,
  profile,
  feedback
}

export default RoutePage
