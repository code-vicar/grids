import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import PIXI from 'pixi.js'

import { highlightRoom } from '../actions/maze'
import Game from '../game_components/game'
import Maze from '../game_components/maze/maze'

export class Scene extends React.Component {
    constructor(props) {
        super(props)
        this.mouseMove = this.mouseMove.bind(this)
    }

    componentDidMount() {
        let sceneState = _.get(this, 'props.scene')
        this.renderer = PIXI.autoDetectRenderer(sceneState.height, sceneState.width, {
            view: this._canvas
        })
        this.renderer.backgroundColor = sceneState.backgroundColor

        this.createMaze()
    }

    shouldComponentUpdate(nextProps) {
        let highlightedRoom = _.get(this, 'maze.highlightedRoom')
        let nextHighlightedRoom = _.get(nextProps, 'scene.maze.highlightedRoom')

        return diffRoom(highlightedRoom, nextHighlightedRoom)
    }

    componentWillUpdate() {
        this.createMaze()
    }

    componentWillUnmount() {
        this.renderer.destroy()
        delete this.renderer
        this.stage.destroy()
        delete this.stage
    }

    mouseMove(event) {
        let cRect = event.target.getBoundingClientRect()
        let x = event.clientX - cRect.left
        let y = event.clientY - cRect.top

        let room = this.maze.getRoomFromCoords(x, y)

        if (!_.isNil(room) && diffRoom(room, this.maze.highlightedRoom)) {
            let onRoomHovered = _.get(this, 'props.onRoomHovered')
            onRoomHovered(room)
        }
    }

    createMaze() {
        let sceneState = _.get(this, 'props.scene')
        let mazeState = sceneState.maze

        this.maze = new Maze({
            x: 0,
            y: 0,
            height: sceneState.height,
            width: sceneState.width,
            padding: mazeState.padding,
            grid: mazeState.grid,
            highlightedRoom: mazeState.highlightedRoom
        })

        if (this.stage) {
            this.stage.destroy(true)
        }
        this.stage = new PIXI.Graphics()
        let game = new Game(this.stage)
        game.addToStage(this.maze)
        game.render(this.renderer)
    }

    render() {
        return (
            <canvas ref={(c) => {
                this._canvas = c
            }} onMouseMove={this.mouseMove} />
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
