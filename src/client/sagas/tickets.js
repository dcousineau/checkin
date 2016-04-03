import {takeLatest} from 'redux-saga';
import {fork, call, put} from 'redux-saga/effects';

import {REQUEST_TICKETS, UPLOAD_TICKETS, REQUEST_STATS} from '../constants/tickets';
import {receiveTickets, requestTicketsFail, uploadTicketsSuccess, uploadTicketsFail, receiveStats, requestStatsFail} from '../actions/tickets';
import {getAllTickets, postTickets, getStats} from '../api/tickets';

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

export default function* saga() {
    yield [
        fork(watchFetchTickets),
        fork(watchUploadTickets),
        fork(watchFetchStats)
    ];
}
