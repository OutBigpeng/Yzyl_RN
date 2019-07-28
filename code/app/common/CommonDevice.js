/**
 * Created by coatu on 2016/12/21.
 */
import React from 'react';
import {Dimensions, Platform} from 'react-native';

import Loading from "./Loading";
import {
    Alerts,
    AvatarStitching,
    compare,
    DeviceStorage,
    Domain,
    domainObj,
    DuplicateRemoval,
    ImageStitching,
    isEmptyObject,
    LoginAlerts,
    ShowTwoButtonAlerts,
    phoneInspect,
    pwdInspect,
    px2dp,
    subString,
    trimStr
} from './CommonUtil';
import {toastLong, toastShort} from './ToastUtils';
import MobclickAgent from 'rn-umeng';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import _ from "underscore";
import TransformView from './TransformView';
import {Colors, Fonts, Metrics} from '../themes';
import {scaleSize} from "./ScreenUtil";

global.NOMESSAGECOUNT = 'NOMESSAGECOUNT';//未读消息数
global.AndroidBadge = 'AndroidBadge';
global.USERINFO = 'USERINFO';//用户登录的所有信息
// global.BUYINFO = 'BUYINFO';//通过id获取的买家等级和销售区域信息
global.BUYERGRADE = 'BUYERGRADE';//用户等级
global.USERID = 'USERID';//用户id  直接用
global.ADDRESSSOUCE = 'ADDRESSSOUCE';//地址源
global.USERANDPWD = 'USERANDPWD';//保存用户名和密码
global.ISSHOWCART = false;// false 显示收藏  true 显示购物车
global.WEBIMTOKEN = 'WEBIMTOKEN';

const window = Dimensions.get('window');
let PlatfIOS = Platform.OS == 'ios';

let webScript = ` <script>
                function postQuestion(id,type) {
                    var data = {
                        id:id,
                        type:type
                    };
                 window.postMessage&& window.postMessage(JSON.stringify(data))
                }
            </script>
`;


const Sizes = {
    navSize: 18,//顶部导航栏栏目名称,18
    titleSize: 16,//主要用于正文标题，主按妞文字16
    listSize: 14,//区域标题性文字，列表名称14
    searchSize: 12,//正文及内容型文字，搜索条件文字12
    screenSize: 11,//筛选框文字11
    otherSize: 10//说明文，日期，提示文，辅助性文字10
};

// const colors = {
//     BGColor: '#f0f0f0',//背景色
//     whiteColor: '#fff',
//     line: '#dddddd',//分割线的颜色
//     redColor: '#e4393c',//全局红色包括字体的红色
//     titleColor: '#333333',//标题的颜色
//     contactColor: '#666666',//内容颜色
//     inputColor: '#bbbbbb',//input提示文字颜色
//     ExplainColor: '#999999',//辅助性文字的颜色
//     clear: 'rgba(0,0,0,0)',
//     transparent: 'rgba(0,0,0,0)',
// };
module.exports = {
    deviceWidth: window.width,
    deviceHeight: window.height,
    statuBar: Platform.OS === 'ios' ? 0 : 25,
    actionBar: Platform.OS === 'ios' ? 64 : 48,
    isEmptyObject, toastShort, toastLong, MobclickAgent,
    trimStr,
    connect, bindActionCreators, _, Loading,
    BGColor: '#f0f0f0',
    BGTextColor: '#e4393c',
    borderColor: '#dddddd',
    borderRadius: 4,
    // commonMobile:CustomMobile,
    textHeight: scaleSize(100),
    commentWord: 1000,
    DeviceStorage,
    iosDownLoadUrl: 'https://itunes.apple.com/cn/app/you-zhong-you-liao/id1089097137?mt=8',
    pwd: pwdInspect,
    phoneInspect: phoneInspect,
    MobileAlerts: ShowTwoButtonAlerts,
    DuplicateRemoval, compare, TransformView,
    px2dp, Colors, Metrics,
    subString, PlatfIOS,
    defName: '佚名',
    Domain, ImageStitching,
    AvatarStitching,
    LoginAlerts,
    Fonts,
    Sizes,
    domainObj,
    Alerts,
    webScript
};


