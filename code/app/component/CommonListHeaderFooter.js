/**
 * Created by Monika on 2017/9/4.
 */
import React, {Component} from 'react';
import {ActivityIndicator, Text, View} from "react-native";
import {comStyles} from '../themes'

export class FooterWanView extends Component {
    render() {
        return (
            <View style={comStyles.footViewStyle}>
                <Text style={comStyles.footerStyle}>
                    - 已经到底了 -
                </Text>
            </View>
        )
    }
}

export class FooterIngView extends Component {
    render() {
        return (
            <View style={comStyles.footViewStyle}>
                <ActivityIndicator size="small" color="#3e9ce9"/>
                <Text style={[comStyles.footerStyle, {textAlign: 'center'},]}>
                    数据加载中……
                </Text>
            </View>
        )
    }
}