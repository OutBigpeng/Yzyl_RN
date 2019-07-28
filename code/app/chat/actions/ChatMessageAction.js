/**
 * Created by Monika on 2017/4/6.
 */
import * as types from "./ActionTypes";
import WebIM from "../lib/WebIM";
import {parseFromLocal} from "../utils/ChatMessageUtil";
import {sendSelfHttpImgMsg} from "../dao/ChatDao";
export function sendTxtMessage(chatType, chatId, message = {}) {
    return (dispatch, getState) => {
        const pMessage = parseFromLocal(chatType, chatId, message, 'txt');
        const {body, id, to} = pMessage;
        const {type, msg} = body;
        const msgObj = new WebIM.message(type, id);
        msgObj.set({
            //TODO: cate type == 'chatrooms'
            msg, to, roomType: false,
            success: function () {
                dispatch(updateMessageStatus(pMessage, 'sent'))
            },
            fail: function () {
                dispatch(updateMessageStatus(pMessage, 'fail'))
            }
        });

        // TODO: 群组聊天需要梳理此参数的逻辑
        // if (type !== 'chat') {
        //   msgObj.setGroup('groupchat');
        // }

        WebIM.conn.send(msgObj.body);
        // console.log("messa------------", pMessage);
        dispatch(addMessage(pMessage, type))
    }
}
export function sendImgMessage(chatType, chatId, sendId, message = {}, source = {}) {
    return (dispatch, getState) => {
        let pMessage = null;
        const id = WebIM.conn.getUniqueId();
        const type = 'img';
        const to = chatId;//对方（联系人）
        const from = sendId;//自己
        const msgObj = new WebIM.message(type, id);
        // console.log("查看",message,chatId);
        msgObj.set({
            apiUrl: WebIM.config.apiURL,
            ext: {
                file_length: source.fileSize,
                filename: source.fileName || '',
                filetype: source.fileName && (source.fileName.split('.')).pop(),
                width: source.width,
                height: source.height,
            },
            file: {
                data: {
                    uri: source.uri, type: 'application/octet-stream', name: source.fileName
                }
            },
            to, roomType: '',
            onFileUploadError: function (error) {
                dispatch(updateMessageStatus(pMessage, 'fail'))
            },
            onFileUploadComplete: function (fileResult) {
                // console.log("发送的图片***data***：", data);
                //发送给服务器
                let data = {
                    'msgid': id,
                    'from': from,
                    'to': to,
                    'hxurl': fileResult.uri + '/' + fileResult.entities[0].uuid
                };
                setTimeout(() => {
                    sendSelfHttpImgMsg(data, (res) => {
                    }, (err) => {
                    });
                }, 100);
                // url = data.uri + '/' + data.entities[0].uuid;
                dispatch(updateMessageStatus(pMessage, 'sent'))
            },
            success: function (id) {
            },
        });

        // TODO: 群组聊天需要梳理此参数的逻辑
        // if (type !== 'chat') {
        //   msgObj.setGroup('groupchat');
        // }
        WebIM.conn.send(msgObj.body);
        pMessage = parseFromLocal(chatType, chatId, msgObj.body, 'img', id);

        // uri只记录在本地
        pMessage.body.uri = source.uri;

        dispatch(addMessage(pMessage, type))
    }
}

export function updateMessageStatus(message, messageType) {
    return {
        type: types.UPDATE_MESSAGE_STATUS,
        message, messageType
    };
}

export function addMessage(message, bodyType = 'txt') {
    return {
        type: types.ADD_MESSAGE,
        message, bodyType
    };
}
export function clearProps(chatId) {
    return {type: types.REMOVE_PROPS, chatId};

}
export function removeCurrentUserMsg() {
    return {type: types.REMOVE_MSG};
}
