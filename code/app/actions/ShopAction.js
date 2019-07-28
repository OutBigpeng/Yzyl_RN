/**
 * Created by coatu on 2016/12/29.
 */
import *as types from "./ActionTypes";
import {
    AsyncStorage
} from 'react-native'
import {addShopCartId, shopCountId, shopDeleteId, shopListId} from "../dao/ShopDao";
import {Alerts} from "../common/CommonUtil";
import {toastShort} from "../common/CommonDevice";



//购物车列表
export function fetchShopListInfo(data,navigation,isLoading) {
    return (dispatch) => {
        shopListId(data, navigation, (res) => {
            dispatch(receive_shopListData(res,isLoading))
        }, (error) => {
            dispatch(receive_shopListData([],false))
        })
    }
}

function receive_shopListData(res,isLoading) {
    return {
        type: types.RECEIVE_SHOPLIST,
        res,
        isLoading
    }
}

// export function fetchShopListInfo(data, navigation, getLoad) {
//     return (dispatch) => {
//         dispatch(fetchShopListData(data, navigation, getLoad));
//     }
// }
//
// function fetchShopListData(data, navigation, getLoad) {
//     return (dispatch) => {
//         shopListId(data, navigation, (res) => {
//             console.log('我是res',res)
//             dispatch(receive_ShopListData(res))
//         }, (error) => {
//         })
//     }
// }

// function receive_ShopListData(shopListData) {
//     return {
//         type: types.RECEIVE_SHOPLIST,
//         shopListData
//     }
// }
//
// function request_Shop(isLoading) {
//     return {
//         type: types.REQUEST_SHOPLIST,
//         isLoading
//     }
// }

//购物车删除
export function fetchShopDeleteInfo(item, scarid, navigation) {
    return (dispatch) => {
        dispatch(fetchShopDeleteData(item, scarid, navigation));
    }
}

function fetchShopDeleteData(item, scarid, navigation) {
    return (dispatch) => {
        let data = {
            "userid": item,
            "scarid": scarid
        };
        shopDeleteId(data, navigation, (res) => {
            dispatch(receive_ShopDeleteData(scarid))
        }, (error) => {
        })
    }
}

function receive_ShopDeleteData(scarid) {
    return {
        type: types.RECEIVE_SHOPDELETE,
        scarid: scarid
    };
}

//加入购物车
export function fetchAddShopIfNeeded(data, count, navigation,rowData) {
    return (dispatch) => {
        dispatch(fetchAddShop(data, count, navigation,rowData));
    }
}

function fetchAddShop(data, count, navigation,rowData ) {
    return (dispatch) => {
        addShopCartId(data, navigation, (res) => {
            if (ISSHOWCART) {
                Alerts('加入购物车成功');
            } else {
                toastShort("已收藏");
            }
            dispatch(reveice_AddShop(res, count, rowData))
        }, (error) => {
            dispatch(reveice_AddShop([]))
        })
    }
}

function reveice_AddShop(res, count, rowData) {
    return {
        type: types.RECEIVE_ADDSHOP,
        res,
        count,
        prodpackid: res.prodpackid,
        rowData
    }
}

//购物车数量（-）
export function fetchShopReduceCountInfo(quantity, prodpackid) {
    return (dispatch) => {
        dispatch(fetchShopReduceCountData(quantity, prodpackid));
    }
}

function fetchShopReduceCountData(quantity, prodpackid) {
    return (dispatch) => {
        dispatch(receive_ShopReduceCountData(quantity, prodpackid))
    }
}

function receive_ShopReduceCountData(quantity, prodpackid) {
    return {
        type: types.RECEIVE_SHOPREDUCE,
        quantity,
        prodpackid
    }
}

//购物车数量（+）
export function fetchShopAddCountInfo(quantity, prodpackid) {
    return (dispatch) => {
        dispatch(fetchShopAddCountData(quantity, prodpackid));
    }
}

function fetchShopAddCountData(quantity, prodpackid) {
    return (dispatch) => {
        dispatch(receive_ShopAddCountData(quantity, prodpackid))
    }
}

function receive_ShopAddCountData(quantity, prodpackid) {
    return {
        type: types.RECEIVE_SHOPRADD,
        quantity,
        prodpackid
    }
}

//购物车总价格
export function fetchTotalPriceIfNeeded(scarid, dataId) {
    return (dispatch) => {
        dispatch(fetchTotalPrice(scarid, dataId));
    }
}

function fetchTotalPrice(scarid, dataId) {
    return (dispatch) => {
        dispatch(receiveTotalPrice(scarid, dataId))
    }
}

function receiveTotalPrice(scarid, dataId) {
    return {
        type: types.RECEIVE_TOTALPRICE,
        scarid,
        dataId
    }
}


//购物车总数
export function fetchShopCountInfo(item) {
    return (dispatch) => {
        dispatch(fetchShopCountData(item));
    }
}

function fetchShopCountData(item) {
    return (dispatch) => {
        let data = {
            "userid": item.userid,
            "buyergradeid": item.buyergradeid,
            "areaid": item.areaid
        };
        shopCountId(data, (res) => {
            AsyncStorage.setItem('SHOPCOUNT', JSON.stringify(res.count));
            dispatch(receive_ShopCountData(res.count))
        }, (err) => {
        })

    }
}

function receive_ShopCountData(count) {
    return {
        type: types.RECEIVE_SHOPCOUNT,
        count

    }
}


//选中购物车
export function fetchSelectCartIfNeeded(scarid, prodpackid, quantity) {
    return (dispatch) => {
        dispatch(receive_SelectCart(scarid, prodpackid, quantity))
    }
}

function receive_SelectCart(scarid, prodpackid, quantity) {
    return {
        type: types.RECEIVE_SELECTSHOPCART,
        scarid,
        prodpackid,
        quantity
    }
}


// //清空选中的购物车
// export function fetchClearSelectCartIfNeededscar() {
//     return (dispatch)=>{
//         dispatch (receive_ClearSelectCart())
//     }
// }
//
// function receive_ClearSelectCart() {
//     return{
//         type:types.RECEIVE_CLEARSELECTSHOP,
//
//     }
// }

//清空选中的购物车
export function fetchClearSelectCartIfNeeded() {
    return (dispatch) => {
        dispatch(receive_ClearSelectCart())
    }
}

function receive_ClearSelectCart() {
    return {
        type: types.RECEIVE_CLEARSELECTSHOPCART,
    }
}