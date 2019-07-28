/**
 * 分级下拉Dao
 * Created by Monika on 2018/4/19.
 */

import { API_QUERYLINKMANJOBTREE} from "./API_Interface";
import Util from "../common/Util";


//获取职位下拉
export function getQueryLinkManJobTree(navigation = 0, callback = () => {
}, failCallback = () => {
}) {
    getNetWork(API_QUERYLINKMANJOBTREE, {parentKey: "merchantUserJob"}, navigation, callback, failCallback)
}

function getNetWork(url, data, navigation, callback, failCallback) {
    Util.POST(url, data, navigation, (res) => {
        if (res.code === '200') {
            callback(res.result);
        } else {
            failCallback(res);
        }
    }, (error) => {
        failCallback(error);
    })
}