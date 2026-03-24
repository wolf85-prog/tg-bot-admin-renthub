import {$authHost, $host} from "./index";

export const getMContacts = async () =>{
    try {
       let response = await $host.get('api/maxbots/get');
       //console.log(response);
       return response.data;
    } catch (error) {
        console.log("error while calling getUsers api", error.message);
    }
}

export const getMContactId = async (id) =>{
    try {
       let response = await $host.get(`api/userbots/get/${id}`);
       //console.log(response);
       return response.data;
    } catch (error) {
        console.log("error while calling getUser api", error.message);
    }
}

export const getMaxMessagesCount = async(count)=>{
    try {
        let response= await $host.get(`api/message/maxbot/count/${count}`);
        
        return response.data;
    } catch (error) {
        console.log("error while calling getMaxMessagesCount api",error.message);
        
    }
}

export const getMaxConversation= async (id)=>{
    try {
       let response= await $host.get(`api/conversation/maxbot/${id}`);
       if (response.data === null) {
            return null;
       }
        return response.data.id
    } catch (error) {
        console.log("error while calling getMaxConversation api", error.message);       
    }
}

export const getMaxConversations= async ()=>{
    try {
       let response= await $host.get(`api/conversations/maxbot`);
       return response.data;
    } catch (error) {
        console.log("error while calling getMaxConversations api", error.message);       
    }
}

// message
export const newMaxMessage = async (data) =>{
    try {
        await $host.post(`api/message/maxbot/add`, data); 
    } catch (error) {
        console.log("error while calling newMaxMessage api",error.message);
    }
}


export const delMaxMessage = async (id) =>{
    try {
        await $host.delete(`api/message/maxbot/delete/${id}`); 
    } catch (error) {
        console.log("error while calling delMaxMessage api",error.message);
    }
}


export const sendMessageToMax = async (data) =>{
    try {
       let response = await $host.post('api/botmaxrent/sendmessage', data);
       //console.log(response);
       return response;
    } catch (error) {
        console.log("error while calling sendMessageToMax api", error.message);
    }
}

export const delMessageToMax = async (data) =>{
    try {
       let response = await $host.post('api/botmaxrent/delmessage', data);
       //console.log(response);
       return response;
    } catch (error) {
        console.log("error while calling delMessageToMax api", error.message);
    }
}

export const sendPhotoToMax = async (data) =>{
    try {
       let response = await $host.post('api/botmaxrent/sendphoto', data);
       //console.log(response);
       return response;
    } catch (error) {
        console.log("error while calling sendPhotoToMax api", error.message);
    }
}

