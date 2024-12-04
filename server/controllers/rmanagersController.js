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

            const {username, sfera, worklist} = req.body

            const newUser = await Manager.update(
                { username, sfera, worklist },
                { where: {chatId: id} })
            return res.status(200).json(newUser);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async addRmanager(req, res) {       
        try {    

            const {fio} = req.body

            const newUser = await Manager.create({fio})
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

        if (managers && managers.length > 0) {
            //обновить аватар
            let j = 0
            let proc = 0
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
            console.log("ОБНОВЛЕНИЕ ДАННЫХ МЕНЕДЖЕРОВ")
            
            managers.map(async(man, i)=> {
                let specArr = []
                setTimeout(async()=> {     
                    const workerN = managersN.filter((item)=> item.tgID?.toString() === man.chatId)        
                    
                    if (workerN && workerN.length > 0) {
                        console.log("Менеджер в ноушен найден!", i)
                        //список специалистов
                        workerN[0].bisnes.map((item) => {
                            //specData.map((category)=> {
                                //if (category.icon === item.name) {
                                    const obj = {
                                        cat: item.name,
                                    }
                                    specArr.push(obj) 
                                //}
                            //})
                            // if (item.name === 'Blacklist') {
                            //     const obj = {
                            //         spec: item.name,
                            //         cat: 'Blacklist',
                            //     }
                            //     specArr.push(obj) 
                            // }
                            // if (item.name === '+18') {
                            //     const obj = {
                            //         spec: item.name,
                            //         cat: '+18',
                            //     }
                            //     specArr.push(obj) 
                            // }
                        })
    
                        if (workerN[0].bisnes.length > 0) {
                            //обновить бд
                            const res = await Manager.update({ 
                                worklist: JSON.stringify(specArr)  
                            },
                            { 
                                where: {chatId: man.chatId} 
                            })   
                            console.log("Список специальностей (есть) обновлен! ", man.chatId, i)                                        
                        } else {
                            console.log("Список специальностей пуст! ", man.chatId, i) 
                        }
                            
                        console.log("ФИО: ", man.id, workerN[0]?.fio, i)
                        

                        //обновить фио
                        const res = await Manager.update({ 
                            fio: workerN[0].fio,
                            phone: workerN[0].phone,
                            city: workerN[0].city,
                            company: workerN[0].companyId,
                            dojnost: workerN[0].doljnost,
                            comteg: workerN[0].comteg,
                            comment: workerN[0].comment,
                            //worklist: JSON.stringify(workerN[0].bisnes),
                        },
                        { 
                            where: {chatId: man.chatId} 
                        })
                        if (res) {
                            console.log("Менеджер обновлен! ", man.chatId, i) 
                        }else {
                            console.log("Ошибка обновления! ", man.chatId, i) 
                        }
                        
                    } else {
                        console.log("Менеджер не найден в Notion!", man.chatId, i) 
                    }     
                    
                    
                //}

                }, 500 * ++i)   
            })  
            
            return res.status(200).json("Managers update successfully");
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