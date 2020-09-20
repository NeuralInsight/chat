module.exports = {
    Query: {
        getUsers: () => {
            const users = [
                {
                    username: 'john',
                    email: 'john@email.com '
                },
                {
                    username: 'Jane',
                    email: 'Jane@email.com'
                },
            ]
            return users
        }
    }
}
