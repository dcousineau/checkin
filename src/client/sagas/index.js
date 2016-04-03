import { fork } from 'redux-saga/effects'

import ticketsSaga from './tickets';

export default function* root() {
    yield [
        fork(ticketsSaga)
    ];
}
