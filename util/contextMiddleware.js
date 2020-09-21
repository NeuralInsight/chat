const jwt = require('jsonwebtoken');

module.exports = context => {
    if(context.req && context.req.headers.authorization) {
        const token = context.req.headers.authorization.split('Bearer ')[1]
        //TODO: set this secretOrPublickey to get from env
        jwt.verify(token, 'secret', (err, decodedToken) => {
            if (err) {
                throw new AuthenticationError('Unauthenticated')
            }
            context.user = decodedToken
        })
    }
    return context
}