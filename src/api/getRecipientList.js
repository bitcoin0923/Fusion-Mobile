import config from "../config";
import { encodeParams } from "./common";

export const getRecipientList = async (serverurl, args, token) => {
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json; charset="utf-8"',
            'Authorization': `Bearer ${token}` 
        },
        body: '',
        redirect: 'follow'
    };
    
    const resp = await fetch(serverurl + config.getRecipients + '?' + encodeParams({
        f: 'json',
        ...args
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