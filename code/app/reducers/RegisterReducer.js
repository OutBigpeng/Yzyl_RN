/**
 * Created by coatu on 2016/12/13.
 */
import * as types from '../actions/ActionTypes';
import _ from 'underscore'

const initialState = {
    radioArray: [],
    radioSelectedId: [],
    selectTextObj: {},
    map: {}
};

export default function Audit(state = initialState, action = {}) {
    switch (action.type) {
        case types.RECEIVE_MULTISELECT://多选
            let listData = state.radioArray;
            let obj = action.rowData;
            let isHave = false;
            for (let i = 0; i < listData.length; i++) {
                if (listData[i].id == obj.id) {
                    isHave = true;
                }
            }
            if (isHave) {
                if (_.first(listData).id == obj.id) {
                    listData.shift();
                } else {
                    for (let i = 0; i < listData.length; i++) {
                        if (obj.id === listData[i].id) {
                            listData.splice([i], 1);
                        }
                    }
                }
            } else {
                // ids.push(obj.id);
                listData.push({name: obj.name, id: obj.id})
            }

            return Object.assign({}, state, {
                radioArray: listData
            });
            break;


        case types.RECEIVE_RADIO://单选
            // state.radioArray = [];
            let classification = action.classification;//判断是职位还是公司名称；职位是2 公司名称是1
            let id = action.rowData.keyName || action.rowData.id ;
            let names =  action.rowData.keyValue||action.rowData.name || action.textInput;
            let array = state.radioArray;

            if (_.isEmpty(array)) {
                if (classification == 'company') {
                    array.push({'name': names, 'address': action.rowData.address, 'key': classification});
                } else {
                    array.push({'id': id, 'name': names, 'key': classification});
                }

            } else {
                for (let i = 0; i < array.length; i++) {
                    if (classification != 'company') {
                        if (array[i].id != id) {
                            array.push({'id': id, 'name': names, 'key': classification});
                        } else {
                            array.shift();
                        }
                    } else {
                        if (array[i].name && array[i].name != names) {
                            array.push({'name': names, 'address': action.rowData.address, 'key': classification});
                        } else {
                            array.shift();
                        }
                    }
                }
            }
            return Object.assign({}, state, {
                radioArray: array
            });
            break;
        case types.RECEIVE_SETCHECKDATA://设置 传过来的。已经选中的数据
            return Object.assign({}, state, {
                radioArray: action.array
            });
            break;
        case types.RECEIVE_SETCHECKTEXTDATA://设置单选多选文字
            let name = action.name;
            let value = action.value;
            let selectTextObj = state.selectTextObj || {};
            selectTextObj[name] = value;
            return Object.assign({}, state, selectTextObj);
            break;
        default:
            return state;
    }
}