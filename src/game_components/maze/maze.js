import GameComponent from '../game_component'
import Background from './background'
import Room from './room'

export default class Maze extends GameComponent {
    constructor(state) {
        super(state)

        this.x = state.x
        this.y = state.y
        this.height = state.height
        this.width = state.width
        this.padding = state.padding
        this.grid = state.grid
        this.highlightedRoom = state.highlightedRoom
    }

    getRoomFromCoords(x, y) {
        let padding = this.padding
        let stageHeight = this.height
        let stageWidth = this.width

        let gridHeight = stageHeight - padding
        let cellHeight = Math.floor(gridHeight / this.grid.rowsLength)

        let gridWidth = stageWidth - padding
        let cellWidth = Math.floor(gridWidth / this.grid.columnsLength)

        let paddingOffset = (padding / 2)

        let adjustedX = x - paddingOffset
        let adjustedY = y - paddingOffset

        if (adjustedX < 0 || adjustedY < 0 || adjustedX > gridWidth || adjustedY > gridHeight) {
            return
        }

        return {
            row_index: Math.floor(adjustedY / cellHeight),
            column_index: Math.floor(adjustedX / cellWidth)
        }
    }

    render(stage) {
        if (!this.grid || this.grid.rowsLength <= 0 || this.grid.columnsLength <= 0) {
            return
        }

        let x = this.x
        let y = this.y
        let padding = this.padding
        let stageHeight = this.height
        let stageWidth = this.width

        let gridHeight = stageHeight - padding
        let cellHeight = Math.floor(gridHeight / this.grid.rowsLength)

        let gridWidth = stageWidth - padding
        let cellWidth = Math.floor(gridWidth / this.grid.columnsLength)

        let paddingOffset = (padding / 2)

        let background = new Background({
            x: x + paddingOffset,
            y: y + paddingOffset,
            height: gridHeight,
            width: gridWidth
        })

        background.render(stage)

        let highlightedRoom = this.highlightedRoom || {}
        for (let row of this.grid.rows) {
            for (let column of this.grid.columns) {
                let cell = this.grid.getCell(row, column)
                let x = (column * cellWidth) + (padding / 2)
                let y = (row * cellHeight) + (padding / 2)

                let highlighted = (row === highlightedRoom.row_index && column === highlightedRoom.column_index)

                let room = new Room({
                    x, y,
                    height: cellHeight,
                    width: cellWidth,
                    highlighted,
                    walls: {
                        N: true, // shared wall
                        W: true, // shared wall
                        E: this.grid.hasLinkEast(cell),
                        S: this.grid.hasLinkSouth(cell)
                    }
                })
                room.render(stage)
            }
        }
    }
}
