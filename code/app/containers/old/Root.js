// import React, {Component} from "react";
// import {AppState, AsyncStorage, DeviceEventEmitter, Platform, StatusBar, View} from 'react-native'
// import {Provider} from "react-redux";
// import store from "./store/Store";
// import LoginScreen from './containers/LoginScreen';
// import TabBarView from "./containers/Routers";
// import MobclickAgent from "rn-umeng";
// import JPushModule from "jpush-react-native";
// import BackKey from "./common/BackKey";
// import {setChatPage} from "./chat/dao/ChatDao";
// //
// import SplashScreen from 'react-native-splash-screen'
//
// let BadgeAndroid = (Platform.OS === 'ios' ? '' : require('react-native-android-badge'));
// let WeChat = require('react-native-wechat');
//
// export default class Root extends Component {
//
//     _handleAppStateChange = (nextAppState) => {
//         if (nextAppState != null && nextAppState === 'active') {
//             if (this.flage) {
//                 this.getUserInfoSubmit(true);
//             }
//             this.flage = false;
//         } else if (nextAppState != null && nextAppState === 'background') {
//             if (Platform.OS === 'ios') {
//                 JPushModule.setBadge(0, (cb) => {
//                 })
//             } else {
//                 BadgeAndroid.setBadge(0);
//             }
//             this.flage = true;
//             this.getUserInfoSubmit(false);
//         }
//     };
//
//     // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         this.state = {
//             isToken: true,//是否有token
//             loaded: false,//第一次加载时的页面
//             isLogin: false
//         };
//
//         this.subscription = DeviceEventEmitter.addListener('RootView', () => this.isToken(1));
//         MobclickAgent.startWithAppkey("57e9fecf67e58e61dd0024fd");
//         WeChat.registerApp('wxe6fb2ea13a5a9775');
//         if (Platform.OS == 'android') {
//             JPushModule.initPush();
//         }
//     }
//
//     componentDidMount() {
//         this.getUserInfoSubmit(true);
//         AppState.addEventListener('change', this._handleAppStateChange);
//         if (Platform.OS == 'android') {
//             setTimeout(() => {
//                 SplashScreen.hide();
//             }, 2000);
//             BackKey.addBackHandlerListener();
//             JPushModule.notifyJSDidLoad((cb) => {
//             });
//             JPushModule.addReceiveNotificationListener((map) => {
//                 AsyncStorage.getItem(AndroidBadge, (error, res) => {
//                     if (res > 0) {
//                         let badge = JSON.parse(res) + 1;
//                         BadgeAndroid.setBadge(badge);
//                         AsyncStorage.setItem(AndroidBadge, JSON.stringify(badge));
//                     } else {
//                         BadgeAndroid.setBadge(1);
//                         AsyncStorage.setItem(AndroidBadge, JSON.stringify(1));
//                     }
//                 });
//             });
//
//         }
//         this.isToken()//获取token
//     }
//
//     componentWillUnmount() {
//         AppState.removeEventListener('change', this._handleAppStateChange);
//     }
//
//     isToken(type) {
//         if (type == 1) {
//             this.setState({isLogin: true})
//         }
//         AsyncStorage.getItem(USERINFO, (err, id) => {
//             var item = JSON.parse(id);
//             if (item) {
//                 this.setState({
//                     isToken: true,
//                     loaded: true
//                 })
//             } else {
//                 this.setState({
//                     isToken: false,
//                     loaded: true
//                 })
//             }
//         })
//     }
//
//     render() {
//         return (
//             <Provider store={store}>
//                 <View style={{flex: 1}}>
//                     <StatusBar
//                         backgroundColor='black'
//                         barStyle="light-content"
//                         translucent={false}
//                         animated={true}
//                         hidden={false}
//                         networkActivityIndicatorVisible={false} //设置状态栏上面的网络进度菊花,仅支持iOS
//                         showHideTransition='slide' //显隐时的动画效果.默认fade
//                     />
//                     {this.pushToDetail()}
//                 </View>
//             </Provider>
//         );
//     }
//
//     pushToDetail() {
//         if (this.state.isLogin) {
//             if (!this.state.loaded) {
//                 return (
//                     <View/>
//                 )
//             } else if (this.state.isToken) {
//                 return (
//                     <TabBarView/>
//                 )
//             } else {
//                 return (
//                     <LoginScreen/>
//                 )
//             }
//         } else {
//             if (!this.state.loaded) {
//                 return (
//                     <View/>
//                 )
//             } else {
//                 return (
//                     <TabBarView/>
//                 )
//             }
//
//         }
//     }
//
//     getUserInfoSubmit(flag) {
//         if (this.state.ImUserInfo && this.state.ImUserInfo.imusername) {
//             this.tellPosition(flag);
//         } else {
//             AsyncStorage.getItem(USERINFO, (error, result) => {
//                 let item = JSON.parse(result);
//                 if (item) {
//                     this.setState({ImUserInfo: item});
//                     this.tellPosition(flag, item);
//                 }
//             });
//         }
//     }
//
//     tellPosition(flag, item) {
//         let data = {"imusername": item ? item.imusername : this.state.ImUserInfo.imusername, "isChatUI": flag};
//         setChatPage(data, (callBack) => {
//         }, (error) => {
//         })
//     }
// }
//
