import _ from 'lodash'

export function render(stage, state) {
    drawGrid(stage, state)
    // addActorsToStage(stage, _.get(state, 'actors'))
}

function drawGrid(stage, state) {
    let grid = _.get(state, 'grid') || {}
    let gridPadding = _.get(state, 'gridPadding') || 0

    if (grid.rowsLength <= 0 || grid.columnsLength <= 0) {
        return
    }

    let stageHeight = _.get(state, 'height')
    let stageWidth = _.get(state, 'width')

    let gridHeight = stageHeight - gridPadding
    let cellHeight = Math.floor(gridHeight / grid.rowsLength)

    let gridWidth = stageWidth - gridPadding
    let cellWidth = Math.floor(gridWidth / grid.columnsLength)

    let paddingOffset = (gridPadding / 2)

    drawBorder(stage, paddingOffset, paddingOffset, gridHeight, gridWidth)

    for (let row of grid.rows) {
        for (let column of grid.columns) {
            let cell = grid.getCell(row, column)

            let x = (column * cellWidth) + (gridPadding / 2)
            let y = (row * cellHeight) + (gridPadding / 2)
            drawRoom(stage, x, y, cellHeight, cellWidth, {
                N: true, // shared wall
                W: true, // shared wall
                E: grid.hasLinkEast(cell),
                S: grid.hasLinkSouth(cell)
            })
        }
    }
}

function drawBorder(stage, x, y, height, width) {
    stage.beginFill(0xFFFF00)
    stage.lineStyle(2, 0xDD0000)
    stage.drawRect(x, y, width, height)
    stage.endFill()
}

function drawRoom(stage, x, y, height, width, walls) {
    _.forEach(walls, (isLinked, wall) => {
        if (!isLinked) {
            drawWall(wall)
        }
    })

    function drawWall(direction) {
        let startX = x, startY = y
        let offsetX = 0, offsetY = 0
        switch (direction) {
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
        stage.beginFill()
        stage.moveTo(startX, startY)
        stage.lineTo(startX + offsetX, startY + offsetY)
        stage.endFill()
    }
}

function addActorsToStage(stage, actors = []) {
    stage.beginFill(0xFFFFFF)
    _.forEach(actors, (actor) => {
        stage.drawCircle(actor.x, actor.y, 15)
    })
    stage.endFill()
}
