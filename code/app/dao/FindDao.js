/**产品Dao
 * Created by coatu on 2016/12/28.
 */


'use strict';
import React from 'react';
import {
    API_BANNER,
    API_DEFAULTADDRESS,
    API_LISTPRODUCTPRICE,
    API_PRODUCTDETAIL,
    API_PRODUCTLISTKEYWORD,
    API_PRODUCTPARAMETES,
    API_RECOMMENDBRAND,
    API_RECOMMENDPRODUCT,
    API_PRODUCT_LIST,
    API_SAMPLE,
    API_TELEPHONE,
    API_TYPE,
    API_TYPEDETAIL, API_COLLECTPRODUCT, API_COLLECTPRODUCTCOUNT, API_CANCELCOLLECTPRODUCT, API_COLLECTPRODUCTLIST,
    API_GETUSERRECEIVER, API_LISTBRANDFIRSTPY
} from './API_Interface';
import Util from '../common/Util'
import {toastShort} from '../common/ToastUtils'

//图片轮播
export function BrannerById(data, callback, failCallback) {
    reqNetwork(API_BANNER,data, 0, callback, failCallback);
}

//推荐品牌
export function BrandById(data, callback, failCallback) {
    reqNetwork(API_RECOMMENDBRAND,data, 0, callback, failCallback);
}

export function queryListBrandFirstPY(data, callback, failCallback) {
    reqNetwork(API_LISTBRANDFIRSTPY,data, 0, callback, failCallback);
}

//产品热门搜索功能
export function getProListKeyword(navigation, callback, failCallback) {
    reqNetwork(API_PRODUCTLISTKEYWORD,{}, navigation, callback, failCallback);
}


/*
产品收藏
"userid":2,
 "productid":149
 */
export function getCollectProduct(data,navigation, callback, failCallback) {
    reqNetwork(API_COLLECTPRODUCT,data, navigation, callback, failCallback);
}


/*
产品收藏列表
"userid":2,
 */
export function getCollectProductList(data,navigation, callback, failCallback) {
    reqNetwork(API_COLLECTPRODUCTLIST,data, navigation, callback, failCallback);
}

//产品收藏数量
export function getCollectProductCount(data,navigation, callback, failCallback) {
    reqNetwork(API_COLLECTPRODUCTCOUNT,data, navigation, callback, failCallback);
}


//推荐产品
export function commendProductById(data, navigation, callback, failCallback) {
    reqNetwork(API_RECOMMENDPRODUCT,data, 0, callback, failCallback);
}

//全部分类
export function typeById(data, navigation, callback, failCallback) {
    reqNetwork(API_TYPE,data, navigation, callback, failCallback);
}

//分类详情
export function typeDetailById(data, navigation, callback, failCallback) {
    reqNetwork(API_TYPEDETAIL,data, navigation, callback, failCallback);
}

//产品详情
export function productDetailById(data, navigation, callback, failCallback) {
    reqNetwork(API_PRODUCTDETAIL,data, navigation, callback, failCallback);
}

//索样
export function productSouYangById(data, navigation, callback, failCallback) {
    reqNetwork(API_SAMPLE,data, navigation, callback, failCallback);
}

//默认选中地址
export function productDefaultAddressById(data, navigation, callback, failCallback) {
    reqNetwork(API_DEFAULTADDRESS,data, navigation, callback, failCallback);
}

//索样默认地址
export function productSampleAddressById( navigation, callback, failCallback) {
    reqNetwork(API_GETUSERRECEIVER,{}, navigation, callback, failCallback);
}

//产品详情的技术参数，生产商介绍等
export function productParametersById(data, navigation, callback, failCallback) {
    reqNetwork(API_PRODUCTPARAMETES,data, navigation, callback, failCallback);

}

//vip会员价格
export function productVipMoneyById(data, callback, failCallback) {
    reqNetwork(API_LISTPRODUCTPRICE,data, 0, callback, failCallback);

}

//获取客服电话
export function PhoneById(callback, failCallback) {
      reqNetwork(API_TELEPHONE,{}, 0, callback, failCallback);
}

/**
 * 产品搜索列表
 *   let data = {  "buyergradeid": buyergradeid,
        "areaid": areaid,
        "brandid": brandid,
        "pageIndex": pageIndex,
        "pageSize": pageSize,
        "searchname": "searchname",
        "categoryid": categoryid};
 * @param data
 * @param callback
 */
export function getProductList(data, navigation, callback, failCallBack) {
    reqNetwork(API_PRODUCT_LIST,data, navigation, callback, failCallBack);
}

function reqNetwork (url,data, navigation, callback, failCallBack) {
    Util.POST(url, data, navigation, (res) => {
        if (res && res.code === "200") {
            callback(res.result);
        } else {
            failCallBack(res);
        }
    }, (err) => {
        failCallBack(err);
    });
}

