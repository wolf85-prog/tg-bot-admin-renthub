import {$authHost, $host, $host_bot, $host_bottest, $host_call, $host_old} from "./index";


export const getManagers = async () =>{
    try {
       let response = await $host_bot.get('managers');
       //console.log(response);
       return response.data;
    } catch (error) {
        console.log("error while calling getManagers api", error.message);
    }
}

export const getProjects = async () =>{
    try {
       let response = await $host_bot.get('projects');
       //console.log("projects: ", response.data);
       return response.data;
    } catch (error) {
        console.log("error while calling getProjects api", error.message);
    }
}

export const getProjects2 = async () =>{
    try {
       let response = await $host_bot.get('projects2');
       console.log("projects: ", response.data.results);
       return response.data.results;
    } catch (error) {
        console.log("error while calling getProjects2 api", error.message);
    }
}

//api notion
export const getProjects3 = async () =>{
    try {
        let response = await $host_bot.get('projects3');
        //console.log("projectsAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getProjects3 api", error.message);
    }
}

//api notion
export const getProjectAll = async () =>{
    try {
        let response = await $host_bot.get('projectall');
        //console.log("projectsAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getProjectAll api", error.message);
    }
}

//api notion
export const getProjectNewDate = async () =>{
    try {
        let response = await $host_bot.get('projectnewdate');
        //console.log("projectsAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getProjectNewDate api", error.message);
    }
}

//api бд
export const getProjectNewCash = async () =>{
    try {
        let response = await $host_bot.get('projectsnewcash');
        //console.log("projectsAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getProjectNewCash api", error.message);
    }
}

//api бд
export const getProjectCash = async () =>{
    try {
        let response = await $host_bot.get('projectscash');
        //console.log("projectsAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getProjectCash api", error.message);
    }
}

//api notion
export const getProjectCrmId = async (id) =>{
    try {
        let response = await $host_bot.get('project/crm/' + id);
        console.log("projectCrmIdAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getProjectCrmId api", error.message);
    }
}

//api id notion
export const getProjectId = async (id) =>{
    try {
        let response = await $host_bot.get('project/' + id);
        //console.log("projectsAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getProjectId api", error.message);
    }
}

export const newPlan = async (data) => {
    try {
        let response =  await $host.post(`api/plan/add`, data); 
        console.log("planAPI: ", response.data);
    } catch (error) {
        console.log("error while calling newPlan api", error.message);
    }
}

export const getPlan = async (date) => {
    try {
        let response =  await $host.get('api/plan/get/' + date); 
        //console.log("planAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getPlan api", error.message);
    }
}

export const addTimer = async (data) => {
    try {
        let response =  await $host.post(`api/plan/timer/add`, data);
        //console.log("planAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling addTimer api", error.message);
    }
}

export const getProjectNew = async () => {
    try {
        let response =  await $host_old.get(`api/projectnew/get`);
        //console.log("planAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getProjectNew api", error.message);
    }
}

export const getProjectNewId = async (id) => {
    try {
        let response =  await $host.get(`api/projectnew/get/` + id);
        //console.log("planAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getProjectNewId api", error.message);
    }
}

export const getProjectNewCreate = async (data) => {
    try {
        let response =  await $host.post(`api/projectnew/add`, data);
        //console.log("planAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getProjectNewCreate api", error.message);
    }
}

export const getProjectNewUpdate = async (data) => {
    try {
        let response =  await $host.post(`api/projectnew/update`, data);
        //console.log("planAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getProjectNewUpdate api", error.message);
    }
}

export const getProjectNewDel = async (data) => {
    try {
        let response =  await $host.post(`api/projectnew/del`, data);
        //console.log("planAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getProjectNewDel api", error.message);
    }
}


export const getProjectsAllNotion = async () =>{
    try {
       let response = await $host_bot.get('projectsallnotion');
       return response.data;
    } catch (error) {
        console.log("error while calling getProjectsAllNotion api", error.message);
    }
}


//get Workers
export const getWorkers = async () =>{
    try {
       let response = await $host_bottest.get('workers');
       //console.log(response);
       return response.data;
    } catch (error) {
        console.log("error while calling getWorkers api", error.message);
    }
}

export const getWorkerId = async (chatId) =>{
    try {
       let response = await $host_bottest.get('workers/chat/' + chatId);
       //console.log("database: ", response);
       return response;
    } catch (error) {
        console.log("error while calling getWorkerId api", error.message);
    }
}


