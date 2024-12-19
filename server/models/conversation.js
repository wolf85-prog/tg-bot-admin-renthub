const sequelize = require('../db_rent')
const {DataTypes} = require('sequelize')

const UserBot = sequelize.define('userbot', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    firstname: {type: DataTypes.STRING},
    lastname: {type: DataTypes.STRING},
    chatId: {type: DataTypes.STRING, unique: true},
    username: {type: DataTypes.STRING},
    avatar: {type: DataTypes.STRING},
})

const Conversation = sequelize.define('conversation', {
    members: {type: DataTypes.ARRAY(DataTypes.STRING)},
})


module.exports = {
    UserBot,
    Conversation,
}