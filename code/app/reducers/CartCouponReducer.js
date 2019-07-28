/**购物车——优惠券
 * Created by Monika on 2016/12/29.
 */

import * as types from "../actions/ActionTypes";
import _ from "underscore";
const initialState = {
    CouponData: [],
    selectData: [],
    totalMoney: 0,
    selectIds: "",
    isLoading:false
};

export default function coupons(state = initialState, action = {}) {
    switch (action.type) {
        case types.RECEIVE_LISTCOUPON:
            state.CouponData = [];
            let list = action.list;
            return Object.assign({}, state, {CouponData: list},{isLoading:false});
            break;
        case types.REQUESR_LISTCOUPON:
            return Object.assign({}, state,{isLoading:true});
            break;
        case types.RECEIVE_SELECTCOUPON:
            let selectObj = action.selectObj;
            let selectArray = state.selectData;
            let total = state.totalMoney;
            let isFirst = action.isFirst;
            if (isFirst) {//如果为true ，证明选中的数据有值，我们直接对当前选中进行操作
                if (state.selectIds) {
                    selectArray.splice(0, selectArray.length);
                    _.map(state.selectIds.split(","), (element, index) => {
                        selectArray.push(element * 1);
                    });
                    total = selectObj.amount * 1 || 0;
                }
            } else {
                if (_.contains(selectArray, selectObj.id)) {
                    _.map(selectArray, (element, index) => {
                        if (element === selectObj.id) {
                            total = total - selectObj.amount;
                            selectArray.splice(index, 1);
                        }
                    });
                } else {
                    total = total + selectObj.amount;
                    selectArray.push(selectObj.id);
                }
            }
            return Object.assign({}, state, {selectData: selectArray}, {totalMoney: total});
            break;
        case types.RECEIVE_DEFAULTCOUPON:
            let ids = action.ids;
            return Object.assign({}, state, {selectIds: ids});
            break;
        case types.RESET_COUPONDATA:
            if(action.isReset) {

            }
            return Object.assign({}, state, {CouponData: []},{selectData: []},{totalMoney:0},{selectIds:""});
            break;
        default:
            return state;
            break;
    }
}