/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {BGTextColor, borderRadius, phoneInspect, PlatfIOS, px2dp, Sizes, toastShort} from "../common/CommonDevice";
import {VerificationCodeById} from "../dao/UserInfoDao";
import ATouchableHighlight from "./ATouchableHighlight";
import {scaleSize} from "../common/ScreenUtil";

let codeTime = 60;
export default class VerificationCode extends Component {
    static defaultProps = {
        mobile: '',
        API_CODE: 'user/sendMessage',
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            timerCount: codeTime,
            timerTitle: '',
            isOnclickCode: true
        };

        this._isMounted;
    }

    componentDidMount() {
        this._isMounted = true;
    }


    render() {
        return (
            <ATouchableHighlight onPress={this.state.isOnclickCode ? () => this.getCodeButton() : null}>
                <View style={styles.codeViewStyle}>
                    {this.codeText()}
                </View>
            </ATouchableHighlight>
        );
    }

    codeText() {
        if (this.state.timerCount === codeTime && this.state.timerTitle === '') {
            return (
                <Text style={styles.tv}>获取验证码</Text>
            )
        } else if (this.state.timerCount < codeTime && this.state.timerCount > 0) {
            return (
                <Text style={styles.tv}>还剩{this.state.timerCount}s</Text>
            )
        } else if (this.state.timerTitle === '重新获取') {
            return (
                <Text style={styles.tv}>{this.state.timerTitle}</Text>
            )
        }
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    getCodeButton() {
        this.props.onPress && this.props.onPress();
        if (!this.props.mobile) {
            toastShort("请输入手机号");
        } else if (!phoneInspect.test(this.props.mobile)) {
            toastShort("手机格式不正确");
        } else if (this.props.smstype === 5) {
            const {userObj = {}, domainObj} = this.props.state.Login;
            if (this.props.mobile === userObj.mobile) {
                toastShort("该手机号与注册手机号相同，不可更改");
            } else {
                this.clearAndLoad();
            }
        } else {
            this.clearAndLoad();
        }
    }

    clearAndLoad() {
        this.loadNet()
    }

    loadNet() {//user/sendMessage mobile,smstype=11 绑定验证码短信
        let data = {'mobile': this.props.mobile, 'smstype': this.props.smstype};
        this.props.compent.getLoading().show();
        VerificationCodeById(data, (res) => {
            this.props.compent.getLoading().dismiss();
            this.interval = setInterval(() => {
                let timer = this.state.timerCount - 1;
                if (timer === 0) {
                    this.interval && clearInterval(this.interval);
                    this.setState({
                        timerCount: codeTime,
                        timerTitle: '重新获取',
                        isOnclickCode: true
                    })
                } else {
                    this.setState({
                        timerCount: timer,
                        isOnclickCode: false
                    })
                }
            }, 1000);
            this.props.callBack(this.interval);
        }, (err) => {
            this.props.compent.getLoading().dismiss();
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.interval && clearTimeout(this.interval);
    }


}

const styles = StyleSheet.create({
    codeViewStyle: {
        width: scaleSize(180),
        height: PlatfIOS ? scaleSize(66) : scaleSize(60),
        backgroundColor: BGTextColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius,
        paddingVertical: scaleSize(25),
        paddingHorizontal:scaleSize(12)
    },
    tv: {color: 'white', fontSize: px2dp(Sizes.listSize)},
});


// export default connect(state => ({
//         state: state,
//     }),
//     (dispatch) => ({
//         loginAction: bindActionCreators(LoginAction, dispatch)
//     })
// )(VerificationCode);

