/**Tab——Reducer
 */
const initialTab = {
    index: 2,
    isFromJpush: false,
    isTabSwitch: false,
};
import *as types from '../actions/ActionTypes';

function TabSwitch(state = initialTab, action) {
    switch (action.type) {
        case types.RECEIVE_TABSWITCH:
            return {...state, index: action.index,isFromJpush:action.isJpush};
        case types.RECEIVE_JUMPPAGE://style:jump
            return {...state, isFromJpush: action.isJpush,};
        case types.RECEIVE_ISTABSWITCH://true 表示 需要切换一次。 false 重置 不用切换 了
            return {...state, isTabSwitch: action.isTabSwitch,};
        default:
            return state;
    }
}

export default TabSwitch;