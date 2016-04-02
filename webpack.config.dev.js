var path = require('path');
var webpack = require('webpack');


module.exports = {
    name: 'app',
    devtool: 'source-map', //devtool: 'eval' for maximum build performance
    entry: {
        vendors: ['webpack-hot-middleware/client', './src/client/__vendor__.js'],
        app: ['./src/client/__app__.js']
    },
    output: {
        path: path.join(__dirname, 'src/static'),
        publicPath: "/static/",
        filename: "js/[name].js"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("development")
            }
        }),
        // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendors', 'js/vendors.js'),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        // preLoaders: [
        //     {
        //         test: /\.jsx?$/,
        //         loader: "eslint-loader",
        //         exclude: /node_modules/
        //     }
        // ],
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: [
                    'react-hot',
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
            },
            {
                test: /\.json$/,
                loaders: ['json-loader']
            }
        ]
    },
    // resolve: {
    //     root: path.resolve(__dirname, 'src/client'),
    //     modulesDirectories: [path.resolve(__dirname, 'src/client'), path.resolve(__dirname, 'node_modules')],
    //     extensions: ['', '.js', '.jsx', '.css', '.scss', '.sass']
    // }
};
