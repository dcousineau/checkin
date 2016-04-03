import {Router} from 'express';
import {parse} from 'csv';
import Multer from 'multer';

import db from '../db';

const upload = new Multer();
const api = new Router();

function will(method, ...args) {
    return new Promise((resolve, reject) => {
        return method(...args, (err, data) => {
            if (err) return reject(err);
            else return resolve(data);
        });
    });
}

api.get('/stats', (req, res) => {
    Promise.all([
        will(db.count.bind(db), {})
    ]).then(([ticketCount]) => {
        res.json({
            ticketCount: ticketCount
        })
    });
});

api.get('/tickets', (req, res) => {
    will(db.find.bind(db), {})
        .then(tickets => {
            tickets.sort((a, b) => {
                if (a.lastName < b.lastName) {
                    return -1;
                } else if (a.lastName > b.lastName) {
                    return 1;
                } else if (a.firstName < b.firstName) {
                    return -1;
                } else if (a.firstName > b.firstName) {
                    return 1;
                } else {
                    return 0;
                }
            });
            res.json(tickets)
        });
});


const formatTicket = ticket => {
    return {
        id: ticket['Ticket Reference'],
        lastName: ticket['Ticket Last Name'],
        firstName: ticket['Ticket First Name'],
        company: ticket['Ticket Company Name'],
        type: ticket['Ticket'],
        shirtSize: ticket['T-Shirt Size?'],
        checkedIn: false
    };
};

api.post('/tickets', upload.single('tickets'), (req, res) => {
    parse(req.file.buffer.toString('UTF-8'), {columns: true}, (err, data) => {
        const tickets = data.map(ticket => formatTicket(ticket));

        will(db.remove.bind(db), {}, {multi: true})
            .then(() => will(db.insert.bind(db), tickets))
            .then(newDocs => res.json(newDocs.length))
            .catch(e => res.status(500).json({error: e}));
    });
});



export default api;
