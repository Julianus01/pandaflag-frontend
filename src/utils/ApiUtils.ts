import { IUser } from "hooks/authHooks"

const LS_USER_KEY: string = "user"

function saveUserInLS(user: IUser) {
  localStorage.setItem(LS_USER_KEY, JSON.stringify(user))
}

function removeUserFromLS() {
  localStorage.removeItem(LS_USER_KEY)
}

function globalUser(): IUser {
  const user: IUser = JSON.parse(localStorage.getItem(LS_USER_KEY) as string)
  return user
}

const ApiUtils = {
  saveUserInLS,
  removeUserFromLS,
  globalUser
}

export default ApiUtils