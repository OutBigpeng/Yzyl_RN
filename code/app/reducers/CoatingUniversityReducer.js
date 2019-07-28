/**
 * 大学——Reducer
 */
import {isEmptyObject} from "../common/CommonUtil";
import *as types from '../actions/ActionTypes';
import _ from 'underscore'

const initialState = {
    selectCoatingLabelList: [],
    selectCoatingLabel: {},
    selectCoatingChildLabel: {},
    selectCoatingChildLabelObj: {},
    fromType: '',
    fromTypeArr: [],
    coatingListObj: {},
    coatingListData: [],
    coatingListDataObj: {},
    coatingKey: '',
    isRefreshing: false,
    isLoadMore: false,
    reqData: {},
    receiveDataObj: {}
};
let setKey = ({id, value, key}) => {
    return `${id}-${value}-${key}`
};
let setValueKey = (value1, value2) => {
    return `${value1}-${value2}`
};

function CoatingUniversity(state = initialState, action) {
    switch (action.type) {
        case types.RECEIVE_SELECTCOATINGLABEL://请求设置 Label List
            let tempSelectObj = {}, tSelectObjC = {};
            let list = !_.isEmpty(action.array) ? action.array : state.selectCoatingLabelList;
            if (state.fromType && !_.isEmpty(state.fromTypeArr)) {
                list.map((item) => {
                    if (item.value === state.fromTypeArr[0]) {
                        tempSelectObj = item;
                        let subList = item.subList;
                        state.fromTypeArr[1] && subList && !_.isEmpty(subList) && subList.map((obj) => {
                            if (obj.value === state.fromTypeArr[1]) {
                                tSelectObjC = obj;
                            }
                        })
                    }
                })
            } else {
                tempSelectObj = list[0] || {};
                tSelectObjC = tempSelectObj.subList && !_.isEmpty(tempSelectObj.subList) ? tempSelectObj.subList[0] : {}
            }
            state.selectCoatingChildLabelObj[setKey(tempSelectObj)] = tSelectObjC;
            return Object.assign({}, state, {
                coatingKey: setValueKey(tempSelectObj.value, tSelectObjC.value),
                selectCoatingLabelList: list,
                selectCoatingLabel: tempSelectObj,
                selectCoatingChildLabel: tSelectObjC,
                selectCoatingChildLabelObj: state.selectCoatingChildLabelObj,
                fromType: ''
            });
            break;
        case types.RECEIVE_SELECTCOATINGCHILDLABEL://点击Label 设置 Label数据
            let tempObj = state.selectCoatingChildLabelObj[setKey(action.selectItem)] || {};
            let selectC = !isEmptyObject(tempObj) ? tempObj : action.selectItem.subList && !_.isEmpty(action.selectItem.subList) ? action.selectItem.subList[0] : {};
            let selectChildItem1 = action.selectChildItem ? action.selectChildItem : selectC;
            state.selectCoatingChildLabelObj[setKey(action.selectItem)] = selectChildItem1;
            return Object.assign({}, state, {
                coatingKey: setValueKey(action.selectItem.value, selectChildItem1.value),
                selectCoatingLabel: action.selectItem || state.selectCoatingLabel,
                selectCoatingChildLabel: selectChildItem1,
                isClickRefreshing: true,
                fromType: ''
            });
            break;
        case types.RECEIVE_SELECTCOATINGCHILDLABELVALUE://根据值来找对象
            let arrStr = action.selectItemValue ? [action.selectItemValue, action.selectChildItemValue] : [];
            if (!_.isEmpty(state.selectCoatingLabelList)) {
                let selectItem = {}, selectItemC = {};
                if (action.selectItemValue) {
                    state.selectCoatingLabelList.map((item) => {
                        if (item.value === arrStr[0]) {
                            selectItem = item;
                            let subList = item.subList;
                            arrStr[1] && subList && !_.isEmpty(subList) && subList.map((obj) => {
                                if (obj.value === arrStr[1]) {
                                    selectItemC = obj;
                                }
                            })
                        }
                    });
                } else {
                    selectItem = state.selectCoatingLabelList[0]
                }
                state.selectCoatingChildLabelObj[setKey(selectItem)] = selectItemC;
                return Object.assign({}, state, {
                    fromType: action.fromType,
                    coatingKey: setValueKey(selectItem.value, selectItemC.value),
                    selectCoatingLabel: selectItem,
                    selectCoatingChildLabel: selectItemC,
                    selectCoatingChildLabelObj: state.selectCoatingChildLabelObj,
                    isClickRefreshing: true
                })
            } else {
                return Object.assign({}, state, {
                    fromType: action.fromType,
                    fromTypeArr: arrStr,
                    isClickRefreshing: true

                });
            }
            break;

        case types.REQUIRE_COATINGLIST:
            return Object.assign({}, state, {
                isRefreshing: action.isRefreshing,
                isLoadMore: action.isLoadMore
            }, !action.isRefreshing ? {coatingListData: [], isClickRefreshing: !action.isRefreshing} : {});

        case types.RECEIVE_COATINGLIST://Label 请求数据的List
            let reqData = action.data;
            let res = action.res || {};
            if (isEmptyObject(res)) {
                return state
            }
            let t = setValueKey(state.selectCoatingLabel.value, state.selectCoatingChildLabel.value);
            let currentTime = new Date().getTime();
            let localList = state.coatingListDataObj[t] || [];
            let {count = 0, page, pageCount} = action.res;
            // console.log("请求到的结果 数据 。。。。。",localList.length ,count,page,pageCount)
            // if (count && page <= pageCount) {
            state.receiveDataObj = {
                count,
                isLoadMore: (page <= pageCount && localList.length <= count),
                page,
                pageCount,
                jumpType: reqData.articleType,
                tagKey: reqData.tagKey
            };
            // } else {
            //     state.receiveDataObj = {isLoadMore: undefined,};
            // }
            // console.log(count = 0, page, pageCount, t, reqData.tagKey, state.coatingKey, reqData.pageIndex)
            if (t === reqData.tagKey) {
                if (page > 1) {
                    state.coatingListDataObj[t] = localList.concat(res.data)
                } else {
                    if (reqData.option === 3) {//是下拉刷新
                        state.coatingListDataObj[t] = res.data;
                    } else {
                        let temp1 = res.page === 1 && (currentTime - reqData.reqTime <= 3 * 1000) ? (_.isEmpty(localList) ? res.data : localList) : res.data;
                        state.coatingListDataObj[t] = temp1;
                    }
                }
            } else {
                state.coatingListDataObj[t] = state.coatingListData;
            }
            return Object.assign({}, state, {
                receiveDataObj: state.receiveDataObj,
                reqData: reqData,
                coatingListDataObj: state.coatingListDataObj,
                coatingKey: t,
                isClickRefreshing: false,
                isRefreshing: false,
                isLoadMore: false,
            });
        default:
            return state;
    }
}

export default CoatingUniversity;