/**
 * Created by Monika on 2016/9/22.
 */
/*
 使用: 参考链接:http://reactnative.cn/post/480
 1.在首页/homepage页(只需要在全局都存在的页面调用一次监听即可)
 componentDidMount(){
 // 添加返回键监听
 BackHandlerTool.addBackHandlerListener(this.props.navigator);
 }

 componentWillUnmount(){
 // 移除返回键监听
 BackHandlerTool.removeBackHandlerListener();
 }
 说明：BackHandler在iOS平台下是一个空实现，
 所以理论上不做这个Platform.OS === 'android'判断也是安全的。

 2. 某些类自定义返回键操作(即点击返回键弹出一个alert之类的操作)
 在所需类的初始化方法里调用BackHandlerTool.customHandleBack
 栗子:
 constructor(props) {
 super(props);
 BackHandlerTool.customHandleBack(this.props.navigator,() => {
 Alert.alert('提示','您还未保存记录,确定要返回么?',
 [{text:'取消',onPress:() => {}},
 {text:'确定',onPress:() => { this.props.navigator.pop(); }}
 ]);
 // 一定要 return true; 原因上面的参考链接里有
 return true;
 });
 }

 3.某些页面需要禁用返回键
 在nav进行push的时候,设置属性ignoreBack为true 即可
 this.props.navigator.push({
 component: 所需要禁用的类,
 ignoreBack:true,
 });

 */
'use strict';
import React, {BackHandler, NativeModules, Platform} from "react-native";
import {toastLong} from "./CommonDevice";
// 类
let NativeCommonTools = NativeModules.BackKey;
// let handleBack ;
// 类
export default {
    // 监听返回键事件
    addBackHandlerListener() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => {
                // toastShort('点了');
                return this.onBackHandler();
            });
        }
    },

    // 移除监听
    removeBackHandlerListener() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', () => {
            });
        }
    },

// 判断是返回上一页还是退出程序
    onBackHandler(){
        // 当前页面为root页面时的处理
        if (this.lastBackPressed && (this.lastBackPressed + 2000 >= Date.now())) {
            // toastShort('lastBackPressed');
            //最近2秒内按过back键，可以退出应用。
            BackHandler.exitApp();
            NativeCommonTools.onBackPressed();
            return false;
        }
        this.lastBackPressed = Date.now();
        toastLong('再按一次退出应用');
        return true;
    },

// 自定义返回按钮事件
    customHandleBack(navigation, handleBack1){

    },

}