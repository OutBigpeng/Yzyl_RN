/**问答的Dao
 * Created by Monika on 2017/6/27.
 */
'use strict';
import React from "react";
import {
    API_NEWANSWER, API_NEWQUESTION, API_QUERYMETIONEDQUESTION, API_GETQUESTION,
    API_GETANSWERLISTBYQUESTION, API_QUERYMYANSWER,
    API_DELQUESTION, API_DELANSWER, API_QUERYMYQUESTIONS, API_HOTRECOMMEND, API_LISTALLCERTIFIEDUSER
} from "./API_Interface";
import Util from "../common/Util";
import {toastShort} from "../common/ToastUtils";

//提问
/**
 *
 * @param data  {   "title": "问个问题",
        "content":"to be or not to be",
        "createUserId":   2,
        "atUserIdList":[116]}
 * @param callback
 * @param failCallback
 */
export function getNewQuestion(data, callback, failCallback) {
    Util.POST(API_NEWQUESTION, data, 0, (res) => {
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


/**
 * 新的回答
 * @param data  { "questionId": 6,
"content":"i guess not to be",
    "createUserId":112,
    "atUserIdList":[2,112,113]}
 * @param callback
 * @param failCallback
 */
export function getNewAnswer(data, callback, failCallback) {
    Util.POST(API_NEWANSWER, data, 0, (res) => {
        if (res.code === '200') {
            callback(res.result);
        } else {
            failCallback(res);
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        // failCallback(error);
    })
}

/**
 * 获取 所有 认证用户
 * @param data
 * @param callback
 * @param failCallback
 */
export function getListAllCertifiedUser(navigation,callback, failCallback) {
    Util.POST(API_LISTALLCERTIFIEDUSER, {}, navigation, (res) => {
        if (res.code === '200') {
            callback(res);
        } else {
            failCallback(res);
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        // failCallback(error);
    })
}

/**
 *被@的问题(向我提问)
 * @param data { "pageIndex": 1,
        "pageSize":5,
        "userId":112}
 * @param callback
 * @param failCallback
 */
export function getMetionedQuestion(data, navigation,callback, failCallback) {
    Util.POST(API_QUERYMETIONEDQUESTION, data,navigation, (res) => {
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

/**
 *我回答过的问题列表
 * @param data {   "pageIndex": 1,
        "pageSize":5,
        "createUserId":117}
 * @param callback
 * @param failCallback
 */
export function getMyAnswer(data, navigation,callback, failCallback) {
    Util.POST(API_QUERYMYANSWER, data, navigation, (res) => {
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
/**
 *查询我提的问题列表-分页列表
 * @param data {   "pageIndex": 1,
        "pageSize":5,
        "status":0,
        "createUserId":2}
 * @param callback
 * @param failCallback
 */
export function getMyQuestions(data,navigation, callback, failCallback) {
    Util.POST(API_QUERYMYQUESTIONS, data, navigation, (res) => {
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
/**
 *获取问题信息
 * @param data {    "id":7}||{"sn":。。}
 * @param callback
 * @param failCallback
 */
export function getQuestion(data, callback, failCallback) {
    Util.POST(API_GETQUESTION, data, 0, (res) => {
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
/**
 *某个问题的回答列表
 * @param data {   "pageIndex": 1,
        "pageSize":5,
        "questionId":6}
 * @param callback
 * @param failCallback
 */
export function getAnswerListByQuestion(data,navigation, callback, failCallback) {
    Util.POST(API_GETANSWERLISTBYQUESTION, data, navigation, (res) => {
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
/**
 *删除回答
 * @param data { "id": 1}
 * @param callback
 * @param failCallback
 */
export function getDelAnswer(data, callback, failCallback) {
    Util.POST(API_DELANSWER, data, 0, (res) => {
        if (res.code === '200') {
            callback(res);
        } else {
            failCallback(res);
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        failCallback(error);
    })
}
/**
 *删除问题
 * @param data {    "id": 1}
 * @param callback
 * @param failCallback
 */
export function getDelQuestion(data, callback, failCallback) {
    Util.POST(API_DELQUESTION, data, 0, (res) => {
        if (res.code === '200') {
            callback(res);
        } else {
            failCallback(res);
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        failCallback(error);
    })
}


//热门推荐列表
export function getHotRecommendQuestion(data, navigation,callback, failCallback) {
    Util.POST(API_HOTRECOMMEND, data,navigation, (res) => {
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