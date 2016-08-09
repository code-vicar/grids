import GameComponent from '../game_component'

export default class Room extends GameComponent {
    constructor(state) {
        super(state)

        this.highlighted = state.highlighted
        this.x = state.x
        this.y = state.y
        this.height = state.height
        this.width = state.width
        this.walls = state.walls
    }

    render(stage) {
        _.forEach(this.walls, (isLinked, wall) => {
            if (!isLinked) {
                this.drawWall(stage, wall)
            }
        })

        if (this.highlighted) {
            this.drawHighlight(stage)
        }
    }

    drawWall(stage, wall) {
        let startX = this.x, startY = this.y
        let offsetX = 0, offsetY = 0
        switch (wall) {
            case 'N':
                offsetX = this.width
                break;
            case 'E':
                startX = this.x + this.width
                offsetY = this.height
                break;
            case 'S':
                startY = this.y + this.height
                offsetX = this.width
                break;
            case 'W':
                offsetY = this.height
                break;
        }

        stage.beginFill()
        stage.moveTo(startX, startY)
        stage.lineTo(startX + offsetX, startY + offsetY)
        stage.endFill()
    }

    drawHighlight(stage) {
        let graphic = new PIXI.Graphics()
        graphic.beginFill(0x00BD0D, 0)
        graphic.lineStyle(2, 0x00BD0D)
        graphic.drawRect(this.x, this.y, this.width, this.height)
        graphic.endFill()
        stage.removeChildren()
        stage.addChild(graphic)
    }
}
