import express from 'express';
import nunjucks from 'nunjucks';

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

app.get('/', (req, res) => {
    res.render("index.html");
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
