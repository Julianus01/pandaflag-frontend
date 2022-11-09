function root() {
  return `/`
}

function notFound() {
  return `/not-found`
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

function acceptInvitation(orgId: string) {
  return `/accept-invitation/${orgId}`
}

function members() {
  return `/members`
}

const RoutePage = {
  // Public
  root,
  notFound,
  login,
  register,
  emailVerification,
  forgotPassword,
  acceptInvitation,

  // Authenticated
  flags,
  flag,
  projects,
  environments,
  organization,
  createOrganization,
  createFirstProject,
  profile,
  feedback,
  members,
}

export default RoutePage
