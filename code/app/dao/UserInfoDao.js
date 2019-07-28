/**
 * Created by coatu on 2016/12/26.
 */
import {
    API_ALERABYID,
    API_BINDUSERINFO,
    API_BUYERGRADE,
    API_CODE,
    API_COMPLEUSERINFO,
    API_GETSYSDICTIONARY,
    API_IMUNREADYZCHATMSGCOUNT,
    API_ISMESSAGECOUNT,
    API_MERCHANTSERACHCOMPANY,
    API_MESSAGEISREAD,
    API_PWDLOGIN,
    API_REGISTER,
    API_RESETPWD,
    API_RETIEVEASSWORD,
    API_SMSAUTH,
    API_SYSTEM_AGREEMENT,
    API_WECHATAUTH
} from './API_Interface';
import Util from '../common/Util';

//我的私聊未读消息
export function getUnReadYzChatMsgCount(callback, failCallback) {
    return getNetWork(API_IMUNREADYZCHATMSGCOUNT, {}, callback, failCallback);
}

/*注册*/
export function Register(data, callback, failCallback) {
    return getNetWork(API_REGISTER, data, callback, failCallback);
}

//登录
export function Login(data, callback, failCallback) {
    getNetWork(API_PWDLOGIN, data, callback, failCallback);
}

//微信 认证 code
export function WechatAuth(data, callback, failCallback) {
    getNetWork(API_WECHATAUTH, data, callback, failCallback);
}

//绑定用户信息
export function BindUserInfo(data, callback, failCallback) {
    getNetWork(API_BINDUSERINFO, data, callback, failCallback);
}

//去完善用户信息
export function CompleUserInfo(data, callback, failCallback) {
    getNetWork(API_COMPLEUSERINFO, data, callback, failCallback);
}

//获取用户等级
export function BuyerGrade(data, callback, failCallback) {
    getNetWork(API_BUYERGRADE, data, callback, failCallback);
}

//根据用户id获取买家等级和销售区域
export function queryBuyerGradeAndAreaIdById(data, callback, failCallback) {
    getNetWork(API_ALERABYID, data, callback, failCallback);
}

//用户服务协议
export function userAgreementById(data, callback, failCallback) {
    getNetWork(API_SYSTEM_AGREEMENT, data, callback, failCallback);
}


//短信验证码
export function VerificationCodeById(data, callback, failCallback) {
    getNetWork(API_CODE, data, callback, failCallback);
}

//重置密码
export function resetPwdById(data, callback, failCallback) {
    getNetWork(API_RESETPWD, data, callback, failCallback);
}

//短信验证码登录
export function SmsAuthById(data, callback, failCallback) {
    getNetWork(API_SMSAUTH, data, callback, failCallback);
}

//短信验证
export function retrievePasswordById(data, callback, failCallback) {
    getNetWork(API_RETIEVEASSWORD, data, callback, failCallback);
}

//获取未读消息数量
export function messageCountById(data, callback, failCallback) {
    getNetWork(API_ISMESSAGECOUNT, data, callback, failCallback);
}

//获取已读消息数量
export function readMessageCountById(data, callback, failCallback) {
    getNetWork(API_MESSAGEISREAD, data, callback, failCallback);
}
//
// //职位接口
// export function getSysDictionaryData(data, callback, failCallback) {
//     getNetWork(API_GETSYSDICTIONARY, data, callback, failCallback);
// }

//模糊查询公司名称
export function getSearchCompany(data, callback, failCallback) {
    getNetWork(API_MERCHANTSERACHCOMPANY, data, callback, failCallback);
}


function getNetWork(url, data, callback, failCallback) {
    Util.POST(url, data, 0, (res) => {
        if (res.code === '200') {
            callback(res.result);
        } else {
            failCallback(res);
        }
    }, (error) => {
        failCallback(error);
        console.log(error);
    })
}