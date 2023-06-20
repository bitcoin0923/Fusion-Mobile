import config from "../config";
import { encodeParams, handleError } from "./common";

export const subscribeFirebase = async (serverurl, firebaseToken, token) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: encodeParams({
            f: 'json',
            token: firebaseToken
        }),
        
    };
    
    const resp = await fetch(serverurl + '/api/users/self/firebase/subscribe', requestOptions).catch(handleError);
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