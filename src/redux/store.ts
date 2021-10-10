import { createStore, combineReducers } from 'redux'
import reducers from './ducks'
import { composeWithDevTools } from 'redux-devtools-extension'
import { IAuthState } from './ducks/authDuck'

const rootReducer = combineReducers(reducers)
const store = createStore(rootReducer, composeWithDevTools())
export default store

// Infer the `StoreState` and `AppDispatch` types from the store itself
export interface IStoreState {
  auth: IAuthState
}
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type IAppDispatch = typeof store.dispatch