/**
 * Created by Monika on 2017/4/6.
 */
import * as types from "./ActionTypes";
import {Alert,AsyncStorage} from "react-native";

import  WebIM from '../lib/WebIM';

global.KEFUNAME = "KEFUNAME";//保存客服账号内容

export function getContacts() {

    return(dispatch)=>{
        WebIM.conn.getRoster({
            success: (roster) => {
                if(roster) {
                    let member = [];
                    for(let i=0;i<roster.length;i++){
                        if(roster[i].subscription !== 'none' ){
                            member.push(roster[i])
                        }
                    }
                    dispatch (receive_getContact(member))
                }
            },
            error: (error) => {
                // dispatch(requset_getContact(isLoading))
                //TODO ERROR
                console.log('error', error)
            }
        })
    }
}

function receive_getContact(roster) {
    // console.log('我是roster',roster)
    AsyncStorage.setItem('contactList',JSON.stringify(roster));
    return{
        type:types.RECEIVE_ROSTER,
        roster
    }
}

// export let getContacts = (_navigator,isPush,isJump) => {
//     return (dispatch, getState) => {
//         WebIM.conn.getRoster({
//             success: (roster) => {
//                 console.log("roster  成功----",roster,roster[0].name);
//                 dispatch(loadRoster(roster));
//                 let name = roster[0].name;
//                 AsyncStorage.setItem(KEFUNAME, JSON.stringify(name),(error,result)=>{});
//                 let oop = {
//                     component: ChatMessage,
//                     componentName: '客服',
//                     name: name,
//                     callback: ()=>callBack()
//                 };
//                 if(isPush&&isJump) {
//                     _navigator.push(oop)
//                 }else {
//                     console.log("-------相信我，不能跳转------")
//                 }
//             },
//             error: (error) => {
//                 console.log("哈哈", error);
//             }
//         })
//     }
// };
function callBack(){
}

function loadRoster(roster) {
    return{
        type:types.UPDATE_ROSTER,
        rosters:roster
    }
}

export  let removeContact=(id)=>{
    return (dispatch,getState)=>{
        WebIM.conn.removeRoster({
            to:id,
            success:function () {
                dispatch(getContacts());
                WebIM.conn.unsubscribed({
                    to: id
                });
            },
            error:function (error) {
                console.log("removeContact", error);
            }
        })
    }
};
export let addContact=(id)=>{
    return (dispatch,getState)=>{
        WebIM.conn.subscribe({
            to: id,
            message: 'request'
        });
    }
};