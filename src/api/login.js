import config from "../config";
import { encodeParams, encodeUriParams, handleError } from "./common";


export const logIn = async (serverurl, username, password, clientid, platformtype, platformversion, applicationversion) => {
    console.info("login", {
        username,
        password,
        f: 'json',
        clientid,
        platformtype: "Android",
        platformversion,
        applicationversion
    });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: encodeParams({
            username,
            password,
            f: 'json',
            clientid,
            platformtype: "Android",
            platformversion,
            applicationversion
        })
    };
    const resp = await fetch(serverurl + config.generateTokenUrl, requestOptions).catch(handleError);
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