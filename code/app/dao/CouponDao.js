/**优惠券dao
 * Created by Monika on 2016/12/28.
 *
 */
'use strict';
import React from "react";
import {
    API_COUPON_LIST,
    API_COUPON_LIST_NUM,
    API_ALIVE_COUPON,
    API_COUPON_LIST_ORDER
} from "./API_Interface";

import {isEmptyObject, toastShort} from "../common/CommonDevice";
import Util from "../common/Util";


/**
 * 获取当前各个状态的值
 * "userid":2,
 */
export function getCouponNum(userid, callback, failCallback) {
    let data = {'userid': userid};
    Util.POST(API_COUPON_LIST_NUM, data,0, (backResult) => {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    failCallback(backResult.msg);
                    toastShort(backResult.msg);
                    break;
            }
        }
    }, (err)=>{
        toastShort('网络发生错误,请重试!');
        failCallback();
    });
}
/**
 *优惠券列表
 * "userid":2,
 "status":"used"
 */
export function getCouponList(userid, status,navigation, callback, failCallback) {
    let data = {'userid': userid, 'status': status};
    Util.POST(API_COUPON_LIST, data,navigation,(backResult) => {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    failCallback(backResult.msg);
                    toastShort(backResult.msg);
                    break;
            }
        }
    }, (err)=>{
        toastShort('网络发生错误,请重试!');
        failCallback();
    });
}
/**
 *提交订单时，满足使用条件的优惠券列表功能
 * "userid": 2,
 "orderMoney": 10000
 */
export function getCouponOrder(data,navigation,callback, failCallback) {
    // let data = {'userid': userid, 'orderMoney': orderMoney, "products": products};
    Util.POST(API_COUPON_LIST_ORDER, data,navigation, (backResult) => {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    toastShort(backResult.msg);
                    failCallback(backResult.msg);
                    break;
            }
        }
    }, (err)=>{
        toastShort('网络发生错误,请重试!');
        failCallback();
    });
}
/**
 *绑定（激活）优惠券功能
 *   "userid": 2,
 "couponCode": "RTFDD97777",
 "vcode": "572908"
 520：优惠券已被使用!
 521：优惠券已被绑定!
 522：优惠券已过期!
 533：优惠券绑定失败!
 519：优惠券不存在!
 506：短信验证失败!
 */
export function bindCoupon(userid, couponCode, vcode,navigation, callback, failCallback) {
    let data = {'userid': userid, 'couponCode': couponCode, 'vcode': vcode};
    Util.POST(API_ALIVE_COUPON, data,navigation, (backResult) => {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback('ok');
                    break;
                default:
                    toastShort(backResult.msg);
                    failCallback(backResult.msg);
                    break;
            }
        }
    }, (err)=>{
        toastShort('网络发生错误,请重试!');
        failCallback();
    });
}



