import {Router} from 'express';

const app = new Router();

const serveApp = (req, res) => {
    res.renderApp("index.html");
};

app.get('/', serveApp);
app.get('/*', serveApp);

export default app;
