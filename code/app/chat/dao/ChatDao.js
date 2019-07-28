/**聊天网络请求
 * Created by Monika on 2017/4/13.
 */

'use strict';
import {
    API_CHATIMGMESSAGE, API_CHATMESSAGE, API_IMNOMESSAGECOUNT, API_QUERYVALUEBYSCKEY, API_DEALMESSAGEIMGURL,
    API_GETUSERPOSITION
} from "../../dao/API_Interface";

import Util from '../../common/Util';
import {isEmptyObject,toastShort} from '../../common/CommonDevice';

/**发送聊天消息
 {"type": "txt",,"timestamp":"1491881260242","to":"2","from":"1","payload":{}}
 */
export function sendHttpMsg(type, timestamp,to,from,payload,callback, failCallback) {
    let data = {"type": type, "timestamp": timestamp, "to": to, "from": from, "payload": payload};
    Util.POST(API_CHATMESSAGE, data, 0,(backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    console.log("哈哈，已成功抵达");
                    callback(backResult);
                    break;
                default:
                    console.log("failCallback",backResult);
                    failCallback();
                    break;
            }
        }
    },(err)=>{
        console.log("failCallbackerr",err);
        failCallback();
    });
}

export function sendHttpImgMsg(data,callback, failCallback) {
    // let data = {"from": from, "to": to, "hxurl": hxurl};
    Util.POST(API_CHATIMGMESSAGE, data, 0,(backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    // console.log("sendHttpImgMsg---哈哈，已成功抵达sendHttpImgMsg");
                    callback(backResult);
                    break;
                default:
                    // console.log("sendHttpImgMsg---failCallback",backResult);
                    failCallback();
                    break;
            }
        }
    },(err)=>{
        // console.log("sendHttpImgMsg--failCallbackerr",err);
        failCallback();
    });
}
export function sendSelfHttpImgMsg(data,callback, failCallback) {
    // let data = {"from": from, "to": to, "hxurl": hxurl};
    Util.POST(API_DEALMESSAGEIMGURL, data, 0,(backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    console.log("sendHttpImgMsg---哈哈，已成功抵达sendHttpImgMsg");
                    callback(backResult);
                    break;
                default:
                    console.log("sendHttpImgMsg---failCallback",backResult);
                    failCallback();
                    break;
            }
        }
    },(err)=>{
        console.log("sendHttpImgMsg--failCallbackerr",err);
        failCallback();
    });
}


/**
 *IM_isOpen 即时通讯开(Y)关(N)
 IM_welcome 第一句问候语
 * "data": {
        "key":"IM_isOpen"
    }
 */
export function sendQueryValueBySCKey(key,navigation,callback, failCallback) {
    let data = {"key": key};
    Util.POST(API_QUERYVALUEBYSCKEY, data, navigation,(backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    failCallback();
                    break;
            }
        }
    },(err)=>{
        failCallback();
    });
}


//告诉后台 当前是否是聊天界面
export function setChatPage(data, callback, failCallback) {
    Util.POST(API_GETUSERPOSITION, data, 0, (res) => {
        if (res.code === '200') {
            callback(res);
        } else {
            failCallback();
        }
    }, (error) => {
        failCallback();
    })
}



















//消息未读总数
export function ImNoMessageAllCount(data, navigation, callback, failCallback) {
    return getImNoMessageAllCountData(data, navigation, callback, failCallback);
}

function getImNoMessageAllCountData(data, navigation, callback, failCallback) {
    Util.POST(API_IMNOMESSAGECOUNT, data, navigation, (res) => {
        if (res.code === '200') {
            callback(res.result);
        } else {
            failCallback();
            // toastShort(res.msg);
        }
    }, (error) => {
        failCallback();
    })
}
