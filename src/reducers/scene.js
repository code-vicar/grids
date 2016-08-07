import _ from 'lodash'
import { Actor, Grid } from '../actions/types'

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
            default:
                return state
        }
    }
    return state
}
