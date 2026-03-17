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

module.exports = {
    MaxUserBot, 
}