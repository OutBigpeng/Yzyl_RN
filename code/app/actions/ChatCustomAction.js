/**
 * 聊天
 *  Created by Monika on 2017/11/28.

 */
import * as types from "./ActionTypes";
import {messageList, sendMessageData} from '../dao/ChatCustomDao';
import {toastShort} from "../common/ToastUtils";
import {randomID} from "../common/CommonUtil";

//发送消息
export function fetchSendMessage(fromId, content, navigation) {
    return (dispatch, getState) => {
        return dispatch(sendMessageInfo(fromId, content, navigation));
    }
}

function sendMessageInfo(fromId, content, navigation) {
    return (dispatch) => {
        let data = {fromId: fromId, content: content};
        // console.log("发送消息", data);
        data.id = randomID();
        dispatch(request_sendMessage(data, "sending"));
        sendMessageData(data, navigation, (res) => {
            dispatch(receive_sendMessage(data, "sended"))
        }, (err) => {
            dispatch(receive_sendMessage(data, "failed"))
        })
    }
}

function receive_sendMessage(data, status) {
    return {
        type: types.RECEIVE_SENDMESSAGE,
        sendContent: data, status
    };
}

function request_sendMessage(data, status) {
    return {
        type: types.REQUEST_SENDMESSAGE,
        data, status

    };
}

/**
 *列表 {"pageIndex":1,
"pageSize":10,
    "fromId":2}
 */
export function fetchMessageList(data, navigation, type) {
    return (dispatch, getState) => {
        return dispatch(messageListInfo(data, navigation, type));
    }
}

function messageListInfo(data, navigation, type) {
    return (dispatch, getState) => {
        if (getState().ChatCustom.pageCount&&getState().ChatCustom.pageCount < data.pageIndex) {
            toastShort("没有更多了")
        } else {
            messageList(data, navigation, (res) => {
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
        type: types.RECEIVE_MESSAGELIST,
        data: res,
        options
    };
}

function request_messageList(err) {
    return {
        type: types.REQUEST_MESSAGELIST,
        data: {},
        err
    };
}
