import createReducer from '../utils/createReducer'
import { IUser } from 'hooks/authHooks'

// Types
const AUTH_STATE_CHANGED = '[auth] AUTH_STATE_CHANGED'

const initialState = {
  user: null,
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
  authStateChanged: (user: IUser | null) => ({
    type: AUTH_STATE_CHANGED,
    payload: { user }
  })
}

export { authActions }
