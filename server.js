require('babel-register')({
    //See: https://babeljs.io/docs/usage/options/#options
    ignore: /node_modules/,
    presets: ['modern-node/5.9'],
    sourceMaps: 'inline',
    babelrc: false //Do not use babelrc
});

//Required to support babel's inline sourcemaps
require("source-map-support").install();

var app = require('./src/server').default;

if (process.env.NODE_ENV == 'production') {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        app.listen(80, '0.0.0.0', () => {
            console.log('Listening at ' + add);
        });
    });
} else {
    app.listen(3000, () => {
        console.log('Listening on port 3000!');
    });
}
