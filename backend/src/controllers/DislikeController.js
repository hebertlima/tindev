const User = require('../models/User');

module.exports = {
    async store(request, response) {
        const { user } = request.headers;
        const { id } = request.params;

        const loggedUser = await User.findById(user);
        const targetUser = await User.findById(id);

        if (!targetUser) return response.status(400).json({ error: 'Dev not exists!' });       

        loggedUser.dislikes.push(targetUser._id);

        await loggedUser.save();

        return response.json(loggedUser);
    }
}