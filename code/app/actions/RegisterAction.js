/**
 * Created by coatu on 2017/11/10.
 */
import * as types from "./ActionTypes";
// import {getSysDictionaryData} from '../dao/UserInfoDao';

//单选和多选
export function fetchProjectCheckView(rowData,option,type,textInput) {
    return (dispatch) =>{
        dispatch(receive_projectCheckView(rowData,option,type,textInput))
    }
}

function receive_projectCheckView(rowData,option,classification,textInput) {
    return{
        type:option ==1?types.RECEIVE_RADIO:types.RECEIVE_MULTISELECT,
        rowData,
        option,
        classification,
        textInput
    }
}
//设置选中数据
export function fetchsetCheckView(array) {
    return (dispatch) =>{
        dispatch(receive_setCheckView(array))
    }
}

function receive_setCheckView(array) {
    return{
        type:types.RECEIVE_SETCHECKDATA,
        array
    }
}

//设置单选多选文字
export function fetchSetCheckTextView(name,value) {
    return (dispatch) =>{
        dispatch(receive_SetCheckTextView(name,value))
    }
}

function receive_SetCheckTextView(name,value) {
    return{
        type:types.RECEIVE_SETCHECKTEXTDATA,
        name,value
    }
}

