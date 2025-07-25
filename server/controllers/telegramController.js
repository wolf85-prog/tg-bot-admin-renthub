const ApiError = require('../error/ApiError')

//const { Op } = require('sequelize')

//fetch api
//const fetch = require('node-fetch');
const axios = require("axios");


const token = process.env.TELEGRAM_API_TOKEN_RENTHUB

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

//socket.io
const {io} = require("socket.io-client")
const socketUrl = process.env.SOCKET_APP_URL

class TelegramController {

    //send message
    async sendMessageToTelegram(req, res) {
        const {user, text} = req.body 

        try {   
            const url_send_msg = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${user}&parse_mode=html&text=${text.replace(/\n/g, '%0A')}`
                            
            console.log("Отправка текста в телеграм...")
                            
            const ressend = await $host.get(url_send_msg)

            return res.status(200).json(ressend.data);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //delete message
    async delMessageToTelegram(req, res) {
        const {user, messageId} = req.body 

        try {   
            const url_send_msg = `https://api.telegram.org/bot${token}/deleteMessage?chat_id=${user}&message_id=${messageId}`
                            
            console.log("Удаление сообщения в телеграм...")
                            
            const ressend = await $host.get(url_send_msg)

            return res.status(200).json(ressend.data);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //send photo
    async sendPhotoToTelegram(req, res) {
        const {user, photo, keyboard} = req.body 

        try {   
            const url_send_msg = `https://api.telegram.org/bot${token}/sendPhoto?chat_id=${user}&photo=${photo}&reply_markup=${keyboard ? keyboard : ''}`
                            
            console.log("Отправка фото в телеграм...")
                            
            const ressend = await $host.get(url_send_msg)

            return res.status(200).json(ressend.data);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //send document
    async sendDocumentToTelegram(req, res) {
        const {user, document, keyboard} = req.body 

        try {   
            const url_send_msg = `https://api.telegram.org/bot${token}/sendDocument?chat_id=${user}&document=${document}&reply_markup=${keyboard ? keyboard : ''}`
                            
            console.log("Отправка документы в телеграм...")
                            
            const ressend = await $host.get(url_send_msg)

            return res.status(200).json(ressend.data);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //send document form
    async sendDocumentFormToTelegram(req, res) {
        const {path, filename, chatId} = req.body
        
        const form = new FormData();
		form.append("chat_id", chatId); // добавление имени файла
		form.append("document", fs.createReadStream(path), filename); // добавление файла
 

        try {   
                            
            console.log("Отправка документа через форму в телеграм...")
                            
            const ressend = await $host.get(`https://api.telegram.org/bot${token}/sendDocument`, form)

            return res.status(200).json(ressend.data);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //send video
    async sendVideoToTelegram(req, res) {
        const {user, video, keyboard} = req.body 

        try {   
            const url_send_msg = `https://api.telegram.org/bot${token}/sendVideo?chat_id=${user}&video=${video}&reply_markup=${keyboard ? keyboard : ''}`
                            
            console.log("Отправка видео в телеграм...")
                            
            const ressend = await $host.get(url_send_msg)

            return res.status(200).json(ressend.data);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //send audio
    async sendAudioToTelegram(req, res) {
        const {user, audio, keyboard} = req.body 

        try {   
            const url_send_msg = `https://api.telegram.org/bot${token}/sendAudio?chat_id=${user}&audio=${audio}&reply_markup=${keyboard ? keyboard : ''}`
                            
            console.log("Отправка аудио в телеграм...")
                            
            const ressend = await $host.get(url_send_msg)

            return res.status(200).json(ressend.data);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

}

module.exports = new TelegramController()