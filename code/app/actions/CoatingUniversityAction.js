/**
 * 大学
 * Created by Monika on 2018/7/31.
 */
import * as types from "./ActionTypes";
import {getArticlesForAppNew} from "../dao/CoatingUniversityDao";

/**
 * Label  所有的
 * @param array
 * @returns {Function}
 */
export function fetchSetSelectCoatingLabel(array) {
    return (dispatch) => {
        dispatch(receiveSetSelectCoatingLabel(array))
    }
}

function receiveSetSelectCoatingLabel(array) {
    return {
        type: types.RECEIVE_SELECTCOATINGLABEL,
        array
    }
}

/**
 * 选中的类型。。
 * @param selectItem
 * @param selectChildItem
 * @returns {Function}
 */
export function fetchSetSelectCoatingChildLabel(selectItem, selectChildItem) {
    return (dispatch) => {
        dispatch(receiveSetSelectCoatingChildLabel(selectItem, selectChildItem))
    }
}

function receiveSetSelectCoatingChildLabel(selectItem, selectChildItem) {
    return {
        type: types.RECEIVE_SELECTCOATINGCHILDLABEL,
        selectItem, selectChildItem, isClickRefreshing: true
    }
}

/**
 * 根据Value确认数据
 * @param selectItemValue
 * @param selectChildItemValue
 * @param fromType
 * @returns {Function}
 */
export function fetchSetSelectCoatingChildLabelValue(selectItemValue, selectChildItemValue, fromType) {
    return (dispatch) => {
        dispatch(receiveSetSelectCoatingChildLabelValue(selectItemValue, selectChildItemValue, fromType))
    }
}

function receiveSetSelectCoatingChildLabelValue(selectItemValue, selectChildItemValue, fromType = '') {
    return {
        type: types.RECEIVE_SELECTCOATINGCHILDLABELVALUE,
        selectItemValue, selectChildItemValue, fromType
    }
}

/**
 * 请求当前选中的Label list 数据
 * @param data
 * @param navigation
 * @param isRefreshing
 * @param isLoadMore
 * @returns {Function}
 */
export function fetchCoatingList(data, navigation,callback) {
    return (dispatch) => {
        // dispatch(requestCoatingList(isRefreshing, isLoadMore, !isRefreshing));
        data.reqTime = new Date().getTime();
        getArticlesForAppNew(data, navigation, (res) => {
            dispatch(receiveCoatingList(data, res));
            callback(res)
        }, (error) => {
            callback('err');
            dispatch(receiveCoatingList(data, {}))
        })
    }
}

function receiveCoatingList(data, res) {
    return {
        type: types.RECEIVE_COATINGLIST,
        data,
        res,
    }
}

function requestCoatingList(isRefreshing, isLoadMore, isClickRefreshing) {
    return {
        type: types.REQUIRE_COATINGLIST,
        isRefreshing,
        isLoadMore, isClickRefreshing
    }
}

