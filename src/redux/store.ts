import { createStore, combineReducers } from 'redux'
import reducers from './ducks'
import { composeWithDevTools } from 'redux-devtools-extension'
import { IAuthState } from './ducks/authDuck'
import { IConfigurationState } from './ducks/configurationDuck'

const rootReducer = combineReducers(reducers)
const store = createStore(rootReducer, composeWithDevTools())
export default store


export interface IStoreState {
  auth: IAuthState
  configuration: IConfigurationState
}

export type IAppDispatch = typeof store.dispatch