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

function createFirstProject() {
  return `/create-first-project`
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
  createFirstProject,
  profile
}

export default RoutePage
