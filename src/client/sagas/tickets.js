import {takeLatest, takeEvery} from 'redux-saga';
import {fork, call, put} from 'redux-saga/effects';

import {REQUEST_TICKETS, UPLOAD_TICKETS, REQUEST_STATS, CHECKIN_TICKETS, MANUALLY_PRINT_BADGE} from '../constants/tickets';
import {requestTickets, receiveTickets, requestTicketsFail, uploadTicketsSuccess, uploadTicketsFail, receiveStats, requestStatsFail, checkInTicketSuccess, checkInTicketFail} from '../actions/tickets';
import {getAllTickets, postTickets, getStats, checkIn, printBadge} from '../api/tickets';

function* fetchTickets() {
    try {
        const tickets = yield call(getAllTickets);
        yield put(receiveTickets(tickets));
    } catch (e) {
        yield put(requestTicketsFail(e));
    }
}

function* watchFetchTickets() {
    yield* takeLatest(REQUEST_TICKETS, fetchTickets);
}


function* uploadTickets({payload}) {
    try {
        const ticketCount = yield call(postTickets, payload);
        yield put(uploadTicketsSuccess(ticketCount));
    } catch (e) {
        yield put(uploadTicketsFail(e));
    }
}

function* watchUploadTickets() {
    yield takeLatest(UPLOAD_TICKETS, uploadTickets);
}


function* fetchStats() {
    try {
        const stats = yield call(getStats);
        yield put(receiveStats(stats));
    } catch (e) {
        yield put(requestStatsFail(e));
    }
}

function* watchFetchStats() {
    yield* takeLatest(REQUEST_STATS, fetchStats);
}

function* checkInTicket({payload: ticketId}) {
    try {
        yield call(checkIn, ticketId);
        yield put(checkInTicketSuccess(ticketId));
        yield put(requestTickets()); //Trigger a re-fetch on the tickets
    } catch (e) {
        yield put(checkInTicketFail(e));
    }
}

function* watchCheckInTickets() {
    yield takeEvery(CHECKIN_TICKETS, checkInTicket);
}


function* manuallyPrintBadge({payload}) {
    try {
        yield call(printBadge, payload);
    } catch (e) {
        console.error("Failed to print badge", e);
    }
}

function* watchManuallyPrintBadge() {
    yield takeLatest(MANUALLY_PRINT_BADGE, manuallyPrintBadge);
}

export default function* saga() {
    yield [
        fork(watchFetchTickets),
        fork(watchUploadTickets),
        fork(watchFetchStats),
        fork(watchCheckInTickets),
        fork(watchManuallyPrintBadge)
    ];
}
