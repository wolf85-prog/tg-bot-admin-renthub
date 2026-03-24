const { MaxUserBot, Message, Conversation } = require('../models/Maxbot')
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize')

//const { connect } = require('../redisClient');

require("dotenv").config();

const tokenMax = process.env.MAX_API_TOKEN

class MaxbotController {

    async getMaxUsersRenthub(req, res) {
        try {
            const users = await MaxUserBot.findAll()
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getMaxbotChatId(req, res) {
        const {id} = req.params
        try {
            const userbot = await MaxUserBot.findOne({where: {chatId: id.toString()}})
            return res.status(200).json(userbot);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    //выбрать сообщения с конца таблицы (последние)
    async getMessagesMaxCount(req, res) {
        const count = req.params.count
        try {   
            const countAll = await Message.count();
            //console.log("MessagesAll: ", countAll)

            const messages = await Message.findAll({
                order: [
                    ['id', 'ASC'],
                ],
                offset: countAll > count ? countAll - count : 0,
                //limit : 50,
            })
            //console.log("MessagesCount: ", messages.length)
            return res.status(200).json(messages);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getConversationMax(req, res) {  
        try {
            const chatId = req.params.id
    
            const conversation = await Conversation.findOne({
                where: {
                    members: {
                        [Op.contains]: [chatId]
                    }
                },
            })
            return res.status(200).json(conversation);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getConversationsMax(req, res) {  
        try {   
            const conversations = await Conversation.findAll({
                order: [
                    ['id', 'DESC'],
                ],
            })
            return res.status(200).json(conversations);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //add message
    async newMessageMax(req, res) {
        const {conversationId, text, senderId, receiverId, type, isBot, messageId, buttons} = req.body
        try {
            await Message.create({conversationId, text, senderId, receiverId, type, isBot, messageId, buttons})
            return res.status(200).json("MessageW has been sent successfully");
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //delete message
    async delMessageMax(req, res) {
        const id = req.params.id
        try {
            await Message.destroy({
                where: { messageId: String(id) },
            })
            return res.status(200).json("Message has been delete successfully");
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }


    //send message
    async sendMessageToMax(req, res) {
        const {user, text} = req.body 

        try {   
            //const url_send_msg = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${user}&parse_mode=html&text=${text.replace(/\n/g, '%0A')}`
            const url_send_msg = `https://platform-api.max.ru/messages?user_id=${user}`
                            
            const ressend = await $host.post(url_send_msg, 
                                    { "text": text.replace(/\n/g, '%0A'),
                                    },
                                    {headers: {
                                        "Access-Control-Allow-Origin" : "*",
                                        "Content-type": "Application/json",
                                        "Authorization": `${tokenMax}`
                                        } 
                                    }  

                                )

            return res.status(200).json(ressend.data);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //send photo
    async sendPhotoToMax(req, res) {
        const {user, photo, keyboard} = req.body 

        try {   
            //const url_send_msg = `https://api.telegram.org/bot${token}/sendPhoto?chat_id=${user}&photo=${photo}&reply_markup=${keyboard ? keyboard : ''}`
            const url_send_msg = `https://platform-api.max.ru/messages?user_id=${user}`
                            
            //const ressend = await $host.get(url_send_msg)

            const ressend = await $host.post(url_send_msg, 
                                    { "text": '',
                                        "attachments": [
                                            {
                                            "type": "image", 
                                            "payload": {
                                                "url": photo
                                            }
                                            },
                                        ] 
                                    },
                                    {headers: {
                                        "Access-Control-Allow-Origin" : "*",
                                        "Content-type": "Application/json",
                                        "Authorization": `${tokenMax}`
                                        } 
                                    }  

                                )

            return res.status(200).json(ressend.data);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

}

module.exports = new MaxbotController()