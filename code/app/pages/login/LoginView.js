/**
 * Created by coatu on 2016/12/21.
 */
import React, {Component} from "react";
import {AsyncStorage, Image, ScrollView, StyleSheet, Text, TextInput, View,} from "react-native";
import {
    actionBar,
    BGTextColor,
    bindActionCreators,
    borderColor,
    borderRadius,
    connect,
    deviceHeight,
    deviceWidth,
    MobclickAgent,
    PlatfIOS,
    px2dp,
    Sizes,
    textHeight
} from "../../common/CommonDevice";
import Loading from "../../common/Loading";
import CommonLoginButton from "../../component/CommonLoginButton";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {Alerts, cloneObj, DeviceStorage} from "../../common/CommonUtil";
import {scaleSize} from "../../common/ScreenUtil";
import *as LoginAction from "../../actions/LoginAction";
import {WechatAuth} from "../../dao/UserInfoDao";
import * as FindAction from "../../actions/FindAction";
import * as DiscussAction from "../../actions/DiscussAction";
import * as MeAction from "../../actions/MeAction";
import JPushModule from "jpush-react-native/index";

let WeChat = require('react-native-wechat');

const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];

let mobile = "15688768386";
let password = "123456";

class LoginView extends Component {
    //注册
    rightOnPress = () => {
        const {navigate, state} = this.props.navigation;
        let temp = cloneObj(state.params) || {};
        Object.assign(temp, {name: 'RegisterView', title: '注册', rightTitle: ''});
        // navigate('RegisterUserTypeView', Object.assign(temp, {name: 'RegisterUserTypeView', title: '用户类型', rightTitle: ''}))
        navigate('RegisterView', temp)
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            userName: '',
            password: '',
            isInstallWeChat: false,
            modalVisible: false,
        };
        this._isMounted;
    }

    setModalVisible(visible) {
        this._isMounted && this.setState({
            modalVisible: visible
        });
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let {isInstallWeChat} = this.state;

        return (
            <View style={styles.container}>
                <ScrollView style={{marginTop: 10}} keyboardShouldPersistTaps='always' scrollEnabled={false}>
                    <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}
                          style={{height: deviceHeight - actionBar}}>
                        {this.commonTextInputView('手机号', 1, '账号')}
                        {this.commonTextInputView('密码', 2)}

                        <View style={styles.bottomViewStyle}>
                            <CommonLoginButton
                                {...this.props}
                                name='登录'
                                userName={this.state.userName}
                                passWord={this.state.password}
                                num={1}
                                compent={this}
                            />

                            <View style={styles.secondViewStyle}>
                                <ATouchableHighlight onPress={() => this.pushToDetail('找回密码')}>
                                    <Text style={[styles.textStyle, {paddingRight: scaleSize(18),}]}>找回密码</Text>
                                </ATouchableHighlight>
                                <ATouchableHighlight onPress={() => this.pushToDetail('短信验证码登录')}>
                                    <Text style={[styles.textStyle, {paddingLeft: scaleSize(18),}]}>短信验证码登录</Text>
                                </ATouchableHighlight>
                            </View>
                        </View>

                        {isInstallWeChat && <View style={{
                            position: 'absolute',
                            bottom: scaleSize(100),
                            width: deviceWidth
                        }}>
                            <Text style={{
                                padding: scaleSize(40),
                                alignSelf: 'center', color: '#rgba(0,0,0,0.8)',
                            }}>— 其他方式登录 —</Text>
                            <ATouchableHighlight onPress={() => this.otherLogin()}>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={require('../../imgs/other/weixin_01.png')} style={{
                                        width: scaleSize(120),
                                        height: scaleSize(120)
                                    }}/>
                                    <Text
                                        style={{
                                            marginTop: 7,
                                            color: '#rgba(0,0,0,0.8)',
                                            fontSize: px2dp(14)
                                        }}>微信登录</Text>
                                </View>
                            </ATouchableHighlight>
                        </View>}
                    </View>

                </ScrollView>

                <Loading ref={'loading'}/>
            </View>
        );
    }

    commonTextInputView(placeholder, num, title) {
        return (
            <View style={{alignItems: 'center'}}>
                <View style={styles.allViewStyle}>
                    <Text style={styles.textNameStyle}>{num === 1 ? title : placeholder}</Text>
                    <TextInput
                        style={styles.textInputViewStyle}
                        placeholder={`请输入${placeholder}`}
                        defaultValue={(num === 2 ? this.state.password : this.state.userName) + ''}
                        secureTextEntry={num === 2}
                        clearButtonMode='always'
                        placeholderTextColor="#aaaaaa"
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => this.onChangeText(text, num)}
                        onLayout={this._inputOnLayout.bind(this)}
                    />

                </View>
            </View>
        );
    }

    _onStartShouldSetResponderCapture(event) {
        let target = event.nativeEvent.target;
        if (!inputComponents.includes(target)) {
            dismissKeyboard();
        }
        return false;
    }

    _inputOnLayout(event) {
        inputComponents.push(event.nativeEvent.target);
    }

    onChangeText(text, num) {
        switch (num) {
            case 1:
                this._isMounted && this.setState({
                    userName: text
                });
                break;
            case 2:
                this._isMounted && this.setState({
                    password: text
                });
                break;
        }

    }

    pushToDetail(option) {
        const {navigate, state} = this.props.navigation;
        navigate('ForgetView', Object.assign(state.params || {}, {
            name: 'ForgetView',
            title: option,
            rightTitle: "",
            fromPage: 'LoginView'
        }))
    }

    componentDidMount() {
        const {navigate, state} = this.props.navigation;
        this._isMounted = true;
        this.props.navigation.setParams({
            rightOnPress: this.rightOnPress,
        });
        WeChat.isWXAppInstalled().then((isInstalled) => {
            isInstalled && this.setState({
                isInstallWeChat: isInstalled
            })
        }).catch((err) => {
            console.log('什么都没有' + err)
        });
        AsyncStorage.getItem(USERANDPWD, (err, id) => {
            let item = JSON.parse(id);
            if (item !== null) {
                this._isMounted && this.setState({
                    userName: item.username,
                    // password: state.params.isReLogin ? '' : item.password
                });
            }

        });
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    otherLogin() {
        let scope = 'snsapi_userinfo';
        let state = 'wechat_sdk_YouZhongYouLiao';
        this.getLoading().show();
        let {isInstallWeChat} = this.state;

        // WeChat.isWXAppInstalled()
        //     .then((isInstalled) => {
        if (isInstallWeChat) {
                    //发送授权请求
                    WeChat.sendAuthRequest(scope, state)
                        .then(responseCode => {
                            //返回code码，通过code获取access_token
                            WechatAuth({code: responseCode.code}, (res) => {
                                this.getLoading().dismiss();
                                // res = {jumpBind: true, jumpComple: true, userid: 5538,}
                                //jumpBind true 跳转到绑定的界面。 false则继续判断 jumpComple true 跳转到完善信息的界面。 如果两个都没有，则跟之前密码登录的返回结果集一样
                                let {jumpBind, jumpComple, unionid, userid} = res;
                                if (jumpBind) {
                                    this.getAccessBind('BindPhone', '步骤一：绑定手机号', {unionid})
                                } else {
                                    if (jumpComple) {
                                        this.getAccessBind('UserInfoGoComple', '步骤二：完善用户信息', {userid})
                                    } else {//登录操作，跳转主页。。
                                        if (userid) {
                                            this.jump(res)
                                        }
                                    }
                                }
                            }, (err) => {
                                this.getLoading().dismiss();
                            })
                        })
                        .catch(err => {
                            this.getLoading().dismiss();
                            Alerts('登录授权发生错误：', err.message);
                        })
                } else {
                    this.getLoading().dismiss();
                    Alerts('微信未安装，请您安装微信之后再试');
                }
        // })
    }

    jump(uObj = {}) {
        const {navigate, state, goBack} = this.props.navigation;
        MobclickAgent.onProfileSignIn(uObj.userid.toString());
        JPushModule.setAlias(uObj.userid.toString(), (success) => {
        }, (error) => {
        });
        DeviceStorage.save(USERINFO, uObj);// "areaid": 1,如果 这个是0 》代表 全区。不通过
        this.props.loginAction.requestLogin(uObj, true);
        let {nav} = this.props;
        if (nav && nav.routes) {
            let routes = nav.routes;
            this.props.meAction.fetchMyScore();
            this.props.meAction.fetchMyExpertScore((res)=>{
                this.props.loginAction.updateUserInfo(res);
            });
            this.props.findAction.fetchCollectProductCount({}, 0);
            this.judgeShareData(nav);
            this.props.discussAction.fetchDiscussShareRefresh(1);
            state.params.callback && state.params.callback();
        }
    }

    judgeShareData(nav) {
        let routes = nav.routes;
        const {navigate, state, goBack} = this.props.navigation;
        let shareKey = state.params && state.params.sharePageKey || "";
        if (shareKey) {
            this.props.navigation.goBack(routes[state.params && state.params.sharePageLen].key);
        } else {
            this.props.navigation.goBack(routes[1].key)
        }
    }

    getAccessBind(name, title, {unionid = '', userid = ''}) {
        const {navigate, state} = this.props.navigation;
        navigate(name, Object.assign(state.params || {}, {
            name: name,
            title: title,
            rightTitle: "",
            unionid: unionid,
            userid: userid,
            fromPage: 'LoginView'
        }));
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        height: deviceHeight,
        borderTopColor: borderColor,
        borderTopWidth: 2,
    },

    textInputViewStyle: {
        width: deviceWidth - 75,
        height: textHeight,
        backgroundColor: 'white',
        paddingLeft: 20,
        fontSize: px2dp(Sizes.listSize),
        padding: PlatfIOS ? 0 : 4,
    },

    bottomViewStyle: {
        marginTop: 40,
        alignItems: 'center'
    },

    bottomTopViewStyle: {
        width: deviceWidth - 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BGTextColor,
        borderRadius: borderRadius,
        height: textHeight
    },

    secondViewStyle: {
        // marginTop: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: deviceWidth - 20,
        flexDirection: 'row'
    },

    textStyle: {
        color: BGTextColor,
        fontSize: px2dp(PlatfIOS ? Sizes.listSize : 13),
        paddingTop: scaleSize(18),
        paddingBottom: scaleSize(18),
    },

    allViewStyle: {
        borderBottomColor: borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',//
        height: 50,
        marginTop: 10,
        width: deviceWidth - 20
    },

    textNameStyle: {
        width: 50,
        // marginLeft:8,
        fontSize: px2dp(15),
        color: '#rgba(64,64,64,1)'
    }
});

export default connect(state => ({
        nav: state.nav
    }), dispatch => ({
        loginAction: bindActionCreators(LoginAction, dispatch),
        meAction: bindActionCreators(MeAction, dispatch),
        findAction: bindActionCreators(FindAction, dispatch),
        discussAction: bindActionCreators(DiscussAction, dispatch),
    })
)(LoginView);
