/**用户发票信息请求
 * Created by Monika on 2016/12/27.
 */
import {API_BILL_LIST, API_BILL_SHOW,API_BILL_SETTDEFAULT} from "./API_Interface";
import Util from '../common/Util';
import {isEmptyObject,toastShort} from "../common/CommonDevice";

export function getBillList(userid,navigation,callback,failCallBack) {
    let data = {'userid': userid};
    Util.POST(API_BILL_LIST, data,navigation, (backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    toastShort(backResult.msg);
                    failCallBack(backResult.msg);
                    break;
            }
        }
    },(err)=>{
        toastShort('网络发生错误,请重试!');
        failCallBack();
    });
}

export function getBillShow(userid,id,navigation,callback,failCallBack) {
    let data = {'userid':userid,'id':id};
    Util.POST(API_BILL_SHOW, data,navigation, (backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback(backResult.result);
                    break;
                default:
                    toastShort(backResult.msg);
                    failCallBack(backResult.msg);
                    break;
            }
        }
    },(err)=>{
        toastShort('网络发生错误,请重试!');
        failCallBack();
    });
}

export function getBillSetDefault(data,navigation,callback,failCallBack) {
    // let data = {'userid':userid,'id':id,'isdefault':isdefault};
    Util.POST(API_BILL_SETTDEFAULT, data,navigation, (backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback('ok');
                    break;
                default:
                    toastShort(backResult.msg);
                    failCallBack(backResult.msg);
                    break;
            }
        }
    },(err)=>{
        toastShort('网络发生错误,请重试!');
        failCallBack();
    });
}


