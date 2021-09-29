const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const config = require('./config/config');
const morgan = require('./config/morgan');
const superAdminRoutes = require('./routes/backEnd/superAdmin')
const routes = require('./routes');
const path = require('path');
const { setallrestaurantdb } = require('./config/setrestaurantdb');
const httpStatus = require('http-status');
const salonRoutes = require('./routes//backEnd/salon')
const websiteRoutes = require('./routes/frontEnd')
const { authLimiter } = require('./middlewares/rateLimiter');
const socketIO = require('socket.io')
const http = require('http')

const app = express();

const socketServer = http.createServer(app)
socketServer.listen('4002', () => {
  console.log('listening on socket server at 4002');
})
const io = socketIO(socketServer, {
  cors: {
    origin: '*'
  }
})
const activeUsers = new Set();

let roomId = "";



app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(express.static(path.join(__dirname, '/')));

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

global.ObjectId = require('mongodb').ObjectID;


global.salons = {};
global.activedb = undefined;
global.restaurantdbconn = [];

app.use(setallrestaurantdb());

app.use('/api', routes);

app.use('/api/superadmin', superAdminRoutes);

app.use('/api/salon', salonRoutes)
app.use('/api', websiteRoutes)

io.on("connection", (socket) => {
  console.log('connection open');
  // Joining room for conversation
  socket.on("JOIN_ROOM", (room) => {
    console.log('join room', room);
    roomId = room;
    socket.join(room);
  });

  // Listen to NEW_MESSAGE for receiving new messages
  socket.on("SEND_TO_CUSTOMER_VIEW", (msg) => {
    io.to(roomId).emit("SEND_TO_CUSTOMER_VIEW", msg);
  });

  socket.on("SEND_TO_ADMIN_VIEW", (msg) => {
    io.to(roomId).emit("SEND_TO_ADMIN_VIEW", msg);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);

    // Triggering this event disconnects user
    io.to(roomId).emit("user disconnected", socket.userId);
  });
});
// app.use((req, res, next) => {
//   console.log(global.restaurants);
//   return next()
// })
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(res.status(httpStatus.NOT_FOUND).send({ message: "Internal Server Error" }));
});




module.exports = app;
