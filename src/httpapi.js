/**
 * Created by Sunday on 2016/6/13.
 */

import {constant} from "./constant";

var md5 = require("md5");


function params(args) {
    return Object.keys(args).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(args[k])
    }).join('&');
}


function getSignBuf(method, appid, appkey, timestamp, param) {
    param['timestamp'] = timestamp;
    param['appid'] = appid;

    var sorted = [];
    for(var key in param) {
        if(param.hasOwnProperty(key)) {
            sorted[sorted.length] = key;
        }
    }
    sorted.sort();
    sorted.reverse();

    var buf = method;
    for(var i=0; i != sorted.length; ++i) {
        buf += sorted[i];
        buf += '=';
        buf += param[sorted[i]];
        if(i !== sorted.length - 1) {
            buf += "&";
        }
    }
    buf += appkey;
    buf = buf.toLowerCase();
    console.log(buf);
    return buf;
}


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
    rspbody = await response.json();
    return rspbody;
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


//实时值获取，用于获取DHT VALUE与LED、继电器状态
async function rt_status(appid, appkey, chipid, func_key) {
    let url = constant.API_BASE_HOME + "/openapi/rt_status/" + chipid + "/";
    let args = {
        appid: appid,
        key: 'KEY'
    };
    args.sign = md5(getSignBuf('GET', appid, appkey, (new Date()).getTime(), args));
    url += "?" + params(args);
    console.log("SIGNED URL: " + url);
    let response = await fetch(url);
    if(response.ok) {
        //alert('请求成功: ' + response.text);
    } else {
        alert('请求失败！');
    }
    return await response.text();
}


async function send_at_cmd(appid, appkey, chipid, atcmd) {
    let method = "POST";
    let url = constant.API_BASE_HOME + "/openapi/dev/push/message/";
    let args = {
        appid: appid,
        devid: chipid,
        message: atcmd,
        format: 'AT'
    };
    args.sign = md5(getSignBuf(method, appid, appkey, (new Date()).getTime(), args));
    url += "?" + params(args);
    console.log("SIGNED URL: " + url);
    let response = await fetch(url, {
        method: method
    });
    return await response.json();
}

async function get_gpio_status(appid, appkey, chipid) {
    let url = constant.API_BASE_HOME + "/openapi/v2/" + chipid + "/gpio/";
    let args = {
        appid: appid
    };
    args.sign = md5(getSignBuf("GET", appid, appkey, (new Date()).getTime(), args));
    url += "?" + params(args);
    let response = await fetch(url);
    return await response.json()
}


async function set_gpio_status(appid, appkey, chipid, pin, edge) {
    let method = "POST";
    let url = constant.API_BASE_HOME + "/openapi/set_gpio_edge/" + chipid + "/" + pin + "/" + edge + "/";
    let args = {
        appid: appid
    };
    args.sign = md5(getSignBuf(method, appid, appkey, (new Date()).getTime(), args));
    url += "?" + params(args);
    let response = await fetch(url, {
        method: method
    });
    return await response.json()
}


function generate_ws_url(appid, appkey, chipid) {
    let args = {
        appid: appid,
        chipid: chipid
    };
    args.sign = md5(getSignBuf("GET", appid, appkey, (new Date()).getTime(), args));
    let url = "wss://espush.cn/noticed/peer?" + params(args);
    console.log(url);
    return url;
}


async function change_color_led(appid, appkey, chipid, channel, colorValue) {
    let url = constant.API_BASE_HOME + "/openapi/v2/" + chipid + "/color/" + channel + "/" + colorValue + "/";
    let args = {
        appid: appid
    };
    args.sign = md5(getSignBuf("POST", appid, appkey, (new Date()).getTime(), args));
    url += "?" + params(args);
    let response = await fetch(url, {
        method: 'POST'
    });
    return await response.json()
}

export {
    login,
    user_online_devices,
    user_apps, rt_status,
    send_at_cmd,
    get_gpio_status,
    set_gpio_status,
    generate_ws_url,
    change_color_led
};
