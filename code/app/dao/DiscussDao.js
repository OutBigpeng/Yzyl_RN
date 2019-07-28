/**
 * 涂友圈Dao
 * Created by Monika on 2018/6/21.
 */

import {
    API_DISCUSSCLEARDISCUSSNOTICE,
    API_DISCUSSDELETECOMMENT,
    API_DISCUSSDELETELIKE,
    API_DISCUSSDELETEMESSAGE,
    API_DISCUSSDETAILMESSAGE,
    API_DISCUSSFINISHREWARD,
    API_DISCUSSGETDISCUSSNOTICE,
    API_DISCUSSLISTMESSAGE,
    API_DISCUSSLISTMESSAGEBYCOMMENT,
    API_DISCUSSLISTREPLIER,
    API_DISCUSSPAGEDISCUSSNOTICE,
    API_DISCUSSSAVECOMMENT,
    API_DISCUSSSAVELIKE,
    API_DISCUSSSAVEMESSAGE,
    API_IMGETCANCHAT
} from "./API_Interface";
import Util from "../common/Util";

export function getIMGetCanChat(data, navigation, callback, failCallback) {
    getNetWork(API_IMGETCANCHAT, data, navigation, callback, failCallback);
}

/**
 * //发布说说功能
 * @param data   pageUserId//查的用户id
 * "content":"this is my first friend circle message",
 "imgUrls":'[{"url":"2016/0320/20160320012056559.jpg","key":"2016/0320/20160320012056559.jpg"},{"url":"2016/0229/20160229054812757.jpg","key":"2016/0229/20160229054812757.jpg"},{"url":"2016/0229/20160229054813500.jpg","key":"2016/0229/20160229054813500.jpg"},{"url":"2016/0229/20160229054823251.jpg","key":"2016/0229/20160229054823251.jpg"}]'
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getDiscussSendMessage(data, navigation = 0, callback, failCallback) {
    getNetWork(API_DISCUSSSAVEMESSAGE, data, navigation, callback, failCallback)
}

/**
 * 获取 发现消息通知的功能
 * @param callback {"unReadCount":0}
 * @param failCallback
 */
export function getDiscussNotice(callback, failCallback) {
    getNetWork(API_DISCUSSGETDISCUSSNOTICE, {}, 0, callback, failCallback)
}

/**
 * 获取 发现消息通知的功能
 * @param data "isRead":0  /  "id":4
 * @param callback
 * @param failCallback
 */
export function getPageDiscussNotice(data, navigation, callback, failCallback) {
    getNetWork(API_DISCUSSPAGEDISCUSSNOTICE, data, navigation, callback, failCallback)
}

/**
 * 删除一条通知消息  或清空全部
 * @param data  "type":"single","id":3/"type":"all"
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getClearDiscussNotice(data, navigation, callback, failCallback) {
    getNetWork(API_DISCUSSCLEARDISCUSSNOTICE, data, navigation, callback, failCallback)
}

/**
 * //信息列表 queryListMessage
 * @param data
 "pageIndex":1,
 "pageSize":3
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getDiscussListMessage(data, navigation = 0, callback, failCallback) {
    getNetWork(API_DISCUSSLISTMESSAGE, data, navigation, callback, failCallback)
}

/**详情页面
 * msgId
 * @param data
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getDiscussDetailMessage(data, navigation = 0, callback, failCallback) {
    getNetWork(API_DISCUSSDETAILMESSAGE, data, navigation, callback, failCallback)
}

/** 评论列表
 *  pageIndex,pageSize,pageUserId
 * @param data
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getDiscussListMessageByComment(data, navigation = 0, callback, failCallback) {
    getNetWork(API_DISCUSSLISTMESSAGEBYCOMMENT, data, navigation, callback, failCallback)
}

/**
 * //删除信息 discuss/deleteMessage
 * @param data  "id":10
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getDiscussDeleteMessage(data, navigation = 0, callback, failCallback) {
    getNetWork(API_DISCUSSDELETEMESSAGE, data, navigation, callback, failCallback)
}

/**
 * //删除评论 discuss/deleteComment
 * @param data    "id":1
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getDiscussDeleteComment(data, navigation = 0, callback, failCallback) {
    getNetWork(API_DISCUSSDELETECOMMENT, data, navigation, callback, failCallback)
}

/**
 * //取消点赞 discuss/deleteLike
 * @param data  "msgId":6
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getDiscussDeleteLike(data, callback, failCallback) {
    getNetWork(API_DISCUSSDELETELIKE, data, 0, callback, failCallback)
}

/**
 * 点赞 discuss/saveLike
 * "msgId":6
 */
export function getDiscussSaveLike(data, callback, failCallback) {
    getNetWork(API_DISCUSSSAVELIKE, data, 0, callback, failCallback)
}

/**
 * 评论 点赞/取消 API_DISCUSSSAVECOMMENTLIKE，API_DISCUSSDELETECOMMENTLIKE
 * "msgId":6
 */
export function getDiscussCommentLike(url, data, callback, failCallback) {
    getNetWork(url, data, 0, callback, failCallback)
}

/**
 * //评论（回复评论）discuss/saveComment
 * @param data
 * "msgId":6,
 "parentId":5,
 "content":"第2条回复评论"
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getDiscussSaveComment(data, navigation, callback, failCallback) {
    getNetWork(API_DISCUSSSAVECOMMENT, data, navigation, callback, failCallback)
}

/**
 * 查询悬赏问答帖的回答者列表
 * @param data   msgId
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getDiscussListReplier(data, navigation, callback, failCallback) {
    getNetWork(API_DISCUSSLISTREPLIER, data, navigation, callback, failCallback)
}

/**
 * 结帖分配悬赏分 msgId  replyUsers{
  "score": "int,得到专家分",
  "replyUserId": "int,回答者id"
}
 * @param data
 * @param navigation
 * @param callback
 * @param failCallback
 */
export function getDiscussFinishReward(data, navigation, callback, failCallback) {
    getNetWork(API_DISCUSSFINISHREWARD, data, navigation, callback, failCallback)
}

function getNetWork(url, data, navigation, callback = () => {
}, failCallback = () => {
}) {
    Util.POST(url, data, navigation, (res) => {
        if (res.code === '200') {
            callback(res.result);
        } else {
            failCallback(res);
        }
    }, (error) => {
        console.log(error);
        failCallback(error);
    })
}