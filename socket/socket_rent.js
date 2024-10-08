require('dotenv').config()
const fs = require('fs');
const https = require('https');

// Создание сервера
const express = require("express");
const socket = require("socket.io");
const cors = require('cors');

const PORT = process.env.PORT
const host_admin = process.env.HOST_ADMIN
const host = process.env.HOST

const app = express();
app.use(cors())

// Certificate
const privateKey = fs.readFileSync('privkey.pem', 'utf8'); 
const certificate = fs.readFileSync('cert.pem', 'utf8'); 
const ca = fs.readFileSync('chain.pem', 'utf8'); 

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log(`${host}:${PORT}`);
});

// Socket setup
const io = socket(httpsServer, {
    cors: {
        origin: [host_admin],
        optionsSuccessStatus: 200 // For legacy browser support
    }
});


let users = [];

const addUser = (userId, socketId) => {
    !users.some(user=>user.userId ===userId) &&
        users.push({userId, socketId})
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId)=>{
    console.log("getUser: ", users)
    return users.find((user) => user.userId === userId);
};


io.on("connection", (socket) => {

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    //send and get message
    socket.on("sendMessage", ({senderId, receiverId, text, type, convId, messageId, replyId})=>{
        const user = getUser(receiverId)
        io.emit("getMessage", {
            senderId,
            text,
            type,
            convId,
            messageId,
            replyId,
        })
    })

    //send and get message
    socket.on("sendAdmin", ({senderId, receiverId, text, type, buttons, convId, messageId})=>{
        io.emit("getAdmin", {
            senderId,
            receiverId,
            text,
            type,
            buttons,
            convId,
            messageId,
        })
    })

    //send and get message
    socket.on("delAdmin", ({messageId, messageDate, chatId})=>{
        io.emit("getDelAdmin", {
            messageId,
            messageDate,
            chatId,
        })
    })



    // Чат renthub
//------------------------------------------------------------------
    //send and get message in workers
    socket.on("sendMessageRent", ({senderId, receiverId, text, type, convId, messageId, replyId, isBot})=>{
        const user = getUser(receiverId)
        io.emit("getMessageRent", {
            senderId,
            text,
            type,
            convId,
            messageId,
            replyId,
            isBot, 
        })
    })


    //send and get message
    socket.on("sendAdminRent", ({senderId, receiverId, text, type, buttons, convId, messageId, isBot})=>{
        io.emit("getAdminRent", {
            senderId,
            receiverId,
            text,
            type,
            buttons,
            convId,
            messageId,
            isBot,
        })
    })

    //send and get message
    socket.on("delAdminRent", ({messageId, messageDate, chatId})=>{
        io.emit("getDelAdminRent", {
            messageId,
            messageDate,
            chatId,
        })
    })

    // Notifications
    //------------------------------------------------------------------
    //send and get message in workers
    socket.on("sendNotif", ({task, tg_id, fio, sity, year_of_birth, rating, projects, specialities, 
        comtags, foto, phone, workers_update, processUpdateD, processDistrib})=>{
        io.emit("getNotif", {
            task,
            tg_id,
            fio,
            sity,
            year_of_birth, 
            rating, 
            projects, 
            specialities, 
            comtags, 
            foto,
            phone,
            workers_update,
            processUpdateD,
            processDistrib,
        })
    })  
    
    // Distribution
    //------------------------------------------------------------------
    //send and get distrib
    socket.on("sendDistrib", ({task})=>{
        io.emit("getDistrib", {
            task
        })
    })

    //send and get message in workers
    socket.on("sendWorker", ({task, data})=>{
        io.emit("getWorker", {
            task,
            data,
        })
    })  



    //when disconnect
    socket.on("disconnect", ()=> {
        removeUser(socket.id);
        io.emit("getUsers", users)
    })

})
