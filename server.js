require('babel-register')({
    //See: https://babeljs.io/docs/usage/options/#options
    ignore: /node_modules/,
    presets: ['modern-node/5.9'],
    sourceMaps: 'inline',
    babelrc: false //Do not use babelrc
});

//Required to support babel's inline sourcemaps
require("source-map-support").install();

require('./src/server');
