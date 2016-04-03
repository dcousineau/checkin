import fetch from 'isomorphic-fetch';

export function getAllTickets() {
    return fetch('/api/tickets')
        .then(res => res.json());
}
