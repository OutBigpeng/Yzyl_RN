import React, {Component} from 'react';
import {BackHandler, DeviceEventEmitter, Platform} from 'react-native';
import SplashScreen from "react-native-splash-screen";
import JPushModule from "jpush-react-native";
import *as LoginAction from "../../actions/LoginAction";
import *as DiscussAction from '../../actions/DiscussAction'
import *as FindAction from "../../actions/FindAction";
import *as TabSwitchAction from "../../actions/TabSwitchAction";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TabBarView from '../../TabHome';
import MobclickAgent from "rn-umeng";
import {NavigationActions} from 'react-navigation';
import {PlatfIOS, toastShort} from "../../common/CommonDevice";
import {CustomPhone} from "../../common/CommonUtil";
import * as DeviceInfo from "react-native-device-info";

let WeChat = require('react-native-wechat');
let type = 'sys';
global.ThirdPartyEnum = {
    MOBCLICKAGENTKEY: '57e9fecf67e58e61dd0024fd',
    WECHATID: 'wxe6fb2ea13a5a9775',
    WECHATSECRET: 'c2b341cc539e17b33f1af863269cb455'
};

// let NativeCommonTools = NativeModules.BackKey;
class WelcomeView extends Component {

    onBackAndroid = () => {
        const nav = this.props.nav;
        if (nav.routes && nav.routes.length > 1) {
            if (nav.routes[nav.routes.length - 1].routeName !== "WelcomeView") {
                this.props.navigation.dispatch(NavigationActions.back());
                return true;
            } else {
                return this.exit();
            }
        } else {
            return this.exit();
        }
    };

// 构造
    constructor(props) {
        super(props);
        // 初始状态
        let {state: {params}} = props.navigation;
        let index = params && params.index;
        this.state = {
            isJpush: false,
            pageIndex: index !== undefined && index > -1 ? index : undefined
        };
        this.subscription = DeviceEventEmitter.addListener('LoginExit', () => this.isRefreshLoginState(1));

        MobclickAgent.startWithAppkey(ThirdPartyEnum.MOBCLICKAGENTKEY);
        MobclickAgent.setAppVersion(DeviceInfo.getVersion());

        WeChat.registerApp(ThirdPartyEnum.WECHATID);

        if (Platform.OS === 'android') {
            JPushModule.initPush();
            JPushModule.notifyJSDidLoad((resCode) => {
            })
        }
        CustomPhone(() => {
        })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    componentWillMount() {
        this.props.loginAction.checkLogin();
        this.props.loginAction.reqDomainObj(1);
        this.hindSplash();
    }

    req() {
        // if(this._isMounted) {
        //     let data = Object.assign({
        //         "pageIndex": 1,
        //         "pageSize": 10,
        //     }, {});
        //     this.props.actions.fetchDiscussListMessage('release', data, this.props.navigation, 1, true,'',()=>{
        //     });
        // }
    }

    componentDidMount() {
        this._isMounted = true;
        //
        let {navigation, routes, nav} = this.props;
        if (!PlatfIOS) {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
        JPushModule.addReceiveNotificationListener((map) => {//这个是用来写那个聊天消息和正常消息的message的通知的
            if (PlatfIOS) {
                this.notifyJpush(map.type, 1)
            } else {
                if (map && map.extras) {
                    let temp = JSON.parse(map.extras);
                    if (temp && temp.type) {
                        type = temp.type;
                    }
                    this.notifyJpush(temp.type, 1)
                }
            }
        });

        JPushModule.addReceiveOpenNotificationListener((map) => {
            if (PlatfIOS) {
                this.addListenerResult(map, 2);
            } else {
                if (map && map.extras) {
                    let temp = JSON.parse(map.extras);
                    if (temp && temp.type) {
                        type = temp.type;
                    }
                    this.addListenerResult(temp, 2)
                }
            }
        })
    }

    notifyJpush(name) {
        if (name !== 'chat') {
            DeviceEventEmitter.emit('Jpush', false);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
        JPushModule.addReceiveNotificationListener();
        JPushModule.removeReceiveOpenNotificationListener();
    }


    render() {
        let {state} = this.props.navigation;
        return (
            <TabBarView  {...this.props} index={this.state.pageIndex}/>
        );
    }

    isRefreshLoginState(t) {
        this.props.loginAction.requestLoginOut();
    }

    addListenerResult(temp, type) {//type ==1 是通知 ==2是其他
        if (temp.type) {
            if (temp.type === 'im') {//跳转到大学（以前是技术支持）(现在不需要)
                this.switchPage(3)
            } else if (temp.type === 'chat') {//这是聊天的 聊天需要通知
                if (type === 2) {
                    this.jumpPage(temp.type, temp);
                }
            } else {
                // if (type == 1) {
                //     if (temp.type != 'chat') {
                //         DeviceEventEmitter.emit('Jpush', true)
                //     }
                // } else {
                this.jumpPage(temp.type, temp);
                // }
            }
        } else {//木有类型参数时，跳转到系统消息——我的消息页面
            // if (type == 1) {
            //     if (temp.type == 'chat') {
            //         // DeviceEventEmitter.emit('ChatMsg',true)
            //     } else {
            //         DeviceEventEmitter.emit('Jpush', true)
            //     }
            // } else {
            this.jumpPage("MyMessage");
            // }
        }
    }

    isReJump(name) {
        let {navigation, routes, nav} = this.props;
        // let isReJump = true;//默认为true 可以跳转  false 不在再次跳转同一页面
        /**  || routes[routes.length - 1].routeName == "QuestionDetail"|| routes[routes.length - 1].routeName == "FormulaXNView"|| routes[routes.length - 1].routeName == "CurriculumDetailView"
         * 关于问题详情、课程表等是否重复跳转的问题。如果 当前推出了多条消息，这里可能会是不同的推送。暂时不好判断是否是当前页面的id 。。 所以不做判断
         * */
        return routes && routes[routes.length - 1] && (routes[routes.length - 1].routeName === name)//判断当前是否存在页面，以及当前显示是否为我的消息页面

    }

    jumpPage(name, temp) {
        let {navigation, routes, nav} = this.props;
        switch (name) {
            case 'discuss':
                if (temp && temp.params) {
                    let params = JSON.parse(temp.params);
                    if (params.msgId) {
                        if (params.type !== 'qa') {
                            navigation.navigate('DiscussDetailView', {
                                name: 'DiscussDetailView',
                                title: '详情',
                                msgId: params.msgId,
                                pageParams: "release",
                            });
                        } else {
                            navigation.navigate('DiscussQaDetailView', {
                                name: 'DiscussQaDetailView',
                                title: '详情',
                                msgId: params.msgId,
                                pageParams: "release",
                            });
                        }
                    }
                } else {
                    if (!this.isReJump("MyMessage")) {
                        navigation.navigate("MyMessage", {
                            name: "MyMessage",
                            title: "我的消息",
                            callBack: () => console.log(""),
                        });
                    }
                }
                break;
            case 'yzChat':
                if (temp && temp.params) {
                    let params = JSON.parse(temp.params);
                    params.userId && navigation.navigate('ChatMsg', {
                        personId: params.userId,
                    });
                }
                break;
            case "sys"://我的消息
                if (!this.isReJump("MyMessage")) {
                    navigation.navigate("MyMessage", {
                        name: "MyMessage",
                        title: "我的消息",
                        callBack: () => console.log(""),
                    });
                }
                break;
            case "qa"://跳转问题详情  { extras: '{"params":"184,243","type":"qa"}',alertContent: '您有一条新回复: 垃圾' }
                if (temp && temp.params) {
                    let QuestResult = temp.params.split(",");
                    const {navigate} = this.props.navigation;
                    navigate('QuestionDetail', {
                            title: '问题详情',
                            id: QuestResult[0],
                            callback: () => {
                            },
                            key: 'askQuestion',
                        }
                    );
                }
                break;
            case "formula"://跳转配方页面
                if (temp && temp.params) {
                    let result = temp.params.split(",");
                    navigation.navigate("FormulaXNView", {
                        name: "FormulaXNView",
                        title: result[1] || "配方性能表",
                        id: result[0],
                        rightImageSource: true,
                        isCollection: true,
                    });
                } else {
                    this.switchPage(3)
                }
                break;
            case "course"://跳转课程表
                if (temp && temp.params) {
                    let result = temp.params.split(",");
                    navigation.navigate("CurriculumDetailView", {
                        name: "CurriculumDetailView",
                        title: '课程详情',
                        id: result[0],
                        rightImageSource: true,
                        isCollection: true,
                    });
                } else {
                    this.switchPage(3)
                }
                break;
            case "article":
                if (temp && temp.params) {
                    let result = temp.params.split(",");
                    navigation.navigate('HomeArticleView', {
                        title: '正文',
                        sn: result[0],
                        rightImageSource: true,
                        isRightFirstImage: true,
                        isShare: true,
                        isCollection: true,
                        label: result[1]
                    });
                } else {
                    this.switchPage(0)
                }
                break;
            case "chat":
                if (!this.isReJump("ChatCustom")) {
                    navigation.navigate("ChatCustom", {
                        name: "ChatCustom",
                        title: '客服',
                    });
                }
                break;
            default:
                this.switchPage(0);
                break;
        }
    }

    switchPage(type) {
        const {routes} = this.props;
        if (routes && routes.length > 1) {//切换tab页面。 如果当前tab页面被埋藏。 那么我们返回当前第一个页面，也就是tab 页面。
            this.props.navigation.goBack(routes[1].key);
        }
        this.props.tabSwitchAction.switchTabIndex('switch', type, true);
    }

    hindSplash() {
        this.req();
        setTimeout(() => {
            this.props.findAction.fetchCollectProductCount({}, 0);
            SplashScreen.hide();
        }, 1500);
    }

    exit() {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            BackHandler.exitApp();
            return false;
        }
        this.lastBackPressed = Date.now();
        toastShort('再按一次退出应用');
        return true;
    }
}

export default connect(state => ({
    state: state,
    nav: state.nav,
    routes: state.nav.routes
}), dispatch => ({
    loginAction: bindActionCreators(LoginAction, dispatch),
    findAction: bindActionCreators(FindAction, dispatch),
    tabSwitchAction: bindActionCreators(TabSwitchAction, dispatch),
    actions: bindActionCreators(DiscussAction, dispatch)
}))(WelcomeView);


// // /** 启动页
// //  * Created by coatu on 2016/12/21.
// //  */
// // import React, {Component} from "react";
// // import {
// //     AsyncStorage,
// //     InteractionManager,
// //     NativeAppEventEmitter,
// //     NativeModules,
// //     Platform,
// //     StyleSheet,
// //     View
// // } from "react-native";
// // import {deviceHeight, deviceWidth} from "../../common/CommonDevice";
// // import TabbarView from "../TabBarView";
// // import LoginView from "../../pages/login/LoginView";
// // import MessageView from "../../pages/me/mine/message/MyMessage";
// // import JPushModule from "jpush-react-native";
// // import {ChatLoginAction} from "../../chat/actions";
// // import Store from "../../store/Store";
// //
// // let WeChat = require('react-native-wechat');
// //
// // let SplashScreen = NativeModules.SplashScreen;
// // let isAndroidPush = true;
// // let type = '';
// // export default class WeclomeView extends Component {
// //     // 构造
// //     constructor(props) {
// //         super(props);
// //         // 初始状态
// //         // console.log("我是WeclomeView", this.props.route.appContent);
// //         this.state = {};
// //         this.subscription = '';
// //     }
// //
// //     componentDidMount() {
// //         WeChat.registerApp('wxe6fb2ea13a5a9775');
// //         this.isToken();
// //         if (Platform.OS === 'ios') {
// //             this.iosJpush();
// //         } else {
// //             this.androidJpush();
// //             setTimeout(() => {
// //                 SplashScreen.hide();
// //             }, 2000);
// //         }
// //     }
// //
// //     androidJpush() {
// //         JPushModule.notifyJSDidLoad();
// //         JPushModule.addReceiveOpenNotificationListener((map) => {
// //             if (map && map.extras) {
// //                 let temp = JSON.parse(map.extras);
// //                 if (temp && temp.type) {
// //                     type = temp.type;
// //                 }
// //                 this.addListenerResult(temp);
// //             }
// //         })
// //     }
// //
// //
// //     iosJpush() {
// //         var subscription = NativeAppEventEmitter.addListener(
// //             'OpenNotification',
// //             (notification) => {
// //                 isAndroidPush = false;
// //                 this.addListenerResult(notification)
// //             }
// //         );
// //         // message = NativeAppEventEmitter.addListener(
// //         //     'networkDidReceiveMessage',
// //         //     (message) => this.addListenerResult(message)
// //         // );
// //         // message = NativeAppEventEmitter.addListener(
// //         //     'ebbnnerViewClick',
// //         //     (message) => this.addListenerResult(message)
// //         // );
// //     }
// //
// //     isToken(type) {
// //         const {navigator} = this.props;
// //         AsyncStorage.getItem(USERINFO, (error, id) => {
// //             let data = JSON.parse(id);
// //             if (!data) {
// //                 InteractionManager.runAfterInteractions(() => {
// //                     navigator.resetTo({
// //                         component: LoginView,
// //                         name: 'LoginView',
// //                     });
// //                 });
// //             } else {
// //                 //进入这个页面就去掉接口 登录环信
// //                 this.jumpTabView(type);
// //             }
// //         })
// //     }
// //
// //     jumpTabView(option) {
// //         const {navigator} = this.props;
// //         AsyncStorage.setItem('isAgainLogin', JSON.stringify(''));
// //         Store.dispatch(ChatLoginAction.login(0));
// //         if (option) {
// //             let currentRoutes = navigator.getCurrentRoutes();
// //             if (currentRoutes) {
// //                 let length = currentRoutes.length;
// //                 if (length > 0) {
// //                     console.log("哈哈--length", length);
// //                     let name = currentRoutes[length - 1].name;
// //                     console.log("哈哈-if-option", option);
// //                     if (option && option.type === 'im') {
// //                         console.log("哈哈-if-name", name);
// //
// //                         type = option.type;
// //                         if (name && name != 'ChatMessage') {
// //                             this.pushToDetail(TabbarView, 'TabbarView', 0, type != 'im' ? "CART" : 'FINDSUPPORT')
// //                         }
// //                     } else {
// //                         console.log("哈哈-else-option", option);
// //                         console.log("哈哈-else-option-name", name);
// //                         type = '';
// //                         if (name && name != 'MessageView') {
// //                             this.pushToDetail(MessageView, 'MessageView', 1)
// //                         }
// //                     }
// //                 } else {
// //                     console.log("哈哈-else-length",option);
// //
// //                     if (option && option.type === 'im') {
// //                         this.pushToDetail(TabbarView, 'TabbarView', 0, type != 'im' ? "CART" : 'FINDSUPPORT')
// //                     } else {
// //                         this.pushToDetail(MessageView, 'MessageView', 1)
// //                     }
// //                 }
// //             } else {
// //                 console.log("哈哈-else-currentRoutes",currentRoutes);
// //                 if (option && option.type === 'im') {
// //                     this.pushToDetail(TabbarView, 'TabbarView', 0, type != 'im' ? "CART" : 'FINDSUPPORT')
// //                 } else {
// //                     this.pushToDetail(MessageView, 'MessageView', 1)
// //                 }
// //             }
// //
// //         } else {
// //             this.pushToDetail(TabbarView, 'TabbarView', 0, type != 'im' ? "CART" : 'FINDSUPPORT')
// //         }
// //     }
// //
// //     pushToDetail(component, name, isPush, selectedTab) {
// //         const {navigator} = this.props;
// //         InteractionManager.runAfterInteractions(() => {
// //             if (name === 'MessageView') {
// //                 navigator.push({
// //                     component: component,
// //                     name: name,
// //                     isPush: isPush,
// //                 })
// //             } else {
// //                 navigator.resetTo({
// //                     component: component,
// //                     name: name,
// //                     selectedTab: selectedTab
// //                 })
// //             }
// //
// //         })
// //     }
// //
// //     componentWillUnmount() {
// //         this.timer && clearTimeout(this.timer);
// //     }
// //
// //     render() {
// //         return (
// //             <View />
// //         )
// //     }
// //
// //     addListenerResult(notification) {
// //         this.isToken(notification);
// //     }
// // }
// //
// // const styles = StyleSheet.create({
// //     imageStyle: {
// //         width: deviceWidth,
// //         height: deviceHeight
// //     }
// // });
//
