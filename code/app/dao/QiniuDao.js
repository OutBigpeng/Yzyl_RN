/**
 * Created by coatu on 2017/6/30.
 */
'use strict';
import React from 'react';
import {API_QINIUDOMAIN, API_QINIUTOKEN, API_UPDATEIMAGE} from './API_Interface';
import Util from '../common/Util'
import {toastShort} from '../common/ToastUtils'

//七牛token
export function getQiuNiuTokenData(data, callback, failCallback) {
    Util.POST(API_QINIUTOKEN, data, 0, (res) => {
        // console.log('resres',res)
        if (res.code === '200') {
            callback(res.result);
        } else {
            failCallback();
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        failCallback(error);
    })
}


//七牛域名
export function getQiuNiuDomainData(data, callback, failCallback) {
    Util.POST(API_QINIUDOMAIN, data, 0, (res) => {
        if (res.code === '200') {
            callback(res.result);
        } else {
            failCallback();
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        failCallback(error);
    })
}

//修改头像/昵称
export function getQiuNiuImageData(data, callback, failCallback) {
    Util.POST(API_UPDATEIMAGE, data, 0, (res) => {
        if (res.code === '200') {
            callback(res);
        } else {
            failCallback();
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        failCallback();
    })
}