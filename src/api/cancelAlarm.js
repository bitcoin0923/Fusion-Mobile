import config from "../config";
import { encodeParams, encodeUriParams, handleError } from "./common";

export const cancelAlarm = async (serverurl, alarmid, token) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json; charset="utf-8"',
            'Authorization': `Bearer ${token}` 
        },
        body: encodeParams({
            f: 'json',
            id: alarmid
        }),
        redirect: 'follow'
    };
    const resp = await fetch(serverurl + '/api/alarms/active/' + alarmid + '/cancel', requestOptions).catch(handleError);
    
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