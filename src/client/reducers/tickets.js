import * as tickets from '../constants/tickets';

const defaultState = {
    data: [],
    isFetching: false,
    ticketFetchError: false,
    isFetchingStats: false,
    isUploading: false,
    ticketCount: null,
    ticketUploadError: false
};

export default function reducer(state = defaultState, action) {
    switch(action.type) {
        case tickets.REQUEST_TICKETS:
            return {
                ...state,
                isFetching: true,
                ticketFetchError: false
            };
        case tickets.RECEIVE_TICKETS:
            return {
                ...state,
                data: action.payload,
                isFetching: false,
                ticketFetchError: false
            };
        case tickets.REQUEST_TICKETS_FAIL:
            return {
                ...state,
                data: [],
                isFetching: false,
                ticketFetchError: action.payload
            };
        case tickets.UPLOAD_TICKETS:
            return {
                ...state,
                isUploading: true,
                ticketUploadError: false
            };
        case tickets.UPLOAD_TICKETS_SUCCESS:
            return {
                ...state,
                isUploading: false,
                ticketCount: action.payload,
                ticketUploadError: false
            };
        case tickets.UPLOAD_TICKETS_FAIL:
            return {
                ...state,
                isUploading: false,
                ticketUploadError: action.payload
            };
        case tickets.REQUEST_STATS:
            return state;
        case tickets.RECEIVE_STATS:
            return {
                ...state,
                ticketCount: action.payload.ticketCount
            };
        case tickets.REQUEST_STATS_FAIL:
            return {
                ...state,
                ticketCount: null
            };
        default:
            return state;
    }
};
