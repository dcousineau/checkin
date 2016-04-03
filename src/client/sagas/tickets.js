import {takeLatest} from 'redux-saga';
import {fork, call, put} from 'redux-saga/effects';

import {REQUEST_TICKETS, RECEIVE_TICKETS} from '../constants/tickets';
import {receiveTickets, requestTicketsFail} from '../actions/tickets';
import {getAllTickets} from '../api/tickets';

function* fetchTickets(action) {
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


export default function* saga() {
    yield [
        fork(watchFetchTickets)
    ];
}
