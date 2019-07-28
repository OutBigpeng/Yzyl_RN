/**
 * Created by Monika on 2018/4/19.
 */
import * as types from '../actions/ActionTypes';
import _ from 'underscore'
import {cloneObj, isEmptyObject} from "../common/CommonUtil";

const initialState = {
    discussListDataObj: {},
    discussResObj: {},
    discussLoadingObj: {},
    currentType: '',
    discussOptionIsShow: {},
    optionIsShowCurrent: {},
    shareRefreshFlag: -1,
    currentClickObj: {},
    notifyMsgListObj: {},
    isLoadMore: true
};
let judgeComment = function (tempObj, id) {
    if (_.first(tempObj.comments).id === id) {
        tempObj.comments.shift();
    } else {
        for (let i = 0; i < tempObj.comments.length; i++) {
            if (tempObj.comments[i].id === id) {
                tempObj.comments.splice([i], 1);
            }
        }
    }
    tempObj.commentCount = tempObj.commentCount > 1 ? tempObj.commentCount - 1 : 0;
};

let addComments = function (listDatum, data, parentId, userObj) {
    if (!listDatum.comments && _.isEmpty(listDatum.comments)) {
        listDatum.comments = []
    }
    listDatum.comments.push(Object.assign({
        content: data.content,
        id: data.commentId,
        parentId: parentId,
        msgId: data.msgId,
        replyUserId: userObj.userid,
        replyNickName: userObj.nickname,
        replyLogo: userObj.logo,
        replyGradeImg: userObj.gradeImgUrl,
        replyCertifiedType: userObj.certifiedType,
        createTime: (new Date()).Format('yyyy-MM-dd hh:mm')
    }, data.replyUserId && {
        beReplyNickName: data.replyNickName,
        beReplyUserId: data.replyUserId,
        pContent: data.pContent,
        beReplyLogo: data.replyLogo
    }));
    listDatum.commentCount = listDatum.commentCount ? listDatum.commentCount + 1 : 1;
};

