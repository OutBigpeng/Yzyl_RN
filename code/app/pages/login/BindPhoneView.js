/**
 * Created by Monika on 2018/7/20.
 */


'use strict';
import React, {Component} from "react";
import {ScrollView, Text, TextInput, View} from "react-native";
import {
    BGTextColor,
    bindActionCreators,
    connect,
    deviceWidth,
    Loading,
    MobclickAgent,
    phoneInspect,
    Sizes, PlatfIOS
} from "../../common/CommonDevice";
import {scaleSize} from "../../common/ScreenUtil";
import {DeviceStorage, PwdChange, px2dp} from "../../common/CommonUtil";
import VerificationCodeView from "../../component/VerificationCode";
import {CommonButton} from "../../component/CommonAssembly";
import {BindUserInfo} from "../../dao/UserInfoDao";
import {toastShort} from "../../common/ToastUtils";
import * as FindAction from "../../actions/FindAction";
import * as DiscussAction from "../../actions/DiscussAction";
import * as MeAction from "../../actions/MeAction";
import * as LoginAction from "../../actions/LoginAction";
import JPushModule from "jpush-react-native/index";
import {StyleSheet} from '../../themes'
import KeyboardSpacer from 'react-native-keyboard-spacer';

const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];

class BindPhoneView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            commitObj: {},
            timer: ''
        };
    };

    componentDidMount() {
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {//unionid,mobile,vcode,password
        return (
            <View style={styles.container}>
                <ScrollView
                   // keyboardShouldPersistTaps='always'
                >
                    <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}
                          style={{padding: scaleSize(deviceWidth / 8), }}>
                        <Text style={{
                            fontSize: px2dp(15),
                            lineHeight: scaleSize(50),
                        }}>首次微信登录需要两个步骤完善您的账号信息。</Text>
                        <Text style={{
                            fontSize: px2dp(15),
                            lineHeight: scaleSize(50), paddingTop: scaleSize(5), marginBottom: scaleSize(20)
                        }}>手机号可以用来登录；在账号丢失或异常时，可通过手机号找回。</Text>
                        {this.setTextAndInput('mobile', '手机号', '请输入手机号')}
                        {this.setTextAndInput('vcode', '验证码', '请输入验证码')}
                        {this.setTextAndInput('password', '密码', '手机号+密码可直接登录')}
                        <View style={styles.bottomViewStyle}>
                            <CommonButton
                                title={'提交'}
                                buttonOnPress={() => this.pushToCommit()}
                                buttonStyle={[{
                                    backgroundColor: BGTextColor,
                                }]}
                            />
                        </View>
                    </View>
                </ScrollView>
                {PlatfIOS && <KeyboardSpacer/>}

                <Loading ref={'loading'}/>
            </View>
        );
    }

    //键盘的方法
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

    componentWillUnmount() {
        this.state.timer && clearTimeout(this.state.timer);
    }

    setTextAndInput(type, name, placeholder) {
        let {commitObj: {mobile = ''}} = this.state;
        return (
            <View style={{marginTop: scaleSize(40)}}>
                <Text style={{paddingBottom: scaleSize(10)}}>{name}</Text>
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    borderBottomColor: '#eeeeee',
                    borderBottomWidth: scaleSize(1),
                }}>
                    <TextInput
                        style={styles.tv_content}
                        placeholder={placeholder}
                        placeholderTextColor='#aaaaaa66'
                        autoFocus={type === 'mobile'}
                        secureTextEntry={name === '密码'}
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => this.textChange(type, text)}
                    />

                    {name === '验证码' && <VerificationCodeView
                        {...this.props}
                        mobile={mobile}
                        smstype={11}
                        callBack={this.timers.bind(this)}
                        compent={this}
                    />}
                </View>
            </View>
        )
    }

    pushToCommit() {
        let {unionid} = this.props.navigation.state.params;
        let {commitObj: {mobile = '', vcode = '', password = ''}} = this.state;
        if (mobile && mobile.trim()) {
            if (phoneInspect.test(mobile)) {
                if (password && password.trim()) {
                    if (vcode && vcode.trim()) {
                        password = PwdChange(password);
                        this.getLoading().show();
                        //user/bindUserInfo
                        BindUserInfo(Object.assign(this.state.commitObj, {unionid, password}), (res) => {
                            this.getLoading().dismiss();
                            let {jumpComple, userid} = res;
                            if (jumpComple) {
                                this.getAccessBind('UserInfoGoComple', '完善用户信息', userid)
                            } else {//登录操作，跳转主页。。
                                if (userid)
                                    this.jump(res)
                            }
                        }, () => {
                            this.getLoading().dismiss();
                        })
                    } else {
                        toastShort('请输入验证码')
                    }
                } else {
                    toastShort('请输入密码，至少6位')
                }
            } else {
                toastShort('请输入正确的手机号')
            }
        } else {
            toastShort('请输入手机号')
        }
    }

    getAccessBind(name, title, userid) {
        const {navigate, state} = this.props.navigation;
        navigate(name, Object.assign(state.params || {}, {
            name: name,
            title: title,
            rightTitle: "",
            userid: userid,
            fromPage: 'LoginView'
        }));
    }

    jump(uObj) {
        const {navigate, state, goBack} = this.props.navigation;
        MobclickAgent.onProfileSignIn(uObj.userid.toString());
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

    timers(timer) {
        this.setState({
            timer: timer
        })
    }

    textChange(type, text) {
        let {commitObj} = this.state;
        this.setState(Object.assign(commitObj, {[type]: text}));
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tv_content: {
        justifyContent: 'flex-start',
        textAlign: 'left',
        // textAlignVertical: 'top',
        // backgroundColor:"red",
        flex: 1,
        paddingLeft: 0,
        ios: {
            fontSize: px2dp(Sizes.listSize),
            paddingVertical: scaleSize(30)
        }
    },
    bottomViewStyle: {
        marginTop: scaleSize(80),
        paddingHorizontal: scaleSize(deviceWidth / 8),
        alignItems: 'center'
    },

});

export default connect(state => ({
        nav: state.nav
    }), dispatch => ({
        loginAction: bindActionCreators(LoginAction, dispatch),
        meAction: bindActionCreators(MeAction, dispatch),
        findAction: bindActionCreators(FindAction, dispatch),
        discussAction: bindActionCreators(DiscussAction, dispatch),
    })
)(BindPhoneView);