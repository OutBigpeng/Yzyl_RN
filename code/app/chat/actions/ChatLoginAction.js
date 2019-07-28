// /**
//  * Created by Monika on 2017/4/6.
//  */
//
// import * as types from "./ActionTypes";
// import {Alert, AsyncStorage, Platform} from "react-native";
// import WebIM, {api} from "../lib/WebIM";
// import {chatListen} from "../../chat/utils/ChatUtils";
//
// //
// // export let register = (username, password) => {
// //     return (dispatch, getState) => {
// //         let options = {
// //             username: username.trim().toLowerCase(),
// //             password: password,
// //             nickname: username.trim()
// //         };
// //         dispatch(registerRequest(username, password));
// //         return api.register(options).then(({data}) => {
// //             if (data.error) {
// //                 Alert.alert('Error', data.error_description);
// //                 dispatch(registerFailure(data));
// //                 return Promise.reject();
// //             }
// //             dispatch(registerSuccess(data));
// //             // Alert.alert('Success');
// //             // if(navigator) {
// //             // navigator.pop();
// //             // }else
// //             // Alert.alert("", "注册成功，请点击登录");
// //         }).catch((error) => {
// //             console.log("register error", error);
// //         })
// //     }
// // };
// //
// // function registerRequest(username, password) {
// //     return {
// //         type: types.REGISTER_REQUEST,
// //         username, password, fetching: true
// //     };
// // }
// // function registerSuccess(json) {
// //     return {
// //         type: types.REGISTER_SUCCESS,
// //         json
// //     };
// // }
// // function registerFailure(registerError) {
// //     return {
// //         type: types.REGISTER_FAILURE,
// //         registerError
// //     };
// // }
//
// export let login = (item,navigation) => {
//     return (dispatch, getState) => {
//         dispatch(isAgainLogin(item,navigation));
//         AsyncStorage.getItem(USERINFO, (error,result) => {
//             let user = JSON.parse(result);
//             let username = user.imusername;
//             let password = user.impassword;
//             dispatch(loginRequest(username, password));
//             if (WebIM.conn.isOpened()) {
//                 WebIM.conn.close('logout');
//             }
//             let options = {
//                 apiUrl: WebIM.config.apiURL,
//                 user: username,
//                 pwd: password,
//                 appKey: WebIM.config.appkey,
//             };
//             WebIM.conn.open(options);
//         })
//     }
// };
//
// export function logout(){//USER_LOGOUT
//     return (dispatch, state) => {
//         if (WebIM.conn.isOpened()) {
//             WebIM.conn.close('logout')
//         }
//         dispatch({type: 'USER_LOGOUT'})
//     }
// }
//
// function isAgainLogin(item,navigation) {
//     if(item){
//         AsyncStorage.setItem('isAgainLogin',JSON.stringify(item));
//         chatListen(navigation)
//
//     }
//
//     return{
//         type: types.LOGIN_AGAIN,
//     }
//
// }
//
// function loginRequest(username, password) {
//     return {
//         type: types.LOGIN_REQUEST,
//         username, password, fetching: true
//     };
// }
//
// export function loginSuccess(json) {
//     /**
//      * { canReceive: [ 300, undefined ],
//  canSend: [ 309, 303, 305 ],
//   accessToken: 'YWMt6pi7Fhs4EeeBgb2hkzMwP_QFvWCxbBHmjehtiyJO2aiwWIQwt3AR5oMM3ahY1a-8AwMAAAFbRjd6QABPGgCb13KEGZd2a1Koq
// 2ntMb33htD6y0AZ2eY2bCRfYGWARg' }
//      'token', 'YWMt6pi7Fhs4EeeBgb2hkzMwP_QFvWCxbBHmjehtiyJO2aiwWIQwt3AR5oMM3ahY1a-8AwMAAAFbRjd6QABPGgCb13KEGZd2a1Koq2ntMb3
//      3htD6y0AZ2eY2bCRfYGWARg'
//
//      */
//     // console.log('token', json.accessToken);
//     return {
//         type: types.LOGIN_SUCCESS,
//         json, fetching: false
//     };
// }
// export function loginFailure(error) {
//     return {
//         type: types.LOGIN_FAILURE,
//         error,fetching: false
//     };
// }