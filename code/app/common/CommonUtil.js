import MD5 from "./Md5";
import React from "react";
import {Alert, AsyncStorage, Dimensions, PixelRatio, Platform} from "react-native";
import {getQiuNiuDomainData} from '../dao/QiniuDao'
import {PhoneById} from "../dao/FindDao";

const deviceH = Dimensions.get('window').height;
const deviceW = Dimensions.get('window').width;

const basePx = 375;


//密码加密
export const PwdChange = (pwd) => {
    // let password = item.substr(0,27);
    return MD5.hex_md5(pwd);
};

//随机一个id
export function randomID() {
    let num = new Date().getTime().toString() + Math.random();
    return MD5.hex_md5(num);
}

export let pwdInspect = /^[a-zA-Z0-9_]{6,16}$/;
export let phoneInspect = /^0?1[0-9][0-9]\d{8}$/;

// console.prototype.log = function(...args){
//     return Debug&&console.log(...args);
// }
/**
 * 替换 A.replaceAll中的s1为s2
 * @param s1  被替换掉的内容
 * @param s2  替换的内容
 * @returns {string}
 */
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
};

/**
 *  对Date的扩展，将 Date 转化为指定格式的String
 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 例子：
 (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 调用
 var time1 = new Date().Format("yyyy-MM-dd");
 var time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");
 */
Date.prototype.Format = function (fmt = "yyyy-MM-dd hh:mm:ss") { //author: meizz
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};


