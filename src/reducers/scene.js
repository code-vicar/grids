import _ from 'lodash'
import { Actor, Maze } from '../actions/types'

const initialState = {
    actors: []
}

export default (state = initialState, action) => {
    let _state = _.cloneDeep(state)

    if (action) {
        switch (action.type) {
            case Actor.Add:
                _state.actors.push({
                    x: action.posX,
                    y: action.posY
                })
                return _state
            case Maze.HighlightRoom:
                _state.maze.highlightedRoom = {
                    row_index: action.row_index,
                    column_index: action.column_index
                }
                return _state
            default:
                return state
        }
    }
    return state
}
