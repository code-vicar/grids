import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import scene from './scene'

const rootReducer = combineReducers({
  routing,
  scene
})

export default rootReducer