/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern = function (fmt = "yyyy-MM-dd HH:mm:ss") {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    let week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

/**
 * 去空格
 * @param str
 * @returns {void|*|string|XML}
 */
export function trimStr(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 判断对象是否为空
 * @param obj
 * @returns {boolean}  true  代表是空的。  false 代表非空
 */
export function isEmptyObject(obj) {
    if (obj != null && obj.constructor === String) {
        let temp = trimStr(obj);
        if (!temp || temp == '' || temp == null || temp == undefined) {
            return true;
        } else {
            return false;
        }
    } else {
        for (let name in obj) {
            return false;
        }
        return true;
    }
}

//弹框
export const Alerts = (content, title = "", onPress,isCancelable) => {
    Alert.alert(
        title,
        content,
        [
            {text: '确定', onPress: onPress || null},
        ], isCancelable&&Platform.OS === 'android' ? {cancelable: false} : {})
};

export const ShowTwoButtonAlerts = (title, content, onPress, sureTxt='确定',cancelTxt = '取消') => {
    Alert.alert(title, content, [
        {text: cancelTxt, onPress: () => console.log('Cancel Pressed!')},
        {text: sureTxt, onPress: onPress},])
};


//获取当前的时间戳
export const getTimerYYMMDD = (timStr, type) => {

    var tim = new Date(parseInt(timStr)); ////时间戳你自已取的值
    var year = tim.getFullYear(); //年
    var month = tim.getMonth() + 1; //月
    month = month < 10 ? '0' + month : month;
    var day = tim.getDate();//日
    day = day < 10 ? '0' + day : day;
    var h = tim.getHours() + ':';
    var m = tim.getMinutes() + ':';
    var s = tim.getSeconds();

    if (type === 1) {
        return year + '-' + month + '-' + day + ' ' + h + m + s;
    } else if (type === 2) {
        return year + '年' + month + '月' + day + '日';
    } else
        return year + '-' + month + '-' + day;
};

export const Get = (key) => {
    AsyncStorage.getItem(key, (error, id) => {
        return JSON.parse(id)
    })
};
export const DeviceStorage = {

    //本地存储 (保存)
    save: (key, value) => {
        return AsyncStorage.setItem(key, JSON.stringify(value))
    },

//读取
    Get: (key) => {
        return AsyncStorage.getItem(key, (error, id) => {
            return JSON.parse(id);
        });
    },

//更新
    Update: (key, value) => {
        DeviceStorage.get(key).then((item) => {
            value = typeof value === 'string' ? value : Object.assign({}, item, value);
            return AsyncStorage.setItem(key, JSON.stringify(value));
        });
    },

//删除
    Delete: (key) => {
        return AsyncStorage.removeItem(key)
    },
    DeleteAll: () => {
        AsyncStorage.getAllKeys((error, keys) => {
            // for (let refreshQuestionList in keys) {//比下面map 慢 1s
            keys.map((str, index) => {
                if (str.contains("keyaa")) {
                    AsyncStorage.removeItem(str);
                } else {
                }
            })
        });
    }
};


//去重
export function DuplicateRemoval(item) {
    let json = {}, res = [];
    if (item) {
        for (let i = 0; i < item.length; i++) {
            if (!json[item[i]]) {
                res.push(item[i]);
                json[item[i]] = 1;
            }
        }
        return res
    }
}

//对比js对象里面的某一个属性
export function compare(propertyName) {
    return function (object1, object2) {
        let value1 = object1[propertyName];
        let value2 = object2[propertyName];
        if (value2 < value1) {
            return 1;
        } else if (value2 > value1) {
            return -1;
        } else {
            return 0;
        }
    };
    //使用方法
    // data.sort(compare("age"));
    // console.log(data);
}


//根据手机屏幕适配文字大小
export function px2dp(px) {
    if (Platform.OS === 'ios') {
        return px * deviceW / basePx
    }
    if (Platform.OS === 'android') {
        // let fontSizeScaler = PixelRatio.get() / PixelRatio.getFontScale();
        return px * PixelRatio.getFontScale()
    }
    return px * deviceW / basePx
}
export function dp2px(dp) {
    if (Platform.OS === 'ios') {
        return dp/ deviceW *basePx
    }
    if (Platform.OS === 'android') {
        // let fontSizeScaler = PixelRatio.get() / PixelRatio.getFontScale();
        return dp / PixelRatio.getFontScale()
    }
    return dp / deviceW * basePx
}

//根据空格截取字符串
export function subString(item) {
    var str;
    str = item.split(' ');//先按照空格分割成数组
    str.pop();//删除数组最后一个元素
    str = str.join(' ');//在拼接成字符串
    return str
}

export let CustomMobile = '021-2357-1211';

export function CustomPhone(callBack) {
    AsyncStorage.getItem("CustomPhone", (err, resu) => {
        if (err) {
            phone(callBack);
        } else {
            if (resu) {
                callBack(resu);
                CustomMobile = resu;
            } else {
                phone(callBack);
            }
        }
    })
}

let phone = (callBack) => {
    PhoneById((res) => {
        AsyncStorage.setItem("CustomPhone", res, (err) => {
        });
        callBack(res);
        CustomMobile = res;
    }, () => {
        callBack(CustomMobile)
    })
};

//获取域名的接口
export function Domain(callBack, type) {
    let data = {};
    if (type && type == 1) {
        haveRes(data, callBack);
    } else {
        AsyncStorage.getItem("Domain", (err, resu) => {
            if (err) {
                haveRes(data, callBack);
            } else {
                resu = JSON.parse(resu);
                if (resu) {
                    if (resu.isDebug != Debug) {
                        haveRes(data, callBack);
                    }
                    callBack(resu.data);
                } else {
                    haveRes(data, callBack);
                }
            }
        })
    }
}

function haveRes(data, callBack) {
    getQiuNiuDomainData(data, (res) => {
        if (!res) {
            res = domainObj;
        }
        let acd = {};
        acd["isDebug"] = Debug;
        acd["data"] = res;
        AsyncStorage.setItem("Domain", JSON.stringify(acd), (err) => {
        });
        callBack(res)
    }, (err) => {
        callBack(domainObj)
    })
}


//图片处理
export function AvatarStitching(image, domainObj) {//是否拼接-640x640
    let thumb;
    if (image && domainObj) {
        if (typeof (image) === 'string' && image.indexOf("[") > -1) {
            let thumbArray = JSON.parse(image);
            for (let i = 0; i < thumbArray.length; i++) {
                let url = thumbArray[i].url;
                if (url !== '[]' && url !== '') {
                    thumb = domainObj + thumbArray[i].key + '-200x200';
                }
            }
        }
    } else {
        thumb = image ? `${domainObj}${image}` : "";
    }
    return thumb;
}

export function ImageStitching(image, domainObj, isJoin = false) {//是否拼接-640x640
    let thumb;
    if(domainObj) {

    }
    if (image && domainObj) {
        let thumbArray = JSON.parse(image);
        for (let i = 0; i < thumbArray.length; i++) {
            let url = thumbArray[i].url;
            if (url !== '[]' && url !== '') {
                thumb = `${domainObj}${url}`;
                if (isJoin) {
                    thumb = Debug ? thumb : `${thumb}-200x200wsy`;
                }
            }
        }
    }
    return thumb;
}

export const domainObj = Debug ? {
        prd: 'http://qntest.images.youzhongyouliao.com/',
        brand: 'http://qntest.images.youzhongyouliao.com/',
        avatar: 'http://avatar.qntest.youzhongyouliao.com/',
        info: 'http://info.qntest.youzhongyouliao.com/'
    } :
    {
        prd: 'http://prod.img.youzhongyouliao.com/',
        brand: 'http://prod.img.youzhongyouliao.com/',
        avatar: 'http://avatar.img.youzhongyouliao.com/',
        info: 'http://info.img.youzhongyouliao.com/'
    };

//弹框
export function LoginAlerts(navigation, params = {}, okOnPress, title = '登录才能操作哦！', content = '确定去登录？') {
    Alert.alert(
        title,
        content,
        [
            {text: '取消', onPress: () => console.log('取消')},
            {text: '确定', onPress: okOnPress ? okOnPress : () => pushToLogin(navigation, params)},
        ])
}

/*
* 深拷贝*/
export function cloneObj(obj) {
    let str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else {
        for (let i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
}

export function pushToLogin(navigation, params = {}) {
    navigation.navigate('LoginView', Object.assign({
        title: '登录',
        rightTitle: '注册',
        isReLogin: false,
    }, params))
}

/**
 *
 * @param title 标题
 * @param content  内容
 * @param type  为1代表网页  为2代表问答
 * @param style
 * @returns {string}
 * @constructor
 */
export function HTMLSource(title, content, type = 1, style = `<style> input{font-size: 12px;} div{font-size: 14px;}</style>`) {
    content = Platform.OS == 'ios' ? ` <div class="article--content">
                    ${content}
                </div>` : ` <div class="article--content" onclick="postQuestion('-1','BigView')">
                    ${content}
                </div>`;
    return `
            <!DOCTYPE html>
            <html lang="en">
           ${style}
            <body>
            ${type != 1 ? `<p style="font-size: medium;font-weight: bold">${title}</p>` : `<h3>${title}</h3>`}
            
               ${content}
               
                <script>
             function postQuestion(id,type) {
                var data = {
                    'id':id,
                    'type':type,
                };
                window.postMessage&&window.postMessage(JSON.stringify(data))
                }
                function jumpFromType(type,params) {
                var dataObj = {
                    'params':params,
                    'type':type,
                };
                window.postMessage&&window.postMessage(JSON.stringify(dataObj))
                }
            </script>
         </body>
            </html>`;
}


export function diffObj(obj1,obj2){
    let o1 = obj1 instanceof Object;
    let o2 = obj2 instanceof Object;
    if(!o1 || !o2){/*  判断不是对象  */
        return obj1 === obj2;
    }

    if(Object.keys(obj1).length !== Object.keys(obj2).length){
        return false;
        //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
    }

    for(let attr in obj1){
        let t1 = obj1[attr] instanceof Object;
        let t2 = obj2[attr] instanceof Object;
        if(t1 && t2){
            return diffObj(obj1[attr],obj2[attr]);
        }else if(obj1[attr] !== obj2[attr]){
            return false;
        }
    }
    return true;
}


/**
 * .toFixed(2) 保留两位小数
 * 将价格更改为科学计数
 * @param num
 * @returns {*}
 */
export function formatCurrency(num = 0) {
    if (num && num > 0) {
        // console.log("--------------------------------------",num);
        // num = num.toFixed(2);
        //将num中的$,去掉，将num变成一个纯粹的数据格式字符串
        num = num.toString().replace(/\$|\,/g, '');
        //如果num不是数字，则将num置0，并返回
        if ('' == num || isNaN(num)) {
            return 'Not a Number ! ';
        }
        //如果num是负数，则获取她的符号
        let sign = num.indexOf("-") > 0 ? '-' : '';
        //如果存在小数点，则获取数字的小数部分
        let cents = num.indexOf(".") > 0 ? num.substr(num.indexOf(".")) : '';
        cents = cents.length > 1 ? cents : '';//注意：这里如果是使用change方法不断的调用，小数是输入不了的
        //获取数字的整数数部分
        num = num.indexOf(".") > 0 ? num.substring(0, (num.indexOf("."))) : num;
        //如果没有小数点，整数部分不能以0开头
        if ('' == cents) {
            if (num.length > 1 && '0' == num.substr(0, 1)) {
                return 'Not a Number ! ';
            }
        }
        //如果有小数点，且整数的部分的长度大于1，则整数部分不能以0开头
        else {
            if (num.length > 1 && '0' == num.substr(0, 1)) {
                return 'Not a Number ! ';
            }
        }
        //针对整数部分进行格式化处理，这是此方法的核心，也是稍难理解的一个地方，逆向的来思考或者采用简单的事例来实现就容易多了
        /*
         也可以这样想象，现在有一串数字字符串在你面前，如果让你给他家千分位的逗号的话，你是怎么来思考和操作的?
         字符串长度为0/1/2/3时都不用添加
         字符串长度大于3的时候，从右往左数，有三位字符就加一个逗号，然后继续往前数，直到不到往前数少于三位字符为止
         */
        for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
            num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        }
        //将数据（符号、整数部分、小数部分）整体组合返回
        return (sign + num + cents);
    }
    return num;
}
