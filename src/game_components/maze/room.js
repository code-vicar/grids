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
        if (this.highlighted) {
            stage.lineStyle(2, 0x00BD0D)
        } else {
            stage.lineStyle(2, 0xDD0000)
        }
        stage.moveTo(startX, startY)
        stage.lineTo(startX + offsetX, startY + offsetY)
        stage.endFill()
    }
}
