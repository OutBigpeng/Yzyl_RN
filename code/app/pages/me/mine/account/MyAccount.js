/**我的->账户安全
 * Created by Monika on 2016/12/28.
 */
'use strict';
import React, {Component} from "react";
import {AsyncStorage, Image, InteractionManager, StyleSheet, Text, View} from "react-native";
import ChangePhone from "./ChangePhone";
import {BGColor, borderColor, Colors, deviceWidth, px2dp, Sizes} from "../../../../common/CommonDevice";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";


export default class MyAccount extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    // //返回
    // buttonBackAction() {
    //     const {navigator} = this.props;
    //     return NaviGoBack(navigator);
    // }

    itemActionIndex(position) {
        const {navigate} = this.props.navigation;
        switch (position) {
            case 0://修改登录密码
                AsyncStorage.getItem(USERINFO, (error, result) => {
                    if (result) {
                        let user = JSON.parse(result);
                        if (user.mobile) {
                            InteractionManager.runAfterInteractions(() => {
                                navigate('ForgetView',{
                                    name: 'ForgetView',
                                    title: '修改登录密码',
                                    hint: '已验证手机号:' + user.mobile.substr(0, 3) + '****' + user.mobile.substr(user.mobile.length - 4, user.mobile.length),
                                    smstype: 4,
                                    phone: user.mobile,
                                    view: 1,
                                    fromPage:'MyAccount'
                                })
                            })
                        }
                    }
                });
                break;
            case 1://更换手机号
                InteractionManager.runAfterInteractions(() => {
                    navigate('ChangePhone', {
                        title: '更换手机号',
                        name: 'ChangePhone',
                        smstype: 5
                    })
                });
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.contentView}>
                    {this.itemRow(0, "修改登录密码", "您可修改更换登录密码以保护账户安全")}
                    {this.itemRow(1, "更换手机号", "若您的验证手机丢失或信用，请立即修改更换")}
                </View>
            </View>
        );
    }

    itemRow(index, title, content) {
        return (
            <View>
                {/*有跟线*/}
                <View style={{backgroundColor: borderColor, height: 0.8}}/>
                <ATouchableHighlight onPress={()=>this.itemActionIndex(index)} >
                    <View style={styles.item_view}>
                        {/*左边*/}
                        <View style={{flexDirection: 'column'}}>
                            <Text style={styles.leftTitle}>{title}</Text>
                            <Text style={styles.leftContent}>{content}</Text>
                        </View>
                        {/*右边*/}
                        <Image style={{width: 8, height: 12}}
                               source={require('../../../../imgs/other/right_arrow.png')}/>
                    </View>
                </ATouchableHighlight>
                {/*有跟线*/}
                {index % 2 !== 0 ? <View style={{backgroundColor: borderColor, height: 0.8}}/> : <View/>}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },
    contentView: {
        flexDirection: 'column',
        marginTop: 10
    },
    leftTitle: {
        color: 'black',
        fontSize: px2dp(Sizes.listSize)
    },
    leftContent: {
        color: Colors.ExplainColor,
        fontSize: px2dp(Sizes.searchSize),
        marginTop: 8
    },
    item_view: {
        backgroundColor: 'white',
        padding: 10,
        width: deviceWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});