import { encodeParams, encodeUriParams, handleError } from './common';

export const logout = async (serverurl, token) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: encodeParams({
            f: 'json'
        }),
    };
    
    const resp = await fetch(serverurl + '/api/tokens/releasetoken', requestOptions).catch(handleError);
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