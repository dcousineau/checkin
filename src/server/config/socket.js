import socketIO from "socket.io";

import socketServer from "../routes/socket";

export default (app, server) => {
  const io = socketIO(server);
  socketServer(io);
  app.locals.io = io;
};
