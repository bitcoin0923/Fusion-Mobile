import config from "../config";
import { encodeParams } from "./common";


export const logIn = async (serverurl, username, password) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: encodeParams({
            username,
            password,
            f: 'json'
        })
    };
    const resp = await fetch(serverurl + config.generateTokenUrl, requestOptions);
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
        token: data.token
    }
}