import {Router} from 'express';
import fs from 'fs';
import {parse} from 'csv';
import Multer from 'multer';
import Canvas from 'canvas';
import {spawn} from 'child_process';

import db from '../db';
import renderBadge from '../../common/badge';

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
            .then((affected) => will(db.insert.bind(db), tickets))
            .then(newDocs => res.json(newDocs.length))
            .catch(e => res.status(500).json({error: e}));
    });
});

const printBadge = (badge, copies=2) => {
    return new Promise((resolve, reject) => {
        const stream = badge.pngStream();
        //@TODO: Make printer configurable
        const print = spawn('lp', ['-d', 'Brother_QL_700', '-o', 'media=Custom.200x100px', '-o', 'Collate=True', '-n', `${copies}`]);

        print.stdout.on('data', data => console.log(`PRINT: ${data}`));
        print.stderr.on('data', data => console.log(`PRINT ERR: ${data}`));

        // Pipe the PNG stream directly into the lp process we spawned. WHO NEEDS TEMPORARY FILES!?
        stream.on('data', chunk => print.stdin.write(chunk));
        stream.on('end', () => print.stdin.end());
        stream.on('error', () => reject());

        print.on('close', () => resolve());
        print.on('error', () => reject());
    });
};

api.put('/ticket/check-in/:id', (req, res) => {
    will(db.findOne.bind(db), {id: req.params.id})
        .then(ticket => will(db.update.bind(db), {id: req.params.id}, {$set: {checkedIn: true}}, {}).then(() => ticket))
        .then(ticket => {
            const badge = renderBadge({
                firstName: ticket.firstName,
                lastName: ticket.lastName,
                type: ticket.type,
                badge: {
                    width: 400,
                    height: 200
                }
            }, new Canvas(300, 150));

            printBadge(badge)
                .then(() => res.json({success: true}))
                .catch(() => res.status(500).json());
        });
});

export default api;
