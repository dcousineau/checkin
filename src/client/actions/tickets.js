import * as tickets from '../constants/tickets';

export function requestTickets() {
    return {type: tickets.REQUEST_TICKETS, payload: null};
}

export function receiveTickets(payload) {
    return {type: tickets.RECEIVE_TICKETS, payload};
}

export function requestTicketsFail(error) {
    return {type: tickets.REQUEST_TICKETS_FAIL, payload: error, error: true};
}

export function uploadTickets(files) {
    return {type: tickets.UPLOAD_TICKETS, payload: files};
}

export function uploadTicketsSuccess(count) {
    return {type: tickets.UPLOAD_TICKETS_SUCCESS, payload: count};
}
export function uploadTicketsFail(error) {
    return {type: tickets.UPLOAD_TICKETS_FAIL, payload: error, error: true};
}

export function requestStats() {
    return {type: tickets.REQUEST_STATS, payload: null};
}

export function receiveStats(payload) {
    return {type: tickets.RECEIVE_STATS, payload};
}

export function requestStatsFail(error) {
    return {type: tickets.REQUEST_STATS_FAIL, payload: error, error: true};
}

export function checkInTicket(ticketId, print = true) {
    return {type: tickets.CHECKIN_TICKETS, payload: {ticketId, print}};
}

export function checkInTicketSuccess(ticketId) {
    return {type: tickets.CHECKIN_TICKETS_SUCCESS, ticketId};
}

export function checkInTicketFail(error) {
    return {type: tickets.CHECKIN_TICKETS_FAIL, payload: error, error: true};
}

export function manuallyPrintBadge(badge) {
    return {type: tickets.MANUALLY_PRINT_BADGE, payload: badge};
}
