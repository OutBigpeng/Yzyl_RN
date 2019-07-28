import * as types from "./ActionTypes";
import {AsyncStorage} from "react-native";
import {Domain} from "../common/CommonDevice";
import JPushModule from "jpush-react-native";

/**
 * 检查登录状态
 * 如果当前状态false 判断本地有无用户数据  正常情况 state里的当前状态必为false
 * @returns {function(*, *)}
 */
export function checkLogin() {
    return (dispatch, getState) => {
        if (!getState().Login.isLoginIn) {
            return dispatch((loginState()));
        }
        return dispatch(receiveCheckLogin())
    };
}

function receiveCheckLogin() {
    return {
        type: types.RECEIVE_ISLOGIN,
    };
}


export function loginState() {
    return (dispatch) => {
        return isLogin((res,isLogin) => {
            dispatch(receiveLogin(res,isLogin))
        })
    };
}

function isLogin(callback) {
    AsyncStorage.getItem(USERINFO, (error, res) => {
        let userObj = {};
        if (error) {
            callback(userObj,false);
        }
        res = JSON.parse(res);
        if (res) {
            userObj = res;
            callback(userObj,true);
        } else {
            callback(userObj,false);
        }
    })
}

/**
 * 点击登录按钮时直接传入当前用户数据
 * @param userObj
 * @returns {function(*, *)}
 */
export function requestLogin(userObj,isLogin) {
    let alias = userObj.userid.toString();
    JPushModule.setAlias(Debug ? `dev${alias}` : alias, (success) => {
    }, (error) => {
    });
    return (dispatch, getState) => {
        return dispatch(receiveLogin(userObj,isLogin))
    }
}

function receiveLogin(userObj,isLogin) {
    return {
        type: types.RECEIVE_LOGIN,
        userObj,isLogin
    };
}

/**
 * 更新用户数据
 * @param data
 * @returns {function(*, *)}
 */
export function updateUserInfo(data) {
    return (dispatch, getState) => {
        return dispatch(receiveUpdateUserInfo(data))
    }
}

function receiveUpdateUserInfo(data) {
    return {
        type: types.RECEIVE_UPDATEUSERINFO,
        data
    };
}


/**
 * 用户登出  清空数据
 * @returns {function(*, *)}
 */
export function requestLoginOut() {
    return (dispatch, getState) => {
        AsyncStorage.setItem(USERINFO, JSON.stringify(''));
        return dispatch(receiveLoginOut())
    }
}

function receiveLoginOut() {
    return {
        type: types.RECEIVE_EXIT,
        isLogin: false,
    };
}

/**
 * 请求图片域名
 */
export function reqDomainObj(type) {
    return (dispatch, getState) => {
        return Domain((res) => {
            dispatch(receiveDomain(res))
        }, type)
    }
}

function receiveDomain(domainObj) {
    return {
        type: types.RECEIVE_DOMAIN,
        domainObj
    };
}