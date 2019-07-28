// /** 全局app
//  * Created by coatu on 2016/12/21.
//  */
// import React, {Component} from "react";
// import {AppState, AsyncStorage, Navigator, Platform, StatusBar, StyleSheet, View} from "react-native";
// import BackKey from "../common/BackKey";
// import JPushModule from "jpush-react-native";
// import WeclomeView from "./weclome/WeclomeView";
// import MobclickAgent from "rn-umeng";
// import {chatListen} from "../chat/utils/ChatUtils";
// import {setChatPage} from "../chat/dao/ChatDao";
//
// let _navigator;
// let BadgeAndroid = (Platform.OS === 'ios' ? '' : require('react-native-android-badge'));
//
// class AppContainer extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         this.state = {ImUserInfo: {}};
//         // 初始环信
//         this.renderScence = this.renderScence.bind(this);
//         MobclickAgent.startWithAppkey("57e9fecf67e58e61dd0024fd");
//         if (Platform.OS == 'android') {
//             JPushModule.initPush();
//             console.log("JPushModule.initPush();--");
//         }
//     }
//
//     componentDidMount() {
//         this.getUserInfoSubmit(true);
//         AppState.addEventListener('change', this._handleAppStateChange);
//         // if (Platform.OS === 'android') {
//         //     JPushModule.initPush();
//         if (Platform.OS == 'android') {
//             BackKey.addBackAndroidListener(_navigator);
//             JPushModule.notifyJSDidLoad();
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
//         }
//     }
//
//     componentWillUnmount() {
//         AppState.removeEventListener('change', this._handleAppStateChange);
//         if (Platform.OS === 'android') {
//             BackKey.removeBackAndroidListener();
//         }
//     }
//
//     configureScene() {
//         // return Navigator.SceneConfigs.PushFromRight;
//         let conf = Navigator.SceneConfigs.PushFromRight;
//         conf.gestures = null;
//         return conf;
//     }
//
//     renderScence(route, navigator) {
//         let Component = route.component;
//         _navigator = navigator;
//         chatListen(_navigator, this.props);
//         return (
//             <Component navigator={navigator} route={route}/>
//         )
//     }
//
//     /* hidden={true}
//      animated={true}   backgroundColor={Platform.OS==='ios'?'white':'black'}*/
//     render() {
//         AsyncStorage.setItem(WEBIMTOKEN, JSON.stringify(''));
//         return (
//             <View style={{flex: 1}}>
//                 <StatusBar
//                     backgroundColor='transparent'
//                     barStyle="light-content"
//                     translucent={true}
//                     animated={true}
//                     hidden={false}
//                     networkActivityIndicatorVisible={false} //设置状态栏上面的网络进度菊花,仅支持iOS
//                     showHideTransition='slide' //显隐时的动画效果.默认fade
//                 />
//                 <Navigator
//                     ref='navigator'
//                     initialRoute={{
//                         name: 'WeclomeView',
//                         component: WeclomeView,
//                     }}
//                     configureScene={this.configureScene}
//                     renderScene={this.renderScence}
//                     style={styles.navigatorStyle}
//                 />
//             </View>
//         )
//     }
//
//     getUserInfoSubmit(flag) {
//         if (this.state.ImUserInfo&&this.state.ImUserInfo.imusername) {
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
//
//     }
//
//     tellPosition(flag, item) {
//         let data = {"imusername": item ? item.imusername : this.state.ImUserInfo.imusername, "isChatUI": flag};
//         setChatPage(data, (callBack) => {
//         }, (error) => {
//         })
//     }
//
//     _handleAppStateChange = (nextAppState) => {
//         if (nextAppState != null && nextAppState === 'active') {
//             // alert('我现在在前台');
//             //如果是true ，表示从后台进入了前台 ，请求数据，刷新页面。或者做其他的逻辑
//             if (this.flage) {
//                 //这里的逻辑表示 ，第一次进入前台的时候 ，不会进入这个判断语句中。
//                 // 因为初始化的时候是false ，当进入后台的时候 ，flag才是true ，
//                 // 当第二次进入前台的时候 ，这里就是true ，就走进来了。
//
//                 //测试通过
//                 // alert("从后台进入前台");
//
//                 this.getUserInfoSubmit(true);
//                 // 这个地方进行网络请求等其他逻辑。
//             }
//             this.flage = false;
//         } else if (nextAppState != null && nextAppState === 'background') {
//             // console.log('我现在在后台');
//             if (Platform.OS === 'ios') {
//                 JPushModule.setBadge(0, (cb) => {
//                 })
//             }else {
//                 //如果 是Android 那么我们在跳转聊天的时候，判断未读消息是否有，如果有直接对lauchicon上的小红点数量进行替换
//                 // AsyncStorage.getItem(NOMESSAGECOUNT, (error, res) => {
//                 //     if (res) {
//                 //         let badge = JSON.parse(res);
//                 //         BadgeAndroid.setBadge(badge);
//                 //         AsyncStorage.setItem(AndroidBadge, JSON.stringify(badge));
//                 //     }else {
//                         BadgeAndroid.setBadge(0);
//                     // }
//                 // })
//             }
//             this.flage = true;
//             this.getUserInfoSubmit(false);
//         }
//     };
// }
// const styles = StyleSheet.create({
//     navigatorStyle: {
//         flex: 1,
//     }
// });
//
//
// export default AppContainer;