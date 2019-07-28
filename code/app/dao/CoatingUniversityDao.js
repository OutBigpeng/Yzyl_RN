/**
 * Created by coatu on 2017/6/26.
 */
'use strict';
import React from 'react';
import {
    API_ARTICLECATEGORYBYCOATINGUNIVERSITY, API_ARTICLELISTKEYWORD, API_ARTICLESFORAPPNEW, API_FORMULAPFBYID,
    API_FORMULAXNBYID,
    API_UNIVERSITYCOURSE, API_UNIVERSITYSIGNUP
} from './API_Interface';
import Util from '../common/Util'
import {toastShort} from '../common/ToastUtils'

//首页Lable 七标签
export function getArticleCategoryByCoatingUniversity(navigation, callback, failCallback) {
    request(API_ARTICLECATEGORYBYCOATINGUNIVERSITY,{},navigation, callback, failCallback)
}

//大家都在搜  文章热门搜索关键字功能
export function getArtListKeyword(navigation, callback, failCallback) {
    request(API_ARTICLELISTKEYWORD, {},navigation, callback, failCallback)
}
//课程表详情
export function getUniversityCourse(data,navigation, callback, failCallback) {
    request(API_UNIVERSITYCOURSE, data,navigation, callback, failCallback)
}
//配方详情  第二个页面
export function getFormulaPFById(data,navigation, callback, failCallback) {
    request(API_FORMULAPFBYID, data,navigation, callback, failCallback)
}
//配方性能  第一个页面
export function getFormulaXNById(data,navigation, callback, failCallback) {
    request(API_FORMULAXNBYID, data,navigation, callback, failCallback)
}
//课程表报名接口
export function getSignUp(data,navigation, callback, failCallback) {
    request(API_UNIVERSITYSIGNUP, data,navigation, callback, failCallback)
}
/*
"label": 2,"type": "label",
"scope":"university",
        "pageIndex": 3,
        "pageSize": 4
        涂料大学列表
 */
export function getArticlesForAppNew(data,navigation, callback, failCallback) {
    request(API_ARTICLESFORAPPNEW, data,navigation, callback, failCallback)
}


function request(url,data,navigation, callback, failCallback) {
    Util.POST(url, data, navigation, (res) => {
        if (res.code === '200') {
            callback(res.result);
        } else {
            failCallback(res);
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        failCallback(error);
    })
}