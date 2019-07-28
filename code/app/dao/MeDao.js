/**
 * Created by coatu on 2017/6/29.
 */
'use strict';
import React, {Component} from 'react';
import {Alert} from 'react-native';
import {
    API_MYFOLLOWLIST,
    API_COLLECTLIST,
    API_USERSIGNIN,
    API_GETMYUSERSCORE,
    API_LISTSIGNIN,
    API_MYUSERSCORETASKS,
    API_USERSCOREGOODS,
    API_EXCHANGEGOODS,
    API_MYEXCHANGEGOODS,
    API_MYUSERSCOREDETAIL,
    API_UPDATEUSERSCORE,
    API_GETMYEXPERTSCORE,
    API_GETMYEXPERTSCOREDETAIL,
    API_APPLYUSERCERTIFICATION
} from './API_Interface';
import Util from '../common/Util'
import {toastShort} from '../common/ToastUtils'
import {isEmptyObject} from "../common/CommonDevice";

//申请加V 认证content
export function getApplyUserCertification(data, navigation, callback, failCallback) {
    request(API_APPLYUSERCERTIFICATION, data, navigation, (res)=>{
        callback(res);
    }, failCallback);
}

/**
 * 签到
 *  "signDate":"2018-01-09",签到日期	string  yyyy-MM-dd
 "isFill":0   是否补签	int	1是 0不是
 return:
 days
 连续签到天数	int
 signDates
 本月签到日期数组	array
 */
export function getUserSignIn(data, navigation, callback, failCallback) {
    request(API_USERSIGNIN, data, navigation, (res)=>{
        callback(res);
    }, failCallback);
}


/**
 * 获取月连续签到的集合
 * @param data
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getListSignIn (data, navigation, callback, failCallback) {
    request(API_LISTSIGNIN, data, navigation, (res)=>{
        callback(res.result);
    }, failCallback);
}
//获取我的积分
export function getMyUserScore( navigation, callback, failCallback) {
    request(API_GETMYUSERSCORE, {}, navigation, (res)=>{
        callback(res.result);
    }, failCallback);
}
//我的专家总分和专家等级
export function getMyExpertScore(data,navigation, callback, failCallback) {
    request(API_GETMYEXPERTSCORE, data, navigation, (res)=>{
        callback(res.result);
    }, failCallback);
}

//我的专家总分和专家等级
export function getMyExpertScoreDetail( data,navigation, callback, failCallback) {
    request(API_GETMYEXPERTSCOREDETAIL, data, navigation, (res)=>{
        callback(res.result);
    }, failCallback);
}

/**
 * 积分任务
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getMyUserScoreTasks( navigation, callback, failCallback) {
    request(API_MYUSERSCORETASKS, {}, navigation, (res)=>{
        callback(res.result);
    }, failCallback);
}

/**
 * 积分兑换 列表
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getUserScoreGoods(data, navigation, callback, failCallback) {
    request(API_USERSCOREGOODS, data, navigation, (res)=>{
        callback(res.result);
    }, failCallback);
}

/**
 * 积分兑换商品
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getExchangeGoods(data,navigation, callback, failCallback) {
    request(API_EXCHANGEGOODS, data, navigation, (res)=>{
        callback(res);
    }, failCallback);
}

/**
 * 我的积分兑换商品记录
 * @param data
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getMyExchangeGoods(data,navigation, callback, failCallback) {
    request(API_MYEXCHANGEGOODS, data, navigation, (res)=>{
        callback(res.result);
    }, failCallback);
}
/**
 * 我的积分使用记录  list
 * @param data
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getMyUserScoreDetail(data,navigation, callback, failCallback) {
    request(API_MYUSERSCOREDETAIL, data, navigation, (res)=>{
        callback(res.result);
    }, failCallback);
}

/**
 * 获得积分回调接口
 * @param data  { "userId":1,
      "taskSn":"share",//任务编码 share分享 sample索样
      "score":120,//可选，有任务编码无效
      "reason": "2018-04-20",//同上
      "remark": "sdf"//同上}
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getUpdateUserScore(data,navigation, callback, failCallback) {
    request(API_UPDATEUSERSCORE, data, navigation, (res)=>{
        callback(res.result);
    }, failCallback);
}

//关注列表
export function getMyFollowListData(data, navigation, callback, failCallback) {
    request(API_MYFOLLOWLIST, data, navigation, callback, failCallback);
}

//收藏列表
export function getMyCollectListData(data, navigation, callback, failCallback) {
    request(API_COLLECTLIST, data, navigation, callback, failCallback);
}

let request = function (url,data, navigation, callback, failCallback) {
    Util.POST(url, data, navigation, (res) => {
        if (res.code === '200') {
            callback(res);
        } else {
            failCallback(res);
        }
    }, (error) => {
        if(error) {
            toastShort('网络发生错误,请重试!');
            failCallback(error);
        }
    })
};