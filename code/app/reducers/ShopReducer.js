/**
 * 购物车——Reducer
 */
import *as types from "../actions/ActionTypes";
import _ from "underscore";

const initialListSize = {
    shopListData: [],
    shopListRes:[],
    quantity: {},
    subTotal: {},
    allMoney: {},
    ShopCount: 0,
    TotalPrice: [],
    selectArray: [],
    selectDataArray: [],
    isLoading: true,
    isListData: [],
    shopLoading:true

};

export default function TypeView(state = initialListSize, action = {}) {
    let count = 0;
    let shops = [];
    switch (action.type) {
        case types.RECEIVE_CLEARSELECTSHOPCART:
            state.selectArray.shift();
            state.selectDataArray.shift();
            return Object.assign({}, state, {selectArray:[], selectDataArray: [], allMoney: 0.00,TotalPrice:[]});
            break;

        // //我的收藏夹
        // case types.RECEIVE_SHOPLIST:
        //     let shopListRes = action.res;
        //     return Object.assign({}, state, {
        //         shopListData: shopListRes.result,
        //         shopListRes: shopListRes
        //     });
        //     break;
        //购物车列表
        case types.RECEIVE_SHOPLIST:
            shops =_.isEmpty(action.res)?[]:action.res.result;
            let object = {};
            let price = {};
            let allMoney = {};
            shops.map((item, index) => {
                object[`${item.prodpackid}`] = item.quantity;
                price[`${item.prodpackid}`] = (item.quantity * item.packnum).toFixed(2);
                allMoney[`${item.prodpackid}`] = (item.quantity * item.packnum * item.packprice).toFixed(2);

            });
            count = shops.length;

            return Object.assign({}, state, {
                shopLoading:action.isLoading,
                shopListData: shops,
                shopListRes:_.isEmpty(action.res)?[]:action.res,
                quantity: object,
                subTotal: price,
                allMoney: allMoney,
                shopCount: count,
                isLoading: false
            });
            break;

        case types.REQUEST_SHOPLIST:
            return Object.assign({}, state, {});
            break;

        //减少购物车数量
        case types.RECEIVE_SHOPREDUCE:
            var object = state.quantity;
            var aa;
            var bb;
            if (action.quantity > 1) {
                object[`${action.prodpackid}`] = action.quantity - 1;
            }
            var price = state.subTotal;
            var allMoney = state.allMoney
            state.shopListData.map((item, index) => {
                if (action.prodpackid === item.prodpackid) {
                    if (action.quantity > 1) {
                        aa = ((action.quantity - 1) * item.packnum).toFixed(2);
                        price[`${action.prodpackid}`] = aa
                        bb = (((action.quantity - 1) * item.packnum * item.packprice)).toFixed(2)
                        allMoney[`${action.prodpackid}`] = bb

                        if (state.selectDataArray) {
                            state.selectDataArray.map((res, index) => {
                                if (res.scarid === item.scarid) {
                                    res.quantity = res.quantity - 1
                                }
                            })
                        }
                    }
                }
            })
            return Object.assign({}, state, {quantity: object, subTotal: price, allMoney: allMoney});
            break;

        //增加购物车数量
        case types.RECEIVE_SHOPRADD:
            var object = state.quantity;
            var price = state.subTotal;
            var allMoney = state.allMoney;
            object[`${action.prodpackid}`] = action.quantity + 1;
            var aa;
            var bb;
            state.shopListData.map((item, index) => {
                if (action.prodpackid === item.prodpackid) {
                    aa = ((action.quantity + 1) * item.packnum).toFixed(2);
                    price[`${action.prodpackid}`] = aa;

                    bb = ((action.quantity + 1) * item.packnum * item.packprice).toFixed(2);

                    allMoney[`${action.prodpackid}`] = bb;

                    if (state.selectDataArray) {
                        state.selectDataArray.map((res, index) => {
                            if (res.scarid === item.scarid) {
                                res.quantity = res.quantity + 1
                            }
                        })
                    }
                }
            });
            return Object.assign({}, state, {quantity: object}, {subTotal: price}, {allMoney: allMoney});
            break;

        //购物车总数
        case types.RECEIVE_SHOPCOUNT:
            return Object.assign({}, state, {ShopCount: action.count});
            break;

        //总价格
        case  types.RECEIVE_TOTALPRICE:
            let TotalPrice = state.TotalPrice;
            var isProducts = false;
            for (let i = 0; i < TotalPrice.length; i++) {
                if (TotalPrice[i].scarid == action.scarid) {
                    isProducts = true;
                }

            }
            if (isProducts) {
                if (_.first(TotalPrice).scarid == action.scarid) {
                    TotalPrice.shift()
                }
                else {
                    for (let i = 0; i < TotalPrice.length; i++) {
                        if (action.scarid === TotalPrice[i].scarid) {
                            TotalPrice.splice([i], 1)
                        }
                    }
                }
            } else {
                TotalPrice.push({"scarid": action.scarid, 'dataId': action.dataId})

            }
            return Object.assign({}, state, {TotalPrice: TotalPrice});
            break;

        //选中购物车
        case types.RECEIVE_SELECTSHOPCART:
            let array = state.selectArray;
            let product = state.selectDataArray;
            var isProducts = false;
            let selectCount;
            if (_.contains(array, action.scarid)) {
                if (_.first(array) == action.scarid) {
                    array.shift()
                } else {
                    _.map(array, (element, index) => {
                        if (element == action.scarid)
                            array.splice(index, 1)
                    })
                }
            } else {
                array.push(action.scarid)
            }

            for (let i = 0; i < product.length; i++) {
                if (product[i].scarid == action.scarid) {
                    isProducts = true;
                }

            }
            if (isProducts) {
                if (_.first(product).scarid == action.scarid) {
                    product.shift()
                } else {
                    for (let i = 0; i < product.length; i++) {
                        if (action.scarid === product[i].scarid) {
                            product.splice([i], 1)
                        }
                    }
                }
            } else {
                product.push({"scarid": action.scarid, "quantity": action.quantity,"prodpackid":action.prodpackid})
            }
            return Object.assign({}, state, {selectArray: array, selectDataArray: product})
            break;

        //删除购物车
        case types.RECEIVE_SHOPDELETE:
            let allmoney = {};
            shops= state.shopListData;
            count = state.ShopCount;
            shops.map((item, index) => {
                if (action.scarid === item.scarid) {
                    shops.splice(index, 1);
                    count -= 1;
                    for (let i = 0; i < shops.length; i++) {
                        allmoney[`${shops[i].prodpackid}`] = (shops[i].quantity * shops[i].packnum * shops[i].packprice).toFixed(2)
                    }
                    for (let i=0;i<state.selectArray.length;i++){
                        if(action.scarid === state.selectArray[i]){
                            state.selectArray.splice([i],1);
                            state.selectDataArray.splice([i],1)
                        }
                    }
                }
            });

            return Object.assign({}, state,{shopListData:shops},{ShopCount:count},{allMoney: allmoney,selectArray:state.selectArray,selectDataArray:state.selectDataArray});
            break;

        //加入购物车
        case types.RECEIVE_ADDSHOP:
            count = state.ShopCount;
            shops = state.shopListData;
            if(!_.isEmpty(shops)) {
                let flag = true;
                if (shops.length > 0) {
                    for (let i = 0; i < shops.length; i++) {
                        state.isListData.push(shops[i]);
                        for (j = 0; j < state.isListData.length; j++) {
                            if (action.prodpackid === state.isListData[j].prodpackid) {
                                flag = false;
                            }
                        }
                    }
                }

                if (flag) {
                    let objs = {};
                    let price = {};
                    let allMoney = {};
                    count += 1;
                    shops = state.shopListData;
                    shops.push(action.res);

                    for (let i = 0; i < shops.length; i++) {
                        objs[`${shops[i].prodpackid}`] = shops[i].quantity;
                        price[`${shops[i].prodpackid}`] = shops[i].quantity * shops[i].packnum;
                        allMoney[`${shops[i].prodpackid}`] = shops[i].quantity * shops[i].packnum * shops[i].packprice;
                    }
                    return Object.assign({}, state, {
                        shopListData: shops,
                        ShopCount: count,
                        quantity: objs,
                        subTotal: price,
                        allMoney: allMoney
                    });
                } else {
                    let count = {};
                    let price = {};
                    let allMoney = {};
                    shops.map((item, index) => {
                        if (action.prodpackid === item.prodpackid) {
                            let obj = item;
                            obj.quantity = obj.quantity + action.count;
                            for (let i = 0; i < shops.length; i++) {
                                count[`${shops[i].prodpackid}`] = shops[i].quantity;
                                price[`${shops[i].prodpackid}`] = shops[i].quantity * shops[i].packnum;
                                allMoney[`${shops[i].prodpackid}`] = shops[i].quantity * shops[i].packnum * shops[i].packprice
                            }
                        }
                    });


                    return Object.assign({}, state, {shopListData: shops}, {quantity: count}, {subTotal: price}, {allMoney: allMoney});
                }
            }else {
                return Object.assign({}, state, {shopListData:[]}, {quantity: count}, {subTotal: price}, {allMoney: allMoney});
            }
            break;

        // //清空选中的购物车
        // case types.RECEIVE_CLEARSELECTSHOP:
        //     state.selectArray.shift();
        //     state.selectDataArray.shift();
        //     return Object.assign({}, state, {selectArray: state.selectArray, selectDataArray: state.selectDataArray, allMoney: 0.00});
        //     break;

        default:
            return state;
    }
}