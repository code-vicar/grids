import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import PIXI from 'pixi.js'

import { addActor } from '../actions/actor'
import Game from '../game_components/game'
import Maze from '../game_components/maze/maze'

export class Scene extends React.Component {
    componentWillMount() {
        let sceneState = _.get(this, 'props.scene')

        this.renderer = PIXI.autoDetectRenderer(sceneState.height, sceneState.width)
        this.renderer.backgroundColor = sceneState.backgroundColor

        this.stage = new PIXI.Graphics()
        console.log(sceneState)

        let game = new Game(this.stage)

        let mazeState = sceneState.maze
        let maze = new Maze({
            x: 0,
            y: 0,
            height: sceneState.height,
            width: sceneState.width,
            padding: mazeState.padding,
            grid: mazeState.grid
        })

        game.addToStage(maze)
        game.render(this.renderer)
    }

    componentWillUnmount() {
        this.renderer.destroy()
        delete this.renderer
        this.stage.destroy()
        delete this.stage
    }

    render() {
        return (
            <div class="gameScene" ref={
                (divElem) => {
                    if (divElem) {
                        divElem.appendChild(this.renderer.view)
                    }
                }
            }/>
        )
    }
}

function mapStateToProps(state) {
    return { scene: state.scene }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Scene)
