import config from "../config";
import { encodeParams, encodeUriParams } from "./common";

export const actionMsg = async (serverurl, userid, eventid, token, action) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json; charset="utf-8"',
            'Authorization': `Bearer ${token}` 
        },
        body: encodeUriParams({
            f: 'json',
        }),
        redirect: 'follow'
    };
    const resp = await fetch(serverurl + '/api/users/self/events/' + eventid + action + '?' + encodeParams({ 
        userid: 'self',
        eventid
    }), requestOptions);
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