import { Scene } from './types'

export function highlightRoom(room) {
    return {
        type: Scene.HighlightRoom,
        row_index: room.row_index,
        column_index: room.column_index
    }
}

export function loaded() {
    return {
        type: Scene.Loaded
    }
}

export function loadingError(errors) {
    return {
        type: Scene.LoadingError,
        errors: errors
    }
}
