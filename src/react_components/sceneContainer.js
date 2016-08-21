import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Loading from './loading'
import LoadingError from './loadingError'
import Scene from './scene'

import * as SceneActions from '../actions/scene'
import Game from '../game_components/game'

class SceneContainer extends React.Component {
    componentWillMount() {
        if (!Game.instance) {
            const game = new Game()
            game.makeGlobal()

            game.init().then(() => {
                this.props.onLoaded()
            }).catch((err) => {
                console.log(err)
                this.props.onError(err)
            })
        }
    }

    render() {
        if (this.props.loadingError) {
            return <LoadingError errors={this.props.loadingErrors} />
        }

        if (this.props.isLoading) {
            return <Loading />
        }

        return <Scene />
    }
}

function mapStateToProps(state) {
    return {
        loadingError: _.get(state, 'scene.loadingError'),
        loadingErrors: _.get(state, 'scene.loadingErrors'),
        isLoading: _.get(state, 'scene.isLoading')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onLoaded: () => {
            dispatch(SceneActions.loaded())
        },
        onError: (errors) => {
            dispatch(SceneActions.loadingError(errors))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SceneContainer)

