var base = require("./webpack.config.dev.js");

var path = require('path');
var webpack = require('webpack');

module.exports = Object.assign({}, base, {
    name: 'app',
    //devtool: 'eval', //While faster, it does not produce builds that Uglify is capable of minimizing
    entry: Object.assign({}, base.entry, {
        //Do not include any hot loader client code in the vendors build, production don't need none of this
        app: ['./src/client/__app__.js']
    }),
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production") //Critical for dead-code elimination of debugging code in React
            }
        }),
        // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: Object.assign({}, base.module, {
        loaders: [{
            test: /\.jsx?$/,
            loaders: [
                'babel?' + JSON.stringify({
                    "babelrc": false,
                    "presets": ["es2015", "react", "stage-0"],
                    "plugins": [
                        ["transform-runtime", {
                            "polyfill": true,
                            "regenerator": true
                        }]
                    ]
                })
            ],
            exclude: /node_modules/
        }].concat(base.module.loaders.slice(1))
    })
});
