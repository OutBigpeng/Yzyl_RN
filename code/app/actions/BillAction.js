/**发票信息Action
 * Created by Monika on 2017/1/17.
 */
'use strict';
import * as types from "./ActionTypes";
import {isEmptyObject,toastShort,_} from "../common/CommonDevice";
import {getBillList, getBillShow, getBillSetDefault} from "../dao/UserBillDao";

/**
 * 发票列表
 *
 * @param params ：userId
 */
export function fetchBillListIfNeeded(params, navigation,callBack) {
    return (dispatch) => {
        if (shouldFetchBillList(params)) {
            return dispatch(fetchBillList(params, navigation,callBack));
        }
    }
}
function fetchBillList( params, navigation,callBack) {
    return (dispatch) => {
        dispatch(requestBillList());
        return getBillList(params, navigation, (result) => {
            if(result&&!isEmptyObject(result)&&result.length>0){
                callBack(result, {
                    allLoaded: true,
                });
            dispatch(receiveBillList(result));}
            else {
                if(callBack) {
                callBack(null, {});
                }
            }
        }, (error) => {
            if(callBack) {
                callBack(null, {});
            }
            dispatch(receiveBillList([]));
        })
    }
}
function requestBillList() {
    return {
        type: types.REQUEST_BillLIST,
    }
}
function receiveBillList(result) {
    return {
        type: types.RECEIVE_BillLIST,
        billList: result,
    }
}
function shouldFetchBillList(params) {
    return true;
}
/**
 * 设置默认发票
 * @param params
 * @param navigation
 * @param callBack
 * @returns {function(*)}
 */
export function fetchSetDefaultBillIfNeeded(params, navigation) {
    return (dispatch) => {
        if (shouldFetchSetDefault(params)) {
            return dispatch(fetchSetDefault(params, navigation));
        }
    }
}
function fetchSetDefault(params,id, navigation) {
    return (dispatch) => {
        dispatch(requestSetDefault());
        return getBillSetDefault(params, navigation, (result) => {
            dispatch(receiveSetDefault(params,id));
        }, (error) => {
            dispatch(receiveSetDefault([]));
        })
    }
}
function requestSetDefault() {
    return {
        type: types.REQUEST_SETDEFAULTBILL,
    }
}
function receiveSetDefault(params,id) {
    return {
        type: types.RECEIVE_SETDEFAULTBILL,
        id: id,
    }
}
function shouldFetchSetDefault(params) {
    return true;
}
/**
 * 发票展示
 * @param params
 * @param navigation
 * @returns {function(*)}
 */
export function fetchBillShowIfNeeded(userId,id, navigation) {
    return (dispatch) => {
        if (shouldFetchBillShow(userId)) {
            return dispatch(fetchBillShow(userId,id, navigation));
        }
    }
}

function fetchBillShow(userId,id, navigation) {
    return (dispatch) => {
        dispatch(requestBillShow(id));
        return getBillShow(userId,id, navigation, (result) => {
            dispatch(receiveBillShow(userId,id,result));
        }, (error) => {
            dispatch(receiveBillShow());
        })
    }
}
function requestBillShow(id) {
    return {
        type: types.REQUEST_BILLSHOW,
    }
}
function receiveBillShow(userId,id,result) {
    return {
        type: types.RECEIVE_BILLSHOW,
        id: id,
        itemDetail:result
    }
}
function shouldFetchBillShow(params) {
    return true;
}
