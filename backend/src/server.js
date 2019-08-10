const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const { username, password } = require('./credentials/mongodb-atlas.json');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;
});

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0-3nmv8.mongodb.net/tindev?retryWrites=true&w=majority`, {
    useNewUrlParser: true
});

app.use((request, response, next) => {
    request.io = io;
    request.connectedUsers = connectedUsers;
    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
