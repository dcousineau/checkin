import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootSaga from '../sagas';
import rootReducer from '../reducers';

const finalCreateStore = compose(
    // reduxReactRouter({ routes, createHistory }),
    applyMiddleware(
        createSagaMiddleware(rootSaga)
    )
)(createStore);

export default function initializeStore(initialState = {}) {
    return finalCreateStore(rootReducer, initialState);
}
