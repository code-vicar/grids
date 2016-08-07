import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import configureStore from './store/configureStore'
import Root from './components/root'

import { getInitialState } from './settings'

const store = configureStore(getInitialState())
const history = syncHistoryWithStore(browserHistory, store)

import { addActor } from './actions/actor'
store.dispatch(addActor())
store.dispatch(addActor())
store.dispatch(addActor())

let div = document.createElement('div');
document.body.appendChild(div);

ReactDOM.render(
  <Root store={store} history={history} />,
  div
);
