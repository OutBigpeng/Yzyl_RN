/**订单请求
 * Created by Monika on 2016/12/27.
 */
'use strict';
import {
    API_ORDER_LIST,
    API_ORDER_DETAIL,
    API_ORDER_RETRY_BUY,
    API_ORDER_RETRY_BUY_CALC,
    API_ORDER_TRACK,API_CONFIRM_ORDER,API_COMMIT_ORDER
} from "./API_Interface";
import Util from '../common/Util';
import {isEmptyObject,toastShort} from "../common/CommonDevice";
/**
 * * 我的订单列表
 * @param userid
 * @param pageindex
 * @param pagesize
 * @param callback
 */
export function perJsonOrderList(data,navigation, callback,failCallBack) {
    Util.POST(API_ORDER_LIST, data,navigation,(backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                case '544':
                default:
                    toastShort(backResult.msg);
                    failCallBack(backResult.msg);
                    break;
            }
        }
    },(err)=>{
        toastShort('网络发生错误,请重试!');
        failCallBack();
    });
}
/**
 * 订单详情
 * @param orderid
 * @param callback
 */
export function perJsonOrderDetail(orderid, navigation,callback,failCallBack) {
    let data = {"orderid": orderid};
    Util.POST(API_ORDER_DETAIL, data,navigation,(backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                case '544':
                default:
                    toastShort(backResult.msg);
                    failCallBack(backResult.msg);
                    break;
            }
        }
    },(err)=>{
        toastShort('网络发生错误,请重试!');
        failCallBack();
    });
}
/**
 * 订单跟踪
 * @param orderid
 * @param callback
 */
export function perJsonOrderTrack(orderid,navigation, callback,failCallBack) {
    let data = {"orderid": orderid};
       Util.POST(API_ORDER_TRACK, data,navigation,(backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    toastShort(backResult.msg);
                    failCallBack(backResult.msg);
                    break;
            }
        }
    },(err)=>{
           // toastShort('网络发生错误,请重试!');
           failCallBack();
       });
}

/**
 * 再次购买订单提交
 * @param orderId
 * @param userid
 * @param buyergradeid
 * @param areaid
 * @param callback
 */
export function perJsonReBuyOrder(data,navigation,callback,failCallBack) {
       Util.POST(API_ORDER_RETRY_BUY, data,navigation,(backResult)=> {
        if (!isEmptyObject(backResult)) {
            var code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    toastShort(backResult.msg );
                    failCallBack(backResult.msg );
                    break;
            }
        }
    },(err)=>{
           toastShort('网络发生错误,请重试!');
           failCallBack();
       });
}
/**
 * 订单重新购买计算价格
 * @param orderId
 * @param userid
 * @param buyergradeid
 * @param areaid
 * @param callback
 */
export function perJsonReBuyMoney(data,navigation, callback,failCallBack) {
       Util.POST(API_ORDER_RETRY_BUY_CALC, data,navigation,(backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                // case '532':
                // case '533':
                // case '536':
                // case '539':
                // case '540':
                // case '546':
                default:
                    toastShort(backResult.msg);
                    failCallBack(backResult.msg);
                    break;
            }
        }
    },(err)=>{
           toastShort('网络发生错误,请重试!');
           failCallBack();
       });
}

/**
 * 确认下单
 * @param data
 * @param callback
 */
export function perJsonOrderConfirm(data, navigation,callback,failCallBack) {
    // let data = {"userid": userid, "buyergradeid": buyergradeid, "areaid": areaid,'carJson':arr};
       Util.POST(API_CONFIRM_ORDER, data,navigation,  (backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    toastShort(backResult.msg);
                    failCallBack();
                    break;
            }
        }
    },(err)=>{
           toastShort('网络发生错误,请重试!');
           failCallBack();
       });
}
/**
 * 订单提交
 *  "userid": 2,
 "buyergradeid": 1,
 "areaid": 1,
 "orderRecId": 80,
 "invoiceId": 1,
 "invoiceRecId": 10,
 "couponId": 1,
 "carJson": {"products": [{"scarid": 7,"quantity": 1},{"scarid": 12,"quantity": 2}]}
 *
 *
 * @param data
 * @param callback
 */
export function perJsonOrderCommit(data,navigation, callback,failCallBack) {
    // let data = {"orderId": orderId, "userid": userid, "buyergradeid": buyergradeid, "areaid": areaid};
       Util.POST(API_COMMIT_ORDER, data,navigation, (backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    toastShort(backResult.msg);
                    failCallBack();
                    break;
            }
        }
    },(err)=>{
           toastShort('网络发生错误,请重试!');
           failCallBack();
       });


}