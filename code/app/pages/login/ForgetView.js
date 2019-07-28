/**忘记密码->>>找回密码
 * Created by coatu on 2016/12/26.
 */
import React, {Component} from "react";
import {ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {
    BGTextColor,
    bindActionCreators,
    borderColor,
    borderRadius,
    connect,
    deviceHeight,
    deviceWidth,
    Loading,
    PlatfIOS,
    px2dp,
    Sizes,
    textHeight
} from "../../common/CommonDevice";
import VerificationCodeView from "../../component/VerificationCode";
import CommonLoginButton from "../../component/CommonLoginButton";
import CommonPhoneTextView from "../../component/CommonPhoneTextView";
import * as LoginAction from "../../actions/LoginAction";
import * as TabSwitchAction from "../../actions/TabSwitchAction";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {cloneObj} from "../../common/CommonUtil";
import {scaleSize} from "../../common/ScreenUtil";

const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];

class ForgetView extends Component {
    back = () => {
        const {goBack} = this.props.navigation;
        this.state.timer && clearTimeout(this.state.timer);
        goBack();
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            mobile: '',
            code: '',
            timer: ''
        };
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    componentDidMount() {
        this.props.navigation.setParams({
            rightOnPress: this.back,
        })
    }

    render() {
        const {title, view, phone, hint} = this.props.navigation.state.params;
        let isLogin = title === '短信验证码登录';
        return (
            <View style={styles.container}>
                <ScrollView style={{marginTop: 10}} scrollEnabled={false} keyboardShouldPersistTaps='always'>
                    {/*验证码*/}
                    <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}
                          style={{alignItems: 'center'}}>
                        <View style={[styles.codeViewStyle, {}]}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={styles.textNameStyle}>手机号</Text>
                                <TextInput
                                    style={[styles.codeTextInputStyle, {color: view === 1 ? 'gray' : '#000'}]}
                                    placeholder='手机号'
                                    keyboardType='numeric'
                                    placeholderTextColor="#aaaaaa"
                                    underlineColorAndroid="transparent"
                                    numberOfLines={1}
                                    defaultValue={view === 1 ? hint : null}
                                    maxLength={view !== 1 ? 11 : 200}
                                    editable={view === 1 ? false : true}
                                    clearButtonMode={view === 1 ? 'never' : 'always'}
                                    onChangeText={(text) => this.setState({mobile: text})}
                                />
                            </View>
                            <VerificationCodeView
                                {...this.props}
                                mobile={view === 1 ? phone : this.state.mobile}
                                smstype={title === '找回密码' ? 3 : (view === 1 ? 4 : 2)}
                                callBack={this.timers.bind(this)}
                                compent={this}
                            />
                        </View>
                        {this.commonTextInputView('验证码')}

                        <View style={styles.bottomViewStyle}>
                            <CommonLoginButton
                                {...this.props}
                                name={title === '找回密码' || view === 1 ? '下一步' : '验证并登陆'}
                                mobile={view === 1 ? phone : this.state.mobile}
                                code={this.state.code}
                                num={2}
                                smstype={view === 1 ? 4 : 3}
                                compent={this}
                                timer={this.state.timer}
                                style={{backgroundColor: this.state.code ? BGTextColor : '#rgba(190,190,190,1)'}}
                            />
                            <View style={[styles.secondViewStyle, isLogin ? {
                                justifyContent: 'space-between',
                            } : {
                                justifyContent: 'flex-end',
                            }]}>
                                {isLogin && <ATouchableHighlight onPress={() => this.pushToDetail()}>
                                    <Text style={styles.textStyle}>没账号去注册</Text>
                                </ATouchableHighlight>}
                                <CommonPhoneTextView
                                    {...this.props}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Loading ref={'loading'}/>
            </View>
        )
    }

    pushToDetail() {
        const {navigate, state} = this.props.navigation;
        let temp = cloneObj(state.params) || {};
        navigate('RegisterView', Object.assign(temp, {name: 'RegisterView', title: '注册', rightTitle: ''}))
    }

    commonTextInputView(placeholder) {
        return (
            <View style={styles.codeSecondViewStyle}>
                <View style={styles.codeStyle}>
                    <Text style={styles.textNameStyle}>{placeholder}</Text>
                    <TextInput
                        onLayout={this._inputOnLayout.bind(this)}
                        style={styles.textInputViewStyle}
                        placeholder={placeholder}
                        keyboardType='numeric'
                        placeholderTextColor="#aaaaaa"
                        underlineColorAndroid="transparent"
                        numberOfLines={1}
                        clearButtonMode='always'
                        onChangeText={(text) => this.setState({code: text})}
                    />
                </View>

            </View>
        )
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

    timers(timer) {
        this.setState({
            timer: timer
        })
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
        width: deviceWidth - 70,
        height: textHeight,
        backgroundColor: 'white',
        paddingLeft: PlatfIOS ? 30 : 15,
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
        width: deviceWidth - 20,
        flexDirection: 'row'
    },

    textStyle: {
        fontSize: px2dp(PlatfIOS ? Sizes.listSize : 13),
        paddingRight: scaleSize(18),
        paddingTop: scaleSize(18),
        paddingBottom: scaleSize(18),
        color: BGTextColor,
    },

    codeViewStyle: {
        width: PlatfIOS ? deviceWidth - 20 : deviceWidth - 15,
        height: textHeight,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: borderColor,
        marginTop: 10
    },

    codeTextInputStyle: {
        width: deviceWidth - 165,
        paddingLeft: PlatfIOS ? 30 : 15,
        fontSize: px2dp(Sizes.listSize),
        height: textHeight,
        alignItems: 'center',
        padding: PlatfIOS ? 0 : 4,
    },

    textNameStyle: {
        width: 50,
        // marginLeft:8,
        fontSize: px2dp(15),
        color: '#rgba(64,64,64,1)'
    },

    codeSecondViewStyle: {
        borderBottomColor: borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        alignItems: 'center'
    },

    codeStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    }
});
export default connect(state => ({
    nav: state.nav
}), dispatch => ({
    loginAction: bindActionCreators(LoginAction, dispatch),
    tabSwitchAction: bindActionCreators(TabSwitchAction, dispatch)
}))(ForgetView);