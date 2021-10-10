import createReducer from '../utils/createReducer'
import { User } from "@auth0/auth0-react"

// Types
const AUTH_STATE_CHANGED = '[auth] AUTH_STATE_CHANGED'

export type IUser = Required<User>
export interface IAuthState {
  user: IUser | undefined
}

const initialState: IAuthState = {
  user: undefined,
}

interface PayloadAction<T> {
  payload: T
}

// Reducer
export default createReducer(initialState)({
  [AUTH_STATE_CHANGED]: (state: any, { payload: user }: PayloadAction<IUser>) => ({
    ...state,
    user
  }),
})

// Actions
const authActions = {
  authStateChanged: (user: IUser | undefined) => ({
    type: AUTH_STATE_CHANGED,
    payload: user
  })
}

export { authActions }