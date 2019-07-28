/**重置密码
 * Created by Monika on 2016/12/27.
 */
import React, {Component} from "react";
import {AsyncStorage, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {PwdChange} from "../../common/CommonUtil";
import {
    BGTextColor,
    bindActionCreators,
    borderColor,
    borderRadius,
    connect,
    deviceWidth,
    Loading,
    PlatfIOS,
    pwd,
    px2dp,
    Sizes,
    textHeight,
    toastShort
} from "../../common/CommonDevice";
import {NavigationActions} from 'react-navigation'
import ATouchableHighlight from "../../component/ATouchableHighlight";
import * as LoginAction from "../../actions/LoginAction";
import * as TabSwitchAction from "../../actions/TabSwitchAction";
import {resetPwdById} from "../../dao/UserInfoDao";

const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];


class ResetPwd extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            oldPwd: '',
            NewPwd: ''
        };
    }

    render() {
        return (
            <View style={styles.container}>

                <ScrollView keyboardShouldPersistTaps='always'>
                    <View style={styles.contentViewStyle}
                          onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}>
                        {this.commonTextInputView('密码', '输入新密码', 1)}
                        {this.commonTextInputView('新密码', '再次输入新密码', 2)}

                        <ATouchableHighlight onPress={() => this.checkInputText()}>
                            <View style={styles.buttonViewStyle}>
                                <Text style={{color: 'white', fontSize: px2dp(18)}}>确定</Text>
                            </View>
                        </ATouchableHighlight>
                    </View>
                </ScrollView>
                <Loading ref={'loading'}/>
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


    commonTextInputView(text, placeholder, num) {
        return (
            <View style={styles.TextInputViewStyle}>
                <Text style={styles.textNameStyle}>{text}</Text>
                <TextInput
                    placeholder={placeholder}
                    secureTextEntry={true}
                    clearButtonMode='always'
                    password={true}
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    numberOfLines={1}
                    style={styles.textInputStyle}
                    onChangeText={(text) => this.onChangeText(text, num)}
                    onLayout={this._inputOnLayout.bind(this)}
                />
            </View>
        )
    }

    onChangeText(text, num) {
        switch (num) {
            case 1:
                this.setState({
                    oldPwd: text
                });
                break;
            case 2:
                this.setState({
                    NewPwd: text
                });
                break;
        }
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    checkInputText() {
        const {state} = this.props.navigation;
        state.params.timer && clearTimeout(state.params.timer);
        let {NewPwd, oldPwd} = this.state;
        if (!(oldPwd) || !(NewPwd)) {
            toastShort('密码不能为空')
        } else if (!pwd.test(oldPwd)) {
            toastShort('密码只能为字母或数字,长度6-16位')
        } else if (NewPwd !== oldPwd) {
            toastShort('两次密码不一致')
        } else {
            this.loadNetResetPwd()
        }
    }

    loadNetResetPwd() {
        const {navigate, state} = this.props.navigation;
        let password = PwdChange(this.state.NewPwd);
        let data = {'mobile': state.params.mobile, 'userid': state.params.userId, 'password': password};
        if (this.getLoading()) {
            this.getLoading().show();
        }
        AsyncStorage.getAllKeys((error, keys) => {
            keys.map((str, index) => {
                AsyncStorage.removeItem(str);
            })
        });
        resetPwdById(data, (res) => {
            if (this.getLoading()) {
                this.getLoading().dismiss();
            }
        if (state.params && state.params.fromPage && state.params.fromPage == "LoginView") {
            let routes = this.props.nav.routes || [];
            routes.length > 2 && this.props.navigation.goBack(routes[routes.length - 2].key);
        } else {
            const navigateAction = NavigationActions.reset({
                index: 1,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'WelcomeView',
                    }),
                    NavigationActions.navigate({
                        routeName: 'LoginView',
                        params: {
                            title: '登录',
                            rightTitle: '注册',
                        }
                    })]
            });
            this.props.navigation.dispatch(navigateAction)
        }
        }, (err) => {
            if (this.getLoading()) {
                this.getLoading().dismiss();
            }
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderTopColor: borderColor,
        borderTopWidth: 2,
    },

    contentViewStyle: {
        alignItems: 'center',


    },

    TextInputViewStyle: {
        backgroundColor: 'white',
        borderBottomColor: borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        width: deviceWidth - 20,
        alignItems: 'center',
        marginTop: 10,
    },

    textInputStyle: {
        width: deviceWidth - 50,
        height: textHeight,
        paddingLeft: 30,
        fontSize: px2dp(Sizes.listSize),
        padding: PlatfIOS ? 0 : 4,

    },

    buttonViewStyle: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: deviceWidth - 20,
        height: textHeight,
        backgroundColor: BGTextColor,
        borderRadius: borderRadius
    },

    textNameStyle: {
        width: 50,
        // marginLeft:8,
        fontSize: px2dp(15),
        color: '#rgba(64,64,64,1)'
    },
});
export default connect(state => ({
    nav: state.nav
}), dispatch => ({
    loginAction: bindActionCreators(LoginAction, dispatch),
    tabSwitchAction: bindActionCreators(TabSwitchAction, dispatch)
}))(ResetPwd);
