/**
 * 聊天
 *  Created by Monika on 2017/11/28.

 */
import * as types from "./ActionTypes";
import {toastShort} from "../common/ToastUtils";
import {randomID} from "../common/CommonUtil";
import {getPageYzChatMsg, getSaveYzChatMsg} from "../dao/ChatMsgDao";

//保存一个当前聊天的key
export function fetchSetChatKey(key) {
    return (dispatch, getState) => {
        return dispatch(receive_setChatKey(key));
    }
}

function receive_setChatKey(key) {
    return {
        type: types.RECEIVE_IMCHATKEY,
      key
    };
}
//发送消息
export function fetchSendChatMsg(data, navigation) {
    return (dispatch, getState) => {
        return dispatch(sendMsgInfo(data, navigation));
    }
}

function sendMsgInfo(data, navigation) {
    return (dispatch) => {
        data.id = randomID();
        dispatch(request_sendMessage(data, "sending"));
        getSaveYzChatMsg(data, navigation, (res) => {
            dispatch(receive_sendMessage(data, "sended"))
        }, (err) => {
            dispatch(request_sendMessage(data, "failed"))
        })
    }
}

function receive_sendMessage(data, status) {
    return {
        type: types.RECEIVE_IMCHATSENDMSG,
        data, status
    };
}

function request_sendMessage(data, status) {
    return {
        type: types.REQUEST_IMCHATSENDMSG,
        data, status

    };
}

/**
 *列表 {"pageIndex":1,
"pageSize":10,
    "fromId":2}
 */
export function fetchChatMsgList(data, navigation, type) {
    return (dispatch, getState) => {
        return dispatch(messageListInfo(data, navigation, type));
    }
}

function messageListInfo(data, navigation, type) {
    return (dispatch, getState) => {
        if (getState().ChatMsg.resObj.pageCount&&getState().ChatMsg.resObj.pageCount < data.pageIndex) {
            toastShort("没有更多了")
        } else {
            getPageYzChatMsg(data, navigation, (res) => {
                if (res.page === 1) {
                    dispatch(receive_messageList(res, type))
                } else {
                    dispatch(receive_messageList(res, type))
                }
            }, (err) => {
                dispatch(request_messageList(err, type))
            })
        }
    }
}

function receive_messageList(res, options) {
    return {
        type: types.RECEIVE_IMCHATMSGLIST,
        res,
        options
    };
}

function request_messageList(err) {
    return {
        type: types.REQUEST_IMCHATMSGLIST,
        res: {},
        err
    };
}


