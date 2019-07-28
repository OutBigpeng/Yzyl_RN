/**
 * Created by coatu on 2017/6/29.
 */
'use strict';
import React, {Component} from 'react';
import {Alert} from 'react-native';
import {API_IMADDCHATMSG, API_IMPAGECHATMSG,API_UNREADCHATMSGCOUNT,API_READCHATMSG} from './API_Interface';
import Util from '../common/Util'
import {toastShort} from '../common/ToastUtils'
import {isEmptyObject} from "../common/CommonDevice";

//发送消息
export function sendMessageData(data, navigation, callback, failCallback) {
    request(API_IMADDCHATMSG,data, navigation, callback, failCallback);
}

//聊天记录列表功能
export function messageList(data, navigation, callback, failCallback) {
    request(API_IMPAGECHATMSG,data, navigation, callback, failCallback);
}

//未读消息
export function unReadChatMsg(data, navigation, callback, failCallback) {
    request(API_UNREADCHATMSGCOUNT,data, navigation, callback, failCallback);
}

//已读消息
export function readChatMsg(data, navigation, callback, failCallback) {
    request(API_READCHATMSG,data, navigation, callback, failCallback,1);
}

let request = function (url,data, navigation, callback, failCallback,type) {
    Util.POST(url, data, navigation, (res) => {
        if (res.code === '200') {
            if(type){
                callback(res);
            }else {
                callback(res.result);
            }

        } else {
            failCallback();
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        failCallback();
    })
};