import config from "../config";
import { encodeParams, handleError } from "./common";

export const getAlarmList = async (serverurl, args, token) => {
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json; charset="utf-8"',
            'Authorization': `Bearer ${token}` 
        },
        body: '',
        redirect: 'follow'
    };
    
    const resp = await fetch(serverurl + '/api/alarms/active' + '?' + encodeParams({ 
        f: 'json',
        ...args
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