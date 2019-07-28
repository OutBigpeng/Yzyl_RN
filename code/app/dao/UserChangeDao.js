/**用户数据修改
 * Created by Monika on 2016/12/27.
 */
'use strict';
import {API_RESETPWD, API_MODIFY_PHONE,API_RETIEVEASSWORD,API_CODE} from "./API_Interface";
import MD5 from "../common/Md5";
import Util from '../common/Util';
import {isEmptyObject,toastShort} from "../common/CommonDevice";


/**
 * 密码短信验证
 * "mobile":"15026739232",
 "smstype":3,
 "vcode":"987392"
 */
export function resetMobile(mobile, smstype, vcode, userid,navigation, callback, failCallback) {
    let data = {"newmobile": mobile, "smstype": smstype, "vcode": vcode,"userid":userid};
   Util.POST(API_MODIFY_PHONE, data, navigation,(backResult)=> {
        if (!isEmptyObject(backResult)) {
            let code = backResult.code;
            switch (code) {
                case '200':
                    callback('ok');
                    break;
                default:
                    toastShort(backResult.msg);
                    failCallback();
                    break;
            }
        }
    },(err)=>{
       toastShort('修改出错');
       failCallback();
   });
}
