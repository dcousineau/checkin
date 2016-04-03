import express from 'express';
import nunjucks from 'nunjucks';
import {argv} from 'yargs';
import {createReadStream} from 'fs';
import {resolve} from 'path';
import {parse} from 'csv';
import untildify from 'untildify';

const app = express();

////
// Setup Webpack
////
if (process.env.NODE_ENV === "development") {
    const webpack = require('webpack');
    const webpackConfig = require('../../webpack.config.dev.js');
    const compiler = webpack(webpackConfig);
    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true, publicPath: webpackConfig.output.publicPath
    }));
    app.use(require("webpack-hot-middleware")(compiler));
} else {
    //@TODO: point to built static path...
    app.use('/static', express.static(`${__dirname}/../static/`));
}

////
// Setup Views
////

nunjucks.configure(`${__dirname}/views`, {
    autoescape: true,
    express: app
});

////
// Routes
////

app.get('/', (req, res) => {
    res.render("index.html");
});

const tickets = {
    data: null,
    loaded: false
};

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

const parser = parse({columns: true}, function(err, data){
    tickets.data = data.map(ticket => formatTicket(ticket));
    tickets.data.sort((a, b) => {
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
    tickets.loaded = true;
    console.log("Loaded Ticket Data...");
});

createReadStream(resolve(untildify(argv.csv))).pipe(parser);

app.get('/api/tickets', (req, res) => {
    res.json(tickets.data);
});

export default app;