export const getBlocks = async (projectId) =>{
    try {
       let response = await $host_bot.get('blocks/' + projectId);
       //console.log("blockId: ", response);
       return response;
    } catch (error) {
        console.log("error while calling getBlocks api", error.message);
    }
}

export const getDatabaseId = async (blockId) =>{
    try {
       let response = await $host_bot.get('database/' + blockId);
       //console.log("database: ", response);
       return response;
    } catch (error) {
        console.log("error while calling getDatabase api", error.message);
    }
}



export const getProjectsApi = async () =>{
    try {
       let response = await $host.get('api/projects/get');
       return response.data;
    } catch (error) {
        console.log("error while calling getProjectsApi api", error.message);
    }
}

export const getCompanys = async () =>{
    try {
       let response = await $host_bot.get('companys');
       return response.data;
    } catch (error) {
        console.log("error while calling getCompanys api", error.message);
    }
}

export const getCompanyId = async (id) =>{
    try {
       let response = await $host_bot.get(`company/${id}`);
       //console.log("getCompanyId: ", response.data);
       return response.data;
    } catch (error) {
        console.log("error while calling getCompany api", error.message);
    }
}

export const getContacts = async () =>{
    try {
       let response = await $host.get('api/userbots/get');
       //console.log(response);
       return response.data;
    } catch (error) {
        console.log("error while calling getUsers api", error.message);
    }
}

export const getContactId = async (id) =>{
    try {
       let response = await $host.get(`api/userbots/get/${id}`);
       //console.log(response);
       return response.data;
    } catch (error) {
        console.log("error while calling getUser api", error.message);
    }
}

export const editContact = async (data, id) =>{
    try {
       let response = await $host.patch(`api/userbots/update/${id}`, data);
       console.log(response);
       return response.data;
    } catch (error) {
        console.log("error while calling editContact api", error.message);
    }
}

export const editContactAvatar = async (data, id) =>{
    try {
       let response = await $host.patch(`api/userbots/updatefile/${id}`, data);
       console.log("response: ", response);
       return response.data;
    } catch (error) {
        console.log("error while calling editContactAvatar api", error.message);
    }
}

