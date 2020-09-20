const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError } = require('apollo-server');

module.exports = {
    Query: {
        getUsers: async (_,__,context) => {
            let user;
            if(context.req && context.req.headers.authorization){
                const token = context.req.headers.authorization.split('Bearer ')[1]
                //TODO: set this secretOrPublickey to get from env
                jwt.verify(token, 'secret', (err, decodedToken) => {
                    if(err){
                        throw new AuthenticationError('Unauthenticated')
                    }
                    user = decodedToken
                    console.log(user)
                })
            }

            try {
                const users = await User.findAll();
                console.log(users)

                return users;
            }catch (err){
                console.log(err);
            }
        },
        login: async (_,args) => {
            const {username,password} = args;
            let errors = {};

            try{
                if(username.trim() === '') errors.username = 'username must not be empty'
                if(password === '') errors.password = 'password must not be empty'

                if(Object.keys(errors).length > 0){
                    throw new UserInputError('user not found', {errors})
                }

                const user = await User.findOne({
                    where: { username }
                })

                if(!user){
                    errors.username = 'user not found';
                    throw new UserInputError('user not found',{ errors })
                }



                const correctPassword = await bcrypt.compare(password, user.password)

                if(!correctPassword){
                    errors.password = 'password is incorrect'
                    throw new AuthenticationError('password is incorrect',{ errors })
                }
                //TODO: Change this secret with Complicated one and save it to .env
                const token = jwt.sign({ username }, 'secret', { expiresIn: 60 * 60 });

                return {
                    ...user.toJSON(),
                    createdAt: user.createdAt.toISOString(),
                    token
                }

            }catch (err){
                console.log(err)
            }

        }
    },
    Mutation: {
        register: async (_, args) =>{
            let { username, email, password, confirmPassword } = args;
            let errors = {};

            try{
                // Validate input data
                if(email.trim() == '') errors.email = 'email must not be empty'
                if(username.trim() == '') errors.uesername = 'username must not be empty'
                if(password.trim() == '') errors.password = 'passwrod must not be empty'
                if(confirmPassword.trim() == '') errors.confirmPassword = 'repeat password must not be empty'

                if(password !== confirmPassword) errors.confirmPassword = 'password must match'

                // check if username / email exists
                const userByUsername = await User.findOne({where: { username }});
                const userByEmail = await User.findOne({where: { email }});

                if(userByUsername) errors.username = 'Username is taken'
                if(userByEmail) errors.email = 'Email is taken'

                if(Object.keys(errors).length > 0){
                    throw errors
                }

                // Hash Password
                password =  await bcrypt.hash(password,6)
                // Create user
                const user = await User.create({
                    username,email,password
                })
                // Return user
                return user;
            }catch (err){
                console.log(err)
                if(err.name === 'SequelizeUniqueConstraintError'){
                    err.errors.forEach(e => (errors[e.path] = `${e.path} is aleardy taken`))
                }
                throw new UserInputError('Bad input', { errors });
            }
        }
    }
}
