const {Manager} = require('../models/renthub')
const ApiError = require('../error/ApiError')

require("dotenv").config();

//const { Client } = require("@notionhq/client");
//const notion = new Client({ auth: process.env.NOTION_API_KEY });
//const databaseWorkerId = process.env.NOTION_DATABASE_WORKERS_ID

const {specData} = require('../data/specData');
const getManagersNotion = require('../common/getManagersNotion');
const getWorkersNotion100 = require('../common/getWorkersNotion100');
const getWorkersNotion100s = require('../common/getWorkersNotion100s');
const updateAvatar = require('../common/updateAvatar');

const host = process.env.HOST

const https = require('https');
const fs = require('fs');
const path = require('path')
//const sharp = require('sharp');

//socket.io
const {io} = require("socket.io-client");
const socketUrl = process.env.SOCKET_APP_URL

class RmanagersController {

    async getRmanagers(req, res) {
        try {
            const managers = await Manager.findAll({
                order: [
                    ['id', 'DESC'], //DESC, ASC
                ],
            })
            return res.status(200).json(managers);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getRManagerCount(req, res) {
        const kol = req.params.count
        const prev = req.params.prev
        try {
            const count = await Manager.count();
            //console.log(count)

            const k = parseInt(kol) + parseInt(prev)

            const managers = await Manager.findAll({
                order: [
                    ['id', 'ASC'], //DESC, ASC
                ],
                offset: count > k ? count - k : 0,
                //limit : 50,
            })
            return res.status(200).json(managers);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getRmanager(req, res) {
        const {id} = req.params
        try {
            const managers = await Manager.findOne({where: {chatId: id}})
            return res.status(200).json(managers);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    async editRmanager(req, res) { 
        const {id} = req.params      
        try {    
            let exist=await Manager.findOne( {where: {chatId: id}} )
            
            if(!exist){
                res.status(500).json({msg: "user not exist"});
                return;
            }

            const {username} = req.body

            const newUser = await Manager.update(
                { username },
                { where: {chatId: id} })
            return res.status(200).json(newUser);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    // async blockWorker(req, res) { 
    //     const {id} = req.params      
    //     try {    
    //         let exist=await Worker.findOne( {where: {chatId: id}} )
            
    //         if(!exist){
    //             res.status(500).json({msg: "user not exist"});
    //             return;
    //         }

    //         const newUser = await Worker.update(
    //             { block: exist.dataValues.block !==null ? !exist.dataValues.block : true},
    //             { where: {chatId: id} })
    //         return res.status(200).json(newUser);
    //     } catch (error) {
    //         return res.status(500).json(error.message);
    //     }
    // }

//------------------------------------------------------------
//        обновление аватарок
//------------------------------------------------------------
async updateManagers(req, res) {
    console.log("Start update manager")

    // Подключаемся к серверу socket
    let socket = io(socketUrl);

    socket.emit("sendNotifRent", {
        task: 302,
        managers_update: 0,
        processUpdateD: true,
    }) 

    try {
        console.log("START GET MANAGERS ALL...")

        const managers = await Manager.findAll({
            order: [
                ['id', 'DESC'], //DESC, ASC
            ],
        })
        console.log("managers: ", managers.length)  

        //получить всех специалистов из ноушен
        const managersN = await getManagersNotion()
        console.log("managersN: ", managersN.length)  

         


        //if (Object.keys(workersN).length !== 0) {
        if (managers && managers.length > 0) {
            //const managerProf = managersN.filter((item)=> item.profile && item.profile !== null)
            //console.log("managerProf: ", managerProf.length) 

            //обновить аватар
            let j = 0
            let proc = 0
            //while (j < workersProf.length) { 
            managers.map(async(man, index)=>{
                setTimeout(()=> {
                    const manApp = managersN.find((item)=> item.tgID === man.chatId?.toString())
                    console.log("manApp: ", manApp)
                    const avatar = manApp.profile.files && manApp.profile.files.length ? (manApp.profile?.files[0].file ? manApp.profile?.files[0].file.url : manApp.profile?.files[0].external.url) : null
                    
                    if (manApp) {
                        updateAvatar(avatar, manApp)
                        console.log("Менеджер найден!", index)  
                    } else {
                        console.log("Менеджер не найден!", index)  
                    }

                    proc = Math.round((index+1)*100/managers.length)

                    if (index === (managers.length)) {
                        console.log("Обновление данных завершено: i=", index, proc)
                        socket.emit("sendNotifRent", {
                            task: 302,
                            managers_update: proc,
                            processUpdateD: false,
                        })  
                        socket.disconnect()
                        
                    } else {
                        console.log("Идет обновление данных...: i=", index, proc)                      
                        //setTimeout(()=> {
                            socket.emit("sendNotifRent", {
                                task: 302,
                                managers_update: proc,
                                processUpdateD: true,
                            })  
                        //}, 10000 * i)
                    }
                }, 1000 * ++index)   
            })

            //обновить данные
            //console.log("ОБНОВЛЕНИЕ ДАННЫХ СПЕЦИАЛИСТОВ")
            
            // workers.map(async(worker, i)=> {
            //     let specArr = []
            //     setTimeout(async()=> {     
            //         const workerN = workersN.filter((item)=> item.tgId?.toString() === worker.chatId)        
                    
            //         if (workerN && workerN.length > 0) {
            //             console.log("Специалист в ноушен найден!", i)
            //             //список специалистов
            //             workerN[0].spec.map((item) => {
            //                 specData.map((category)=> {
            //                     category.models.map((work)=> {
            //                         if (work.name === item.name){
            //                             const obj = {
            //                                 spec: item.name,
            //                                 cat: category.icon,
            //                             }
            //                             specArr.push(obj)
            //                         }
            //                     })
            //                     if (category.icon === item.name) {
            //                         const obj = {
            //                             spec: item.name,
            //                             cat: category.icon,
            //                         }
            //                         specArr.push(obj) 
            //                     }
            //                 })
            //                 if (item.name === 'Blacklist') {
            //                     const obj = {
            //                         spec: item.name,
            //                         cat: 'Blacklist',
            //                     }
            //                     specArr.push(obj) 
            //                 }
            //                 if (item.name === '+18') {
            //                     const obj = {
            //                         spec: item.name,
            //                         cat: '+18',
            //                     }
            //                     specArr.push(obj) 
            //                 }
            //             })
    
            //             if (specArr.length > 0) {
            //                 //обновить бд
            //                 if (worker.chatId === '1408579113' || worker.chatId === '805436270' || worker.chatId === '639113098' || worker.chatId === '671797459' || worker.chatId === '276285228' || worker.chatId === '1144954767') {
            //                     const newSpec = {
            //                         spec: 'Вне категории',
            //                         cat: 'NoTag'
            //                     }
            //                     const newSpec2 = {
            //                         spec: 'Тест',
            //                         cat: 'Test'
            //                     }
            //                     specArr.push(newSpec)
            //                     specArr.push(newSpec2)

            //                     const res = await Worker.update({ 
            //                         worklist: JSON.stringify(specArr)  
            //                     },
            //                     { 
            //                         where: {chatId: worker.chatId} 
            //                     })
            //                 } else {             
            //                     const res = await Worker.update({ 
            //                         worklist: JSON.stringify(specArr)  
            //                     },
            //                     { 
            //                         where: {chatId: worker.chatId} 
            //                     })
            //                 }   
            //                 console.log("Список специальностей (есть) обновлен! ", worker.chatId, i)                                        
            //             } else {
            //                 //обновить бд
            //                 if (worker.chatId === '1408579113' || worker.chatId === '805436270' || worker.chatId === '639113098' || worker.chatId === '671797459' || worker.chatId === '276285228') {
            //                     const newSpec = {
            //                         spec: 'Вне категории',
            //                         cat: 'NoTag'
            //                     }
            //                     const newSpec2 = {
            //                         spec: 'Тест',
            //                         cat: 'Test'
            //                     }
            //                     specArr.push(newSpec)
            //                     specArr.push(newSpec2)

            //                     const res = await Worker.update({ 
            //                         worklist: JSON.stringify(specArr)  
            //                     },
            //                     { 
            //                         where: {chatId: worker.chatId} 
            //                     })
            //                 } else {
            //                     const res = await Worker.update({ 
            //                         worklist: JSON.stringify([{
            //                             spec: 'Вне категории',
            //                             cat: 'NoTag'
            //                         }]) 
            //                     },
            //                     { 
            //                         where: {chatId: worker.chatId} 
            //                     })
            //                 }
            //                 console.log("Список специальностей (нет) обновлен! ", worker.chatId, i) 
            //             }
                            
            //             console.log("ФИО: ", worker.id, workerN[0]?.fio, i)
                        

            //             //обновить фио
            //             const res = await Worker.update({ 
            //                 userfamily: workerN[0]?.fio.split(" ")[0],
            //                 username: workerN[0]?.fio.split(" ")[1],
            //                 phone: workerN[0]?.phone && workerN[0]?.phone,
            //                 dateborn: workerN[0].age?.start.split('-')[0],
            //                 city: workerN[0].city && workerN[0].city,     
            //                 newcity: workerN[0].newcity.length > 0 ? workerN[0].newcity[0].name : '',                
            //                 from: 'Notion',
            //                 comment: workerN[0]?.comment ? workerN[0]?.comment : '',
            //                 rank: workerN[0]?.rank ? workerN[0]?.rank : null,
            //             },
            //             { 
            //                 where: {chatId: worker.chatId} 
            //             })
            //             if (res) {
            //                 console.log("Специалист обновлен! ", worker.chatId, i) 
            //             }else {
            //                 console.log("Ошибка обновления! ", worker.chatId, i) 
            //             }
                        
            //         } else {
            //             console.log("Специалист не найден в Notion!", worker.chatId, i) 
            //         }     
                    
                    
            //     //}

            //     }, 500 * ++i)   
            // })              
        } else {
            console.log("Ошибка получения данных из таблицы 'Менеджеры' Notion!") 
        }         

    } catch (error) {
        console.log(new Date().toLocaleDateString())
        console.log(error.message)
    }
}


}

module.exports = new RmanagersController()