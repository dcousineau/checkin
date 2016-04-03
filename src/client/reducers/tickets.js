import {REQUEST_TICKETS, RECEIVE_TICKETS, REQUEST_TICKETS_FAIL} from '../constants/tickets';

const defaultState = {
    data: [],
    isFetching: false,
    error: false
};

export default function reducer(state = defaultState, action) {
    switch(action.type) {
        case REQUEST_TICKETS:
            return {
                ...state,
                isFetching: true,
                error: false
            };
        case RECEIVE_TICKETS:
            return {
                ...state,
                data: action.payload,
                isFetching: false,
                error: false
            };
        case REQUEST_TICKETS_FAIL:
            return {
                ...state,
                data: [],
                isFetching: false,
                error: action.payload
            };
        default:
            return state;
    }
};
