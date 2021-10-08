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

const RoutePage = {
  root,
  dashboard,
  login,
  emailVerification,
  featureFlags,
  settings,
}

export default RoutePage
