import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import tickets from './tickets';

const rootReducer = combineReducers({
    tickets,
    routing
});

export default rootReducer;