export const uploadFile = async (data) =>{
    try {
        return await $host.post(`api/file/upload`, data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
    } catch (error) {
        console.log("error while calling uploadFile api",error.message);
        
    }
}


//distribution
export const newDistribution = async (data) =>{
    try {
        let response = await $host.post(`api/distribution/add`, data); 
        return response.data;
    } catch (error) {
        console.log("error while calling newDistribution api",error.message);
    }
}

export const getDistributions = async()=>{
    try {
        let response = await $host.get('api/distributions/get');
        //console.log(response);
        return response.data;
     } catch (error) {
         console.log("error while calling getDistributions api", error.message);
     }
}

export const delDistribution = async (id) =>{
    try {
        await $host.delete(`api/distributions/delete/${id}`); 
    } catch (error) {
        console.log("error while calling delMessage api",error.message);
    }
}

export const editDistribution = async (data, id) =>{
    try {
        await $host.patch(`api/distributions/update/${id}`, data); 
    } catch (error) {
        console.log("error while calling editDistribution api",error.message);
    }
}

//--------------------------------------------------------------------------
//distribution2
//--------------------------------------------------------------------------
export const newDistributionR = async (data) =>{
    try {
        let response = await $host.post(`api/distributionr/add`, data); 
        return response.data;
    } catch (error) {
        console.log("error while calling newDistributionR api",error.message);
    }
}

export const getDistributionsR = async()=>{
    try {
        let response = await $host.get('api/distributionsr/get');
        //console.log(response);
        return response.data;
     } catch (error) {
         console.log("error while calling getDistributionsW api", error.message);
     }
}

export const getDistributionsCountR = async(count, prev)=>{
    try {
        let response = await $host.get(`api/distributionsr/count/get/${count}/${prev}`);
        //console.log(response);
        return response.data;
     } catch (error) {
         console.log("error while calling getDistributionsW api", error.message);
     }
}

export const getDistributionsRPlan = async()=>{
    try {
        let response = await $host.get(`api/distributionsr/plan/get`);
        //console.log(response);
        return response.data;
     } catch (error) {
         console.log("error while calling getDistributionsWPlan api", error.message);
     }
}

export const getDistributionR = async(id)=>{
    try {
        let response = await $host.get(`api/distributionr/get/${id}`)
        //console.log(response);
        return response.data;
     } catch (error) {
         console.log("error while calling getDistribution api", error.message);
     }
}

export const delDistributionR = async (id) =>{
    try {
        await $host.delete(`api/distributionsr/delete/${id}`); 
    } catch (error) {
        console.log("error while calling delMessage api",error.message);
    }
}

export const delDistributionRPlan = async (data) =>{
    try {
        await $host.post(`api/distributionsr/delete`, data); 
    } catch (error) {
        console.log("error while calling delMessage api",error.message);
    }
}

export const editDistributionR = async (data, id) =>{
    try {
        await $host.patch(`api/distributionsr/update/${id}`, data); 
    } catch (error) {
        console.log("error while calling editDistributionW api",error.message);
    }
}

export const editDistributionW2 = async (data, id) =>{
    try {
        await $host.patch(`api/distributionsw2/update/${id}`, data); 
    } catch (error) {
        console.log("error while calling editDistributionW2 api",error.message);
    }
}

export const editDistributionWAll = async (data, id) =>{
    try {
        await $host.patch(`api/distributionswall/update/${id}`, data); 
    } catch (error) {
        console.log("error while calling editDistributionW2 api",error.message);
    }
}

export const editDistributionRPlan = async (data) =>{
    try {
        await $host.post(`api/distributionsr/plan/update`, data); 
    } catch (error) {
        console.log("error while calling editDistributionW api",error.message);
    }
}


export const getCountMessage = async()=>{
    try {
        let response = await $host.get(`api/message/count/get`);
        //console.log(response);
        return response.data;
     } catch (error) {
         console.log("error while calling getCountMessage api", error.message);
     }
}

// message
export const newCountMessage = async (count) =>{
    try {
        await $host.get(`api/message/count/add/${count}`); 
    } catch (error) {
        console.log("error while calling newCountMessage api",error.message);
    }
}

// wmessage
export const newCountWMessage = async (count) =>{
    try {
        await $host.get(`api/wmessage/count/add/${count}`); 
    } catch (error) {
        console.log("error while calling newCountWMessage api",error.message);
    }
}

// projects
export const newCountProjects = async (count) =>{
    try {
        await $host.get(`api/projects/count/add/${count}`); 
    } catch (error) {
        console.log("error while calling newCountProjects api",error.message);
    }
}



//--------------------------------------------------------------------------------------

// message
export const editCountMessage = async (count) =>{
    try {
        await $host.get(`api/message/count/update`); 
    } catch (error) {
        console.log("error while calling newCountMessage api",error.message);
    }
}

// wmessage
export const editCountWMessage = async (count) =>{
    try {
        await $host.get(`api/wmessage/count/update`); 
    } catch (error) {
        console.log("error while calling newCountWMessage api",error.message);
    }
}


//------------------------------------------------------------------------------------------

//notif
export const getSoundNotif = async()=>{
    try {
        let response = await $host.get('api/soundnotif/get');
        //console.log(response);
        return response.data;
     } catch (error) {
         console.log("error while calling getSoundNotif api", error.message);
     }
}

export const delSoundNotif = async()=>{
    try {
        let response = await $host.get('api/soundnotif/del');
        //console.log(response);
        return response.data;
     } catch (error) {
         console.log("error while calling delSoundNotif api", error.message);
     }
}


export const startSoundNotif = async()=>{
    try {
        let response = await $host_bot.get('api/startsoundnotif');
        //console.log(response);
        return response.data;
     } catch (error) {
         console.log("error while calling startSoundNotif api", error.message);
     }
}


//------------------------------------------------------------------------------------------

//call
export const getSendCall = async(tg_id)=>{
    try {
        const response = await $host_call.post('/calls', {
            "tg_id": tg_id,
            "type": "m"
        });
        console.log("call: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getSendCall api", error.message);
    }
}

//------------------------------------------------------------------------------------------

//update
export const getUpdateManagers = async()=>{
    try {
        const response = await $host.get('api/managers/update/get');
        //console.log("update: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getUpdateWorkers api", error.message);
    }
}


//-------------------------------------------------------------------

//api бд
export const getProcess= async (count, on) =>{
    try {
        let response = await $host_bot.get(`api/process/update/${count}/${on}`);
        //console.log("projectsAPI: ", response.data);
        return response.data;
    } catch (error) {
        console.log("error while calling getProcess api", error.message);
    }
}


export const getProjectsNewApi = async () =>{
    try {
       let response = await $host.get('api/projects/new/get');
       return response.data;
    } catch (error) {
        console.log("error while calling getProjectsApi api", error.message);
    }
}

export const getProjectsNewApi2 = async () =>{
    try {
       let response = await $host.get('api/projectnew/get');
       return response.data;
    } catch (error) {
        console.log("error while calling getProjectsNewApi2 api", error.message);
    }
}
