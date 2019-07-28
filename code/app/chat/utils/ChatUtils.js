// /**
//  * Created by Monika on 2017/4/6.
//  */
// import {Alert, AsyncStorage} from "react-native";
//
// import WebIM from "../lib/WebIM";
// import store from "../../store/Store";
//
// import {ChatLoginAction, ChatMessageAction, ChatRosterAction, ChatSubscribeAction} from "../actions";
// import {toastShort} from "../../common/CommonDevice";
// let isPush = true;
// let kefuAccount;
// let num = 0;
// export function chatListen(navigation) {
//     WebIM.conn.listen({
//         // xmpp连接成功
//         onOpened: (msg) => {
//             // 出席后才能接受推送消息
//             WebIM.conn.setPresence();
//             AsyncStorage.setItem(WEBIMTOKEN, JSON.stringify(msg.accessToken), () => {
//             });
//             // 获取好友信息
//             store.dispatch(ChatRosterAction.getContacts());
//             // 通知登陆成功
//             store.dispatch(ChatLoginAction.loginSuccess(msg));
//             if (navigation) {
//                 AsyncStorage.getItem('isAgainLogin', (err, id) => {
//                     let item = JSON.parse(id);
//                     if (item && parseInt(item) === 1) {
//                         AsyncStorage.getItem('contactList', (err, id) => {
//                             let item = JSON.parse(id);
//                             if (item) {
//                                 kefuAccount = item[0].name;
//                                 if (navigation.navigate) {
//                                     navigation.navigate('ChatMessage', {
//                                         title: '客服',
//                                         name: 'ChatMessage',
//                                         kefuAccount: kefuAccount,
//                                         callback: () => callBack()
//                                     })
//                                 }
//                             } else {
//                                 AsyncStorage.setItem(WEBIMTOKEN, JSON.stringify(''), () => {
//                                 });
//                             }
//                         });
//                     }
//                 })
//
//             }
//             // store.dispatch(ChatRosterAction.getContacts(_navigator,isPush,true));
//         },
//
//         // 出席消息
//         onPresence: (msg) => {
//             console.debug('onPresence', msg, store.getState());
//             isPush = true;
//             switch (msg.type) {
//                 case 'subscribe':
//                     // 加好友时双向订阅过程，所以当对方同意添加好友的时候
//                     // 会有一步对方自动订阅本人的操作，这步操作是自动发起
//                     // 不需要通知提示，所以此处通过state=[resp:true]标示
//                     if (msg.status === '[resp:true]') {
//                         return
//                     }
//                     store.dispatch(ChatSubscribeAction.addSubscribe(msg));
//                     break;
//                 case 'subscribed':
//                     store.dispatch(ChatRosterAction.getContacts());
//                     // Alert.alert(msg.from + ' ' + 'subscribed');
//                     break;
//                 case 'unsubscribe':
//                     // TODO: 局部刷新
//                     store.dispatch(ChatRosterAction.getContacts());
//                     break;
//                 case 'unsubscribed':
//                     // 好友退订消息
//                     store.dispatch(ChatRosterAction.getContacts());
//                     // Alert.alert(msg.from + ' ' + 'unsubscribed');
//                     break;
//             }
//         },
//         // 各种异常
//         onError: (error) => {
//             console.log(error);
//             // console.log("哈哈----", error);
//             //        store.dispatch(ChatLoginAction.loginFailure(error));
//             // 16: server-side close the websocket connection
//             if (error.type === WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
//                 console.log('WEBIM_CONNCTION_DISCONNECTED', WebIM.conn.autoReconnectNumTotal, WebIM.conn.autoReconnectNumMax);
//                 if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
//                     return;
//                 }
//                 AsyncStorage.setItem(WEBIMTOKEN, JSON.stringify(''));
//                 Alert.alert('抱歉', '与客服聊天连接超时,是否返回重新连接？', [
//                     {
//                         text: '是', onPress: () => {
//                         navigation.goBack()
//                     }
//                     },
//                     {
//                         text: '否', onPress: () => {
//                         isPush = false;
//                         // store.dispatch(ChatLoginAction.login(1));
//                     }
//                     },
//                 ]);
//                 return;
//             }
//             // 8: offline by multi login
//             if (error.type === WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
//                 console.log('WEBIM_CONNCTION_SERVER_ERROR');
//                 AsyncStorage.setItem(WEBIMTOKEN, JSON.stringify(''));
//
//                 let name = navigation.navigate.state.params.routeName;
//                 if (name) {
//                     // let length = currentRoutes.length;
//                     // if (length > 0) {
//                     //     let name = currentRoutes[length - 1].name;
//                     if (name && name == 'ChatMessage') {
//                         if (num <= 3) {
//                             Alert.alert(
//                                 '温馨提示：',
//                                 '账号已在其他地方登录，聊天连接已断开，是否重连',
//                                 [
//                                     {
//                                         text: '是', onPress: () => {
//                                         isPush = false;
//                                         store.dispatch(ChatLoginAction.login(0));
//                                         num++
//                                     }
//                                     },
//                                     {
//                                         text: '否', onPress: () => {
//                                         navigation.goBack()
//                                     }
//                                     },
//                                 ]
//                             );
//                         } else {
//                             Alert.alert(
//                                 '温馨提示',
//                                 '当前网络连接过慢，休息一下...',
//                                 [{text: '是', onPress: () => navigation.goBack()}]
//                             )
//                         }
//                     }
//                 }
//                 // }
//                 return;
//             }
//             if (error.type === 1) {
//                 let data = error.data ? error.data.data : '';
//
//                 AsyncStorage.getItem('isAgainLogin', (err, id) => {
//                     let item = JSON.parse(id);
//                     if (item) {
//                         if (item === 1) {
//                             let dataType = error.data ? error.data.type || -1 : -1;
//                             if (dataType == 17) {
//                                 // Alert.alert("", "客服不在线，稍候再试222");
//                                 toastShort("连接失败，稍候再试....");
//                             }
//                         } else if (item === 0) {
//                             data && Alert.alert('', '客服不在线，休息一会333!');//data
//                         }
//                     }
//                 });
//                 isPush = true;
//                 // store.dispatch(ChatLoginAction.loginFailure(error))
//             }
//             store.dispatch(ChatLoginAction.loginFailure(error));
//         },
//         // 连接断开优众优料
//         onClosed: (msg) => {
//             store.dispatch(ChatLoginAction.loginFailure(msg));
//             console.log('onClosed')
//         },
//         // 更新黑名单
//         onBlacklistUpdate: (list) => {
//             // store.dispatch(BlacklistActions.updateBlacklist(list))
//         },
//         /**
//          * { id: '320009637665440248',
//      type: 'chat',
//      from: 'kefu001',
//      to: 'uu107',
//      data: 'ddd',
//      ext: { weichat: { originType: 'webim' } },
//      error: false,
//      errorText: '',
//      errorCode: '' }
//          * @param message
//          */
//         // 文本信息
//         onTextMessage: (message) => {
//             store.dispatch(ChatSubscribeAction.addMsgCount());
//             store.dispatch(ChatMessageAction.addMessage(message, 'txt'));
//         },
//         onPictureMessage: (message) => {
//             store.dispatch(ChatSubscribeAction.addMsgCount());
//             store.dispatch(ChatMessageAction.addMessage(message, 'img'));
//         },
//
//     })
//
// }
//
// function callBack() {
//     store.dispatch(ChatSubscribeAction.removeMsgCount());
// }