import {$authHost, $host, $host_renthub, $host_old} from "./index";

export const getRUserbot = async () =>{
    try {
       let response = await $host_old.get('api/userbots/get');
       return response.data;
    } catch (error) {
        console.log("error while calling getWorkers api", error.message);
    }
}

export const getRManagers = async () =>{
    try {
       let response = await $host.get('api/managers/get');
       return response.data;
    } catch (error) {
        console.log("error while calling getWorkers api", error.message);
    }
}

export const getRManagerCount = async (count, prev) =>{
    try {
       let response = await $host.get(`api/managers/count/get/${count}/${prev}`);
       return response.data;
    } catch (error) {
        console.log("error while calling getWorkersCount api", error.message);
    }
}

export const getRManager = async (id) =>{
    try {
       let response = await $host.get(`api/managers/get/${id}`);
       return response.data;
    } catch (error) {
        console.log("error while calling getWorker api", error.message);
    }
}


export const getRCompanyName = async (id) =>{
    try {
       let response = await $host.get(`company/name/${id}`);
       return response.data;
    } catch (error) {
        console.log("error while calling getCompanyName api", error.message);
    }
}

export const getRCompanys = async () =>{
    try {
       let response = await $host.get(`api/companys/get`);
       return response.data;
    } catch (error) {
        console.log("error while calling getRCompanys api", error.message);
    }
}

export const getRContacts = async () =>{
    try {
       let response = await $host.get('api/userbots/get');
       //console.log(response);
       return response.data;
    } catch (error) {
        console.log("error while calling getRContacts api", error.message);
    }
}

export const getRContactId = async (id) =>{
    try {
       let response = await $host.get(`api/userbots/get/${id}`);
       //console.log(response);
       return response.data;
    } catch (error) {
        console.log("error while calling getUser api", error.message);
    }
}

export const editRContact = async (data, id) =>{
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

export const setRConversation= async (data)=>{
    try {
        await $host.post('api/conversation/add', data);
    } catch (error) {
        console.log("error while calling setConversation api", error.message);
        
    }
}

export const getRConversation= async (id)=>{
    try {
       let response= await $host.get(`api/conversation/get/${id}`);
       if (response.data === null) {
            return null;
       }
        return response.data.id
    } catch (error) {
        console.log("error while calling getConversation api", error.message);       
    }
}

export const getRConversations= async ()=>{
    try {
       let response= await $host.get(`api/conversations/get`);
       return response.data;
    } catch (error) {
        console.log("error while calling getConversation api", error.message);       
    }
}

// message
export const newRMessage = async (data) =>{
    try {
        await $host.post(`api/message/add`, data); 
    } catch (error) {
        console.log("error while calling newMessage api",error.message);
    }
}

export const delRMessage = async (id) =>{
    try {
        await $host.delete(`api/message/delete/${id}`); 
    } catch (error) {
        console.log("error while calling delMessage api",error.message);
    }
}


export const getRMessages = async(id)=>{
    try {
        let response
        if (id !== null) {
            response = await $host.get(`api/message/get/${id}`);
        } else {
            return [] 
        }
         
        return response.data;
    } catch (error) {
        console.log("error while calling getRMessages api",error.message);
        
    }
}

export const getRMessages2 = async(id, count, prev)=>{
    try {
        let response
        if (id !== null) {
            response = await $host.get(`api/message2/get/${id}/${count}/${prev}`);
        } else {
            return [] 
        }
         
        return response.data;
    } catch (error) {
        console.log("error while calling getMessages api",error.message);
        
    }
}

export const getAllRMessages = async()=>{
    try {
        let response= await $host.get(`api/message/get`);
        
        return response.data;
    } catch (error) {
        console.log("error while calling getAllWMessages api",error.message);
        
    }
}

export const getRMessagesCount = async(count)=>{
    try {
        let response= await $host.get(`api/message/get/count/${count}`);
        
        return response.data;
    } catch (error) {
        console.log("error while calling getRMessagesCount api",error.message);
        
    }
}




//file
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


export const getManagerNotion = async (id) =>{
    try {
       let response = await $host_renthub.get(`managers`);
       //console.log(response);
       return response.data;
    } catch (error) {
        console.log("error while calling getManagerNotion api", error.message);
    }
}

//--------------------------------------------------------------------------
//distribution
//--------------------------------------------------------------------------

export const getDistributionsCountR = async(count, prev)=>{
    try {
        let response = await $host.get(`api/distributionsr/count/get/${count}/${prev}`);
        //console.log(response);
        return response.data;
     } catch (error) {
         console.log("error while calling getDistributionsCountR api", error.message);
     }
}

export const getDistributionsRPlan = async()=>{
    try {
        let response = await $host.get(`api/distributionsr/plan/get`);
        //console.log(response);
        return response.data;
     } catch (error) {
         console.log("error while calling getDistributionsRPlan api", error.message);
     }
}

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
         console.log("error while calling newDistributionR api", error.message);
     }
}

export const delDistributionR = async (id) =>{
    try {
        await $host.delete(`api/distributionsr/delete/${id}`); 
    } catch (error) {
        console.log("error while calling delDistributionR api",error.message);
    }
}

export const delDistributionRPlan = async (data) =>{
    try {
        await $host.post(`api/distributionsr/delete`, data); 
    } catch (error) {
        console.log("error while calling delDistributionRPlan api",error.message);
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