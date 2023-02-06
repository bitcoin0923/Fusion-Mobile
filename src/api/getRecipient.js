import config from "../config";
import { encodeParams } from "./common";

export const getRecipient = async (serverurl, id, token) => {
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json; charset="utf-8"',
            'Authorization': `Bearer ${token}` 
        },
        body: '',
        redirect: 'follow'
    };
    
    const resp = await fetch(serverurl + '/api/recipients/' + id + '?' + encodeParams({ 
        f: 'json',
        id
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