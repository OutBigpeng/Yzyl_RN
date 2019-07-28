/**涂友圈
 * Created by Monika on 2018/06-21.
 */
import * as types from "./ActionTypes";
import {
    getClearDiscussNotice, getDiscussCommentLike,
    getDiscussDeleteComment,
    getDiscussDeleteLike,
    getDiscussDeleteMessage,
    getDiscussListMessage,
    getDiscussListMessageByComment,
    getDiscussSaveLike, getPageDiscussNotice
} from "../dao/DiscussDao";
import {toastShort} from "../common/ToastUtils";
import {API_DISCUSSDELETECOMMENTLIKE, API_DISCUSSSAVECOMMENTLIKE} from "../dao/API_Interface";

//分页列表信息
export function fetchDiscussListMessage(pageParams, data, navigation, option, isLoading, getLoading = '', callback) {
    return (dispatch) => {
        console.log("走你");
        //TODO:网络请求
        if (getLoading) {
            getLoading.show()
        }
        reqDiscussListMessage(isLoading);
        let reqFun = getDiscussListMessage;
        if (!data.isSelf && pageParams === 'myrelease' && data.type === 'icomment') {//别人的个人主页的他评论的
            reqFun = getDiscussListMessageByComment
        }
        reqFun(data, navigation, (res = {}) => {
            dispatch(receiveDiscussListMessage(pageParams, data, res, option, false));
            if (getLoading) {
                getLoading.dismiss()
            }
            callback && callback(res, '')
        }, (err) => {
            dispatch(receiveDiscussListMessage(pageParams, data, {}, option, false));
            if (getLoading) {
                getLoading.dismiss()
            }
            callback && callback({}, err)
        });
    }
}

function reqDiscussListMessage(isLoading) {
    return {
        type: types.RECEIVE_DISCUSSLISTMESSAGE,
        isLoading
    }
}

function receiveDiscussListMessage(pageParams, reqData, res, option, isLoading) {
    return {
        type: pageParams === 'release' ? types.RECEIVE_DISCUSSLISTMESSAGE : types.RECEIVE_MYDISCUSSLISTMESSAGE,
        res, reqData,
        option,
        isLoading
    }
}


//点赞与取消点赞
export function fetchDiscussIsLike(pageParams, msgId, isLike, rowID = -1, rowData, userObj, callback) {
    return (dispatch) => {
        let data = {msgId};
        (isLike ? getDiscussDeleteLike : getDiscussSaveLike)(data, (res) => {
            callback&&callback();
            dispatch(receiveDiscussIsLike(pageParams, rowID, rowData, res, userObj))
        }, () => {
            callback&&callback()
        })
    }
}

function receiveDiscussIsLike(pageParams, rowID, rowData, likeCount, userObj) {
    return {
        type: pageParams === 'release' ? types.RECEIVE_DISCUSSSAVELIKE : types.RECEIVE_MYDISCUSSSAVELIKE,
        rowID, rowData, userObj, likeCount,
    }
}

//评论 点赞与取消点赞
export function fetchDiscussCommentIsLike(pageParams, commentId, isLike, pos,rowData, userObj, callback) {
    return (dispatch) => {
        let data = {commentId};
         getDiscussCommentLike(isLike ?API_DISCUSSDELETECOMMENTLIKE:API_DISCUSSSAVECOMMENTLIKE,data, (res) => {
            callback&&callback();
            dispatch(receiveDiscussCommentIsLike(pageParams,pos, rowData, res, userObj))
        }, () => {
            callback&&callback()
        })
    }
}

function receiveDiscussCommentIsLike(pageParams,pos, rowData, likeCount, userObj) {
    return {
        type: pageParams === 'release' ? types.RECEIVE_DISCUSSSAVECOMMENTLIKE : types.RECEIVE_MYDISCUSSSAVECOMMENTLIKE,
        pos, rowData, userObj, likeCount,
    }
}

//评论加数据
export function fetchDiscussComment(pageParams, data, commentType = "add", userObj, detailObj) {
    return (dispatch) => {
        dispatch(receiveDiscussComment(pageParams, data, commentType, userObj, detailObj))
    }
}

function receiveDiscussComment(pageParams, data, commentType, userObj, detailObj) {
    return {
        type: pageParams === 'release' ? types.RECEIVE_DISCUSSSAVECOMMENT : types.RECEIVE_MYDISCUSSSAVECOMMENT,
        data, commentType, userObj, detailObj
    }
}

