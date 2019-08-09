const axios = require('axios');
const gitHubApi = 'https://api.github.com/users/'
const User = require('../models/User');

module.exports = {
    async index(request, response) {
        const { user } = request.headers;

        const loggedUser = await User.findById(user);

        const users = await User.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedUser.likes } },
                { _id: { $nin: loggedUser.dislikes } }
            ]
        });
        return response.json(users);
    },
    async store(request, response) {
        const { username } = request.body;

        const userExists = await User.findOne({ user: username });

        if (userExists) {
            console.log(`User ${userExists.name} Logged`);
            return response.json(userExists);
        }

        try {
            const res = await axios.get(gitHubApi + username);

            const { name, bio, avatar_url: avatar } = res.data;

            const user = await User.create({
                name,
                user: username,
                bio,
                avatar
            });

            return response.json(user);
        } catch (error) {
            return response.status(400).json({ error: 'Dev not exists!' });
        }
    }
};