/**
 * Created by coatu on 2016/12/29.
 */
import {API_SHOPCAR, API_DELETESHOPCART, API_SHOPCOUNT, API_ADDSHOPCART} from './API_Interface';
import Util from '../common/Util'
import {toastShort} from '../common/ToastUtils';
import {MobclickAgent} from '../common/CommonDevice';

//购物车列表数据
export function shopListId(data, navigation, callback, failCallback) {
    return getshopListData(data, navigation, callback, failCallback);
}

function getshopListData(data, navigation, callback, failCallback) {
    Util.POST(API_SHOPCAR, data, navigation, (res) => {
        if (res.code === '200') {
            callback(res);
        } else {
            failCallback();
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        failCallback();
    })
}


//删除购物车
export function shopDeleteId(data, navigation, callback, failCallback) {
    return getshopDeleteData(data, navigation, callback, failCallback);
}

function getshopDeleteData(data, navigation, callback, failCallback) {
    Util.POST(API_DELETESHOPCART, data, navigation, (res) => {
        if (res.code === '200') {
            callback(res);
        } else {
            failCallback();
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        failCallback();
    })
}

//购物车数量
export function shopCountId(data, callback, failCallback) {
    return getshopCountData(data, callback, failCallback);
}

function getshopCountData(data, callback, failCallback) {
    Util.POST(API_SHOPCOUNT, data, 0, (res) => {
        if (res.code === '200') {
            callback(res.result);
        } else {
            failCallback();
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        failCallback();
    })
}

//加入购物车
export function addShopCartId(data, navigation, callback, failCallback) {
    return getAddShopCartData(data, navigation, callback, failCallback);
}

function getAddShopCartData(data, navigation, callback, failCallback) {
    // MobclickAgent.onEvent("yz_addShopCart", data);
    Util.POST(API_ADDSHOPCART, data, navigation, (res) => {
        if (res.code === '200') {
            callback(res.result);
        } else {
            failCallback();
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        failCallback();
    })
}


