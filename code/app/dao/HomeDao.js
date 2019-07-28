/**
 * Created by coatu on 2017/6/26.
 */
'use strict';
import React from 'react';
import {
    API_GETSYSDICTIONARY,
    API_HOMEABSTRACT,
    API_HOMEAPPLABEL,
    API_HOMEARTICLE,
    API_HOMEFOLLOW,
    API_HOMEGETSYSDICTIONARY,
    API_HOMEISFOLLOW,
    API_HOMELIST,
    API_HOMERECOMMEND, API_IMGETCANCHAT,
    API_ISCOLLECTARTICLE, API_LISTSHOWGROUPBYCODE,
    API_PRODUCT_LIST,
    API_UNHOMEFOLLOW
} from './API_Interface';
import Util from '../common/Util'
import {toastShort} from '../common/ToastUtils'

//首页7个 Lable
export function getListAppLabel(navigation, callback, failCallback) {
    network(API_HOMEAPPLABEL, {}, navigation, callback, failCallback);
}

//首页最下面的列表上的导航条：
// export function getSysDictionary(navigation, callback, failCallback) {
//     let data = {"parentKey": "articleLabel"};
//     network(API_GETSYSDICTIONARY, data, navigation, callback, failCallback);
// }


export function getListShowGroupByCode(type="article",navigation, callback, failCallback) {
    let data = {code: type==="article"?"universityIndex":"newsIndex"};
    network(API_LISTSHOWGROUPBYCODE, data, navigation, callback, failCallback);
}

//首页底部文章列表
export function getHomeListData(data, navigation, callback, failCallback) {
    network(API_HOMELIST, data, navigation, callback, failCallback);
}

//个人首页底部产品列表
export function getHomeProductListData(data, navigation, callback, failCallback) {
    network(API_PRODUCT_LIST, data, navigation, callback, failCallback);
}

//首页正文
export function getHomeArticleData(data, navigation, callback, failCallback) {
    network(API_HOMEARTICLE, data, navigation, callback, failCallback);
}

//首页用户资料 id
export function getHomeUserWithCertifiedData(data, navigation, callback, failCallback) {
    network(API_HOMEABSTRACT, data, navigation, callback, failCallback);
}

//首页是否关注
export function getHomeIsFollowData(data, callback, failCallback) {
    network(API_HOMEISFOLLOW, data, 0, callback, failCallback);
}

function network(url, data, navigation, callback, failCallback, type) {
    Util.POST(url, data, navigation, (res) => {
        if (res.code === '200') {
            if (type) {
                callback(res)
            } else {
                callback(res.result);
            }
        } else {
            failCallback();
        }
    }, (error) => {
        toastShort('网络发生错误,请重试!');
        failCallback();
    })
}

//首页关注
export function getHomeFollowData(data, navigation, callback, failCallback) {
    network(API_HOMEFOLLOW, data, navigation, callback, failCallback,1);
}

//首页取消关注
export function getHomeUnFollowData(data, navigation, callback, failCallback) {
    network(API_UNHOMEFOLLOW, data, navigation, callback, failCallback,1);
}


//首页推荐认证账号
export function getHomeRecommendData(data, callback, failCallback) {
    network(API_HOMERECOMMEND, data, 0, callback, failCallback,1);
}

//首页是否收藏
export function getIsCollectData(data, navigation, callback, failCallback) {
    network(API_ISCOLLECTARTICLE, data, navigation, callback, failCallback,1);
}
