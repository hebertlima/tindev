const User = require('../models/User');

module.exports = {
    async store(request, response) {
        const { user } = request.headers;
        const { id } = request.params;

        const loggedUser = await User.findById(user);
        const targetUser = await User.findById(id);

        if (!targetUser) return response.status(400).json({ error: 'Dev not exists!' });

        if (targetUser.likes.includes(user)) {
            console.log(`<match> ${loggedUser.name} && ${targetUser.name} </match>`);
        }

        loggedUser.likes.push(targetUser._id);

        await loggedUser.save();

        console.log(`${loggedUser.name} Like ${targetUser.name}`);

        return response.json(loggedUser);
    }
}