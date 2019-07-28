/**地址相关、优惠券相关
 * Created by Monika on 2016/12/27.
 */

'use strict';
import * as types from "./ActionTypes";
// import {isEmptyObject,toastShort,_} from "../common/CommonDevice";
import {
    getReceiverList,
    getReceiverDel,
    getReceiverSetDefault,
    getReceiverAdd,
    getReceiverEdit
} from "../dao/UserReceiverDao";
import {
    API_RECEIVER_LIST,
    API_RECEIVER_EDIT,
    API_RECEIVER_NEWADD,
    API_RECEIVER_DEL,
    API_RECEIVER_SETTDEFAULT,
    API_BILL_RECEIVER_LIST,
    API_BILL_RECEIVER_EDIT,
    API_BILL_RECEIVER_NEWADD,
    API_BILL_RECEIVER_DEL,
    API_BILL_RECEIVER_SETTDEFAULT
} from "../dao/API_Interface";
import {getCouponOrder} from "../dao/CouponDao";

/**
 * 收货人地址列表
 * @param userId
 */
export function fetchAddressListIfNeeded(type, params, navigation,status) {
    return (dispatch) => {
        if (shouldFetchAddressList(params)) {
            let url = API_RECEIVER_LIST;
            if (type == 2) {
                url = API_BILL_RECEIVER_LIST;
            }
            return dispatch(fetchAddressList(url, params, navigation,status));
        }
    }
}
function fetchAddressList(url, params, navigation,status) {
    return (dispatch) => {
        dispatch(requestAddressList(status));
        return getReceiverList(url, params, navigation, (result) => {
            dispatch(receiveAddressList(result,status));
        }, (error) => {
            dispatch(receiveAddressList(status,[]));
        })
    }
}
function requestAddressList(status) {
    return {
        type: types.REQUEST_ADDRESSLIST,
        status
    }
}
function receiveAddressList(result,status) {
    return {
        type: types.RECEIVE_ADDRESSLIST,
        addressList: result,
        status
    }
}
function shouldFetchAddressList(params) {
    return true;
}

/**设置默认
 *
 */
export function fetchSetDefaultIfNeeded(type, userId, id, isDefault, navigation) {
    return (dispatch) => {
        dispatch(requestSetDefault(isDefault));
        if (shouldFetchSetDefault(isDefault)) {
            let url = API_RECEIVER_SETTDEFAULT;
            if (type == 2) {
                url = API_BILL_RECEIVER_SETTDEFAULT;
            }
            return dispatch(fetchSetDefault(url, userId, id, navigation))
        }
    }
}
/**
 * 设置默认
 * @param url
 * @param userId
 * @param id
 * @param navigation
 * @returns {function(*)}
 */
function fetchSetDefault(url, userId, id, navigation) {
    return (dispatch) => {
        return getReceiverSetDefault(url, userId, id, navigation, (result) => {
            dispatch(receiveSetDefault(id));
        }, (error) => {
            console.log("*******REQUEST_ISDEFAULT**error*************")
        });
    }
}
function receiveSetDefault(id) {
    return {
        type: types.RECEIVE_ISDEFAULT,
        id: id,
    }
}
function requestSetDefault(isdefault) {
    return {
        type: types.REQUEST_ISDEFAULT,
        isdefault: isdefault,
    }
}
function shouldFetchSetDefault(params) {
    return true
}

/**删除地址
 *
 */
export function fetchDelAddressIfNeeded(type, userId, id, isdelete, navigation) {
    return (dispatch) => {
        dispatch(requestDelAddress(isdelete));
        if (shouldFetchDelAddress(isdelete)) {
            let url = API_RECEIVER_DEL;
            if (type == 2) {
                url = API_BILL_RECEIVER_DEL;
            }
            return dispatch(fetchDelAddress(url, userId, id, navigation))
        }
    }
}
function fetchDelAddress(url, userId, id, navigation) {
    return (dispatch) => {
        return getReceiverDel(url, userId, id, navigation, (result) => {
            dispatch(receiveDelAddress(id, navigation));
        }, (error) => {
        });
    }
}
function receiveDelAddress(id, navigation) {
    return {
        type: types.RECEIVE_DELADDRESS,
        id: id,
        navigation: navigation
    }
}
function requestDelAddress(isdelete) {
    return {
        type: types.REQUEST_DELADDRESS,
        isdelete: isdelete,
    }
}
function shouldFetchDelAddress(params) {
    return true
}

/**
 * 添加地址
 * @param type
 * @param navigation
 * @returns {function(*)}
 * this.state.type, data, navigate,this
 */
