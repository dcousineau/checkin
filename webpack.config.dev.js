const path = require('path');
const webpack = require('webpack');
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;

module.exports = {
    name: 'app',
    devtool: 'eval-source-map', //devtool: 'eval' for maximum build performance
    entry: {
        vendors: [
            'react-hot-loader/patch',
            'webpack-dev-server/client?http://localhost:3001/',
            './src/client/__vendors__.js',
        ],
        app: './src/client/__app__.js',
    },
    output: {
        path: path.join(__dirname, 'build/static'),
        publicPath: "/static/",
        filename: "js/[name].js"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("development")
            }
        }),

        new StatsWriterPlugin({
            filename: "assets.json"
        }),

        //The minChunks function ensures vendors only includes those files that are produced from 3rd party vendors,
        //namely anything in the node_modules folder
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendors",
            minChunks: function(module){
                return module.context && module.context.indexOf("node_modules") !== -1;
            }
        }),
        
        //The minChunks: Infinity creates a separate chunk, `manifest`, that contains only bootstrapping information
        //required by Webpack compiled modules
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),

        new webpack.HotModuleReplacementPlugin(),

        new webpack.NamedModulesPlugin(),

        // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    'react-hot-loader/webpack',
                    {
                        loader: "babel-loader",
                        options: {
                            babelrc: false,
                            presets: [["es2015", {"modules": false}], "react", "stage-0"],
                            plugins: [
                                "react-hot-loader/babel",
                                ["transform-runtime", {
                                    "polyfill": true,
                                    "regenerator": true
                                }],
                                "transform-react-jsx-source"
                            ],
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loaders: ['json-loader']
            }
        ]
    },
    devServer: {
        hot: true,
        compress: true,
        port: 3001
    }
};
