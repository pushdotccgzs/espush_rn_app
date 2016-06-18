/**
 * Created by Sunday on 2016/6/14.
 * key为 espush_auth
 */

import React from 'react';
import {AsyncStorage} from 'react-native';

const STORAGE_KEY = 'espush_auth';

export  default class EspushAsyncStorage {
    constructor() {
    }

    setTokenObj = async (token) => {
        this.token = token;
        let req = await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(token));
        return req;
    };

    getTokenObj = () => {
        return this.token;
    };

    isSignedIn = () => {
        return this.getTokenObj();
    };

    signOut = async () => {
        let req = await AsyncStorage.removeItem(STORAGE_KEY);
        this.token = undefined;
        return req;
    };

    getUserAuthStorage = async () => {
        let tokenstr = await AsyncStorage.getItem(STORAGE_KEY);
        console.log('TOKENSTR: ' + tokenstr);
        if(!tokenstr) {
            throw 'EMPTY RESULT.';
        }
        this.token = JSON.parse(tokenstr);
        return this.token;
    };
}


