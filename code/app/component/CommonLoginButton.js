/** 登录这一类型的Bottom
 * Created by coatu on 2016/12/27.
 */
import React, {Component} from "react";
import {InteractionManager, Platform, StyleSheet, Text, View, ViewPropTypes} from "react-native";
import {
    BGTextColor,
    bindActionCreators,
    borderRadius,
    connect,
    deviceWidth,
    MobclickAgent,
    PlatfIOS,
    px2dp,
    Sizes,
    textHeight,
    _
} from "../common/CommonDevice";
import * as DeviceInfo from "react-native-device-info";
import *as LoginAction from "../actions/LoginAction";

import {BuyerGrade, Login, retrievePasswordById, SmsAuthById} from "../dao/UserInfoDao";
import {DeviceStorage, PwdChange} from "../common/CommonUtil";
import {toastShort} from "../common/ToastUtils";
import JPushModule from "jpush-react-native";
import ATouchableHighlight from "./ATouchableHighlight";
import * as MeAction from "../actions/MeAction";
import * as FindAction from "../actions/FindAction";
import * as DiscussAction from "../actions/DiscussAction";

class CommonLoginButton extends Component {
    static propTypes = {
        style: ViewPropTypes.style
    };

// 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
        this._isMounted;

    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }


    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        return (
            <ATouchableHighlight
                delayTime={PlatfIOS ? 1000 : 300}
                onPress={this.props.onPress ? () => this.props.onPress() : () => this.pushToTabbar()}>
                <View
                    style={[styles.buttonViewStyle, {width: this.props.num === 3 ? 150 : deviceWidth - 20}, this.props.style]}>
                    <Text style={{
                        color: 'white',
                        fontSize: Platform.OS === 'ios' ? px2dp(Sizes.titleSize) : px2dp(Sizes.titleSize)
                    }}>{this.props.name}</Text>
                </View>
            </ATouchableHighlight>
        )
    }

    pushToTabbar() {
        if (this._isMounted) {
            if (this.props.num === 1) {
                if (!this.props.userName) {
                    toastShort('请输入手机号');
                } else if (!this.props.passWord) {
                    toastShort('请输入密码');
                } else {
                    this.getLoginData(this.props.num)
                }
            } else if (this.props.num === 2) {
                if (!this.props.mobile) {
                    toastShort('请输入手机号');
                    return;
                }
                if (!this.props.code) {
                    toastShort('请输入验证码');
                } else {
                    if (this.props.name === '下一步') {
                        this.getPushToResetPwd()
                    } else {
                        this.getLoginData(this.props.num)
                    }
                }
            } else if (this.props.num === 3) {
                this.getLoginData(this.props.num)
            }
        }
    }

    getLoginData(opaction) {
        if (this.props.compent.getLoading()) {
            this.props.compent.getLoading().show();
        }
        if (opaction === 1 || opaction === 3) {
            let data = {
                "username": this.props.userName,
                "password": PwdChange(this.props.passWord),
                'phonetype': DeviceInfo.getModel(),
                'osversion': DeviceInfo.getSystemVersion(),
            };
            Login(data, (res) => {
                this.loginReturn(res, this.props.userName);
            }, (error) => {
                if (this.props.compent.getLoading()) {
                    this.props.compent.getLoading().dismiss();
                }
            })
        } else if (opaction === 2) {
            let data = {
                "mobile": this.props.mobile,
                "vcode": this.props.code,
                'phonetype': DeviceInfo.getModel(),
                'osversion': DeviceInfo.getSystemVersion(),
            };
            SmsAuthById(data, (res) => {
                this.loginReturn(res, this.props.mobile)
            }, (error) => {
                if (this.props.compent.getLoading()) {
                    this.props.compent.getLoading().dismiss();
                }
            })
        }
    }

    loginReturn(res, name) {
        let {jumpComple, userid} = res;
        if (this.props.compent.getLoading()) {
            this.props.compent.getLoading().dismiss();
        }
        if (jumpComple) {
            this.getAccessBind('UserInfoGoComple', '步骤二：完善用户信息', userid)
        } else {//登录操作，跳转主页。。
            this.loginAfter(res, name);
        }
    }

    judgeShareData(nav) {
        let routes = nav.routes||[];
        const {navigate, state, goBack} = this.props.navigation;
        let shareKey = state.params && state.params.sharePageKey || "";
        if(routes&&!_.isEmpty(routes)){
            if (shareKey) {
                this.props.navigation.goBack(routes[state.params && state.params.sharePageLen].key);
            } else {
                this.props.navigation.goBack(routes[1].key)
            }
        }else {
            this.props.navigation.goBack()
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

    loginAfter(res, name) {
        if (this.props.compent.getLoading()) {
            this.props.compent.getLoading().dismiss();
        }
        if (res && res.userid) {
            DeviceStorage.save(USERANDPWD, {"username": name,});
            DeviceStorage.save(USERINFO, res);
            this.jump(res);
        }
    }

//获取买家等级
    getBuyergrade() {
        let data = {};
        BuyerGrade(data, (res) => {
            if (res) {
                DeviceStorage.save(BUYERGRADE, res);
            }
        }, (err) => {
        })
    }

    //根据id 获取买家信息
    getGradeId(uObj) {
        // if (this.props.timer) {
        //     this.props.timer && clearTimeout(this.props.timer);
        // }

        // let data = {'userid': res.userid};
        // if (this.props.compent.getLoading()) {
        //     this.props.compent.getLoading().show();
        // }
        // queryBuyerGradeAndAreaIdById(data, (item) => {
        //     if (this.props.compent.getLoading()) {
        //         this.props.compent.getLoading().dismiss();
        //     }
        //
        //     if (item) {
        // item['userid'] = res.userid;
        // let uObj = Object.assign(res, {});
        //进入这个页面就去掉接口 登录环信立即进入主页
        // this.jump(uObj);
        //     }
        // }, (error) => {
        //     if (this.props.compent.getLoading()) {
        //         this.props.compent.getLoading().dismiss();
        //     }
        // })
    }

    jump(uObj) {
        console.log("登录 。。。。。。。。。。。。jump");
        if (this.props.timer) {
            this.props.timer && clearTimeout(this.props.timer);
        }
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
            if (state.params.reLogin) {
                this.props.navigation.goBack(routes[1].key);
            } else {
                if (this.props.name === '验证并登陆' || this.props.name === "立即进入主页") {//routes.length - 2
                    this.judgeShareData(nav)
                } else {
                    goBack();
                }
            }
            this.props.discussAction.fetchDiscussShareRefresh(1);
            state.params.callback && state.params.callback();
        }
    }

//跳转到重置密码界面
    getPushToResetPwd() {
        let data = {
            "mobile": this.props.mobile,
            "smstype": this.props.smstype,
            "vcode": this.props.code
        };
        if (this.props.compent.getLoading()) {
            this.props.compent.getLoading().show();
        }

        retrievePasswordById(data, (res) => {
            if (this.props.compent.getLoading()) {
                this.props.compent.getLoading().dismiss();
            }
            if (res) {
                const {navigate, state} = this.props.navigation;
                InteractionManager.runAfterInteractions(() => {
                    navigate('ResetPwdView', Object.assign(state.params || {}, {
                        title: '重置密码',
                        name: '重置密码',
                        mobile: res.mobile,
                        userId: res.userid,
                        timer: this.props.timer
                    }))
                })
            }
        }, (error) => {
            if (this.props.compent.getLoading()) {
                this.props.compent.getLoading().dismiss();
            }
        })
    }
}

const styles = StyleSheet.create({
    buttonViewStyle: {
        height: textHeight,
        width: deviceWidth - 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BGTextColor,
        borderRadius: borderRadius
    }
});
export default connect(state => ({
    nav: state.nav
}), dispatch => ({
    loginAction: bindActionCreators(LoginAction, dispatch),
    meAction: bindActionCreators(MeAction, dispatch),
    findAction: bindActionCreators(FindAction, dispatch),
    discussAction: bindActionCreators(DiscussAction, dispatch),
}))(CommonLoginButton);