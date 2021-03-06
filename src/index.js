import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import configureStore from './store/configureStore'
import Root from './react_components/root'

import { getInitialState } from './settings'

const store = configureStore(getInitialState())
const history = syncHistoryWithStore(browserHistory, store)

let div = document.createElement('div')
document.body.appendChild(div)

ReactDOM.render(
    <Root store={store} history={history} />,
    div
)
