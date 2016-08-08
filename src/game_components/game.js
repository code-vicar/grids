import _ from 'lodash'

export default class Game {
    constructor(stage) {
        this.stage = stage
        this.components = []
    }

    addToStage(component) {
        this.components.push(component)
    }

    render(renderer) {
        this.components.forEach((component) => {
            // draw the components onto the stage
            component.render(this.stage)
        })

        // draw the stage onto the canvas
        renderer.render(this.stage)
    }
}
