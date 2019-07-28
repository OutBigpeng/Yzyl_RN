import *as types from './ActionTypes';
import {typeById, typeDetailById} from '../dao/FindDao'
import * as _ from "underscore";

//现在的。重新写。


export function fetchTypeClearData() {//
    return (dispatch) => {
        dispatch(receive_TypeClearData())
    }
}

function receive_TypeClearData() {
    return {
        type: types.RECEIVE_TYPECLEAR,
    }
}

export function fetchTypeLeftData(rowData, navigation, isLoading) {
    return (dispatch, getState) => {
        let {typeDetailDataObj = {}} = getState().Type;
        let {id, name} = rowData;
        if (typeDetailDataObj[id] && !_.isEmpty(typeDetailDataObj[id])) {
            dispatch(receive_TypeLeftData(typeDetailDataObj[id], rowData))
        } else {
            dispatch(request_TypeLeftData(isLoading));
            let data = {"pid": id};
            typeDetailById(data, navigation, (res) => {
                dispatch(receive_TypeLeftData(res, rowData))
            }, (error) => {
            })
        }
    }
}

function request_TypeLeftData(isLoading) {
    return {
        type: types.REQUEST_TYPELEFT,
        isLoading
    }
}

function receive_TypeLeftData(typeDetailData, rowData) {
    return {
        type: types.RECEIVE_TYPELEFT,
        typeDetailData, rowData,
        pname: !_.isEmpty(typeDetailData) && typeDetailData[0].pname || '',
        rightData: !_.isEmpty(typeDetailData) && typeDetailData[0].categories || [],
        isLoading: false
    }
}

export function fetchTypeRightData(rowData) {
    return (dispatch) => {
        dispatch(receive_TypeRightData(rowData.categories, rowData.pname))
    }
}

function receive_TypeRightData(rightData, pname) {
    return {
        type: types.RECEIVE_TYPERIGHT,
        rightData,
        pname
    }
}

export function fetchTypeHeadData(navigation, callback) {
    return (dispatch, getState) => {
        // let {typeDetailDataObj = {}} = getState().Type;
        // if (!isEmptyObject(typeDetailDataObj)) {
        //     dispatch(request_TypeLeftData(true));
        // }
        typeById({}, navigation, (res) => {
            if (res && res[0]) {
                let {id, name} = res[0];
                callback(id, res[0]);
                dispatch(receive_TypeHeadData(res, name))
            } else {
                callback()
            }
            dispatch(request_TypeLeftData(false));
        }, (error) => {
            dispatch(request_TypeLeftData(false));
            callback()
        })
    }
}

function receive_TypeHeadData(typeHeadData, selectHeadName) {
    return {
        type: types.RECEIVE_TYPEHEAD,
        typeHeadData, selectHeadName
    }
}


//以前的。不改变。

export function fetchTypeDetailInfo(id, navigation, isLoading) {
    return (dispatch) => {
        dispatch(fetchTypeDetailData(id, navigation, isLoading));
    }
}

function fetchTypeDetailData(id, navigation, isLoading) {
    return (dispatch) => {
        dispatch(request_TypeDetailData(isLoading));
        let data = {"pid": id};
        typeDetailById(data, navigation, (res) => {
            dispatch(receive_TypeDetailData(res))
        }, (error) => {

        })
    }
}

function request_TypeDetailData(isLoading) {
    return {
        type: types.REQUEST_TYPEDETAIL,
        isLoading
    }
}

function receive_TypeDetailData(typeDetailData) {
    return {
        type: types.RECEIVE_TYPEDETAIL,
        typeDetailData,
        pname: typeDetailData[0].pname,
        rightData: typeDetailData[0].categories
    }
}

//获取右边的数据
export function fetchTypeRightDetailInfo(rowData, typeData) {
    return (dispatch) => {
        dispatch(fetchTypeRightDetailData(rowData, typeData));
    }
}

function fetchTypeRightDetailData(rowData, typeData) {
    return (dispatch) => {
        for (let i = 0; i < typeData.length; i++) {
            if (rowData.pname === typeData[i].pname) {
                dispatch(receive_TypeRightDetailData(typeData[i].categories, rowData.pname))
            }
        }
    }
}

function receive_TypeRightDetailData(rightData, pname) {
    return {
        type: types.RECEIVE_TYPERIGHTDETAIL,
        rightData,
        pname
    }
}