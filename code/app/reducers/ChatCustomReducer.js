/**
 * 聊天
 */
import {cloneObj} from "../common/CommonUtil";
import *as types from '../actions/ActionTypes';

const initialState = {
    messageList: [],
    pageCount: 0,
    // page: 0,
    countAll: 0//总数

};

function ChatCustom(state = initialState, action) {
    let newArray = state.messageList;

    switch (action.type) {
        case types.RECEIVE_SENDMESSAGE:
            let temp = action.sendContent;
            temp.ctime = new Date().Format();
            temp.fromApp = "yzyl";
            temp.status = action.status;
            state.messageList.push(temp);
            return Object.assign({},state, {messageList: state.messageList});

        case types.REQUEST_SENDMESSAGE://发送消息，改变状态
            let list = state.messageList;
            for(let i  = list.length-1;i>=0;i--) {
                if(action.data.id===list[i].id) {
                    list[i].status = action.status;
                    break;
                }
            }
            return  Object.assign({},state, {messageList: list});

        case types.RECEIVE_MESSAGELIST://请求的消息列表
            let data = action.data;
            let array = data.data;
            if (action.options === 2) {
                if (data.page <= data.pageCount && newArray.length < data.count) {
                    newArray = array.concat(newArray);
                }
            } else {
                if (state.countAll !== data.count) {
                    newArray = cloneObj(array);
                }
            }
            return Object.assign({},state, {countAll: data.count, pageCount: data.pageCount, messageList: newArray});
            break;
        case types.REQUEST_MESSAGELIST:
            return state;
        default:
            return state;
    }
}

export default ChatCustom;