import { IUser } from "hooks/authHooks"
import store from "redux/store"

function globalUser(): IUser {
  return store.getState().auth.user as IUser
}

const ApiUtils = {
  globalUser
}

export default ApiUtils