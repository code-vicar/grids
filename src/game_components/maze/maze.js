import _ from 'lodash'
import { Grid } from '@code-vicar/svutils'

export default class Maze {
    constructor(x, y, height, width) {
        this.container = new PIXI.Container()

        this.x = x
        this.y = y
        this.height = height
        this.width = width

        this.grid = new Grid()
        this.grid.runSidewinderMaze()
        console.log(this.grid.toString())

        this._createRoomSprites()
        this.greenHighlight = new PIXI.Sprite(PIXI.Texture.fromImage('static/green_dash_rect.png'))
        this.greenHighlight.visible = false
        this.container.addChild(this.greenHighlight)
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
        if (x < 0 || y < 0 || x > this.width || y > this.height) {
            return
        }

        let cellHeight = Math.floor(this.height / this.grid.rowsLength)
        let cellWidth = Math.floor(this.width / this.grid.columnsLength)

        return {
            row_index: Math.floor(y / cellHeight),
            column_index: Math.floor(x / cellWidth)
        }
    }

    _createRoomSprites() {
        this.rooms = new Map()
        for (let row of this.grid.rows) {
            for (let column of this.grid.columns) {
                let cell = this.grid.getCell(row, column)

                let room = new PIXI.Sprite(this._getRoomTexture({
                    N: this.grid.hasLinkNorth(cell),
                    E: this.grid.hasLinkEast(cell),
                    S: this.grid.hasLinkSouth(cell),
                    W: this.grid.hasLinkWest(cell)
                }))

                room.visible = false
                this.rooms.set(`${row}-${column}`, room)
                this.container.addChild(room)
            }
        }
    }

    _getRoomTexture(paths) {
        if (paths.N && paths.E && paths.W && paths.S) {
            return PIXI.Texture.fromFrame('road.ase')
        } else if (paths.N && paths.E && paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadTE.ase')
        } else if (paths.N && paths.E && !paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadTN.ase')
        } else if (paths.N && !paths.E && paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadTW.ase')
        } else if (!paths.N && paths.E && paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadTS.ase')
        } else if (paths.N && paths.E && !paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadNE.ase')
        } else if (paths.N && !paths.E && !paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadNW.ase')
        } else if (!paths.N && !paths.E && paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadSW.ase')
        } else if (!paths.N && paths.E && paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadSE.ase')
        } else if (!paths.N && paths.E && !paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadEW.ase')
        } else if (paths.N && !paths.E && paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadNS.ase')
        } else if (paths.N && !paths.E && !paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadEndN.ase')
        } else if (!paths.N && paths.E && !paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadEndE.ase')
        } else if (!paths.N && !paths.E && paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadEndS.ase')
        } else if (!paths.N && !paths.E && !paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadEndW.ase')
        }

        return PIXI.Texture.fromFrame('roadEndE.ase')
    }

    _draw() {
        let cellHeight = Math.floor(this.height / this.grid.rowsLength)
        let cellWidth = Math.floor(this.width / this.grid.columnsLength)

        for (let row of this.grid.rows) {
            for (let column of this.grid.columns) {
                let room = this.rooms.get(`${row}-${column}`)
                room.height = cellHeight
                room.width = cellWidth
                room.x = (column * cellWidth)
                room.y = (row * cellHeight)
                room.visible = true
            }
        }
    }

    _drawHighlight(row, column) {
        let cellHeight = Math.floor(this.height / this.grid.rowsLength)
        let cellWidth = Math.floor(this.width / this.grid.columnsLength)

        this.greenHighlight.height = cellHeight
        this.greenHighlight.width = cellWidth
        this.greenHighlight.x = (column * cellWidth)
        this.greenHighlight.y = (row * cellHeight)
        this.greenHighlight.visible = true
    }
}
