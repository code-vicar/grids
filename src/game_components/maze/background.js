import GameComponent from '../game_component'

export default class Background extends GameComponent {
    constructor(state) {
        super(state)

        this.x = state.x
        this.y = state.y
        this.height = state.height
        this.width = state.width
    }

    render(stage) {
        stage.beginFill(0xFFFF00)
        stage.lineStyle(2, 0xDD0000)
        stage.drawRect(this.x, this.y, this.width, this.height)
        stage.endFill()
    }
}
