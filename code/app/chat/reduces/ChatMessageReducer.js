// /**
//  * Created by Monika on 2017/4/6.
//  */
// import *as types from "../actions/ActionTypes";
// import {createReducer} from "reduxsauce";
// import {AsyncStorage} from "react-native";
// import {parseFromServer} from "../utils/ChatMessageUtil";
// import {sendHttpMsg} from "../dao/ChatDao";
// import {compare, DuplicateRemoval} from "../../common/CommonDevice";
// global.CHATHISTORY = "CHATHISTORY";//保存消息历史
// const INITIAL_STATE = {
//     byId: {},
//     chat: {},
//     groupChat: {},
//     extra: {},
//     chatId: '',
//     chatType: '',
//     chatCount: 0
// };
//
// const addMessage = (state = INITIAL_STATE, {message, bodyType = 'txt'}) => {
//     !message.status && (message = parseFromServer(message, bodyType));
//     const {type, id, to, status, bySelf, time} = message;
//     // console.log("我是消息--", message);
//     // 消息来源：没有from默认即为当前用户发送
//     const from = message.from;
//     // 房间id：自己发送或者不是单聊的时候，是接收人的ID， 否则是发送人的ID
//     let chatId = bySelf ? to : (type !== 'chat' ? to : from);
//     let currentTime = time || +new Date();
//     if (bySelf) {
//         let data = {
//             ...message,
//             bySelf,
//             time: currentTime,
//             status: status,
//         };
//         let newMessageData = {[id]: data};
//         AsyncStorage.getItem(USERINFO, (error, result) => {
//             let user = JSON.parse(result);
//             sendHttpMsg(bodyType, currentTime, to, user.imusername, newMessageData, (callback) => {
//             }, (failCallback) => {
//             })
//         })
//     }
//
//     let ChatIdTemp = (state.chat && state.chat[chatId]) || [];
//     let ChatIdAll = [].concat(ChatIdTemp);
//     ChatIdAll.push(id);
//     ChatIdAll = DuplicateRemoval(ChatIdAll);
//     let itemTemp = {'chat': {}, 'byId': {}};
//
//     itemTemp.byId[id] = {
//         ...message,
//         bySelf,
//         time: currentTime,
//         status: status,
//     };
//     for (let m = 0; m < ChatIdAll.length; m++) {
//         itemTemp.byId[ChatIdAll[m]] = state.byId[ChatIdAll[m]] || itemTemp.byId[ChatIdAll[m]];
//     }
//     // itemTemp.chat[chatId] = ChatIdAll;
//
//     //先判断本地有没有
//     let flag = true;//判断 chatId是否再次加入
//     AsyncStorage.getItem(USERINFO, (error, result) => {
//         let user = JSON.parse(result);
//         AsyncStorage.getItem(`CHATHISTORY${user.imusername}`, (err, id) => {
//             let item = JSON.parse(id);
//             if (ChatIdAll.length <= 0 &&item) {
//                 let itemChatId = [].concat(item.chat[chatId]);
//                 // let ChatIdAll = [].concat(itemTemp.chat[chatId]);
//                 // ChatIdAll = DuplicateRemoval(ChatIdAll);
//                 for (let i = 0; i < itemChatId.length; i++) {
//                     for (let j = 0; j < ChatIdAll.length; j++) {
//                         if (itemChatId[i] === ChatIdAll[j]) {
//                             ChatIdAll.splice(i, 1)
//                         }
//                     }
//                 }
//                 let copyItemChat = (item.chat[chatId]).concat();//
//                 let allItem = ChatIdAll.concat(copyItemChat);//合并本地数据与state
//                 // item.chat[chatId] = DuplicateRemoval(allItem);//把合并以后的数据去重后替换本地的chat[chat]
//                 for (let m = 0; m < ChatIdAll.length; m++) {
//                     item.byId[ChatIdAll[m]] = itemTemp.byId[ChatIdAll[m]] || item.byId[ChatIdAll[m]];
//                 }
//                 itemTemp.byId = item.byId;//替换state 里面的byId
//                 //根据时间排序
//                 let timeArr = [];
//                 for (let i = 0; i < allItem.length; i++) {
//                     let aa = item.byId[allItem[i]];
//                     if (aa) {
//                         timeArr.push({
//                             "time": aa.time,
//                             "id": aa.id,
//                             "msg": aa.body.msg
//                         });
//                     }
//                 }
//                 let aadd = [];
//                 let timeSort = timeArr.sort(compare("time"));//时间倒序排列
//                 for (let m = 0; m < timeSort.length; m++) {
//                     aadd.push(timeSort[m].id);
//                 }
//                 let temp = DuplicateRemoval(aadd);
//                 item.chat[chatId] = temp;
//                 itemTemp = item;
//                 // ChatIdAll = aadd;
//                 saveData(itemTemp);
//                 flag = false;
//             } else {
//             }
//         });
//     });
//     if (flag) {
//         itemTemp.chat[chatId] = ChatIdAll;
//     }
//     return Object.assign({}, state, itemTemp);
// };
//
// const updateMessageStatus = (state = INITIAL_STATE, {message, status = ''}) => {
//     const {id, to, from, bySelf, type} = message;
//     let chatId = (bySelf || type !== 'chat' )? to : from;
//     // console.log("哈哈---", message);
//     state.byId[id].status = status;
//     state.byId[id].time = +new Date();
//     let stateChatId = [].concat(state.chat[chatId]);
//     stateChatId.push(id);
//     state.chat[chatId] = DuplicateRemoval(stateChatId);
//     saveData(state);
//     // AsyncStorage.getItem(USERINFO, (error, result) => {
//     //     let user = JSON.parse(result);
//     //     AsyncStorage.setItem(`CHATHISTORY${user.imusername}`, JSON.stringify(state));
//     // });
//     return Object.assign({}, state, state);
// };
//
//
// const removeCurrentUserMsg = (state, {}) => {
//     state = {};
//     return state;
// };
//
//
// const clearProps = (state, {chatId}) => {
//     state = {};
//     return state;
//     // console.log('foiehfeowihfwoih',state)
//     // return Object.assign({},state,{byId:{},chat:{}})
//     // state = state.setIn(['chat', chatId], );
//     // console.log("lsflsflsfl00000---", state);
//     // return state;
// };
// const ChatMessage = createReducer(INITIAL_STATE, {
//     [types.ADD_MESSAGE]: addMessage,
//     [types.UPDATE_MESSAGE_STATUS]: updateMessageStatus,
//     [types.REMOVE_MSG]: removeCurrentUserMsg,
//     [types.REMOVE_PROPS]: clearProps,
// });
//
//  function saveData(item) {
//     AsyncStorage.getItem(USERINFO, (error, result) => {
//         let user = JSON.parse(result);
//         AsyncStorage.setItem(`CHATHISTORY${user.imusername}`, JSON.stringify(item));
//     });
// }
//
// export default ChatMessage;