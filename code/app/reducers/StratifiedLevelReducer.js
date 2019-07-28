/**
 * Created by Monika on 2018/4/19.
 */
import * as types from '../actions/ActionTypes';
import _ from 'underscore'
import {cloneObj} from "../common/CommonUtil";

const initialState = {
    //设置分级选择  职位分级选择
    jobClassifyData: [],
    jobClassifySelectData: [],
    jobClassifyIsSpread: [],

};

export default function StratifiedLevel(state = initialState, action = {}) {
    switch (action.type) {
        case types.RECEIVE_JOBCLASSIFY:
            let item = action.item;
            let isSingle = action.option;//是否单选  默认是
            let selectData = state.jobClassifySelectData;

            if (isSingle) {//是单选
                if (_.isEmpty(selectData)) {
                    selectData.push(item);
                } else {
                    for (let i = 0; i < selectData.length; i++) {
                        if (selectData[i].keyName != item.keyName) {
                            selectData.push(item);
                        } else {
                            selectData.shift();
                        }
                    }
                }
            } else {
                multiSelectData(selectData, item, "keyName");
            }
            return Object.assign({}, state, {jobClassifySelectData: cloneObj(selectData)});
        case types.RECEIVE_JOBCLASSIFYSELECTED:
            return Object.assign({}, state, {jobClassifySelectData: action.array});
            break;
            case types.RECEIVE_JOBCLASSIFYDATA:
            return Object.assign({}, state, {jobClassifyData: action.array});
            break;
        case types.RECEIVE_JOBCLASSIFYISSPREAD://分级列表是否展开
            let spread = state.jobClassifyIsSpread;
            let comKey = action.comKey;
            // console.log("spread[comKey]",spread[comKey]);
            spread[comKey] = !spread[comKey];
            return Object.assign({}, state, {jobClassifyIsSpread: spread});
            break;
        default:
            return state;
    }

    /**
     * 工作职位多选
     * @param selectData
     * @param item
     */
    function multiSelectData(selectData, item, key) {
        let isHave = false;
        if (!_.isEmpty(selectData)) {
            for (let i = 0; i < selectData.length; i++) {
                if (selectData[i][key] == item[key]) {
                    isHave = true;
                }
            }
        }
        if (isHave) {
            if (_.first(selectData)[key] == item[key]) {
                selectData.shift();
            } else {
                for (let i = 0; i < selectData.length; i++) {
                    if (item[key] === selectData[i][key]) {
                        selectData.splice([i], 1);
                    }
                }
            }
        } else {
            selectData.push(item);
        }
    }
}
