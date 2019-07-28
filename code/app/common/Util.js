/**
 * Created by coatu on 2016/12/22.
 */
import React from 'react';
import {Alert, AsyncStorage, DeviceEventEmitter, Platform} from 'react-native';

global.Debug = true;// false  生产环境   true  测试环境

import Md5 from './Md5';
import {base64decode, utf8to16} from './Base64';
import * as DeviceInfo from "react-native-device-info";
import {toastShort} from "./ToastUtils";
import {NavigationActions} from "react-navigation";
import {cloneObj} from "./CommonUtil";

/*
 http://210.16.189.102:8090/api/
 https://api.youzhongyouliao.com/api/
 */
//13699209132@163.com  ying123
//  const dev = 'http://192.168.1.125:8090/';//我自己的测试优众
const dev = 'http://192.168.7.114:8090/';//内网测试优众
// const dev = 'http://47.98.140.81:8090/api/';//测试环境
const pro = 'https://api.youzhongyouliao.com/api/';//生产环境
const HttpUrl = Debug ? dev : pro;//

let Util = {
    //get请求优众优料河北金牌
    get: (url, successCallBack, failCallBack) => {
        fetch(url)
            .then((response) => response.json())
            .then((responseText) => {
                successCallBack(responseText)
            })
            .catch((error) => {
                failCallBack(error)
            })
    },

    //post请求
    POST: (url, data, navigation, callback, failCallback) => {
        //封装body
        // NetInfo.fetch().done((reach)=>{
        //     console.log("哈哈----网络状态 ", reach);
        // })
        // NetInfo.isConnected.fetch().done((isConnected) => {
        //     console.log('First, is ' + (isConnected ? 'online' : 'offline'));
        // });
        let token = '';
        let currentId = '';
        let time = new Date().getTime();
        let appCode = Platform.OS === 'ios' ? 'ios' : 'android';
        let currentUser = '';
        let refersh_token = '';
        AsyncStorage.getItem(USERINFO, (error, id) => {
            currentUser = JSON.parse(id);
            // console.log("数据 。。。。", url,data,currentUser&&currentUser.userid);
            if (currentUser) {
                token = currentUser.access_token;
                currentId = currentUser.userid;
                refersh_token = currentUser.refersh_token;
            }
            let value = utf8to16(base64decode(refersh_token));
            let first = (value.substr(value.length - 5));
            let second = value.substr(0, value.length - 5);
            let refreshToken = first + second;
            let str = time + appCode + token + refreshToken;
            let sign = Md5.hex_md5(str);
            let newBody = {
                "token": token,
                "timestamp": time,
                "sign": sign,
                "appCode": appCode,
                "currentId": currentId,
                "version": Platform.OS === 'ios' ? DeviceInfo.getVersion() : DeviceInfo.getBuildNumber(),
                data
            };
            let fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: JSON.stringify(newBody)
            };
            // console.log( HttpUrl + url);
            fetch(HttpUrl + url, fetchOptions)
                .then((response) => response.text())
                .then((res) => check401(url, res, navigation))
                .then(checkError)
                .then(check549)
                .then((res) => {
                    jsonParse(res, callback, navigation, url, data);
                })
                .catch((err) => {
                    Debug && console.log('err', HttpUrl, url, err);
                    failCallback(err);
                });
        });
    }
};

const check401 = (url, res, navigation) => {

    if (res) {
        let item = JSON.parse(res);
        // 登陆界面不需要做401校验
        if (item.code === '401') {
            DeviceEventEmitter.emit('LoginExit');
            Debug && console.log('url', url);
            AsyncStorage.setItem(USERINFO, JSON.stringify(''));
            if (navigation !== 0) {//
                Alert.alert(
                    '',
                    '您的登录已过期,请重新登录!',
                    [
                        {text: '确定', onPress: () => pushToLogin(navigation)},
                    ], Platform.OS === 'android' ? {cancelable: false} : {}
                )
            }
        }
        return res
    } else {
        return null
    }
};

function checkError(res) {
    let item = JSON.parse(res);
    if (item.code !== '200' && item.code !== '401' && item.code !== '531' && item.code !== '549') {
        let msg = item.msg || '';
        toastShort(msg.indexOf('server') > -1 ? '' : msg);
    }
    return res;

}

const jsonParse = (res, callback, navigation, url, data) => {
    let item = JSON.parse(res);
    // Debug&&console.log("结果----",url,res);
    // data.tagKey&&(item.result.tagKey = data.tagKey);
    callback(item);
    return res;

};

const check549 = (res) => {
    let item = JSON.parse(res);
    if (item.code === '549') {
        toastShort('您的客户信息不完整,请联系客服或者销售代表');
    }
    return res;
};


function pushToLogin(navigation) {
    AsyncStorage.getAllKeys((error, keys) => {
        keys.map((str, index) => {
            AsyncStorage.removeItem(str);
        })
    });
    AsyncStorage.setItem(USERINFO, JSON.stringify(''));
    const resetAction = NavigationActions.reset({
        index: 1,
        actions: [
            NavigationActions.navigate({
                routeName: 'WelcomeView'
            }),
            NavigationActions.navigate({
                routeName: 'LoginView',
                params: {
                    title: '登录',
                    rightTitle: '注册',
                    reLogin: true,
                    leftImageSource: false,
                },
            }),
        ]
    });
    navigation.dispatch(resetAction);
}

export default Util;
