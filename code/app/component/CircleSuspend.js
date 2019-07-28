/**
 * Created by Monika on 2018/6/22.
 */
'use strict';
import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {BGTextColor, px2dp, Sizes} from "../common/CommonDevice";
import ATouchableHighlight from "./ATouchableHighlight";
import {scaleSize} from "../common/ScreenUtil";


export class CircleSuspend extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    };


    render() {
        let {text,onPress, style = {}} = this.props;
        return (
            <View style={[styles.positionViewStyle,style]}>
                <ATouchableHighlight onPress={()=>onPress()}>
                    <Text style={{
                        color: 'white',
                        padding: scaleSize(10),
                        fontSize: px2dp(Sizes.searchSize),
                        textAlign: 'center',
                    }}>{text}</Text>
                </ATouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    positionViewStyle: {
        width: scaleSize(90),
        height: scaleSize(90),
        borderRadius: scaleSize(45),
        position: 'absolute',
        bottom: scaleSize(100),
        right: scaleSize(20),
        backgroundColor: BGTextColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