//删除一条自己的发布
export function fetchDiscussDelMessage(pageParams, data, rowID,callback) {
    return (dispatch) => {
        getDiscussDeleteMessage(data, 0, () => {
            dispatch(receiveDiscussDelMessage(pageParams, data, rowID));
            callback&&callback()
        }, (err) => {
            callback&& callback('err');
            console.log(err);
            toastShort('删除失败，请稍候重试')
        })
    }
}

function receiveDiscussDelMessage(pageParams, data, rowID) {
    return {
        type: pageParams === 'release' ? types.RECEIVE_DISCUSSDELETEMESSAGE : types.RECEIVE_MYDISCUSSDELETEMESSAGE,
        data, rowID
    }
}

//删除一条自己的评论
export function fetchDiscussDelComment(pageParams, rowData, userObj) {
    return (dispatch) => {
        let data = {id: rowData.id};
        getDiscussDeleteComment(data, 0, () => {
            dispatch(receiveDiscussDelComment(pageParams, data, rowData, userObj))
        }, (err) => {
            toastShort('删除失败，请稍候重试' + err)
        })
    }
}

function receiveDiscussDelComment(pageParams, data, rowData, userObj) {
    return {
        type: pageParams === 'release' ? types.RECEIVE_DISCUSSDELETECOMMENT : types.RECEIVE_MYDISCUSSDELETECOMMENT,
        data, rowData, userObj
    }
}

//是否操作
export function fetchDiscussOptionIsShow(pageParams, comKey, isFlag = -1) {
    return (dispatch) => {
        dispatch(receiveDiscussOptionIsShow(pageParams, comKey, isFlag))
    }
}

function receiveDiscussOptionIsShow(pageParams, comKey, isFlag) {
    return {
        type: pageParams === 'release' ? types.RECEIVE_DISCUSSOPTIONISSHOW : types.RECEIVE_MYDISCUSSOPTIONISSHOW,
        comKey, isFlag
    }
}

//详情 中的操作
export function fetchDiscussDetailOption(pageParams, optionType, detailObj, data, userObj) {
    return (dispatch) => {
        switch (optionType) {
            case 'delComment':
                getDiscussDeleteComment({id: data.id}, 0, () => {
                    dispatch(receiveDiscussDetailOption(pageParams, optionType, detailObj, data, userObj))
                }, (err) => {
                    toastShort('删除失败，请稍候重试' + err)
                });
                break;
            case 'addComment':
            default:
                dispatch(receiveDiscussDetailOption(pageParams, optionType, detailObj, data, userObj));
                break;
        }
    }
}

function receiveDiscussDetailOption(pageParams, optionType, detailObj, data, userObj) {
    return {
        type: pageParams === 'release' ? types.RECEIVE_DISCUSSDETAILOPTION : types.RECEIVE_MYDISCUSSDETAILOPTION,
        optionType, detailObj, data, userObj
    }
}

//是否有分享以后需要刷新
export function fetchDiscussShareRefresh(isFlag) {
    return (dispatch) => {
        dispatch(receiveDiscussShareRefresh(isFlag))
    }
}

function receiveDiscussShareRefresh(isFlag) {
    return {
        type: types.RECEIVE_DISCUSSSHAREREFRESH,
        isFlag
    }
}

export function fetchDiscussSwitchTabType(tabType) {
    return (dispatch) => {
        dispatch(receiveDiscussSwitchTabType(tabType))
    }
}

function receiveDiscussSwitchTabType(tabType) {
    return {
        type: types.RECEIVE_DISCUSSSWITCHTAB,
        tabType
    }
}

//发现通知消息列表
export function fetchDiscussPageDiscussNotice(data,navigation,callback) {
    return (dispatch) => {
        getPageDiscussNotice(data, navigation, (res) => {
            dispatch(receiveDiscussPageDiscussNotice(data,res));
            callback(res)
        }, (err) => {
            callback('err');
            dispatch(receiveDiscussPageDiscussNotice(data,[]))
        })
    }
}

function receiveDiscussPageDiscussNotice(data,res) {
    return {
        type: types.RECEIVE_DISCUSSPAGEDISCUSSNOTICE,
        data,res
    }
}
//删除通知消息
export function fetchDiscussClearDiscussNotice(data,navigation) {
    return (dispatch) => {
        getClearDiscussNotice(data, navigation, (res) => {
            dispatch(receiveDiscussClearDiscussNotice(data))
        }, (err) => {
          toastShort(data.type==='all'?'清空失败，请稍候尝试':"删除失败，请稍候尝试")
        })
    }
}

function receiveDiscussClearDiscussNotice(data) {
    return {
        type: types.RECEIVE_DISCUSSCLEARDISCUSSNOTICE,
        data
    }
}

