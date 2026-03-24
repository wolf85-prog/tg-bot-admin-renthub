const { MaxUserBot, Message, Conversation } = require('../models/Maxbot')
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize')

//const { connect } = require('../redisClient');

require("dotenv").config();


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

}

module.exports = new MaxbotController()