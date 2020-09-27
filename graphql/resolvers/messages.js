const {Op} =  require("sequelize");
const { Message, User } = require('../../models');
const { PubSub } = require('apollo-server');
const { UserInputError, AuthenticationError } = require('apollo-server');

const pubsub = new PubSub();

module.exports = {
    Query: {
        getMessages: async (parent,{from},{user}) => {
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                const otherUser = await User.findOne({
                    where: { username: from }
                })
                if(!otherUser) throw new UserInputError('User not found')

                const usernames = [user.username, otherUser.username]

                const messages = await Message.findAll({
                    where: {
                        from: { [Op.in]: usernames },
                        to: { [Op.in]: usernames },
                    },
                    order:[['createdAt', 'DESC']],
                })

                return messages;

            }catch (err){
                console.log(err)
                throw err
            }
        }
    },
    Mutation: {
        sendMessage: async (parent, { to, content }, { user }) => {
            try{
                console.log(user)
                if(!user) throw new AuthenticationError('Unauthenticated')

                const recipient = await User.findOne({ where: { username: to }})

                if(!recipient){
                    throw new UserInputError('User Not Found')
                }else if(recipient.username === user.username){
                    throw new UserInputError("You cant sent message yourself but it become update to saved message")
                }

                if(content.trim() === ''){
                    throw new UserInputError('Message is empty')
                }

                const message = await Message.create({
                    from: user.username,
                    to,
                    content,
                })

                pubsub.publish('NEW_MESSAGE', { newMessage: message })

                return message

            }catch (err){
                console.log(err)
                throw err
            }
        },
    },
    Subscription: {
        newMessage: {
            subscribe: () => pubsub.asyncIterator(['NEW_MESSAGE'])
        } 
    }
}
