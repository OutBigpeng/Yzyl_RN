/**
 * 私聊
 */
import *as types from '../actions/ActionTypes';
import {cloneObj} from "../common/CommonUtil";

const initialState = {
    messageListObj: {},
    resObj: {},
    currentChatKey: ''
};

function ChatMsg(state = initialState, action) {
    let list = [];
    switch (action.type) {
        case types.RECEIVE_IMCHATKEY:
            return Object.assign({}, state, {
                currentChatKey: action.key
            });
        case types.REQUEST_IMCHATMSGLIST:
            return state;
        case types.RECEIVE_IMCHATMSGLIST:
            list = state.messageListObj[state.currentChatKey]||[];
            let newArray = list;
            let res = action.res;
            let array = res.data;
            if (action.options === 2) {// 下拉 得到更多 历史消息
                if (res.page <= res.pageCount && newArray.length < res.count) {
                    newArray = array.concat(newArray);
                }
            } else {
                if (state.resObj&&state.resObj.count !== res.count) {
                    newArray = cloneObj(array);
                }
            }
            let {count,pageCount,other,page} = res;
            return Object.assign({}, state, {
                resObj:Object.assign(state.resObj,{[state.currentChatKey]:{count,pageCount,personObj:other,page}}),
                messageListObj: Object.assign(state.messageListObj,{[state.currentChatKey]:newArray})
            });
            break;
        case types.RECEIVE_IMCHATSENDMSG:
            list = state.messageListObj[state.currentChatKey]||[];
            let temp = action.data;
            temp.ctime = new Date().Format();
            temp.fromApp = "yzylChat";
            temp.status = action.status;
            list.push(temp);
            return Object.assign({}, state, {messageListObj: Object.assign(state.messageListObj,{[state.currentChatKey]:list})});
            break;
        case types.REQUEST_IMCHATSENDMSG:
             list = state.messageListObj[state.currentChatKey]||[];
            for (let i = list.length - 1; i >= 0; i--) {
                if (action.data.id === list[i].id) {
                    list[i].status = action.status;
                    break;
                }
            }
            return Object.assign({}, state, {messageListObj: Object.assign(state.messageListObj,{[state.currentChatKey]:list})});

            break;
        default:
            return state;
    }
}

export default ChatMsg;