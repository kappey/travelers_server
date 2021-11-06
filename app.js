const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const cors = require ('cors');
const dotenv = require ('dotenv').config();
const { routesInit , corsAccessControl } = require('./routes/configRoutes');
const fileUpload = require("express-fileupload");

require('./dataBase/mongoConnection');
require ('dotenv').config();

const app = express();

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(express.static(path.resolve('./public')))

app.use(express.json());

app.use(cors());

routesInit(app);
corsAccessControl(app);

const server = http.createServer(app);
const PORT = process.env.PORT || "3000";
server.listen(PORT);


const io = socketio(server, {
    cors:{
        origin:'*',
        methods:['GET','POST','PUT','DELETE']
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
  });

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('post', (p) => {
        console.log('post: ' + p);
        io.emit('my broadcast', `server: ${p}`);
    });

  });



