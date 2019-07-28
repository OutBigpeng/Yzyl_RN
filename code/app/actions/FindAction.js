/**
 * Created by coatu on 2016/12/21.
 */
import *as types from './ActionTypes';
import {
    BrandById,
    BrannerById,
    commendProductById,
    getCollectProduct,
    getCollectProductCount,
    getCollectProductList
} from '../dao/FindDao';


//推荐品牌
export function fetchBrandIfNeeded(data, isLoading) {
    return (dispatch) => {
        dispatch(fetchBrand(data, isLoading));
    }
}

function fetchBrand(data, isLoading) {
    return (dispatch) => {
        BrandById(data, (res) => {
            dispatch(receive_Brand(res))
        }, (error) => {
            dispatch(request_Brand(true))
        })
    }
}

function receive_Brand(res) {
    return {
        type: types.RECEIVE_BRAND,
        res
    }
}

function request_Brand(isData) {
    return {
        type: types.REQUEST_BRAND,
        isData
    }
}


//图片轮播
export function fetchBrannerIfNeeded(type) {
    return (dispatch) => {
        // dispatch(request_Branner(isLoading))
        let data = {type: type};
        BrannerById(data, (res) => {
            dispatch(reveice_Branner(res, data, true))
        }, (error) => {
            dispatch(request_Branner(true))
        })
    }
}

function reveice_Branner(res, data, isData) {
    return {
        type: types.RECEIVE_IMAGEBANNER,
        res, data,
        isData
    }
}

function request_Branner(isData) {
    return {
        type: types.REQUESR_IMAGEBANNER,
        isData
    }
}


//推荐产品
export function fetchProductIfNeeded(data, navigation) {
    return (dispatch) => {
        dispatch(fetchProduct(data, navigation));
    }
}

function fetchProduct(data, navigation) {
    return (dispatch) => {
        // dispatch(request_Product(isLoading))
        commendProductById(data, 0, (res) => {
            dispatch(reveice_Product(res))
        }, (error) => {
            dispatch(request_Product(true))
        })
    }
}

function reveice_Product(res, isData) {
    return {
        type: types.RECEIVE_PRODUCT,
        res,
        isData
    }
}

function request_Product(isData) {
    return {
        type: types.REQUEST_PRODUCT,
        isData
    }
}

//添加收藏
export function fetchAddCollectProduct(data, navigation, callback, pType = "") {
    return (dispatch) => {
        dispatch(fetchCollectPro(data, navigation, callback, pType));
    }
}

function fetchCollectPro(data, navigation, callback, pType) {
    return (dispatch) => {
        getCollectProduct(data, navigation, (res) => {
            callback(data.isCollect);
            dispatch(reveice_CollectPro(res, data, pType))
        }, (error) => {
            dispatch(reveice_CollectPro([]))
        })
    }
}

function reveice_CollectPro(res, data, pType) {
    return {
        type: types.RECEIVE_COLLECTPRODUCT,
        count: res,
        data, pType
    }
}

//请求收藏总数
export function fetchCollectProductCount(data, navigation) {
    return (dispatch, getState) => {
        if(getState().Login.userObj.userid){//&&!getState().Find.collectProductCount
            // console.log("是否一直在请求")
            let data = {"userid": getState().Login.userObj.userid};
            getCollectProductCount(data, navigation, (res) => {
                dispatch(reveice_CollectProCount(res))
            }, (error) => {
                dispatch(reveice_CollectProCount(null))
            })
        }else {
            dispatch(reveice_CollectProCount(null))
        }
    }
}

function reveice_CollectProCount(res) {
    return {
        type: types.RECEIVE_COLLECTPRODUCTCOUNT,
        count: res || 0
    }
}

//我的产品收藏列表
export function fetchCollectProductList(data, navigation, isLoading, option) {
    return (dispatch) => {
        getCollectProductList(data, navigation, (res) => {
            dispatch(reveice_CollectProList(res, isLoading, option))
        }, (error) => {
            dispatch(reveice_CollectProList([], false))
        })
    }
}

function reveice_CollectProList(res, isLoading, option) {
    return {
        type: types.RECEIVE_COLLECTPRODUCTLIST,
        res,
        isLoading,
        option
    }
}

export function fetchCollectProductFromID(id, callback) {
    return (dispatch) => {
        dispatch(reveice_CollectProID(id, callback))
    }
}

function reveice_CollectProID(id, callback) {
    return {
        type: types.RECEIVE_COLLECTPRODUCTID,
        id, callback
    }
}

//清除数据
export function fetchCollectProductClearData() {
    return (dispatch) => {
        dispatch(reveice_CollectProductClearData())
    }
}

function reveice_CollectProductClearData() {
    return {
        type: types.RECEIVE_CLEARCOLLECTPRODUCTLIST
    }
}

