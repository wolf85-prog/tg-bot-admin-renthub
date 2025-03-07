const { Distribution }= require('../models/models')
const {Message, Conversation, Manager} = require('../models/renthub')
const ApiError = require('../error/ApiError')

const { Op } = require('sequelize')

//fetch api
//const fetch = require('node-fetch');
const axios = require("axios");

const webAppAddStavka = process.env.WEBAPP_STAVKA
const token = process.env.TELEGRAM_API_TOKEN_RENTHUB
const chatAdminId = process.env.REACT_APP_CHAT_ADMIN_ID
const host = process.env.HOST

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

//socket.io
const {io} = require("socket.io-client")
const socketUrl = process.env.SOCKET_APP_URL

class DistributionController {

//=========== Renthub =====================================================================

    //add Distribution
    async newDistributionR(req, res) {
        const {text, image, project, receivers, datestart, delivered, projectId, count, date, users, button, del, uuid, editButton, stavka, target, type} = req.body
        try {
            const distrib = await Distribution.create({
                text, 
                image, 
                project, 
                receivers, 
                datestart, 
                delivered, 
                projectId, 
                count, 
                date, 
                users, 
                button,
                del,
                uuid, 
                editButton,
                stavka,
                target,
                type
            })
            return res.status(200).json(distrib);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getDistributionsR(req, res) {
        try {
            const distributions = await Distribution.findAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    delivered: true
                }
            })
            return res.status(200).json(distributions);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getDistributionsCount(req, res) {
        const kol = req.params.count
        const prev = req.params.prev
        try {
            const count = await Distribution.count();
            //console.log(count)

            const k = parseInt(kol) + parseInt(prev)

            const distributions = await Distribution.findAll({
                order: [
                    ['id', 'ASC'], //DESC, ASC
                ],
                offset: count > k ? count - k : 0,
                //limit : 50,
            })
            return res.status(200).json(distributions);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getDistributionsRPlan(req, res) {
        try {
            const distributions = await Distribution.findAll({
                order: [
                    ['id', 'ASC'],
                ],
                where: {
                    delivered: false,
                }
            })
            return res.status(200).json(distributions);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getDistributionsRId(req, res) {
        const {id} = req.params
        try {
            const distib = await Distribution.findAll({where: {chatId: id}})
            return res.status(200).json(distib);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    async getDistributionR(req, res) {
        const {id} = req.params
        try {
            const distib = await Distribution.findOne({where: {id: id}})
            return res.status(200).json(distib);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    //delete message
    async delDistributionR(req, res) {
        const id = req.params.id
        try {
            await Distribution.destroy({
                where: { id: String(id) },
            })
            return res.status(200).json("Distribution has been delete successfully");
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //delete message
    async delDistributionRPlan(req, res) {
        const {id, date} = req.body

        try {
            await Distribution.destroy({
                where: { 
                    uuid: String(id),
                    date: String(date),
                    delivered: false,
                },
            })
            return res.status(200).json("Distribution has been delete successfully");
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }


    //обновить рассылку - поменять статус delivered
    async editDistribR(req, res) { 
        const {id} = req.params      
        try {    
            let exist=await Distribution.findOne( {where: {id: id}} )
            
            if(!exist){
                res.status(500).json({msg: "distrib not exist"});
                return;
            }

            const {delivered} = req.body

            const newDistrib = await Distribution.update(
                { delivered },
                { where: {id: id} })
            return res.status(200).json(newDistrib);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //обновить рассылку - поменять ВСЁ
    async editDistribRAll(req, res) { 
        const {id} = req.params      
        try {    
            let exist=await Distribution.findOne( {where: {id: id}} )
            
            if(!exist){
                res.status(500).json({msg: "distrib not exist"});
                return;
            }

            const {text, category, image, project, projectId, receivers, datestart, count, date, button, users, editButton, stavka, target} = req.body

            const newDistrib = await Distribution.update(
                { 
                    text,
                    category, 
                    image, 
                    project, 
                    projectId,
                    receivers,
                    datestart,   
                    count, 
                    date, 
                    button,
                    users,
                    editButton,
                    stavka,  
                    target,
                },
                { where: {id: id} })
            return res.status(200).json(newDistrib);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //обновить рассылку - поменять статус del
    async editDistribRPlan(req, res) {
        const {id, date, del} = req.body
        try {    
            let exist=await Distribution.findAll( {
                where: { 
                    uuid: String(id),
                    date: String(date),
                    delivered: false,
                }
            } )
            
            if(!exist){
                res.status(500).json({msg: "distrib not exist"});
                return;
            }

            const newDistrib = await Distribution.update(
                { del },
                { where: { 
                    uuid: String(id),
                    date: String(date),
                    delivered: false,
                }})
            return res.status(200).json(newDistrib);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }


    //send message
    async sendDistribR(req, res) {
        const {id} = req.params  
        let arrUsers = []
        let countSuccess = 0

        try {
            let exist=await Distribution.findOne( {where: {id: id}} )
            
            if(!exist){
                res.status(500).json({msg: "distrib not exist"});
                return;
            }

            const selected = exist.dataValues.users.split(',')
            const valueProject = exist.dataValues.projectId
            const textButton = exist.dataValues.button
            const text = exist.dataValues.text
            const image = exist.dataValues.image
            const editButton = exist.dataValues.editButton
            const stavkaButton = exist.dataValues.stavka
            const target = exist.dataValues.target

            //console.log("selected: ", selected)

            selected.map(async (user, index) => {      
                setTimeout(async()=> { 
                
                    console.log(index + " Пользователю ID: " + user + " сообщение отправляется!")
                    let  conversation_id  

                    //по-умолчанию пока сообщение не отправлено
                    arrUsers.push({
                        user: user,
                        status: 500,
                        mess: null,
                    }) 

                    //найти специалиста
                    const blockedWork = await Manager.findOne({
                        where: {
                            chatId: user
                        },
                    })

                    if (blockedWork.dataValues.block !== null && blockedWork.dataValues.block) {
                        console.log("Блок: ", user)
                    } else {
                        //найти беседу
                        const conversation = await Conversation.findOne({
                            where: {
                                members: {
                                    [Op.contains]: [user]
                                }
                            },
                        }) 

                        //если нет беседы, то создать 
                        if (!conversation) {
                            const conv = await Conversation.create(
                            {
                                members: [user, chatAdminId],
                            })
                            console.log("Беседа успешно создана: ", conv) 
                            console.log("conversationId: ", conv.id)
                            
                            conversation_id = conv.id
                        } else {
                            //console.log('Беседа уже создана в БД')  
                            conversation_id = conversation.id
                        }

                        //Передаем данные боту
                        let keyboard
                        if (textButton === '') {
                            console.log("textButton: НЕТ")
                            keyboard = JSON.stringify({
                                inline_keyboard: [
                                    [
                                        {"text": '', callback_data:'/report'},
                                    ],
                                ]
                            });
                        } else {
                            //console.log("textButton: ...")
                            keyboard = JSON.stringify({
                                inline_keyboard: [
                                    [
                                        {"text": textButton, callback_data:'/report'}, //web_app: {url: target}}, 
                                    ],
                                ]
                            });
                        }

                        let keyboard2

                        if (stavkaButton) {
                            keyboard2 = JSON.stringify({
                            inline_keyboard: [
                                [
                                    {"text": 'Принять', callback_data:'/accept ' + valueProject},
                                    {"text": 'Отклонить', callback_data:'/cancel ' + valueProject},
                                ],
                                [
                                    {"text": "Предложить свою ставку", web_app: {url: webAppAddStavka + '/' + valueProject}},
                                ],
                            ]
                            });
                        } else {
                            keyboard2 = JSON.stringify({
                            inline_keyboard: [
                                [
                                    {"text": 'Принять', callback_data:'/accept ' + valueProject},
                                    {"text": 'Отклонить', callback_data:'/cancel ' + valueProject},
                                ],
                            ]
                            });
                        }
        
                        //отправить в телеграмм
                        let sendTextToTelegram
                        let sendPhotoToTelegram
                        let url_send_photo                   
                        
                        if (text !== '') {
                            const url_send_msg = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${user}&parse_mode=html&text=${text.replace(/\n/g, '%0A')}`
                            //const url_send_msg = `https://api.telegram.org/bot${token}/getChat?chat_id=${user}`
                            
                            console.log("Отправка текста...", url_send_msg)
                            
                            sendTextToTelegram = await $host.get(url_send_msg)
                                    .catch(async(err) => {
                                        if (err.response.status === 403 && err.response.data.description === "Forbidden: bot was blocked by the user") {
                                            await Manager.update({ 
                                                deleted: true  
                                            },
                                            {
                                                where: {
                                                    chatId: user,
                                                },
                                            }) 
                                        }
                                    });
  

                            const { status } = sendTextToTelegram;              

                            if (status === 200) {
                                console.log("статус 200 текст")
                                countSuccess = countSuccess + 1 
                                
                                //обновить статус доставки
                                arrUsers[index-1].status = 200  
                                arrUsers[index-1].mess = sendTextToTelegram.data?.result?.message_id 

                                //обновить бд рассылку
                                const newDistrib = await Distribution.update(
                                    {   
                                        delivered: true,
                                        deleted: false,  
                                        report: JSON.stringify(arrUsers),  
                                        success: countSuccess
                                    },
                                    { where: {id: id} }
                                )
                            }                    
                        } else {
                            url_send_photo = `https://api.telegram.org/bot${token}/sendPhoto?chat_id=${user}&photo=${image}&reply_markup=${editButton ? keyboard : keyboard2}`
                            console.log("url_send_photo2: ", url_send_photo)

                            sendPhotoToTelegram = await $host.get(url_send_photo)
                                .catch(async(err) => {
                                    if (err.response.status === 403 && err.response.data.description === "Forbidden: bot was blocked by the user") {
                                        await Manager.update({ 
                                            deleted: true  
                                        },
                                        {
                                            where: {
                                                chatId: user,
                                            },
                                        }) 
                                    }
                                });
                            

                            const { status } = sendPhotoToTelegram;

                            if (status === 200 && text === '') {
                                console.log("статус 200 фото")
                                countSuccess = countSuccess + 1  
                                        
                                //обновить статус доставки
                                arrUsers[index-1].status = 200
                                arrUsers[index-1].mess = sendPhotoToTelegram.data?.result?.message_id   

                                //обновить бд рассылку
                                const newDistrib = await Distribution.update(
                                    { delivered: true,
                                        report: JSON.stringify(arrUsers),  
                                        success: countSuccess},
                                    { where: {id: id} }
                                )
                            }
                        }
                    
                        //отправить в админку
                        let message = {};
                        if (text !== '') {
                            console.log("no file")
                                message = {
                                    senderId: chatAdminId, 
                                    receiverId: user,
                                    conversationId: conversation_id,
                                    type: "text",
                                    text: text,
                                    isBot: true,
                                    messageId: sendTextToTelegram.data?.result?.message_id,
                                    buttons: '',
                                }
                        } else if (image) {
                            console.log("file yes")
                                message = {
                                    senderId: chatAdminId, 
                                    receiverId: user,
                                    conversationId: conversation_id,
                                    type: "image",
                                    text: image,
                                    isBot: true,
                                    messageId: sendPhotoToTelegram.data?.result?.message_id,
                                    buttons: textButton,
                                }
                        }
                        //console.log("message send: ", message);

                        //сохранение сообщения в базе данных wmessage
                        await Message.create(message)

                        //сохранить в контексте
                        if(!image) {
                            // Подключаемся к серверу socket
                            let socket = io(socketUrl);
                            socket.emit("addUser", user)
                            
                            //отправить сообщение в админку
                            socket.emit("sendAdminSpec", { 
                                senderId: chatAdminId,
                                receiverId: user,
                                text: text,
                                type: 'text',
                                buttons: textButton,
                                convId: conversation_id,
                                messageId: sendTextToTelegram.data.result.message_id,
                                isBot: true,
                            })
                        } else {
                            // Подключаемся к серверу socket
                            let socket = io(socketUrl);
                            //socket.emit("addUser", user)
                            
                            //отправить сообщение в админку
                            socket.emit("sendAdminSpec", { 
                                senderId: chatAdminId,
                                receiverId: user,
                                text: image,
                                type: 'image',
                                buttons: textButton,
                                convId: conversation_id,
                                messageId: sendPhotoToTelegram.data.result.message_id,
                                isBot: true,
                            })
                        }
                    }  

                }, 1000 * ++index) 

            })

            return res.status(200).json("Distribution has been send successfully");
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async sendDistribR2(req, res) {
        const {id} = req.params  
        let arrUsers = []
        let countSuccess = 0

        try {
            let exist=await Distribution.findOne( {where: {id: id}} )
            
            if(!exist){
                res.status(500).json({msg: "distrib not exist"});
                return;
            }

            const selected = exist.dataValues.users.split(',')
            const valueProject = exist.dataValues.projectId
            const textButton = exist.dataValues.button
            const text = exist.dataValues.text
            const image = exist.dataValues.image
            const editButton = exist.dataValues.editButton
            const stavkaButton = exist.dataValues.stavka
            const target = exist.dataValues.target

            //console.log("selected: ", selected)

            selected.map(async (user, index) => {      
                setTimeout(async()=> { 
                
                    console.log(index + " Пользователю ID: " + user + " сообщение отправляется!")
                    let  conversation_id  

                    //по-умолчанию пока сообщение не отправлено
                    arrUsers.push({
                        user: user,
                        status: 500,
                        mess: null,
                    }) 

                    //найти специалиста
                    const blockedWork = await Manager.findOne({
                        where: {
                            chatId: user
                        },
                    })

                    if (blockedWork.dataValues.block !== null && blockedWork.dataValues.block) {
                        console.log("Блок: ", user)
                    } else {
                        //найти беседу
                        const conversation = await Conversation.findOne({
                            where: {
                                members: {
                                    [Op.contains]: [user]
                                }
                            },
                        }) 

                        //если нет беседы, то создать 
                        if (!conversation) {
                            const conv = await Conversation.create(
                            {
                                members: [user, chatAdminId],
                            })
                            console.log("Беседа успешно создана: ", conv) 
                            console.log("conversationId: ", conv.id)
                            
                            conversation_id = conv.id
                        } else {
                            //console.log('Беседа уже создана в БД')  
                            conversation_id = conversation.id
                        }

                        //Передаем данные боту

                        const image_new = 'https://proj.uley.team/upload/2024-12-31T09:44:46.631Z.jpg'
                        const image_new2 = 'https://proj.uley.team/upload/2024-12-31T09:47:17.936Z.jpg'

                        let keyboard2 = JSON.stringify({
                            inline_keyboard: [
                                [
                                    {"text": 'С Новым Годом!', url: 'https://vk.com/uley.team'},
                                ],
                            ]
                        });
        
                        //отправить в телеграмм
                        let sendTextToTelegram
                        let sendPhotoToTelegram
                        let url_send_photo 
                        
                        let sendPhotoToTelegram2
                        let url_send_photo2  
                        
                        if (text !== '') {
                           
                        } else {
                            url_send_photo = `https://api.telegram.org/bot${token}/sendPhoto?chat_id=${user}&photo=${image_new}`
                            console.log("url_send_photo2: ", url_send_photo)

                            url_send_photo2 = `https://api.telegram.org/bot${token}/sendPhoto?chat_id=${user}&photo=${image_new2}&reply_markup=${keyboard2}`
                            console.log("url_send_photo2: ", url_send_photo2)


                            sendPhotoToTelegram = await $host.get(url_send_photo)
                                .catch(async(err) => {
                                    if (err.response.status === 403 && err.response.data.description === "Forbidden: bot was blocked by the user") {
                                        await Manager.update({ 
                                            deleted: true  
                                        },
                                        {
                                            where: {
                                                chatId: user,
                                            },
                                        }) 
                                    }
                                });
                            

                            const { status } = sendPhotoToTelegram;

                            if (status === 200 && text === '') {
                                console.log("статус 200 фото")
                                countSuccess = countSuccess + 1  
                                        
                                //обновить статус доставки
                                arrUsers[index-1].status = 200
                                arrUsers[index-1].mess = sendPhotoToTelegram.data?.result?.message_id   
                            }

                            sendPhotoToTelegram2 = await $host.get(url_send_photo2)
                        }
                    
                        //отправить в админку
                        let message = {};

                        message = {
                                senderId: chatAdminId, 
                                receiverId: user,
                                conversationId: conversation_id,
                                type: "image",
                                text: image_new,
                                isBot: true,
                                messageId: sendPhotoToTelegram.data?.result?.message_id,
                                buttons: textButton,
                        }        


                        //сохранение сообщения в базе данных wmessage
                        await Message.create(message)

                        //сохранить в контексте
                            // Подключаемся к серверу socket
                            let socket = io(socketUrl);
                            
                            //отправить сообщение в админку
                            socket.emit("sendAdminRent", { 
                                senderId: chatAdminId,
                                receiverId: user,
                                text: image_new,
                                type: 'image',
                                buttons: textButton,
                                convId: conversation_id,
                                messageId: sendPhotoToTelegram.data.result.message_id,
                                isBot: true,
                            })

                        //2
                        let message2 = {};

                        message2 = {
                                senderId: chatAdminId, 
                                receiverId: user,
                                conversationId: conversation_id,
                                type: "image",
                                text: image_new2,
                                isBot: true,
                                messageId: sendPhotoToTelegram2.data?.result?.message_id,
                                buttons: textButton,
                        }        


                        //сохранение сообщения в базе данных wmessage
                        await Message.create(message2)

                        //сохранить в контексте
                            // Подключаемся к серверу socket
                            let socket2 = io(socketUrl);
                            
                            //отправить сообщение в админку
                            socket2.emit("sendAdminRent", { 
                                senderId: chatAdminId,
                                receiverId: user,
                                text: image_new2,
                                type: 'image',
                                buttons: textButton,
                                convId: conversation_id,
                                messageId: sendPhotoToTelegram2.data.result.message_id,
                                isBot: true,
                            })
                        
                    }  

                    if (index === (selected.length)) {
                        //обновить бд рассылку
                        const newDistrib = await Distribution.update(
                            { delivered: true,
                                report: JSON.stringify(arrUsers),  
                                success: countSuccess},
                            { where: {id: id} }
                        )
                        console.log("newDistrib: ", newDistrib)
                    }

                }, 1000 * ++index) 

            })

            return res.status(200).json("Distribution has been send successfully");
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //del messages
    async delMessagesDistribR(req, res) {
        const {id} = req.params  
        let arrUsers = []
        let countSuccess = 0

        try {
            let exist=await Distribution.findOne( {where: {id: id}} )
            
            if(!exist){
                res.status(500).json({msg: "distrib not exist"});
                return;
            }

            const selected = exist.dataValues.users.split(',')
            const valueProject = exist.dataValues.projectId
            const textButton = exist.dataValues.button
            const text = exist.dataValues.text
            const image = exist.dataValues.image
            const editButton = exist.dataValues.editButton
            const target = exist.dataValues.target

            //console.log("selected: ", selected)

            selected.map(async (user, index) => {      
                setTimeout(async()=> { 
                
                    console.log(index + " Пользователю ID: " + user + " сообщение удалено!")
                    let  conversation_id  


                    //найти беседу
                    const conversation = await Conversation.findOne({
                        where: {
                            members: {
                                [Op.contains]: [user]
                            }
                        },
                    }) 

                    //если нет беседы, то создать 
                    if (!conversation) {
                        const conv = await Conversation.create(
                        {
                            members: [user, chatAdminId],
                        })
                        console.log("Беседа успешно создана: ", conv) 
                        console.log("conversationId: ", conv.id)
                        
                        conversation_id = conv.id
                    } else {
                        //console.log('Беседа уже создана в БД')  
                        //console.log("conversationId: ", conversation.id)  
                        
                        conversation_id = conversation.id
                    }


 

                }, 100 * ++index) 

            })

            return res.status(200).json("Distribution has been send successfully");
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = new DistributionController()