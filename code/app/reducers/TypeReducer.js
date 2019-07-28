/**分类 ——Reducer
 * Created by coatu on 2016/12/28.
 */
import *as types from '../actions/ActionTypes';

const initialListSize = {
    //以前
    typeDetailData: [],
    pname: '',
    rightData: [],
    isLoading: false,

//现在。
    typeHeadData: [],
    selectHeadName: [],
    typeDetailDataObj: {},
    isDLoading: false
};

export default function TypeView(state = initialListSize, action = {}) {
    switch (action.type) {
        case types.RECEIVE_TYPECLEAR:
            let head = state.typeHeadData[0];
            let temp = state.typeDetailDataObj[head.id];
            return Object.assign({}, state, {
                pname: temp[0].pname,
                rightData: temp[0].categories,
                typeDetailData: temp,
                selectHeadName: head.name,
            });
        case types.RECEIVE_TYPEHEAD://头数据
            return Object.assign({}, state, {...action});
            break;
        case types.RECEIVE_TYPELEFT://左边的数据
            let {id, name} = action.rowData;
            state.typeDetailDataObj[id] = action.typeDetailData;
            return Object.assign({}, state, {
                typeDetailData: action.typeDetailData,
                pname: action.pname,
                rightData: action.rightData,
                selectHeadName: name,
                typeDetailDataObj: state.typeDetailDataObj,
                isDLoading: false
            });
            break;

        case types.REQUEST_TYPELEFT:
            return Object.assign({}, state, {isDLoading: action.isLoading});
            break;

        case types.RECEIVE_TYPERIGHT:
            return Object.assign({}, state, {pname: action.pname, rightData: action.rightData});
            break;


//以前的。不改变
        case types.RECEIVE_TYPEDETAIL:
            return Object.assign({}, state, {
                typeDetailData: action.typeDetailData,
                pname: action.pname,
                rightData: action.rightData,
                isLoading: false
            });
            break;

        case types.REQUEST_TYPEDETAIL:
            return Object.assign({}, state, {isLoading: action.isLoading});
            break;

        case types.RECEIVE_TYPERIGHTDETAIL:
            return Object.assign({}, state, {pname: action.pname, rightData: action.rightData});
            break;

        default:
            return state;
    }
}