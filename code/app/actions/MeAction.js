/**
 * Created by coatu on 2017/6/26.
 */
import * as types from './ActionTypes';
import {getMessageList} from '../dao/SysDao';
import {perJsonOrderList} from '../dao/OrderDao'
import {getMyFollowListData, getMyCollectListData, getMyUserScore, getMyExpertScore} from '../dao/MeDao'

//我的积分数量
export function fetchMyScore(callback) {
    return (dispatch) => {
        getMyUserScore(0, (res) => {
            /**
             *  "score": 80,//总积分
             "lock_score": 0,//锁定积分
             */
            // this.setState({
            //     myScore:res&&(res.score-res.lock_score)||0
            // });
            callback&&callback(res);
            dispatch(receiveMyScore(res || {}))
        }, () => {
            callback&&callback('');

            dispatch(receiveMyScore({}))
        })
    }
}

function receiveMyScore(res) {
    return {
        type: types.RECEIVE_MYSCORE,
        res,
    }
}

export function fetchMyExpertScore(callback) {
    return (dispatch,getState) => {
        let userid = getState().Login.userObj.userid;
        getMyExpertScore({userId: userid},0, (res) => {
            callback&&callback(res);
            dispatch(receiveMyExpertScore(res || {}))
        }, () => {
            dispatch(receiveMyExpertScore({}))
        })
    }
}

function receiveMyExpertScore(res) {
    return {
        type: types.RECEIVE_MYEXPERTSCORE,
        res,
    }
}

//我的消息列表
export function fetchMeMessageListInfo(data,navigation,option,isLoading) {
    return (dispatch) => {
        dispatch(requestList(data,isLoading));
      return  getMessageList(data, navigation, (res) => {
            dispatch(receive_MeMessageListData(res,option,isLoading))
        }, (error) => {
            dispatch(receive_MeMessageListData([],option,true))
        })
    }
}
function requestList(data,isLoading) {
    return {
        type: types.REQUEST_MYDISCUSSLISTMESSAGE,
        data,isLoading
    }
}


function receive_MeMessageListData(res,option,isLoading) {
    return {
        type: types.RECEIVE_MEMESSAGE,
        res,
        option,
        isLoading
    }
}

//我的订单列表
export function fetchMeOrderListInfo(data,navigation,option) {
    return (dispatch) => {
        perJsonOrderList(data, navigation, (res) => {
            dispatch(receive_MeOrderListData(res,option))
        }, (error) => {
            dispatch(receive_MeOrderListData([],option))
        })
    }
}

function receive_MeOrderListData(res,option) {
    return {
        type: types.RECEIVE_MEORDER,
        res,
        option
    }
}

//我的关注列表
export function fetchMeFollowListInfo(data,navigation,isLoading,Load) {
    return (dispatch) => {
        getMyFollowListData(data, navigation, (res) => {
            if(Load){
                Load.getLoading().dismiss()
            }
            dispatch(receive_MeFollowListData(res,isLoading))
        }, (error) => {
            if(Load){
                Load.getLoading().dismiss()
            }
            dispatch(receive_MeFollowListData([],false))
        })
    }
}

function receive_MeFollowListData(res,isLoading) {
    return {
        type: types.RECEIVE_FOLLOW,
        res,
        isLoading
    }
}

//选中关注
export function fetchSelectFollowIfNeeded(rowData) {
    return (dispatch) => {
        dispatch(receive_SelectFollow(rowData))
    }
}

function receive_SelectFollow(rowData) {
    return {
        type: types.RECEIVE_FOLLOWSELECT,
       rowData
    }
}

//我的文章收藏列表
export function fetchMeCollectListInfo(data,navigation,isLoading,option) {
    return (dispatch) => {
        getMyCollectListData(data, navigation, (res) => {
            dispatch(receive_MeCollectListData(res,isLoading,option))
        }, (error) => {
            dispatch(receive_MeCollectListData([],false))
        })
    }
}

function receive_MeCollectListData(res,isLoading,option) {
    return {
        type: types.RECEIVE_ARTICLECOLLECTLIST,
        res,
        isLoading,
        option
    }
}

//删除收藏列表的某条数据
export function fetchDeleteMeCollectListInfo(item) {//item 文章的sn || 课程表配方的id
    return (dispatch) => {
        dispatch(receive_MeDeleteCollectListData(item))
    }
}

function receive_MeDeleteCollectListData(item) {
    return {
        type: types.RECEIVE_DELETEARTICLECOLLECTLIST,
        item
    }
}
