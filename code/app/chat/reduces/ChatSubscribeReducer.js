// /**
//  * Created by Monika on 2017/4/6.
//  */
// import * as types from "../actions/ActionTypes";
// const initState = {
//     byFrom: {},
//     msgCount: 0,
//     msgs: {}//{count:0,msgfrom:''}
// };
//
// let subscribe = (state = initState, action) => {
//     switch (action.type) {
//         case types.ADD_MSGCOUNT://添加消息数目
//             let msgCount = state.msgCount + action.count;
//             return Object.assign({}, state, {
//                 msgCount: msgCount
//             });
//             break;
//         case types.REMOVE_MSGCOUNT://移除聊天数目
//             let count1 = 0;
//             return Object.assign({}, state, {
//                 msgCount: count1
//             });
//             break;
//         case types.ADD_SUBSCRIBE:
//             let msg = action.msg;
//             return Object.assign({}, state, {
//                     byFrom: msg.from, msg
//                 }, {deep: true}
//             );
//             break;
//         case types.REMOVE_SUBSCRIBE:
//             let name = action.name;
//             let subs = state.byFrom;
//             delete subs[name];
//             return Object.assign({}, state, {
//                 byFrom: subs
//             });
//             break;
//         default:
//             return state;
//     }
// };
// export default subscribe;
