import config from "../config";
import { encodeParams, encodeUriParams, handleError } from "./common";

export const getChanges = async (serverurl, token) => {
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}` 
        },
        body: '',
        redirect: 'follow'
    };
    const resp = await fetch(serverurl + '/api/users/self/changes?' + encodeParams({
        f: 'json',
    }), requestOptions).catch(handleError);
    
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