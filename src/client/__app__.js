import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import io from 'socket.io-client';

import initializeStore from './store';

import Layout from './pages/layout';
import Home from './pages/home';
import PageNotFound from './pages/pagenotfound';
import Admin from './pages/admin';

injectTapEventPlugin();

const store = initializeStore();
const history = syncHistoryWithStore(browserHistory, store);

const socket = io.connect();

socket.on('connect', () => {
    const dispatch = store.dispatch.bind(store);
    // dispatch('SOCKET_CONNECTED');
    socket.on('action', (data) => {
        dispatch(data);
    });
});

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={Layout}>
                <IndexRoute component={Home} />
                <Route path="admin" component={Admin} />
                <Route path="*" component={PageNotFound} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById("content")
);
