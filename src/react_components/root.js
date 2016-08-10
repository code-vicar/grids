import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import config from '../config.json'
import App from './app'
import Test from './test'
import Scene from './scene'

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

export default class Root extends Component {
    render() {
        const { store, history } = this.props
        return (
            <MuiThemeProvider muiTheme={ getMuiTheme() }>
                <Provider store={store}>
                    <Router history={history}>
                        <Route path={config.basename} component={App}>
                            <Route path="/" component={Scene} />
                            <Route path="/other" component={Test} />
                        </Route>
                    </Router>
                </Provider>
            </MuiThemeProvider>
        )
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
}
