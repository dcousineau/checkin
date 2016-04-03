import {REQUEST_TICKETS, RECEIVE_TICKETS, REQUEST_TICKETS_FAIL} from '../constants/tickets';

export function requestTickets() {
    return {type: REQUEST_TICKETS, payload: null};
}

export function receiveTickets(payload) {
    return {type: RECEIVE_TICKETS, payload};
}

export function requestTicketsFail(error) {
    return {type: REQUEST_TICKETS_FAIL, payload: error, error: true};
}
