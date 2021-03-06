import _ from 'lodash'
import { Scene } from '../actions/types'

const initialState = {}

export default (state = initialState, action) => {
    let _state

    if (action) {
        switch (action.type) {
            case Scene.HighlightRoom:
                _state = _.cloneDeep(state)
                _state.maze.highlightedRoom = {
                    row_index: action.row_index,
                    column_index: action.column_index
                }
                return _state
            case Scene.Loaded:
                _state = _.cloneDeep(state)
                _state.isLoading = false
                return _state
            case Scene.LoadingError:
                _state = _.cloneDeep(state)
                _state.loadingError = true
                if (action.errors && action.errors.message) {
                    _state.loadingErrors = action.errors.message
                } else {
                    _state.loadingErrors = action.errors
                }
                return _state
            default:
                return state
        }
    }
    return state
}
