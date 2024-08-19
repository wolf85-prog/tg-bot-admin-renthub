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

route.post('/message/add', newMessage)
route.delete('/message/delete/:id', delMessage)
route.get('/message/get', getAllMessages)
route.get('/message/get/:id', getMessages)
route.get('/message/last/get/:id', getLastMessages)

route.get('/message/count/get', getCountMessages)

//кол-во сообщений
route.get('/message/count/add/:count', newCountMessage)
route.get('/wmessage/count/add/:count', newCountWMessage)
route.get('/projects/count/add/:count', newCountProjects)
route.get('/pretendent/count/add/:count', newCountMessagePretendent)


route.post('/conversation/add', newConversation)
route.get('/conversation/get/:id', getConversation)
route.get('/conversations/get', getConversations)

//route.post('/userbots/add', addUser)
route.get('/userbots/get', getUsers)
route.get('/userbots/get/:id', getUser)
route.patch('/userbots/update/:id', editUser)
route.patch('/userbots/updatefile/:id', editUserAvatar)



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

route.post("/file/upload", upload.single("photo"), uploadFile);
route.post("/file/distrib", uploadDistrib.single("photo"), uploadFile);
route.get("/file/:filename", getImage);



//-----------------Обновление данных профиля---------------------------------
route.get('/workers/update/get', updateWorkers)



module.exports = route