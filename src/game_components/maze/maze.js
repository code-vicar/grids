import _ from 'lodash'
import { Grid } from '@code-vicar/svutils'

export default class Maze {
    constructor(x, y, height, width) {
        this.container = new PIXI.Container()

        this.grid = new Grid()
        this.grid.runSidewinderMaze()
        console.log(this.grid.toString())

        this._grid = new PIXI.Graphics()
        this.container.addChild(this._grid)

        this.greenHighlight = new PIXI.Sprite(PIXI.Texture.fromImage('static/green_dash_rect.png'))
        this.greenHighlight.visible = false
        this.container.addChild(this.greenHighlight)

        this.padding = 0
        this.x = x
        this.y = y
        this.height = height
        this.width = width
    }

    get x() {
        return this.container.x
    }
    set x(x) {
        this.container.x = x
    }

    get y() {
        return this.container.y
    }
    set y(y) {
        this.container.y = y
    }

    get height() {
        return this.container._height
    }
    set height(height) {
        this.container.height = height
    }

    get width() {
        return this.container._width
    }
    set width(width) {
        this.container.width = width
    }

    update() {
        this._draw()

        if (this.highlightedRoom) {
            this._drawHighlight(this.highlightedRoom.row_index, this.highlightedRoom.column_index)
        }
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

    _drawHighlight(row, column) {
        if (!this.grid || this.grid.rowsLength <= 0 || this.grid.columnsLength <= 0) {
            return
        }

        let padding = this.padding
        let stageHeight = this.height
        let stageWidth = this.width

        let gridHeight = stageHeight - padding
        let cellHeight = Math.floor(gridHeight / this.grid.rowsLength)

        let gridWidth = stageWidth - padding
        let cellWidth = Math.floor(gridWidth / this.grid.columnsLength)

        let paddingOffset = (padding / 2)

        this.greenHighlight.height = cellHeight
        this.greenHighlight.width = cellWidth
        this.greenHighlight.x = (column * cellWidth) + paddingOffset
        this.greenHighlight.y = (row * cellHeight) + paddingOffset
        this.greenHighlight.visible = true
    }

    _draw(grid) {
        if (grid) {
            this.grid = grid
        }

        if (!this.grid || this.grid.rowsLength <= 0 || this.grid.columnsLength <= 0) {
            return
        }

        let padding = this.padding
        let stageHeight = this.height
        let stageWidth = this.width

        let gridHeight = stageHeight - padding
        let cellHeight = Math.floor(gridHeight / this.grid.rowsLength)

        let gridWidth = stageWidth - padding
        let cellWidth = Math.floor(gridWidth / this.grid.columnsLength)

        let paddingOffset = (padding / 2)

        // background
        this._grid.beginFill(0xFFFF00)
        this._grid.lineStyle(2, 0xDD0000)
        this._grid.drawRect(paddingOffset, paddingOffset, gridWidth, gridHeight)
        this._grid.endFill()

        for (let row of this.grid.rows) {
            for (let column of this.grid.columns) {
                let cell = this.grid.getCell(row, column)
                let x = (column * cellWidth) + paddingOffset
                let y = (row * cellHeight) + paddingOffset

                this._drawRoom(x, y, cellHeight, cellWidth, {
                    N: true, // shared wall
                    W: true, // shared wall
                    E: this.grid.hasLinkEast(cell),
                    S: this.grid.hasLinkSouth(cell)
                })
            }
        }
    }

    _drawRoom(x, y, height, width, walls) {
        _.forEach(walls, (isLinked, wall) => {
            if (!isLinked) {
                this._drawWall(x, y, height, width, wall)
            }
        })
    }

    _drawWall(x, y, height, width, wall) {
        let startX = x, startY = y
        let offsetX = 0, offsetY = 0
        switch (wall) {
            case 'N':
                offsetX = width
                break;
            case 'E':
                startX = x + width
                offsetY = height
                break;
            case 'S':
                startY = y + height
                offsetX = width
                break;
            case 'W':
                offsetY = height
                break;
        }

        this._grid.beginFill()
        this._grid.moveTo(startX, startY)
        this._grid.lineTo(startX + offsetX, startY + offsetY)
        this._grid.endFill()
    }
}
