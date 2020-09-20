const { User } = require('../models');

module.exports = {
    Query: {
        getUsers: async () => {
            try {
                const users = await User.findAll();
                console.log(users)

                return users;
            }catch (err){
                console.log(err);
            }
        },
    },
}
