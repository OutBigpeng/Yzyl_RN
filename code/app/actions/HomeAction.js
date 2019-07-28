import *as types from './ActionTypes';
import {getHomeListData,getHomeRecommendData,getIsCollectData,getHomeProductListData} from '../dao/HomeDao';
//我的消息列表
export function fetchHomeListInfo(data,navigation,type,isRefreshing,isLoadMore,page) {
    return (dispatch) => {
        dispatch(request_homeList(type,isRefreshing,isLoadMore,page));
        getHomeListData(data, navigation, (res) => {
            // console.log('34343',res)
            dispatch(receive_homeList(res,type,page))
        }, (error) => {
            dispatch(receive_homeList([]))
        })
    }
}


function receive_homeList(res,option,page) {
    return {
        type: types.receive_home11,
        res,
        option,
        page
    }
}

function request_homeList(option,isRefreshing,isLoadMore,page) {
    return {
        type: types.request_home11,
        option,
        isRefreshing,
        isLoadMore,
        page
    }
}


//主页 大学label切换
export function selectedLabelInfo(label,option,status) {
    return (dispatch) => {
        dispatch(receive_selectedLabel(label,option,status))
    }
}


function receive_selectedLabel(label,option,status) {
    return{
        type:types.RECEIVE_SELECTEDLABEL,
        label,
        option,
        status
    }
}


//认证品牌
export function fetchHomeRecommendIfNeeded(data,isLoading) {
    return (dispatch)=>{
        dispatch(fetchHomeRecommend(data,isLoading));
    }
}

function fetchHomeRecommend(data,isLoading) {
    return (dispatch)=>{
        // dispatch(request_Brand(isLoading))
        getHomeRecommendData(data,(res)=>{
            dispatch (receive_HomeRecommend(res))
        },(error)=>{
            dispatch (request_HomeRecommend(true))
        })
    }
}

function receive_HomeRecommend(res) {
    return{
        type:types.RECEIVE_HOMERECOMMEND,
        res
    }
}

function request_HomeRecommend(isData) {
    return{
        type:types.REQUEST_HOMERECOMMEND,
        isData
    }
}


//个人主页推荐列表
export function fetchHomeMyListInfo(data,navigation,isRefreshing, loading,isView,isLoadMore,title,getLoading) {
    return (dispatch) => {
        dispatch(request_HomeMyList(isRefreshing, loading,isView,isLoadMore,title));
        let utils;
        if(title =='article'){
            utils = getHomeListData;
        }else if(title == 'product'){
            utils = getHomeProductListData;
        }
        utils(data, navigation, (res) => {
            if(getLoading){
                getLoading.dismiss();
            }
            dispatch(receive_HomeMyListData(res))
        }, (error) => {
            if(getLoading){
                getLoading.dismiss();
            }
            dispatch(receive_HomeMyListData([]))
        })
    }
}



function receive_HomeMyListData(res) {
    return {
        type: types.RECEIVE_HOMEMYLIST,
        res
    }
}

function request_HomeMyList (isRefreshing, loading,isView,isLoadMore = false){
    return {
        type: types.REQUEST_HOMEMYLIST,
        isRefreshing,
        loading,
        isLoadMore,
        isView
    }
}

//个人主页关注
export function fetchHomeFollowInfo(status) {
    return (dispatch) => {
        dispatch(receive_homeFollow(status));
    }
}

function receive_homeFollow(status) {
    return{
        type:types.RECEIVE_HOMEFOLLOW,
        status
    }
}

//
// //大学重新登录数据不刷新扥问题
// export function fetchLoginTechnicalInfo(status) {
//     return (dispatch) => {
//         dispatch(receive_LoginTechnical(status));
//     }
// }
//
// function receive_LoginTechnical(status) {
//     return{
//         type:types.RECEIVE_LOGINTECHNICAL,
//         status
//     }
// }





//导航条图片选择
export function fetchSelectedImageInfo(isSelectedImage) {
    return(dispatch)=>{
        dispatch(receive_selectedImage(isSelectedImage))
    }
}

function receive_selectedImage(isSelectedImage) {
   return{
       type: types.RECEIVE_NAVSELECTEDIMAGE,
       isSelectedImage
   }
}

//是否收藏功能
export function fetchIsCollectInfo(data,navigation,loading) {
    return(dispatch)=>{
        getIsCollectData(data, navigation, (res) => {
            loading.dismiss();
            dispatch(receive_isCollectInfo(res.result,data))
        }, (error) => {
            loading.dismiss();
            console.log('err',error)
        });
    }
}

function receive_isCollectInfo(res,data) {
    return{
        type:types.RECEIVE_ISCOLLECTARTICLE,
        res
    }
}



