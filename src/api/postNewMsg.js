import config from "../config";
import { encodeParams } from "./common";

export const postNewMsg = async (serverurl, userid, event, token) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`,
        },
        body: encodeParams({
            f: 'json',
            ...event
        }),
        redirect: 'follow'
    };
    
    const resp = await fetch(serverurl + '/api/users/self/events/send' + '?' + encodeParams({ 
    }), requestOptions);
    if(!resp.ok) {
        return {
            success: false,
            error: 'Network Error'
        }
    }
    const data = await resp.json();
    if(data.error){
        return {
            success: false,
            ...data
        }
    }

    return {
        success: true,
        ...data
    }
}