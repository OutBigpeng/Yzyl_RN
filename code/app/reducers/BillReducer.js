/**发票——Reducer(暂时没用)
 * Created by Monika on 2016/12/27.
 */

'use strict';
import * as types from "../actions/ActionTypes";

//初始化数据
const initialState = {
    bill: {
        billList: [],
        billDetail: {},
        selectId: 0,
        isComplect: false,
        isLoading: false
    },
};

function setData(id, itemData) {
    let addDatas = {
        "id": id,
        "data": itemData,
    };
    return addDatas;
}

let ShowBill = (state = initialState.bill, action) => {
    let id = 0;
    let list = [];
    switch (action.type) {
        case types.RECEIVE_BillLIST:
            list = action.billList;
            for (let i = 0; i < list.length; i++) {
                if (list[i].isdefault == 1) {
                    id = list[i].id;
                }
            }

            return Object.assign({}, state, {billList: list}, {selectData: id}, {isLoading: false});
            break;
        case types.REQUEST_BillLIST:
            return Object.assign({}, state, {isLoading: true});
            break;

        case types.RECEIVE_SETDEFAULTBILL://设置默认
            id = action.id;
            list = [].concat(state.billList);//
            let itemDetail={};
            list.map((item, index) => {
                    if(item.id===id) {
                        if(list[index].isdefault === 1){
                            list[index].isdefault = 0;
                        }else {
                            list[index].isdefault = 1;
                        }
                        itemDetail = item;
                    }else{
                        list[index].isdefault = 0;
                    }
                });
            return Object.assign({}, state, {selectData: id}, {billList: list}, {billDetail: itemDetail});
            break;
        case types.REQUEST_SETDEFAULTBILL:
            return Object.assign({}, state, {isLoading: true});
            break;
        case types.RECEIVE_BILLSHOW://发票展示
            let item = action.itemDetail;
            id = action.id;
            // let data = setData(id, itemDetail);
            //  allData = state.billDetailData;
            // allData.push(data);
            return Object.assign({}, state, {billDetail: item});//,{billDetailData:allData}
            break;

        case types.GET_BILLSHOW:
            //  allData = state.billDetailData;
            //  id = action.id;
            //  let itemData = {};
            //  allData.map((item, index) => {
            //     if(item.id===id) {
            //         itemData = item.data;
            //     }
            // });
            // return Object.assign({}, state, {billDetail:itemData},{billDetailData:allData});
            break;
        default:
            return state;
            break;
    }
};

export default ShowBill;