let setLikesData = function (obj, userObj) {
    let likes = obj.likes || [];
    let likeCount = obj.likeCount || 0;
    if (obj.isLike) {//为0表示没点过 为1表示点过true
        if (_.first(likes).likeUserId === userObj.userid) {
            likes.shift();
        } else {
            for (let i = 0; i < likes.length; i++) {
                if (likes[i].likeUserId === userObj.userid) {
                    likes.splice([i], 1);
                }
            }
        }
        likeCount = likeCount > 1 ? likeCount - 1 : 0;
    } else {
        likes.push({
            likeUserId: userObj.userid,
            likeNickName: userObj.nickname,
            likeCompany: userObj.merchantname
        });
        likeCount = likeCount + 1
    }
    obj.likeCount = likeCount;
    obj.isLike = obj.isLike > 0 ? 0 : 1;
};
export default function DiscussCircle(state = initialState, action = {}) {
    let userObj = action.userObj || {};
    let res = action.res || {};
    let option = action.option || -1;
    switch (action.type) {
        case types.RECEIVE_DISCUSSDETAILOPTION:
            let detailObj = action.detailObj;
            let discussList1 = state.discussListDataObj[state.currentType] || [];
            let tempItem = {};
            let pos1 = -1;
            if (discussList1 && !_.isEmpty(discussList1)) {
                for (let i = 0; i < discussList1.length; i++) {
                    let temp = discussList1[i];
                    if (temp.id === detailObj.id) {
                        tempItem = temp;
                        pos1 = i;
                    }
                }
            }
            switch (action.optionType) {
                case 'delComment':
                    tempItem.commentCount = tempItem.commentCount > 1 ? tempItem.commentCount - 1 : 0;
                    discussList1[pos1] = tempItem;
                    judgeComment(detailObj, action.data.id);
                    return Object.assign({}, state, {
                        currentDetailObj: cloneObj(detailObj),
                        discussListDataObj: Object.assign(state.discussListDataObj, {[state.currentType]: cloneObj(discussList1)})
                    });
                    break;
                case 'addComment':
                    tempItem.commentCount = tempItem.commentCount + 1;
                    discussList1[pos1] = tempItem;
                    addComments(detailObj, action.data, action.data.parentId || 0, userObj);
                    return Object.assign({}, state, {
                        currentDetailObj: cloneObj(detailObj),
                        discussListDataObj: Object.assign(state.discussListDataObj, {[state.currentType]: cloneObj(discussList1)})
                    });
                    break;

                case 'setData':
                    return Object.assign({}, state, {currentDetailObj: cloneObj(detailObj)});
                    break;
                case 'setLike':
                    if (tempItem.isLike) {
                        tempItem.likeCount = tempItem.likeCount > 1 ? tempItem.likeCount - 1 : 0;
                    } else {
                        tempItem.likeCount = tempItem.likeCount + 1;
                    }
                    tempItem.isLike = tempItem.isLike > 0 ? 0 : 1;
                    setLikesData(detailObj, userObj);
                    return Object.assign({}, state, {
                        currentDetailObj: cloneObj(detailObj),
                        discussListDataObj: Object.assign(state.discussListDataObj, {[state.currentType]: cloneObj(discussList1)})
                    });
                    break
            }
            break;
        case types.RECEIVE_DISCUSSSWITCHTAB:
            return Object.assign({}, state, {currentType: action.tabType});
            break;
        case types.RECEIVE_DISCUSSSHAREREFRESH://分享以后刷新
            return Object.assign({}, state, {shareRefreshFlag: action.isFlag});
            break;
        case types.REQUIRE_DISCUSSLISTMESSAGE://请求过程
            let t = action.data.tabType;
            let loading1 = state.discussLoadingObj[t] || {};//isLoading
            loading1[t] = action.isLoading;
            return Object.assign({}, state, {discussLoadingObj: loading1,});
            break;
        case types.RECEIVE_DISCUSSLISTMESSAGE://列表
            let {tabType: type} = action.reqData;
            let dataObj = state.discussListDataObj[type] || [];
            let resObj = state.discussResObj;
            resObj[type] = res;
            let newData = option === 1 ? (!_.isEmpty(res.data) ? dataObj.concat(res.data) : []) : dataObj.concat(res.data);
            dataObj[type] = option === 1 ? (!_.isEmpty(res.data) ? res.data : []) : newData;
            let loading = state.discussLoadingObj;//isLoading
            loading[type] = false;
            return Object.assign({}, state, {
                discussListDataObj: option === 1 ? Object.assign({}, state.discussListDataObj, dataObj) : Object.assign(state.discussListDataObj, dataObj),
                discussResObj: Object.assign(state.discussResObj, resObj),
                discussLoadingObj: Object.assign(state.discussLoadingObj, loading),
                currentType: type,
                shareRefreshFlag: -1
            });
            break;
        // case types.RECEIVE_DISCUSSDELETELIKE://取消点赞
        case types.RECEIVE_DISCUSSSAVELIKE://点赞
            let discussListData = state.discussListDataObj[state.currentType];
            let obj = action.rowData;
            setLikesData(obj, userObj);
            if (action.rowID > -1) {
                discussListData[action.rowID] = obj;
            } else {
                for (let i = 0; i < discussListData.length; i++) {
                    let temp = discussListData[i];
                    if (temp.id === obj.id) {
                        discussListData[i] = obj;
                    }
                }
            }
            return Object.assign({}, state, {
                discussListDataObj: Object.assign(state.discussListDataObj, {[state.currentType]: cloneObj(discussListData)}),
                currentClickObj: cloneObj(obj)
            });
            break;

        case types.RECEIVE_DISCUSSSAVECOMMENTLIKE://评论点赞与取消点赞
            let objT = action.rowData;
            let p = action.pos;
            if (!objT.likeCount) {
                objT.likeCount = 0
            }
            if (objT.isLike) {
                objT.likeCount = objT.likeCount > 1 ? objT.likeCount - 1 : 0;
            } else {
                objT.likeCount = objT.likeCount + 1;
            }
            objT.isLike = objT.isLike > 0 ? 0 : 1;
            if (p > -1) {
                state.currentClickObj[p] = objT;
            } else {
                let l = state.currentClickObj.comments || [];
                for (let i = 0; i < l.length; i++) {
                    let temp = l[i];
                    if (temp.id === objT.id) {
                        l[i] = objT;
                    }
                }
                state.currentClickObj.comments = l;
            }
            return Object.assign({}, state, {
                currentClickObj: cloneObj(state.currentClickObj)
            });
            break;
        case types.RECEIVE_DISCUSSDELETECOMMENT://删除评论
            let discussList = state.discussListDataObj[state.currentType];
            let row = action.rowData;
            let commentCount = row.commentCount || 0;

            let req = action.data;
            let tempObj = {};
            let pos = -1;
            for (let i = 0; i < discussList.length; i++) {
                let temp = discussList[i];
                if (temp.id === row.msgId) {
                    tempObj = temp;
                    pos = i;
                }
            }
            if (!_.isEmpty(tempObj.comments)) {
                judgeComment(tempObj, req.id);
            }
            discussList[pos] = tempObj;
            return Object.assign({}, state, {
                discussListDataObj: Object.assign(state.discussListDataObj, {[state.currentType]: cloneObj(discussList)}),
                currentClickObj: cloneObj(tempObj)
            });
            break;
        case types.RECEIVE_DISCUSSSAVECOMMENT://评论（回复评论）
            let data = action.data;
            let listData = state.discussListDataObj[state.currentType] || {};
            let parentId = data.parentId || 0;
            let tempObj1 = {};
            for (let i = 0; i < listData.length; i++) {
                let listDatum = listData[i];
                if (listDatum.id === data.msgId) {
                    if (action.commentType !== 'add') {
                        if (_.first(listData).id === parentId) {
                            listData.shift();
                        } else {
                            for (let i = 0; i < listData.length; i++) {
                                if (parentId === listData[i].id) {
                                    listData.splice([i], 1);
                                }
                            }
                        }
                        listDatum.commentCount = listDatum.commentCount > 1 ? listDatum.commentCount - 1 : 0;

                    } else {
                        addComments(listDatum, data, parentId, userObj);
                        tempObj1 = listDatum;
                    }
                }
            }
            return Object.assign({}, state, {
                discussListDataObj: Object.assign(state.discussListDataObj, {[state.currentType]: cloneObj(listData)}),
                currentClickObj: cloneObj(tempObj1)
            });
            break;
        case types.RECEIVE_DISCUSSDELETEMESSAGE://删除item信息
            let da = action.data;
            let rowID = action.rowID;
            let disList = state.discussListDataObj[state.currentType];
            if (rowID === undefined) {
                for (let i = 0; i < discussList.length; i++) {
                    let temp = discussList[i];
                    if (temp.id === da.id) {
                        disList.splice([i], 1);
                    }
                }
            } else {
                if (disList[rowID].id === da.id) {
                    if (_.first(disList).id === da.id) {
                        disList.shift();
                    } else {
                        for (let i = 0; i < disList.length; i++) {
                            if (disList[i].id === da.id) {
                                disList.splice([i], 1);
                            }
                        }
                    }
                }
            }
            return Object.assign({}, state, {
                discussListDataObj: Object.assign(state.discussListDataObj, {[state.currentType]: cloneObj(disList)})
            });
            break;
        case types.RECEIVE_DISCUSSOPTIONISSHOW://是否显示 操作列表
            let spread = state.discussOptionIsShow;
            let comKey = action.comKey;
            let isFlag = action.isFlag;
            if (isFlag > 0) {
                for (let key in spread) {
                    spread[key] = false;
                }
            } else {
                if (!isEmptyObject(spread)) {
                    spread[comKey] = !spread[comKey];
                    for (let key in spread) {
                        if (key !== comKey) {
                            spread[key] = false;
                        }
                    }
                } else {
                    spread[comKey] = !spread[comKey];
                }
            }
            return Object.assign({}, state, {discussOptionIsShow: spread});
            break;

        case types.RECEIVE_DISCUSSPAGEDISCUSSNOTICE://通知 列表
            let tempData = action.data;
            let notifyMsgListObj = state.notifyMsgListObj || {};
            let notiData = notifyMsgListObj.data || [];
            let newList = tempData.option === 1 ? (!_.isEmpty(res.data) ? notiData.concat(res.data) : res) : notiData.concat(res.data);
            if (tempData.option !== 1) {
                res.data = newList;
            }
            notifyMsgListObj = tempData.option === 1 ? res : Object.assign({}, notifyMsgListObj, res);

            return Object.assign({}, state, {
                notifyMsgListObj: notifyMsgListObj,
            });
            break;
        case types.RECEIVE_DISCUSSCLEARDISCUSSNOTICE:
            let reqData = action.data;
            let {type: delType, index} = reqData;
            let itemList = state.notifyMsgListObj.data;
            if (delType === 'all') {
                itemList = []
            } else {
                itemList.splice(index, 1);
                state.notifyMsgListObj.count = state.notifyMsgListObj.count > 1 ? state.notifyMsgListObj.count - 1 : 0;
            }
            return Object.assign({}, state, {
                notifyMsgListObj: Object.assign({}, notifyMsgListObj, {
                    data: itemList,
                    count: state.notifyMsgListObj.count
                })
            });
            break;
        default:
            return state;
    }

}
