import _ from 'lodash'

import Maze from './maze/maze'

let instance = null

export default class Game {
    constructor() {
        this._init = null
        this._loaded = false
    }

    static get instance() {
        return instance
    }

    init() {
        if (_.isNil(this._init)) {
            let errors = []

            this._init = new Promise((resolve, reject) => {
                PIXI.loader.on('error', (err) => {
                    errors.push(err)
                })

                PIXI.loader.add('static/green_dash_rect.png')
                PIXI.loader.add('static/roads.json')

                PIXI.loader.load(() => {
                    this._loaded = true

                    if (errors.length > 0) {
                        return reject(errors)
                    }

                    this._onLoaded()
                    return resolve()
                })
            })
        }

        return this._init
    }

    _onLoaded() {
        this.stage = new PIXI.Container()

        this.maze = new Maze(0, 0, 500, 500)
        this.maze.padding = 50
        this.stage.addChild(this.maze.container)
    }

    setRenderer(renderer) {
        this.renderer = renderer
    }

    update() {
        this.maze.update()
    }

    render() {
        this.renderer.render(this.stage)
    }

    makeGlobal() {
        if (instance) {
            throw new Error('Attempted overwrite of global Game instance')
        }

        instance = this
    }
}
