//Required to support babel's inline sourcemaps
require("source-map-support").install();
require('babel-register')({
    //See: https://babeljs.io/docs/usage/options/#options
    ignore: /node_modules/,
    presets: [["modern-node", { "version": "6.0.0" }], 'react', 'stage-0'],
    sourceMaps: 'both',
    babelrc: false //Do not use babelrc
});

const app = require('./src/server').default;

const host = process.env.HOST || process.env.NODE_ENV == 'production' ? '0.0.0.0' : '127.0.0.1';
const port = parseInt(process.env.PORT) || process.env.NODE_ENV == 'production' ? 80 : 3000;

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    app.listen(port, host, () => {
        console.log(`Listening at ${add} on port ${port}`);
    });
});
