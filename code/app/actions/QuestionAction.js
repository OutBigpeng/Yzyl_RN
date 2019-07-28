/**
 * Created by Monika on 2017/7/5.
 */
import *as types from "./ActionTypes";
import {
    getMyQuestions, getMetionedQuestion, getAnswerListByQuestion, getHotRecommendQuestion,
    getListAllCertifiedUser
} from "../dao/InterlocutionDao";
let util,navigations;
//热门推荐
export function fetchQuestionList(data,navigation,isrefreshing,isLoading,isLoadMore,isNetWork,key,getLoading) {
    return (dispatch) => {
        dispatch(request_HotQuestionList(isrefreshing,isLoading,isLoadMore,isNetWork,key));

        if(key == "hotRecommendKey"){
            util = getHotRecommendQuestion;
            navigations = 0
        }else if(key == "myQuest"){
             util = getMyQuestions;
             navigations = navigation;
        }else if(key == 'askQuestion') {
            util = getMetionedQuestion;
            navigations = 0
        }
        if(getLoading){
            getLoading.show();
        }
        util(data, navigations, (res) => {
            if(getLoading){
                getLoading.dismiss();
            }
            dispatch(receive_HotQuestionList(res,key));
        }, (error) => {
            if(getLoading){
                getLoading.dismiss();
            }
            dispatch(request_HotQuestionList(false,false,false,false))
        })
    }
}

function receive_HotQuestionList(res,key) {
    return {
        type: types.RECEIVE_HOTQUESTLIST,
        res,
        key
    }
}

function request_HotQuestionList(isRefreshing,isLoading,isLoadMore = false,isNetWork) {
    return {
        type: types.REQUEST_HOTQUESTLIST,
        isRefreshing,
        isLoading,
        isLoadMore,
        isNetWork
    }
}

//向谁提问
export function fetchListAllCertifiedUser(navigation,isLoading,Load) {
    return (dispatch) => {
        getListAllCertifiedUser(navigation, (res) => {
            if(Load){
                Load.getLoading().dismiss()
            }
            dispatch(receiveListAllCertifiedUser(res,isLoading))
        }, (error) => {
            if(Load){
                Load.getLoading().dismiss()
            }
            dispatch(receiveListAllCertifiedUser([],false))
        })
    }
}

function receiveListAllCertifiedUser(res,isLoading) {
    return {
        type: types.RECEIVE_LISTALLCERTIFIEDUSER,
        res,
        isLoading
    }
}

//选中@
export function fetchSelectCertifiedUser(rowData) {
    return (dispatch) => {
        dispatch(receiveCertifiedUser(rowData))
    }
}

function receiveCertifiedUser(rowData) {
    return {
        type: types.RECEIVE_CERTIFIEDUSERSELECT,
        rowData
    }
}


//发布
export function fetchFaBuData() {
    return (dispatch) => {
        dispatch(receive_FaBuData());
    }
}

function receive_FaBuData() {
    return{
        type:types.RECEIVE_FABU
    }
}


//评论详情
export function fetchCommentDetailList(data,navigation,isRefreshing, loading,isView,isLoadMore,id,key) {
    return (dispatch) => {
        dispatch(request_CommentDetailListData(isRefreshing, loading,isView,isLoadMore,key));
        getAnswerListByQuestion(data, navigation, (res) => {
            dispatch(receive_CommentDetailListData(res,id,key))
        }, (error) => {
            dispatch(receive_CommentDetailListData([]))
        })
    }
}

function receive_CommentDetailListData(res,id,key) {
    return {
        type: types.RECEIVE_COMMENTDETAILLIST,
        res,
        id,
        key
    }
}

function request_CommentDetailListData(isRefreshing, loading,isView,isLoadMore,key) {
    return {
        type: types.REQUEST_COMMENTDETAILLIST,
        isRefreshing,
        loading,
        isView,
        isLoadMore,
        key
    }
}
