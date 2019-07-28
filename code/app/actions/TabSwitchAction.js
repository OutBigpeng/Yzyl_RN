import * as types from "./ActionTypes";

export function switchTabIndex(style, index, isJpush = false) {
    return (dispatch, getState) => {
        return dispatch(receive_tab(style, index, isJpush));
    }
}

function receive_tab(style, index, isJpush) {
    return {
        type: types.RECEIVE_TABSWITCH,
        style, index, isJpush
    };
}

export function chageJpush(isJpush) {
    return (dispatch, getState) => {
        return dispatch(receive_change(isJpush));
    }
}

function receive_change(isJpush) {
    return {
        type: types.RECEIVE_JUMPPAGE,
        isJpush
    };
}

export function chageGoBack(isTabSwitch) {
    return (dispatch, getState) => {
        return dispatch(receive_GoBack(isTabSwitch));
    }
}

function receive_GoBack(isTabSwitch) {
    return {
        type: types.RECEIVE_ISTABSWITCH,
        isTabSwitch
    };
}

