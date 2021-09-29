const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const socketIO = require('socket.io')
// const WebSocket = require('ws')
// const socketServer = new WebSocket.Server(
//   { port: 4002 },
//   () => logger.info('Server running on port 4002!'),
// );
// const clients = new Map();
// global.socketClient = undefined
// global.sendSocketMessage = () => { }
// const users = new Set();

// socketServer.on('connection', (socket) => {
//   const userRef = {
//     socket: socket,
//   };
//   users.add(userRef);
//   const metadata = { id: 1 }
//   clients.set(socket, metadata);
//   sendSocketMessage = (msg) => {
//     socket.send(msg)

//   }
//   socket.on('message', (msg) => {

//     const message = JSON.parse(msg);
//     console.log('message', message);

//     const metadata = clients.get(socket);

//     msg.sender = metadata.id;
//     const outbound = JSON.stringify(message);

//     // [...clients.keys()].forEach((client) => {
//     //   client.send(outbound);
//     // });
//   });
//   socket.on('close', (code, reason) => { console.log('code', code, reason); clients.delete(socket); });
// });

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port} and running on ${config.env}`);
  });
});
mongoose.set('useFindAndModify', false);
// const exitHandler = () => {
//   if (server) {
//     server.close(() => {
//       logger.info('Server closed');
//       process.exit(1);
//     });
//   } else {
//     process.exit(1);
//   }
// };

// const unexpectedErrorHandler = (error) => {
//   logger.error(error);
//   exitHandler();
// };

// process.on('uncaughtException', unexpectedErrorHandler);
// process.on('unhandledRejection', unexpectedErrorHandler);

// process.on('SIGTERM', () => {
//   logger.info('SIGTERM received');
//   if (server) {
//     server.close();
//   }
// });
