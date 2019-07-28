/**
 * Created by Monika on 2018/4/19.
 */
import * as types from "./ActionTypes";

/**
 * 设置分级选择
 * @param item  选中的条目
 * @param option 单选  true 多选 false
 * @returns {function(*)}
 */
export function fetchJobClassifySelect(item, option) {
    return (dispatch) => {
        dispatch(receiveSetJobClassifySelect(item, option))
    }
}

function receiveSetJobClassifySelect(item, option) {
    return {
        type: types.RECEIVE_JOBCLASSIFY,
        item, option
    }
}
//设置传入的已选择的条目
export function fetchJobClassifySelected(array, option ) {
    return (dispatch) => {
        dispatch(receiveSetJobClassifySelected(array, option))
    }
}

function receiveSetJobClassifySelected(array, option) {
    return {
        type: types.RECEIVE_JOBCLASSIFYSELECTED,
        array, option
    }
}
export function fetchJobClassifyData(array) {
    return (dispatch) => {
        dispatch(receiveSetJobClassifyData(array))
    }
}

function receiveSetJobClassifyData(array) {
    return {
        type: types.RECEIVE_JOBCLASSIFYDATA,
        array
    }
}



//职位 。是否展开
export function fetchJobClassifyIsSpread(comKey) {
    return (dispatch) => {
        dispatch(receiveSetJobClassifyIsSpread(comKey))
    }
}

function receiveSetJobClassifyIsSpread(comKey) {
    return {
        type: types.RECEIVE_JOBCLASSIFYISSPREAD,
        comKey
    }
}

