const { MaxUserBot } = require('../models/Maxbot')
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize')

const { connect } = require('../redisClient');

require("dotenv").config();


class MaxbotController {

    async getMaxbotChatId(req, res) {
        const {id} = req.params
        try {
            const userbot = await MaxUserBot.findOne({where: {chatId: id.toString()}})
            return res.status(200).json(userbot);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

}

module.exports = new MaxbotController()