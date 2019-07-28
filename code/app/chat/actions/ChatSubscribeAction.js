/**
 * Created by Monika on 2017/4/6.
 */
import * as types from "./ActionTypes";

import WebIM from "../lib/WebIM";

export let acceptSubscribe = (name) => {
    return (dispatch, getState) => {
        dispatch(removeSubscribe(name));
        WebIM.conn.subscribed({
            to: name,
            message: '[resp:true]'
        })
    }
};
export let declineSubscribe = (name) => {
    return (dispatch, getState) => {
        dispatch(removeSubscribe(name));
        WebIM.conn.unsubscribed({
            to: name,
            message: new Date().toLocaleString()
        })
    }
};
export let addMSGCOUNT = (message, count) => {
    return (dispatch, getState) => {
        dispatch(addMsgCount(message, count));
    }
};
export function addMsgCount(message, count = 1) {
    return {
        type: types.ADD_MSGCOUNT,
        message, count
    };
}
export let removeMSGCOUNT = (message) => {
    return (dispatch, getState) => {
        dispatch(removeMsgCount(message));
    }
};
export function removeMsgCount(message) {
    return {
        type: types.REMOVE_MSGCOUNT,
        message
    };
}
export function addSubscribe(msg) {
    return {
        type: types.ADD_SUBSCRIBE,
        msg
    };
}
function removeSubscribe(name) {
    return {
        type: types.REMOVE_SUBSCRIBE,
        name
    }
}




