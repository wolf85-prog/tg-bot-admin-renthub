const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const MaxUserBot = sequelize.define('maxuserbot', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    firstname: {type: DataTypes.STRING},
    lastname: {type: DataTypes.STRING},
    chatId: {type: DataTypes.STRING, unique: true},
    username: {type: DataTypes.STRING},
    managerId: {type: DataTypes.STRING},
    telegramId: {type: DataTypes.STRING},
})

const Message = sequelize.define('messagemax', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    conversationId: {type: DataTypes.STRING},
    senderId: {type: DataTypes.STRING},
    receiverId: {type: DataTypes.STRING},    
    text: {type: DataTypes.TEXT}, //текст сообщения;
    type: {type: DataTypes.STRING},      //тип сообщения;
    isBot: {type: DataTypes.BOOLEAN},
    messageId: {type: DataTypes.STRING},
    buttons: {type: DataTypes.STRING},   //названия кнопок;
    replyId: {type: DataTypes.STRING}, //id пересылаемого сообщения
})

const Conversation = sequelize.define('conversationmax', {
    members: {type: DataTypes.ARRAY(DataTypes.STRING)},
})

module.exports = {
    MaxUserBot, 
    Message,
    Conversation,
}