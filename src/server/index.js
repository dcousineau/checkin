import express from 'express';

import setupStatic from './config/static';
import setupTemplates from './config/templates';
import apiRoutes from './routes/api';
import appRoutes from './routes/app';

const app = express();

setupStatic(app);
setupTemplates(app);

app.use('/api', apiRoutes);
app.use('/', appRoutes);

export default app;