export function fetchNewAddIfNeeded(typp, data, navigation,getLoading, call) {
    return (dispatch) => {
        dispatch(requestNewAddress(data));
        if (shouldFetchNewAddress(data)) {
            let url = API_RECEIVER_NEWADD;
            if (typp == 2) {
                url = API_BILL_RECEIVER_NEWADD;
            }
            return dispatch(NewAddress(url, data, typp, navigation,getLoading, call))
        }
    }
}
function NewAddress(url, data, typp, navigation,getLoading, call) {
    return (dispatch) => {
        return getReceiverAdd(url, data, navigation.navigate, (result) => {
            dispatch(receiveNewAddress(result, typp, navigation, call));
        }, (error) => {
            getLoading.getLoading().dismiss()
        });
    }
}
function receiveNewAddress(result, typp, navigation, call) {
    // console.log('navigationnavigation',navigation)
    return {
        type: types.RECEIVE_NEWADDRESS,
        addAddressData: result,
        navigation: navigation,
        typp: typp,
        call: call
    };
}
function requestNewAddress(data) {
    return {
        type: types.REQUEST_NEWADDRESS,
    }
}
function shouldFetchNewAddress(params) {
    return true
}

/**
 * 编辑地址
 * @param type
 * @param data
 * @param navigation
 * @returns {function(*)}
 */
export function fetchEditAddIfNeeded(typp, data, navigation,loading) {
    return (dispatch) => {
        dispatch(requestEditAddress(data));
        if (shouldFetchEditAddress(data)) {
            let url = API_RECEIVER_EDIT;
            if (typp == 2) {
                url = API_BILL_RECEIVER_EDIT;
            }
            return dispatch(fetchEditAddress(url, typp,data, navigation,loading))
        }
    }
}
function fetchEditAddress(url, typp,data, navigation,loading) {
    return (dispatch) => {
        return getReceiverEdit(url, data, navigation.navigate, (result) => {
            dispatch(receiveEditAddress(data, navigation, typp));
        }, (error) => {
            loading.getLoading().dismiss();
        });
    }
}
function receiveEditAddress(data, navigation, typp) {
    return {
        type: types.RECEIVE_EditADDRESS,
        editAddress: data,
        navigation: navigation,
        typp: typp
    }
}
function requestEditAddress(data) {
    return {
        type: types.REQUEST_EditADDRESS,
    }
}
function shouldFetchEditAddress(params) {
    return true
}


/**
 * 优惠券列表
 * @param params
 let data = {'userid': userId, 'scarid': scarid};
 */
export function fetchCouponListIfNeeded(params,navigation) {
    return (dispatch) => {
        if (shouldFetchCouponList(params,navigation)) {
            return dispatch(fetchCouponList(params,navigation));
        }
    }
}
function fetchCouponList(params,navigation) {
    return (dispatch) => {
        return getCouponOrder(params, navigation,(result) => {
            dispatch(receiveCouponList(result))
        }, (error) => {
            dispatch(receiveCouponList([]))
        });
    }
}
function receiveCouponList(result) {
    return {
        type: types.RECEIVE_LISTCOUPON,
        list: result
    };
}
function shouldFetchCouponList(params) {
    return true
}

/**
 * 选中或移除优惠券
 * @param params
 */
export function fetchAddCouponIfNeeded(params, isFirst) {
    return (dispatch) => {
        if (shouldFetchAddCoupon(params)) {
            return dispatch(fetchAddCoupon(params, isFirst));
        }
    }
}
function fetchAddCoupon(params, isFirst) {
    return (dispatch) => {
        return dispatch(receiveAddCoupon(params, isFirst))
    }
}
function receiveAddCoupon(params, isFirst) {
    return {
        type: types.RECEIVE_SELECTCOUPON,
        selectObj: params,
        isFirst: isFirst
    }
}
function shouldFetchAddCoupon(params) {
    return true
}

/**设置选中的默认优惠券
 * @param params
 * @returns {function(*)}
 */
export function fetchDefaultCouponIfNeeded(params) {
    return (dispatch) => {
        if (shouldFetchDefaultCoupon(params)) {
            return dispatch(fetchDefaultCoupon(params));
        }
    }
}
function fetchDefaultCoupon(params) {
    return (dispatch) => {
        return dispatch(receiveDefaultCoupon(params))
    }
}
function receiveDefaultCoupon(params) {
    return {
        type: types.RECEIVE_DEFAULTCOUPON,
        ids: params
    }
}
function shouldFetchDefaultCoupon(params) {
    return true
}

/**重置优惠券数据
 * @param params
 * @returns {function(*)}
 */
export function fetchResetCouponDataIfNeeded() {
    return (dispatch) => {
        if (shouldFetchResetCouponData()) {
            return dispatch(fetchResetCouponData());
        }
    }
}
function fetchResetCouponData() {
    return (dispatch) => {
        return dispatch(receiveResetCouponData())
    }
}
function receiveResetCouponData() {
    return {
        type: types.RESET_COUPONDATA,
        isReset: true
    }
}
function shouldFetchResetCouponData(params) {
    return true
}