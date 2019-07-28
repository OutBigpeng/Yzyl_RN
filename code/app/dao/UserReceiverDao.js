/**
 * 收货人Dao
 * Created by Monika on 2016/12/27.
 */
import {API_ADDRESS} from "./API_Interface";
import Util from "../common/Util";
import {isEmptyObject, toastShort} from "../common/CommonDevice";

/**
 * 列表
 * @param url
 * @param userId
 * @param callback
 */
export function getReceiverList(url, userId, navigation, callback, failCallBack) {
    let data = {'userId': userId};
    Util.POST(url, data, navigation, (backResult) => {
        let code = backResult.code;
        switch (code) {
            case '200':
                callback(backResult.result);
                break;
            default:
                toastShort(backResult.msg);
                break;
        }
    }, (err) => {
        toastShort('网络发生错误,请重试!');
        failCallBack();
    });
}

/**
 编辑收货人
 let data = {'id':id, 'userId':userId,'name':name, 'province':province, 'pcc':pcc,
        'county':county, 'provinceId':provinceId, 'cityId':cityId, 'countyId':countyId,
        'address':address,'mobile':mobile,  'isSelect':isSelect};
 * @param userId
 * @param callback
 */
export function getReceiverEdit(url, data, navigation, callback, failCallBack) {
    Util.POST(url, data, navigation, (backResult) => {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback('ok');
                    break;
                default:
                    toastShort(backResult.msg);
                    break;
            }
        }
    }, (err) => {
        toastShort('网络发生错误,请重试!');
        failCallBack();
    });
}

/**
 * 添加
 *  "userId":2,
 "name":"华志宾",
 "province":"北京",
 "pcc":"北京市",
 "county":"东城区",
 "provinceId":1,
 "cityId":2,
 "countyId":3,
 "address":"天安门广场",
 "mobile":"15026739232",
 "isSelect":1

 let data = {'userId':userId,'name':name, 'province':province, 'pcc':pcc,
        'county':county, 'provinceId':provinceId, 'cityId':cityId, 'countyId':countyId,
        'address':address,'mobile':mobile,  'isSelect':isSelect};
 * @param data
 * @param callback
 */
export function getReceiverAdd(url, data, navigation, callback, failCallBack) {
    Util.POST(url, data, navigation, (backResult) => {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    toastShort(backResult.msg);
                    break;
            }
        }
    }, (err) => {
        toastShort('网络发生错误,请重试!');
        failCallBack();
    });
}

/**
 * 删除
 * @param url
 * @param userId
 * @param id
 * @param callback
 */
export function getReceiverDel(url, userId, id, navigation, callback, failCallBack) {
    let data = {'userId': userId, 'id': id};
    Util.POST(url, data, navigation, (backResult) => {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback('ok');
                    break;
                default:
                    toastShort(backResult.msg);
                    break;
            }
        }
    }, (err) => {
        toastShort('网络发生错误,请重试!');
        failCallBack();
    });
}

/**
 * 查询详情
 * @param url
 * @param userId
 * @param id
 * @param callback
 */
export function getReceiverShow(url, userId, id, callback, failCallBack) {
    let data = {'userId': userId, 'id': id};
    Util.POST(url, data, 0, (backResult) => {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    toastShort(backResult.msg);
                    break;
            }
        }
    }, (err) => {
        toastShort('网络发生错误,请重试!');
        failCallBack();
    });
}

/**
 * 设置默认
 * @param url
 * @param userId
 * @param id
 * @param callback
 */
export function getReceiverSetDefault(url, userId, id, navigation, callback, failCallBack) {
    let data = {'userId': userId, 'id': id};
    Util.POST(url, data, navigation, (backResult) => {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback('ok');
                    break;
                default:
                    toastShort(backResult.msg);
                    break;
            }
        }
    }, (err) => {
        toastShort('网络发生错误,请重试!');
        failCallBack();
    });
}

/**
 * 查询全部地址
 *
 */
export function getAddressDataList(callback, failCallback) {
    return getAddressDataListData(callback, failCallback);
}

function getAddressDataListData(callback, failCallback) {
    Util.POST(API_ADDRESS, {}, 0, (res) => {
        if (res.code === '200') {
            callback(res.result);
        } else {
            failCallback(res);
        }
    }, (error) => {
        failCallback(error);
    })
}

// export function getAddressDataList(callback, failCallBack) {
//     let data = {};
//     Util.POST(API_ADDRESS, data, 0, (backResult) => {
//         if (!isEmptyObject(backResult)) {
//             let code = backResult.code;
//             switch (code) {
//                 case '200':
//                     callback(backResult.result);
//                     break;
//                 default:
//                     toastShort(backResult.msg);
//                     break;
//             }
//         }
//     }, (err)=>{
//         toastShort('网络发生错误,请重试!');
//         failCallBack();
//     });
// }
/**
 * 编辑地址
 * @param area
 * @returns {Array}
 */
export function createAreaData(area) {
    let data = [];
    let len = area.length;
    for (let i = 0; i < len; i++) {
        let cityLen = area[i]['c'];
        let city = [];
        for (let j = 0; j < cityLen.length; j++) {
            let _city = {};
            let qu = [];
            let shi = cityLen[j]['c'];
            for (let k = 0; k < shi.length; k++) {
                qu.push(shi[k]['n'])
            }
            shi = qu;
            _city[cityLen[j]['n']] = shi;
            city.push(_city);
        }
        let _data = {};
        _data[area[i]['n']] = city;
        data.push(_data);
    }
    return data;
}
