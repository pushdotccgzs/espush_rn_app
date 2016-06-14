/**
 * Created by Sunday on 2016/6/13.
 */

import {constant} from "./constant";


async function login(email, password) {
    let url = constant.API_BASE_HOME + "/openapi/v2/user/login/";
    let args = {
        email: email,
        password: password
    };
    let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(args)
    });
    let tokenobj = await response.json();
    return tokenobj;
}


/*
token : {token, email, expire}
 */
async function user_online_devices(token) {
    let url = constant.API_BASE_HOME + "/openapi/v2/user/online/devices/";
    let response = await fetch(url, {
        headers: {
            "token": token.token
        }
    });
    return await response.json();
}


async function user_apps(token) {
    let url = constant.API_BASE_HOME + '/openapi/v2/user/apps/';
    let response = await fetch(url, {
        headers: {
            "token": token.token
        }
    });
    return await response.json();
}


export {login, user_online_devices, user_apps};
