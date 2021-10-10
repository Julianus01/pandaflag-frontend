import createReducer from '../utils/createReducer'
import { User as Auth0User } from "@auth0/auth0-react"

// Types
const AUTH_STATE_CHANGED = '[auth] AUTH_STATE_CHANGED'

export interface IUser extends Auth0User {
  id: string
}

export interface IAuthState {
  user: IUser | undefined
}

const initialState: IAuthState = {
  user: undefined,
}

// Reducer
export default createReducer(initialState)({
  [AUTH_STATE_CHANGED]: (state: any, { payload: { user } }: { payload: { user: IUser | null } }) => ({
    ...state,
    user
  }),
})

// Actions
const authActions = {
  authStateChanged: (user: IUser | undefined) => ({
    type: AUTH_STATE_CHANGED,
    payload: { user }
  })
}

export { authActions }