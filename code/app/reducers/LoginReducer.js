import {AsyncStorage} from "react-native";

/**登录——Reducer
 */
const initialAuthState = {
    isLoginIn: false,
    userObj: {},
    domainObj: {}
};
import *as types from '../actions/ActionTypes';

function auth(state = initialAuthState, action) {
    switch (action.type) {
        case types.RECEIVE_EXIT:
            if (state.isLoginIn === action.isLogin) {
                return state;
            } else {
                return  Object.assign({}, state, {isLoginIn: action.isLogin, userObj: {}});
            }
        case types.RECEIVE_ISLOGIN:
            return state;
        case types.RECEIVE_LOGIN:
            let obj = action.userObj;
            return Object.assign({}, state, {isLoginIn: action.isLogin, userObj: obj});
            break;
        case types.RECEIVE_UPDATEUSERINFO:
            let userObj = state.userObj;
            let uInfo = Object.assign(userObj, action.data);
            AsyncStorage.setItem(USERINFO, JSON.stringify(uInfo));
            return Object.assign({}, state, {userObj:uInfo});
        case types.RECEIVE_DOMAIN:
            return Object.assign({}, state, {domainObj: action.domainObj});
            break;
        default:
            return state;
    }
}

export default auth;