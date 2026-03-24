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
        await $host.post(`api/message/add`, data); 
    } catch (error) {
        console.log("error while calling newMaxMessage api",error.message);
    }
}

