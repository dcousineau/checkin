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

export function checkIn(ticketId, print = true) {
    return fetch(`/api/ticket/check-in/${ticketId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            print,
        }),
    })
        .then(res => res.json());
}

export function printBadge(badge) {
    return fetch(`/api/print-badge`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(badge)
    })
        .then(res => res.json());
}
