const base = require("./webpack.config.dev.js");

const path = require("path");
const webpack = require("webpack");
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;

module.exports = Object.assign({}, base, {
  name: "app",
  devtool: false,
  entry: Object.assign({}, base.entry, {
    vendors: "./src/client/__vendors__.js"
  }),
  output: Object.assign({}, base.output, {
    filename: "js/[name].[chunkhash].min.js"
  }),
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production") //Critical for dead-code elimination of debugging code in React
      }
    }),

    new StatsWriterPlugin({
      filename: "assets.json"
    }),

    //The minChunks function ensures vendors only includes those files that are produced from 3rd party vendors,
    //namely anything in the node_modules folder
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendors",
      minChunks: function(module) {
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),

    //The minChunks: Infinity creates a separate chunk, `manifest`, that contains only bootstrapping information
    //required by Webpack compiled modules
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        dead_code: true,
        screw_ie8: true,
        warnings: false
      }
    }),

    // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: Object.assign({}, base.module, {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              presets: [["es2015", { modules: false }], "react", "stage-0"],
              plugins: [
                [
                  "transform-runtime",
                  {
                    polyfill: true,
                    regenerator: true
                  }
                ]
              ]
            }
          }
        ],
        exclude: /node_modules/
      }
    ].concat(base.module.rules.slice(1))
  })
});
