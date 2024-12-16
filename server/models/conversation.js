const sequelize = require('../db_rent')
const {DataTypes} = require('sequelize')

const Conversation = sequelize.define('conversation', {
    members: {type: DataTypes.ARRAY(DataTypes.STRING)},
})


module.exports = {
    Conversation,
}