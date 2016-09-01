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

        // this.rooms = new Map();
        // this.rooms.set('road', new PIXI.Sprite(PIXI.Texture.fromFrame('road.png')))
        // this.rooms.set('roadTE', new PIXI.Sprite(PIXI.Texture.fromFrame('roadTE.png')))
        // this.rooms.set('roadTN', new PIXI.Sprite(PIXI.Texture.fromFrame('roadTN.png')))
        // this.rooms.set('roadTW', new PIXI.Sprite(PIXI.Texture.fromFrame('roadTW.png')))
        // this.rooms.set('roadTS', new PIXI.Sprite(PIXI.Texture.fromFrame('roadTS.png')))
        // this.rooms.set('roadNE', new PIXI.Sprite(PIXI.Texture.fromFrame('roadNE.png')))
        // this.rooms.set('roadNW', new PIXI.Sprite(PIXI.Texture.fromFrame('roadNW.png')))
        // this.rooms.set('roadSW', new PIXI.Sprite(PIXI.Texture.fromFrame('roadSW.png')))
        // this.rooms.set('roadSE', new PIXI.Sprite(PIXI.Texture.fromFrame('roadSE.png')))
        // this.rooms.set('roadEW', new PIXI.Sprite(PIXI.Texture.fromFrame('roadEW.png')))
        // this.rooms.set('roadNS', new PIXI.Sprite(PIXI.Texture.fromFrame('roadNS.png')))
        // this.rooms.set('roadEndN', new PIXI.Sprite(PIXI.Texture.fromFrame('roadEndN.png')))
        // this.rooms.set('roadEndE', new PIXI.Sprite(PIXI.Texture.fromFrame('roadEndE.png')))
        // this.rooms.set('roadEndS', new PIXI.Sprite(PIXI.Texture.fromFrame('roadEndS.png')))
        // this.rooms.set('roadEndW', new PIXI.Sprite(PIXI.Texture.fromFrame('roadEndW.png')))

        this.startMarker = new PIXI.Sprite(PIXI.Texture.fromFrame('start.png'))
        this.startMarker.visible = false

        this.endMarker = new PIXI.Sprite(PIXI.Texture.fromImage('end.png'))
        this.endMarker.visible = false

        this.greenHighlight = new PIXI.Sprite(PIXI.Texture.fromImage('static/green_dash_rect.png'))
        this.greenHighlight.visible = false

        this.container.addChild(this.startMarker)
        this.container.addChild(this.endMarker)
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
            this._drawSprite(this.highlightedRoom.row_index, this.highlightedRoom.column_index, 'greenHighlight')
        }

        if (this.startPos) {
            this._drawSprite(this.startPos.row_index, this.startPos.column_index, 'startMarker')
        }

        if (this.endPos) {
            this._drawSprite(this.endPos.row_index, this.endPos.column_index, 'endMarker')
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

    setStart(room) {
        this.startPos = room
    }

    setEnd(room) {
        this.endPos = room
    }

    // TODO change this to 'setRoomTextures'
    // create a sprite for a room position if it doesn't exist
    // update that sprites texture to match maze state
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
            return PIXI.Texture.fromFrame('road.png')
        } else if (paths.N && paths.E && paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadTE.png')
        } else if (paths.N && paths.E && !paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadTN.png')
        } else if (paths.N && !paths.E && paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadTW.png')
        } else if (!paths.N && paths.E && paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadTS.png')
        } else if (paths.N && paths.E && !paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadNE.png')
        } else if (paths.N && !paths.E && !paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadNW.png')
        } else if (!paths.N && !paths.E && paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadSW.png')
        } else if (!paths.N && paths.E && paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadSE.png')
        } else if (!paths.N && paths.E && !paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadEW.png')
        } else if (paths.N && !paths.E && paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadNS.png')
        } else if (paths.N && !paths.E && !paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadEndN.png')
        } else if (!paths.N && paths.E && !paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadEndE.png')
        } else if (!paths.N && !paths.E && paths.S && !paths.W) {
            return PIXI.Texture.fromFrame('roadEndS.png')
        } else if (!paths.N && !paths.E && !paths.S && paths.W) {
            return PIXI.Texture.fromFrame('roadEndW.png')
        }
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

    _drawSprite(row, column, spriteName) {
        let cellHeight = Math.floor(this.height / this.grid.rowsLength)
        let cellWidth = Math.floor(this.width / this.grid.columnsLength)

        this[spriteName].height = cellHeight
        this[spriteName].width = cellWidth
        this[spriteName].x = (column * cellWidth)
        this[spriteName].y = (row * cellHeight)
        this[spriteName].visible = true
    }
}
