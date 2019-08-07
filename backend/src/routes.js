const express = require('express');
const UserController = require('./controllers/UserController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');

const routes = express.Router();

routes.get('/', (request, response) => {
    return response.json({ api: 'TinDev 0.0.0' });
});

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

routes.post('/users/:id/likes', LikeController.store);
routes.post('/users/:id/dislikes', DislikeController.store);

module.exports = routes;