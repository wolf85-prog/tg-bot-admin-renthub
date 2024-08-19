const Router = require('express')
const route = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const { newMessage, delMessage, getMessages, getLastMessages, getAllMessages, getCountMessages, 
    newCountMessage, newCountWMessage, newCountProjects, newCountMessagePretendent,
 } = require('../controllers/messageController')
const { newConversation, getConversation, getConversations } = require('../controllers/conversationController')
const { addUser, getUsers, getUser, editUser, editUserAvatar} = require('../controllers/userbotController')
const { getReports, getReportsId } = require('../controllers/reportController')
const { getProjects, getProjectsId, getProjectNew, getProjectNewId, getProjectNewCreate, getProjectNewUpdate, getProjectNewDel } = require('../controllers/projectController')
const { uploadFile, getImage } = require( "../controllers/fileController.js")

//const { newPlan, getPlan, addTimer } = require('../controllers/planController')


const upload = require('../middleware/file')
const uploadDistrib = require('../middleware/fileDistrib') //папка для файлов в рассылках

route.post('/user/registration', userController.registration)
route.post('/user/login', userController.login)
route.get('/user/auth', authMiddleware, userController.check)
route.get('/user/get', authMiddleware, userController.getAll)
route.get('/user/get/:id', authMiddleware, userController.getOne)


//----------------RENTHUB--------------------------------
route.get('/ruserbots/get', getUsersRenthub)
route.get('/ruserbots/get/:id', getUserRenthub)
route.patch('/ruserbots/update/:id', editUserRenthub)

route.post('/rmessage/add', newMessageR)
route.delete('/rmessage/delete/:id', delMessageR)
route.get('/rmessage/get', getAllMessagesR)
route.get('/rmessage/get/:id', getMessagesR)
route.get('/rmessage/get/count/:count', getMessagesRCount)
route.get('/rmessage2/get/:id/:count/:prev', getMessagesR2) //еще

route.post('/rconversation/add', newConversationR)
route.get('/rconversation/get/:id', getConversationR)
route.get('/rconversations/get', getConversationsR)

route.get('/rmanagers/get', getRmanagers)
route.get('/rmanagers/get/:id', getRmanager)
route.patch('/rmanagers/update/:id', editRmanager)
//route.get('/rmanager/block/:id', blockWorker)
route.get('/rmanagers/count/get/:count/:prev', getRManagerCount) //еще



//-------------------------------------------------------------------
route.get('/reports/get', getReports)
route.get('/reports/get/:id', getReportsId)

route.get('/projects/get', getProjects)
route.get('/projects/get/:id', getProjectsId)
route.get('/projectnew/get', getProjectNew)
route.get('/projectnew/get/:id', getProjectNewId)

route.post('/projectnew/add', getProjectNewCreate)
route.post('/projectnew/update', getProjectNewUpdate)
route.post('/projectnew/del', getProjectNewDel)

// route.post("/file/upload", upload.single("photo"), uploadFile);
// route.post("/file/distrib", uploadDistrib.single("photo"), uploadFile);
route.get("/file/:filename", getImage);



module.exports = route