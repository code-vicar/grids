import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import PIXI from 'pixi.js'

import { addActor } from '../actions/actor'
import * as game from '../services/game'

export class Scene extends React.Component {
    componentWillMount() {
        let sceneState = _.get(this, 'props.scene')

        this.renderer = PIXI.autoDetectRenderer(sceneState.height, sceneState.width)
        this.renderer.backgroundColor = sceneState.backgroundColor

        this.stage = new PIXI.Graphics()

        console.log(sceneState)
        game.render(this.stage, sceneState)

        let animate = function () {
            if (!_.get(this, 'renderer')) {
                return
            }

            this.renderer.render(this.stage)
            this.frame = requestAnimationFrame(animate)
        }.bind(this)
        animate()
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
