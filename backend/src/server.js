const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const routes = require('./routes');

const { username, password } = require('./credentials/mongodb-atlas.json');

const server = express();

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0-3nmv8.mongodb.net/tindev?retryWrites=true&w=majority`, {
    useNewUrlParser: true
});

server.use(cors());
server.use(express.json());
server.use(routes);

server.listen(3333);
