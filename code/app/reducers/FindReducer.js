/**发现产品
 * Created by coatu on 2016/12/21.
 */
import *as types from '../actions/ActionTypes';
import _ from "underscore";

const initialListSize = {
    isBrandLoading: false,
    isBrannerLoading: false,
    isProductLoading: false,
    BrandData: [],
    isBrandData: false,
    isBrannerData: false,
    isProductData: false,
    homeBrannerData: [],
    proBrannerData: [],
    teBrannerData: [],
    ProductData: [],
    //收藏
    collectProductCount: 0,
    collectRes: [],
    collectLoading: true,
    collectListData: [],
    isCollect: false,
    isOperation:false,

    brannerObj:{}
};

export default function FindView(state = initialListSize, action = {}) {
    switch (action.type) {
        //图片轮播
        case types.RECEIVE_IMAGEBANNER:
            let temp = action.res||[];
          /*  switch (action.data.type) {
                case 0:
                    return Object.assign({}, state, {
                        homeBrannerData: temp,
                        isBrannerData: false
                    });
                    break;
                case 1:
                    return Object.assign({}, state, {
                        teBrannerData: temp,
                        isBrannerData: false
                    });
                    break;
                case 2:
                    // state.proBrannerData = temp;
                    return Object.assign({}, state, {
                        proBrannerData: temp,
                        isBrannerData: false
                    });
                    break;
                default:
                    return Object.assign({}, state, {
                        isBrannerData: false
                    });
                    break;
            }*/
            return Object.assign({}, state, {
                brannerObj: Object.assign(state.brannerObj, {[action.data.type]:temp}),
            });
        case types.REQUESR_IMAGEBANNER:
            return Object.assign({}, state, {isBrannerData: action.isData});
            break;

        //推荐品牌
        case types.RECEIVE_BRAND:
            // state.BrandData = [];
            return Object.assign({}, state, {BrandData: action.res, isBrandData: false, isBrandLoading: false});
            break;
        case types.REQUEST_BRAND:
            return Object.assign({}, state, {isBrandData: action.isData});
            break;

        //推荐产品
        case types.RECEIVE_PRODUCT:
            state.ProductData = [];
            return Object.assign({}, state, {ProductData: action.res, isProductData: false});
            break;
        case types.REQUEST_PRODUCT://产品
            return Object.assign({}, state, {isProductData: action.isData});
            break;
        case types.RECEIVE_COLLECTPRODUCT://收藏产品
            let collectListData = state.collectListData;
            let rCount = action.count;
            let isOperate  =false;
            if (action.type && action.data && action.data.productid) {//移除收藏产品
                let item = action.data.productid;
                collectListData.map((data, index) => {
                    if (item == data.productid) {
                        collectListData.splice(index, 1);
                        let count = state.collectProductCount || 0;
                        rCount = count - 1;
                        isOperate = true;
                    }
                });
            }
            return Object.assign({}, state, collectListData.length > 0 ? {
                collectListData: collectListData,
                collectProductCount: rCount,
                isOperation:isOperate
            } : {
                collectListData: collectListData,
                collectProductCount: rCount,
                collectLoading: false,
                isOperation:isOperate
            });
            break;
        case types.RECEIVE_COLLECTPRODUCTID://是否有该 收藏产品
            let rCollectListData = state.collectListData;
            let item = action.id;
            let isFlag;
            rCollectListData.map((data, index) => {
                if (item === data.productid) {
                    action.callback(true);
                    isFlag = 1;
                }
            });
            if (!isFlag) {
                action.callback(false);
            }
            return state;
            break;
        case types.RECEIVE_COLLECTPRODUCTCOUNT://收藏产品数量
            let count = action.count||0;
            return Object.assign({}, state, {collectProductCount: count});
            break;

        //收藏列表
        case types.RECEIVE_COLLECTPRODUCTLIST:
            let collectRes = action.res;
            let collectOption = action.option;
            let collectNewDataList = collectOption === 1 && _.isEmpty(collectRes.data) ? [] : state.collectListData.concat(collectRes.data);
            return Object.assign({}, state, {
                collectListData: collectOption === 1 ? _.isEmpty(collectRes.data) ? [] : collectRes.data : collectNewDataList,
                collectRes: collectOption === 1 ? (_.isEmpty(collectRes) ? [] : collectRes) : collectRes,
                collectLoading: collectOption === 1 && _.isEmpty(collectRes.data) ? false : action.isLoading,
            });
            break;
        //clear
        case types.RECEIVE_CLEARCOLLECTPRODUCTLIST:
            let cCollectListData = state.collectListData;
            return Object.assign({}, state, {
                collectListData: cCollectListData,
                collectLoading: true,
            });
            break;
        default:
            return state;
    }
}