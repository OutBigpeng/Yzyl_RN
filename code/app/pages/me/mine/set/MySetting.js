/**我的设置
 * Created by Monika on 2016/12/27.
 */
'use strict';
import React, {Component} from "react";
import {Alert, AsyncStorage, InteractionManager, Platform, StyleSheet, Text, View} from "react-native";
import FeedBack from "./FeedBack";
import {getUpdate} from "../../../../dao/SysDao";
import CommonLoginButton from "../../../../component/CommonLoginButton";
import {
    BGColor,
    BGTextColor,
    bindActionCreators,
    borderColor,
    borderRadius,
    connect,
    deviceWidth,
    MobclickAgent,
    Loading,
    textHeight
} from "../../../../common/CommonDevice";

import *as LoginAction from "../../../../actions/LoginAction";
import {NavigationActions} from 'react-navigation';
import ATouchableHighlight from "../../../../component/ATouchableHighlight";
import JPushModule from "jpush-react-native";
import {isUpdate, getUpdateData} from "../../../../common/UpdateVersion";

class MySetting extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isforceupdate: '',
            modalVisible: false,
        };
        this._isMounted;
    }

    callback() {
        isUpdate({props: this.props, type: 1, callback: () => this.update()})
    }


    update() {
        getUpdateData({props: this.props, callback: this.update.bind(this)})
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    itemActionIndex(position) {
        const {navigate} = this.props.navigation;
        let that = this;
        switch (position) {
            case 0:
                this.callback();
                break;
            case 1:
                InteractionManager.runAfterInteractions(() => {
                    navigate('FeedBack', {
                        name: 'FeedBack',
                        title: '意见反馈'
                    })
                });
                break;
            case 2:
                InteractionManager.runAfterInteractions(() => {
                    navigate('AgreementView',
                        {
                            name: 'AgreementView',
                            title: '关于我们',
                            agreementName: '关于我们'
                        })
                });
                break;
            case 3://
                // this.props = {};
                Alert.alert(
                    '',
                    '是否确定退出账号',
                    [
                        {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                        {
                            text: '确定', onPress: () => {
                            {
                                that.getLoading().show();
                                that.exit(that);
                            }
                        }
                        },
                    ]
                );
                break;
            default:
                break;
        }
    }

    /**
     * 退出登录
     */
    exit(that) {
        AsyncStorage.getAllKeys((error, keys) => {
            keys.map((str, index) => {
                AsyncStorage.removeItem(str);
            })
        });
        JPushModule.removeReceiveNotificationListener();
        MobclickAgent.onProfileSignOff();
        that.props.loginAction.requestLoginOut();
        // AsyncStorage.setItem(USERINFO, JSON.stringify(''));
        that.getLoading().dismiss();
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
                        reLogin: true
                    },
                }),
            ]
        });
        that.props.navigation.dispatch(resetAction);

    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

//+Debug?DeviceInfo.getVersion():""
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentView}>
                    {this.state.isforceupdate !== '' ? this.itemRow(() => this.itemActionIndex(0), "版本更新") : null}
                    {this.itemRow(() => this.itemActionIndex(1), "意见反馈")}
                    {this.itemRow(() => this.itemActionIndex(2), "关于优众优料")}
                </View>
                {/*最后退出登录的按钮*/}
                <View style={{alignItems: 'center', marginTop: 10}}>
                    <CommonLoginButton
                        {...this.props}
                        name='退出'
                        num={0}
                        compent={this}
                        onPress={() => this.itemActionIndex(3)}
                    />
                </View>

                <Loading ref={'loading'}/>
            </View>
        )
    }

    itemRow(onPress, name) {
        return (
            <ATouchableHighlight onPress={onPress}>
                <View style={styles.ViewStyle}>
                    <Text style={styles.item_text}>{name}</Text>
                </View>
            </ATouchableHighlight>)
    }

    componentDidMount() {
        this._isMounted = true;
        const {navigate} = this.props.navigation;
        // this.getLoading() && this.getLoading().show();
        getUpdate(this.props.navigation, (result) => {
            // this.getLoading() && this.getLoading().dismiss();
            this._isMounted && this.setState({
                isforceupdate: result.isforceupdate
            })
        }, (err) => {
            // this.getLoading() && this.getLoading().dismiss()
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
    },
    contentView: {
        width: deviceWidth,
        marginTop: 10,
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    item_text: {
        color: 'black',
        padding: 10,
        alignSelf: 'center',
        fontSize: Platform.OS === 'ios' ? 15 : 14
    },

    bottomViewStyle: {
        margin: 20,
        backgroundColor: BGTextColor,
        borderRadius: borderRadius,
        height: textHeight,
        alignItems: 'center',
        justifyContent: 'center',
        width: deviceWidth - 20
    },
    bottomText: {
        fontSize: 16,
        color: 'white',
        alignSelf: 'center'
    },

    ViewStyle: {
        flexDirection: 'column',
        height: textHeight,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
export default connect(state => ({
        state: state,
        // routes: state.nav.routes
    }),
    (dispatch) => ({
        loginAction: bindActionCreators(LoginAction, dispatch)
    })
)(MySetting);
