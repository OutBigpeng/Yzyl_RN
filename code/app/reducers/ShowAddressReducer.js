/**地址——Reducer
 * Created by Monika on 2016/12/27.
 */

'use strict';
import * as types from "../actions/ActionTypes";

//初始化数据
const initialState = {
    address: {
        listData: [],
        selectId: 0,
        AddResult: {},
        isComplect: false,
        isLoading: true
    },
};

let ShowAddress = (state = initialState.address, action) => {
    let id = 0;
    let list = [];
    switch (action.type) {
        case types.RECEIVE_ADDRESSLIST:
            list = action.addressList;
            for (let i = 0; i < list.length; i++) {
                if (list[i].isDefault == 1) {
                    id = list[i].id;
                }
            }
            return Object.assign({}, state, {listData: list}, {selectData: id}, {isLoading: false});
            break;

        case types.REQUEST_ADDRESSLIST:
            return Object.assign({}, state, {isLoading: action.status});
            break;

        case types.RECEIVE_ISDEFAULT://设置默认
            id = action.id;
            list = state.listData;

            for (let i = 0; i < list.length; i++) {
                if (id == list[i].id) {
                    list[i].isDefault = 1;
                } else {
                    list[i].isDefault = 0;
                }
            }
            return Object.assign({}, state, {selectData: id}, {listData: list});
            break;
        case types.RECEIVE_DELADDRESS://删除地址
            id = action.id;
            list = state.listData;
            for (let i = 0; i < list.length; i++) {
                if (id == list[i].id) {
                    list.splice([i], 1);
                }
            }
            return Object.assign({}, state, {listData: list});
            break;
        case types.RECEIVE_NEWADDRESS://新增
            let addAddress = action.addAddressData;
            list = state.listData;
            list.push(addAddress);
            for (let i = 0; i < list.length; i++) {
                if (list[i].isDefault == 1) {
                    id = list[i].id;
                }
            }
            // if (action.call) {
            //     action.call(addAddress);
            // } else {
                // action.navigation.goBack();
            // }
            return Object.assign({}, state, {listData: list}, {selectData: id}, {AddResult: addAddress}, {isComplect: true});
            break;
        case types.RECEIVE_EditADDRESS://编辑
            let editAddress = action.editAddress;
            // list = state.listData;
            state.listData.map((item, index) => {
                if (editAddress.id == item.id) {
                    if(editAddress.isDefault == 1){
                        id = item.id;
                        state.selectId = item.id
                    }else {
                        if(state.selectId == item.id){
                            id = 0
                        }else {
                            id = state.selectId
                        }
                    }

                    state.listData.splice(index,1,editAddress);
                }
            });
            return Object.assign({}, state, {listData: state.listData}, {selectData:id}, {isComplect: true});
            break;
        default:
            return state;
            break;
    }
};

export default ShowAddress;