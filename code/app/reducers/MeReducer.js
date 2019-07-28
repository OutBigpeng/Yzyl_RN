/**我的——Reducer
 * Created by coatu on 2016/12/21.
 */
import *as types from '../actions/ActionTypes';
import _ from 'underscore';
import {cloneObj, isEmptyObject} from "../common/CommonUtil";

const initialListSize = {
    messageListData: [],
    messageRes: [],
    orderListData: [],
    orderRes: [],
    followListData: [],
    selectFollowListData: [],//选中的关注
    selectFollowListIds: [],//选中的关注
    followRes: [],
    followLoading: true,
    messageLoading: true,
    orderLoading: true,
    //收藏
    collectRes: [],
    collectLoading: true,
    collectListData: [],

    isCollect: false,
    myScore: 0,//我的积分数量
    expertScore: {},//我的专家分对象


    discussListDataObj: {},
    discussResObj: {},
    discussOptionIsShow: {},
    optionIsShowCurrent: {},
    myDiscussLoadingObj: {},
    currentType: 'mine',
    pageUserId: '',
    saveType: '',
    currentClickObj: {},
    currentDetailObj: {},
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
let setLikesData = function (rowObj, userObj) {
    let likes = rowObj.likes || [];
    let likeCount = rowObj.likeCount || 0;

    if (rowObj.isLike) {//为0表示没点过 为1表示点过true
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
    rowObj.likeCount = likeCount;
    rowObj.isLike = rowObj.isLike > 0 ? 0 : 1;
};
export default function MeView(state = initialListSize, action = {}) {
    let userObj = action.userObj || {};
    let res = action.res || {};
    let option = action.option || -1;

    switch (action.type) {
        case types.RECEIVE_MYDISCUSSDETAILOPTION:
            let detailObj = action.detailObj;
            let discussList1 = state.discussListDataObj[state.saveType] || [];
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
                        discussListDataObj: Object.assign(state.discussListDataObj, {[state.saveType]: cloneObj(discussList1)})
                    });
                case 'addComment':
                    tempItem.commentCount = tempItem.commentCount + 1;
                    discussList1[pos1] = tempItem;
                    addComments(detailObj, action.data, action.data.parentId || 0, userObj);
                    return Object.assign({}, state, {
                        currentDetailObj: cloneObj(detailObj),
                        discussListDataObj: Object.assign(state.discussListDataObj, {[state.saveType]: cloneObj(discussList1)})
                    });
                case 'setData':
                    return Object.assign({}, state, {currentDetailObj: cloneObj(detailObj)});
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
                        discussListDataObj: Object.assign(state.discussListDataObj, {[state.saveType]: cloneObj(discussList1)})
                    })
            }
            break;
        case types.REQUEST_MYDISCUSSLISTMESSAGE://加载 loading
            let t = action.data.type;
            let loading1 = state.myDiscussLoadingObj[t] || {};//isLoading
            loading1[t] = action.isLoading;
            return Object.assign({}, state, {myDiscussLoadingObj: loading1,});
            break;
        case types.RECEIVE_MYDISCUSSLISTMESSAGE://列表
            let {type, pageUserId} = action.reqData || {};
            let saveType = `${pageUserId}-${type}`;
            let dataObj = state.discussListDataObj[saveType] || [];
            let resObj = state.discussResObj;
            resObj[saveType] = res;
            let newData = option === 1 ? (!_.isEmpty(res.data) ? dataObj.concat(res.data) : []) : dataObj.concat(res.data);
            dataObj[saveType] = option === 1 ? !_.isEmpty(res.data) ? res.data : [] : newData;
            let loading = state.myDiscussLoadingObj;//isLoading
            loading[saveType] = true;
            return Object.assign({}, state, {
                discussListDataObj: Object.assign({}, state.discussListDataObj, dataObj),
                discussResObj: resObj,
                myDiscussLoadingObj: loading,
                currentType: type,
                pageUserId: pageUserId,
                saveType: saveType
            });
            break;
        // case types.RECEIVE_MYDISCUSSDELETELIKE://取消点赞
        case types.RECEIVE_MYDISCUSSSAVELIKE://点赞
            let discussListData = state.discussListDataObj[state.saveType];
            let rowObj = action.rowData;
            setLikesData(rowObj, userObj);
            if (action.rowID > -1) {
                state.currentType === 'ilike' && rowObj.isLike < 1 ? discussListData.splice(action.rowID, 1) : discussListData[action.rowID] = rowObj;
            } else {
                for (let i = 0; i < discussListData.length; i++) {
                    let temp = discussListData[i];
                    if (temp.id === rowObj.id) {
                        state.currentType === 'ilike' && rowObj.isLike < 1 ? discussListData.splice(action.rowID, 1) : discussListData[action.rowID] = rowObj;
                    }
                }
            }
            return Object.assign({}, state, {
                discussListDataObj: Object.assign(state.discussListDataObj, {[state.saveType]: cloneObj(discussListData)}),
                currentClickObj: cloneObj(rowObj),
                currentDetailObj: cloneObj(rowObj),
            });
            break;
        case types.RECEIVE_MYDISCUSSSAVECOMMENTLIKE://评论点赞与取消点赞
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
            break;
        case types.RECEIVE_MYDISCUSSDELETECOMMENT://删除评论
            let discussList = state.discussListDataObj[state.saveType];
            let row = action.rowData;
            let req = action.data;
            let tempObj = {};
            let pos = -1;
            let isHaveNum = 0;
            for (let i = 0; i < discussList.length; i++) {
                let temp = discussList[i];
                if (temp.id === row.msgId) {
                    tempObj = temp;
                    pos = i;
                }
            }
            if (!_.isEmpty(tempObj.comments)) {
                judgeComment(tempObj, req.id);
                for (let i = 0; i < tempObj.comments.length; i++) {
                    let temp = tempObj.comments[i];
                    if (userObj.userid === temp.replyUserId) {
                        isHaveNum += 1;
                    }
                }
                if (state.currentType === 'icomment') {
                    if (isHaveNum > 0) {
                        discussList[pos] = tempObj
                    } else {
                        if (state.pageUserId === userObj.userid) {
                            discussList.splice(pos, 1)
                        }
                    }
                } else {
                    if (isHaveNum > 0) {
                        discussList[pos] = tempObj
                    }
                }
            }

            return Object.assign({}, state, {
                discussListDataObj: Object.assign(state.discussListDataObj, {[state.saveType]: cloneObj(discussList)}),
                currentClickObj: cloneObj(tempObj),
                currentDetailObj: cloneObj(tempObj),
            });
            break;

        case types.RECEIVE_MYDISCUSSSAVECOMMENT://评论（回复评论）
            let data = action.data;
            let listData = state.discussListDataObj[state.saveType] || [];
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
                        /**
                         * {
                            "content":"第2条回复评论",
                            "id":8,
                            "createTime":"2018-06-20 17:43:38",
                            "parentId":5,
                            "beReplyCompany":"2",
                            "replyUserId":141,
                            "msgId":6,
                            "replyCompany":"抚州市临川区红海化工厂",
                            "beReplyNickName":"测试0423_5",
                            "replyNickName":"抚州市临川区红海化工厂",
                            "beReplyUserId":140
                        },
                         */
                        addComments(listDatum, data, parentId, userObj);
                        tempObj1 = listDatum;
                    }
                }
            }

            return Object.assign({}, state, {
                discussListDataObj: Object.assign(state.discussListDataObj, {[state.saveType]: cloneObj(listData)}),
                currentClickObj: cloneObj(tempObj1),
                currentDetailObj: cloneObj(tempObj1),
            });
            break;

        case types.RECEIVE_MYDISCUSSDELETEMESSAGE://删除一条信息
            let da = action.data;
            let rowID = action.rowID;
            let disList = state.discussListDataObj[state.saveType];
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
            return Object.assign({}, state, {
                discussListDataObj: Object.assign(state.discussListDataObj, {[state.saveType]: cloneObj(disList)})
            });
            break;
        case types.RECEIVE_MYDISCUSSOPTIONISSHOW://是否显示 操作列表
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



        //我的积分
        case types.RECEIVE_MYSCORE:
            //(res.score-res.lock_score)||0
            let {score = 0, lock_score = 0} = action.res;
            let temp = score - lock_score;
            return Object.assign({}, state, {myScore: temp});
            break;
        //我的专家分
        case types.RECEIVE_MYEXPERTSCORE:
            return Object.assign({}, state, {expertScore: action.res});
            break;
        //我的消息
        case types.RECEIVE_MEMESSAGE:
            let newDataList = option === 1 && _.isEmpty(res.data) ? [] : state.messageListData.concat(res.data);
            return Object.assign({}, state, {
                messageListData: option === 1 ? _.isEmpty(res.data) ? [] : res.data : newDataList,
                messageRes: option === 1 ? _.isEmpty(res) ? [] : res : res,
                messageLoading: option === 1 && _.isEmpty(res.data) ? false : action.isLoading,
            });
            break;

        //我的订单：
        case types.RECEIVE_MEORDER:
            let orderRes = action.res;
            let orderOption = action.option;
            let orderNewDataList = orderOption === 1 && _.isEmpty(orderRes.data) ? [] : state.orderListData.concat(orderRes.data);
            return Object.assign({}, state, {
                orderLoading: orderOption === 1 && _.isEmpty(orderRes.data) ? false : action.isLoading,
                orderListData: orderOption === 1 ? _.isEmpty(orderRes.data) ? [] : orderRes.data : orderNewDataList,
                orderRes: orderOption === 1 ? _.isEmpty(orderRes) ? [] : orderRes : orderRes
            });
            break;

        //我的关注
        case types.RECEIVE_FOLLOW:
            let followRes = action.res;
            return Object.assign({}, state, {
                followLoading: _.isEmpty(followRes.result) ? false : action.isLoading,
                followListData: _.isEmpty(followRes.result) ? [] : followRes.result,
                followRes: _.isEmpty(followRes) ? [] : followRes
            });
            break;

        //选中的关注
        case types.RECEIVE_FOLLOWSELECT:
            let selectFollowListData = state.selectFollowListData;
            let ids = state.selectFollowListIds;
            let obj = action.rowData;
            let isHave = false;
            for (let i = 0; i < selectFollowListData.length; i++) {
                if (selectFollowListData[i].id === obj.id) {
                    isHave = true;
                }
            }
            if (isHave) {
                if (_.first(selectFollowListData).id === obj.id) {
                    listData.shift();
                    ids.shift()
                } else {
                    for (let i = 0; i < selectFollowListData.length; i++) {
                        if (obj.id === selectFollowListData[i].id) {
                            selectFollowListData.splice([i], 1);
                            ids.splice(i, 1)
                        }
                    }
                }
            } else {
                ids.push(obj.id);
                selectFollowListData.push({name: obj.nickname, id: obj.id})
            }
            return Object.assign({}, state, {selectFollowListData: selectFollowListData, selectFollowListIds: ids});
            break;

        //收藏列表
        case types.RECEIVE_ARTICLECOLLECTLIST:
            let collectRes = action.res.result;
            let collectOption = action.option;
            let collectNewDataList = collectOption === 1 && _.isEmpty(collectRes.data) ? [] : state.collectListData.concat(collectRes.data);
            return Object.assign({}, state, {
                collectListData: collectOption === 1 ? _.isEmpty(collectRes.data) ? [] : collectRes.data : collectNewDataList,
                collectRes: collectOption === 1 ? _.isEmpty(collectRes) ? [] : collectRes : collectRes,
                collectLoading: collectOption === 1 && _.isEmpty(collectRes.data) ? false : action.isLoading,
            });
            break;

        //删除收藏列表里面的某个值
        case types.RECEIVE_DELETEARTICLECOLLECTLIST:
            let item = action.item;
            let collectListData = state.collectListData;
            collectListData.map((data, index) => {
                if (item === data.sn || item === data.id) {
                    collectListData.splice(index, 1);
                }
            });
            return Object.assign({}, state, {
                collectListData: collectListData
            });
            break;

        case types.RECEIVE_ISCOLLECTARTICLE:
            // let res = action.res;

            return Object.assign({}, state, {isCollect: action.res});
            break;
        default:
            return state;
    }
}