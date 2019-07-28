/**
 * Created by coatu on 2016/12/27.
 */
import React, {Component} from "react";
import {Alert, Linking, StyleSheet, Text, View} from "react-native";
import {BGTextColor, px2dp, Sizes, PlatfIOS} from '../common/CommonDevice'
import ATouchableHighlight from "./ATouchableHighlight";
import {CustomPhone} from "../common/CommonUtil";
import {scaleSize} from "../common/ScreenUtil";

export default class commonPhoneTextView extends Component {
    render() {
        return (
            <ATouchableHighlight onPress={() => this.getPhone()}>
                <View>
                    <Text style={styles.textStyle}>没收到验证码</Text>
                </View>
            </ATouchableHighlight>
        )
    }

    getPhone() {
        Alert.alert(
            '',
            "拨打客服电话？",
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                {text: '确定', onPress: () => this.mobileJump()},
            ]
        )
    }

    mobileJump() {
        CustomPhone((res) => {
            Linking.openURL("tel:" + res)
        })
    }

}

const styles = StyleSheet.create({
    textStyle: {
        color: BGTextColor,
        fontSize: px2dp(PlatfIOS ? Sizes.listSize : 13),
        paddingLeft: scaleSize(18),
        paddingTop: scaleSize(18),
        paddingBottom: scaleSize(18),
    },
});