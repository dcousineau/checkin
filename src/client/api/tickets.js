import fetch from 'isomorphic-fetch';

export function getAllTickets() {
    return fetch('/api/tickets')
        .then(res => res.json());
}

export function getStats() {
    return fetch('/api/stats')
        .then(res => res.json());
}

export function postTickets(files) {
    var data = new FormData();
    data.append('tickets', files[0]);

    return fetch('/api/tickets', {
        method: 'POST',
        body: data
    })
        .then(res => res.json());
}

export function checkIn(ticketId) {
    return fetch(`/api/ticket/check-in/${ticketId}`, {
        method: 'PUT'
    })
        .then(res => res.json());
}
