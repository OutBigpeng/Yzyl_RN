/**没有验证码
 * Created by Monika on 2016/12/27.
 *
 */

'use strict';

import React, {Component} from "react";
import {Alert, Linking, Text, View} from "react-native";
import {BGTextColor} from "../../../../common/CommonDevice";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";
import {CustomPhone, px2dp} from "../../../../common/CommonUtil";

export default class NoVcode extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }

    render() {
        return (
            <View style={{marginRight: 10, justifyContent: 'flex-end', flexDirection: 'row'}}>
                <ATouchableHighlight onPress={() => this.call()}>
                    <Text style={{color: BGTextColor, fontSize:  px2dp(12), alignSelf: 'center', padding: 3}}>没收到验证码</Text>
                </ATouchableHighlight>
            </View>
        )
    }

    call() {
        CustomPhone((res) => {
            Alert.alert("温馨提示", " 拨打客服电话？".concat(res), [
                {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                {text: '确定', onPress: () => Linking.openURL("tel:" + res)},
            ])
        })

    }

}