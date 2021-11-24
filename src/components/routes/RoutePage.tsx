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

function flags() {
  return `/flags`
}

function flag(name: string) {
  return `/flags/${name}`
}

function projects() {
  return `/projects`
}

function organization() {
  return `/organization`
}

function createFirstProject() {
  return `/create-first-project`
}

function profile() {
  return `/profile`
}

const RoutePage = {
  root,
  login,
  register,
  emailVerification,
  flags,
  flag,
  projects,
  organization,
  createFirstProject,
  profile,
}

export default RoutePage
