import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootSaga from '../sagas';
import rootReducer from '../reducers';

const sagaMiddleware = createSagaMiddleware();

const finalCreateStore = compose(
    applyMiddleware(sagaMiddleware),
    typeof window === `object` && typeof window[`devToolsExtension`] !== `undefined` ? window[`devToolsExtension`]() : f => f
)(createStore);

export default function initializeStore(initialState = {}) {
    const _store = finalCreateStore(rootReducer, initialState);
    sagaMiddleware.run(rootSaga);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers');
            _store.replaceReducer(nextRootReducer)
        });
    }

    return _store;
}
