import {Router} from 'express';
import {omit} from 'lodash/object';
import {parse, stringify} from 'csv';
import Multer from 'multer';
import Canvas from 'canvas';
import {spawn} from 'child_process';
import bodyParser from 'body-parser';

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
        will(db.count.bind(db), {}),
        will(db.find.bind(db), {}),
    ]).then(([ticketCount, allTix]) => {
        let stats = allTix
            .map(ticket => ticket)
            .reduce((stats = {}, ticket) => {
                if (!stats[ticket.type]) {
                    stats[ticket.type] = {
                        checkedIn: 0,
                        total: 0,
                    };
                }

                stats[ticket.type].total += 1;
                
                if (ticket.checkedIn) {
                    stats[ticket.type].checkedIn += 1;
                }

                return stats;
            }, {});
        
        let sortedKeys = Object.keys(stats)
            .sort((a, b) => {
                if (a < b) {
                    return -1;
                } else if (a > b) {
                    return 1;
                } else {
                    return 0;
                }
            });
        
        stats = sortedKeys
            .map(type => [type, stats[type]])
            .reduce((stats = {}, [type, counts]) => {
                stats[type] = counts;
                return stats;
            }, {});

        res.json({
            ticketCount: ticketCount,
            byType: stats,
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
        will(db.remove.bind(db), {id: {$nin: tickets.map(ticket => ticket.id)}}) //Remove tickets that no longer exist
            .then(() => Promise.all(tickets.map(ticket => will(db.update.bind(db), {id: ticket.id}, {$set: omit(ticket, ['checkedIn'])}, {upsert: true})))) //Update everything but preserve checkedIn
            .then(results => res.json(results.length))
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

api.put('/ticket/check-in/:id', bodyParser.json(), (req, res) => {
    const notifyAboutUpdate = ticket => {
        const {io} = req.app.locals;
        io.emit('action', {type: 'CHECKIN_TICKETS_UPDATE', payload: {
            ticketId: ticket.id,
            checkedIn: true
        }});
        return ticket;
    };

    will(db.findOne.bind(db), {id: req.params.id})
        .then(ticket => will(db.update.bind(db), {id: req.params.id}, {$set: {checkedIn: true}}, {}).then(() => ticket))
        .then(notifyAboutUpdate)
        .then(ticket => renderBadge({
            firstName: ticket.firstName,
            lastName: ticket.lastName,
            type: ticket.type,
            badge: {
                width: 400,
                height: 200
            }
        }, new Canvas(400, 200)))
        .then(req.body.print ? printBadge : noop => noop)
        .then(() => res.json({success: true}))
        .catch(() => res.status(500).json());
});

api.put('/print-badge', bodyParser.json(), (req, res) => {
    const badge = renderBadge({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        type: req.body.type,
        badge: {
            width: 400,
            height: 200
        }
    }, new Canvas(400, 200));

    printBadge(badge)
        .then(() => res.json({success: true}))
        .catch(() => res.status(500).json());
});

const filterTicket = ticket => [
    ticket.id,
    ticket.lastName,
    ticket.firstName,
    ticket.company,
    ticket.type
];

api.get('/report/checked-in', (req, res) => {
    res.set('Content-Type', 'text/csv');
    will(db.find.bind(db), {checkedIn: true})
        .then(attendees => attendees.map(filterTicket))
        .then(attendees => [['ID', 'Last Name', 'First Name', 'Company', 'Type']].concat(attendees))
        .then(data => stringify(data, (err, output) => res.send(output)));
});

export default api;
