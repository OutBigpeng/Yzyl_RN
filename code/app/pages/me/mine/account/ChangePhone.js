/**更改手机号码
 * Created by Monika on 2016/12/27.
 */
'use strict';
import React, {Component} from "react";
import {Alert, AsyncStorage, Platform, ScrollView, StyleSheet, TextInput, View, Text} from "react-native";
import {resetMobile} from "../../../../dao/UserChangeDao";
import VerificationCodeView from "../../../../component/VerificationCode";
import CommonPhoneTextView from "../../../../component/CommonPhoneTextView";
import {
    BGColor,
    BGTextColor,
    borderColor,
    borderRadius,
    deviceWidth,
    isEmptyObject,
    Loading,
    textHeight,
    toastShort,
    Colors,
    Sizes,
    px2dp, PlatfIOS, bindActionCreators, connect
} from "../../../../common/CommonDevice";
import CommonLoginButton from "../../../../component/CommonLoginButton";
import LoginView from "../../../login/LoginView";
import {NavigationActions} from 'react-navigation'
import * as LoginAction from "../../../../actions/LoginAction";

const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];

class ChangePhone extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            smstype: this.props.navigation.state.params.smstype,
            phone: '',
            vcode: '',
        };

        this._isMounted;

    }

    componentDidMount() {
        this._isMounted = true;
        this.props.navigation.setParams({
            navigatePress:this.isBack,
        });
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }
    componentWillUnmount() {
        this.isBack;
        this._isMounted = false;
    }

    isBack = () =>{
        const {goBack} = this.props.navigation;
        this.state.timer && clearTimeout(this.state.timer);
        goBack();
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView scrollEnabled={false} keyboardShouldPersistTaps='always'>
                    <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)} style={{alignItems:'center'}}>
                        <View style={{marginTop:10,marginBottom:15}}>
                            <View style={styles.inputbg}>
                                {this.commonTextInputView('输入新手机号', 1)}
                            </View>

                            <View style={styles.inputbg}>
                                {this.commonTextInputView('验证码', 2)}
                                <VerificationCodeView
                                    {...this.props}
                                    mobile={this.state.phone}
                                    smstype={5}
                                    callBack={this.timers.bind(this)}
                                    compent={this}
                                />
                            </View>
                        </View>

                        <View style={{alignItems:'center',marginTop:30}}>
                            <CommonLoginButton
                                {...this.props}
                                name='确定更换'
                                num={0}
                                compent={this}
                                style={{backgroundColor:this.state.phone && this.state.vcode? BGTextColor:'#rgba(190,190,190,1)'}}
                                onPress={() => this.sureChange()}
                            />{/*this.state.phone && this.state.vcode?*/}
                        </View>
                        <View style={styles.secondViewStyle}>
                            <CommonPhoneTextView {...this.props}/>
                        </View>
                    </View>
                </ScrollView>
                <Loading ref={'loading'} />
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

    timers(timer) {
        this.setState({
            timer: timer
        })
    }

    commonTextInputView(placeholder, num) {
        return (
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={styles.textNameStyle}>{num ==1?'手机号':placeholder}</Text>
                <TextInput
                    style={[styles.textInputStyle,{width:num===2?deviceWidth-165:deviceWidth}]}
                    placeholder={placeholder}
                    placeholderTextColor='#aaaaaa'
                    numberOfLines={1}
                    keyboardType={'numeric'}
                    maxLength={num===1?11:6}
                    underlineColorAndroid='transparent'
                    onChangeText={(text) =>this.onChangeTextView(text,num)}
                    onLayout={this._inputOnLayout.bind(this)}
                />
            </View>
        )
    }

    onChangeTextView(text, num) {
        switch (num) {
            case 1:
                this.setState({phone: text});
                break;
            case 2:
                this.setState({vcode: text});
                break;
        }
    }


    sureChange() {
        const {navigate} = this.props.navigation;
        if (!this.state.phone) {
            toastShort("请输入手机号");
            return;
        }
        if (!this.state.vcode) {
            toastShort('请输入验证码');
            return;
        }
        if(this.getLoading()) {
            this.getLoading().show();
        }
        const {isLoginIn,userObj={},domainObj} = this.props.state.Login;

        resetMobile(this.state.phone, this.state.smstype, this.state.vcode, userObj.userid, this.props.navigation, (result) => {
            if(this.getLoading()) {
                this.getLoading().dismiss();
            }
            this.state.timer && clearTimeout(this.state.timer);
            if (result) {
                Alert.alert('温馨提示', '手机号更新成功,需要重新登录哦！',
                    [
                        {text: '确定', onPress: () => this.pushToLogin()}
                    ])
            }
        }, (err) => {//{text: '取消', onPress: () => console.log('Cancel Pressed!')},
            if(this.getLoading()) {
                this.getLoading().dismiss();
            }
        })
    }

    pushToLogin() {
        AsyncStorage.getAllKeys((error, keys) => {
            keys.map((str, index) => {
                AsyncStorage.removeItem(str);
            })
        });

        const resetAction = NavigationActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({
                    routeName: 'WelcomeView'
                }),
                NavigationActions.navigate({
                    routeName: 'LoginView',
                    params: {
                        title: '登录',
                        rightTitle: '注册',
                    },
                }),
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderTopColor: borderColor,
        borderTopWidth: 2,
    },

    vcodeView: {
        borderRadius: 3,
        margin: 5,
        flex: 1,
        backgroundColor: BGTextColor,
        alignItems: 'center'
    },

    commitView: {
        borderRadius: borderRadius,
        backgroundColor: BGTextColor,
        alignItems: 'center',
        height: textHeight,
        justifyContent: 'center',
        width: PlatfIOS?deviceWidth - 20:deviceWidth-15
    },

    inputbg: {
        backgroundColor: 'white',
        borderBottomColor: borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width:  PlatfIOS?deviceWidth - 20:deviceWidth-15,
        alignItems: 'center',
        paddingRight: 10,
        marginTop:10

    },

    textInputStyle: {
        height: textHeight,
        width: deviceWidth,
        paddingLeft: 30,
        fontSize: px2dp(Sizes.listSize),
        padding: PlatfIOS?0:4,

    },

    secondViewStyle: {
        // marginTop: 8,
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: deviceWidth - 18,
        flexDirection: 'row'
    },
    textNameStyle: {
        width: 50,
        // marginLeft:8,
        fontSize: px2dp(15),
        color: '#rgba(64,64,64,1)'
    },
});
export default connect(state => ({
        state: state,
    }),
    (dispatch) => ({
        loginAction: bindActionCreators(LoginAction, dispatch)
    })
)(ChangePhone);