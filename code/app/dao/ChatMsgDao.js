/**
 * 聊天消息Dao
 * Created by Monika on 2018/08/22.
 */

import {API_IMPAGEYZCHATACCOUNT, API_IMPAGEYZCHATMSG, API_IMSAVEYZCHATMSG} from "./API_Interface";
import Util from "../common/Util";


//发送消息
export function getSaveYzChatMsg(data, navigation = 0, callback, failCallback) {
    getNetWork(API_IMSAVEYZCHATMSG, data, navigation, callback, failCallback)
}

//消息历史记录列表
export function getPageYzChatMsg(data, navigation = 0, callback, failCallback) {
    getNetWork(API_IMPAGEYZCHATMSG, data, navigation, callback, failCallback)
}

//聊天人的列表
export function getPageYzChatAccount(data, navigation = 0, callback, failCallback) {
    getNetWork(API_IMPAGEYZCHATACCOUNT, data, navigation, callback, failCallback)
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
        failCallback(error);
    })
}