import createReducer from '../utils/createReducer'
import { PayloadAction } from 'redux/types'
import { User } from '@firebase/auth'

// Types
const AUTH_STATE_CHANGED = '[auth] AUTH_STATE_CHANGED'

export type IUser = User
export interface IAuthState {
  user: User | null
}

const initialState: IAuthState = {
  user: null,
}

// Reducer
export default createReducer(initialState)({
  [AUTH_STATE_CHANGED]: (state: IAuthState, { payload: user }: PayloadAction<IUser>) => ({
    ...state,
    user,
  }),
})

// Actions
const authActions = {
  authStateChanged: (user: IUser | null) => ({
    type: AUTH_STATE_CHANGED,
    payload: user,
  }),
}

export { authActions }
