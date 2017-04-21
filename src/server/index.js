import express from "express";
import { createServer } from "http";

import setupStatic from "./config/static";
import setupTemplates from "./config/templates";
import setupSocket from "./config/socket";
import apiRoutes from "./routes/api";
import appRoutes from "./routes/app";

const app = express();
const server = createServer(app);

setupStatic(app, server);
setupTemplates(app, server);

app.use("/api", apiRoutes);
app.use("/", appRoutes);

setupSocket(app, server);

export default server;
