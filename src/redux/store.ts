import { createStore, combineReducers } from 'redux'
import reducers from './ducks'
import { composeWithDevTools } from 'redux-devtools-extension'

const rootReducer = combineReducers(reducers)
export default createStore(rootReducer, composeWithDevTools())
