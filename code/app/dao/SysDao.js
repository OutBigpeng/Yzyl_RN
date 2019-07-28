/**
 * Created by Monika on 2016/10/5.
 */
'use strict';
import {
    API_FEEDBACK,
    API_GETSYSDICTIONARY, API_LISTFIRSTPYBYPARENTKEY,
    API_MESSAGE_LIST,
    API_QUERYVALUEBYSCKEY,
    API_SYSTEM_AGREEMENT,
    API_VERSIONUPDATE
} from "./API_Interface";
import Util from '../common/Util';
import {Platform} from "react-native";

import {isEmptyObject, toastShort} from "../common/CommonDevice";
import * as DeviceInfo from "react-native-device-info";

/**
 * 系统协议请求名称
 * @param data
 * @param callback
 * @param failCallback
 */
export function getSysDictionaryData(data, callback, failCallback) {
    getNetWork(API_GETSYSDICTIONARY, data,0, callback, failCallback);
}

export function getListFirstPYByParentKey(data, callback, failCallback) {
    getNetWork(API_LISTFIRSTPYBYPARENTKEY, data,0, callback, failCallback);
}

/**
 * 请求的协议名称    string
 关于我们，用户服务协议,提问悬赏规则   专家分获得规则  结贴规则
 * @param agreementName
 */
export function getSysAgreement(agreementName, callback, failCallback) {
    let data = {'agreementName': agreementName};
    Util.POST(API_SYSTEM_AGREEMENT, data, 0, (backResult) => {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    toastShort(backResult.msg);
                    failCallback(backResult.msg);
                    break;
            }
        }
    }, (err) => {
        // toastShort('网络发生错误,请重试!');
        failCallback();
    })
}

/**
 * 反馈与建议
 *  "secret":"AAAAAAAAAAAAA",
 "phonetype":"iphone 7",
 "osversion":"IOS9999",
 "content":"测试测试测试测试啊啊啊",
 "appid":"BBBBBBBBBBBB",
 "userid":2
 * @param content
 * @param callback
 */
export function setFeedBack(content, userId, navigation, callback, failCallback) {
    let data = {
        'secret': '', 'phonetype': DeviceInfo.getModel(), 'osversion': DeviceInfo.getSystemVersion(),
        'content': content, 'appid': DeviceInfo.getVersion(), 'userid': userId
    };
    Util.POST(API_FEEDBACK, data, navigation, (backResult) => {
        if (backResult) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback("ok");
                    break;
                default:
                    failCallback(backResult.msg);
                    toastShort(backResult.msg);
                    break;
            }
        }
    }, (err) => {
        // toastShort('网络发生错误,请重试!');
        failCallback();
    });
}

/**
 * 我的消息列表
 * @param
 * "userid": 2,
 "pageIndex":1,
 "pageSize":1,
 "usertype":"employee",
 "isread": 0
 * @param callback
 */
export function getMessageList(data, navigation, callback, failCallback) {
    Util.POST(API_MESSAGE_LIST, data, navigation, (backResult) => {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    toastShort(backResult.msg);
                    failCallback(backResult.msg);
                    break;
            }
        }
    }, (err) => {
        // toastShort('网络发生错误,请重试!');
        failCallback();
    });
}

/**
 * 版本更新
 * @param
 * "userid": 2,
 "pageIndex":1,
 "pageSize":1,
 "usertype":"employee",
 "isread": 0
 * @param callback
 */
export function getUpdate(navigation, callback, failCallback, type) {

    let name = 'ios' + DeviceInfo.getVersion();
    let data = {
        "version": Platform.OS === 'ios' ? 0 : DeviceInfo.getBuildNumber(),
        "name": Platform.OS === 'ios' ? name : DeviceInfo.getVersion(),
    };
    Util.POST(API_VERSIONUPDATE, data, navigation, (backResult) => {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    if (type) {
                        toastShort(backResult.msg);
                    }
                    failCallback(backResult.msg);
                    break;
            }
        }
    }, (err) => {
        // toastShort('网络发生错误,请重试!');
        failCallback();
    });
}


/**
 *IM_isOpen 即时通讯开(Y)关(N)
 * 问答 是否要设置积分 "key":"Discuss_QA_score_isOpen"
 IM_welcome 第一句问候语
 * "data": {
        "key":"IM_isOpen"
    }
 */
export function sendQueryValueBySCKey(key, navigation, callback, failCallback) {
    let data = {"key": key};
    Util.POST(API_QUERYVALUEBYSCKEY, data, navigation, (backResult) => {
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
    }, (err) => {
        failCallback();
    });
}

function getNetWork(url, data, navigation, callback = () => {
}, failCallback = () => {
}) {
    Util.POST(url, data, navigation, (res) => {
        if (res.code === '200') {
            callback(res.result);
        } else {
            failCallback(res);
        }
    }, (error) => {
        console.log(error);
        failCallback(error);
    })
}