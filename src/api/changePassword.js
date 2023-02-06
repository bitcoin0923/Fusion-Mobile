import { encodeParams, encodeUriParams } from './common';
export const changePassword = async (serverurl, password,token) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`,
        },
        body: encodeParams({
            f: 'json',
            password
        }),
    };
    
    const resp = await fetch(serverurl + '/api/users/self/password?', requestOptions);
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