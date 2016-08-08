import { Maze } from './types'

export function highlightRoom(room) {
    return {
        type: Maze.HighlightRoom,
        row_index: room.row_index,
        column_index: room.column_index
    }
}
