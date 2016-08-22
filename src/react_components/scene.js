import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import PIXI from 'pixi.js'

import Game from '../game_components/game'

import { highlightRoom } from '../actions/scene'

export class Scene extends React.Component {
    constructor(props) {
        super(props)
        this.mouseMove = this.mouseMove.bind(this)
    }

    componentDidMount() {
        let mazeState = _.get(this, 'props.scene.maze')
        this.renderer = PIXI.autoDetectRenderer(mazeState.height, mazeState.width, {
            view: this._canvas
        })
        this.renderer.backgroundColor = 0x3498db

        this.game = Game.instance
        this.game.maze.padding = mazeState.padding
        this.game.maze.height = mazeState.height
        this.game.maze.width = mazeState.width
        this.game.setRenderer(this.renderer)

        this.game.update()
        this.game.render()
    }

    componentDidUpdate() {
        let mazeState = _.get(this, 'props.scene.maze')
        this.game.maze.highlightedRoom = mazeState.highlightedRoom

        this.game.update()
        this.game.render()
    }

    componentWillUnmount() {
        if (this.renderer) {
            this.renderer.destroy()
            delete this.renderer
        }
    }

    mouseMove(event) {
        let cRect = event.target.getBoundingClientRect()
        let x = event.clientX - cRect.left
        let y = event.clientY - cRect.top

        let room = this.game.maze.getRoomFromCoords(x, y)

        if (!_.isNil(room) && diffRoom(room, this.game.maze.highlightedRoom)) {
            let onRoomHovered = _.get(this, 'props.onRoomHovered')
            onRoomHovered(room)
        }
    }

    render() {
        return (
            <canvas ref={(c) => {
                this._canvas = c
            } } onMouseMove={this.mouseMove} />
        )
    }
}

function diffRoom(room1, room2) {
    let row1 = _.get(room1, 'row_index')
    let row2 = _.get(room2, 'row_index')
    let col1 = _.get(room1, 'column_index')
    let col2 = _.get(room2, 'column_index')

    return (row1 !== row2 || col1 !== col2)
}

function mapStateToProps(state) {
    return { scene: state.scene }
}

function mapDispatchToProps(dispatch) {
    return {
        onRoomHovered: (room) => {
            dispatch(highlightRoom(room))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scene)
