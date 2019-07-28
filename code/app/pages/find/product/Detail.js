/**产品详情
 * Created by coatu on 16/8/10.
 */
'use strict';
import React, {Component} from "react";
import {Image, ScrollView, StyleSheet, Text, View, WebView} from "react-native";
// 引入外部组件
import {deviceWidth, px2dp, Sizes} from "../../../common/CommonDevice";
export function setHtml(content,px) {
    return `<!DOCTYPE html>
<html lang="en">
<style>
div,p {
    letter-spacing: 0.3px;
    line-height: 25px;
    font-size: `+px+`px !important;
    padding-left: 5px;
    padding-right: 5px;
}</style>
<head>
    <meta charset="UTF-8">
</head>
<script>window.onload=function(){window.location.hash = 1;document.title = document.body.clientHeight;}</script>
<body>
<div>
 ${content}
</div>
</body>
</html>`
}
export default class Detail extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            height: 800
        };
    }

    render() {
        let {brandimg, applicationsystem, applarea, content} = this.props.detail;
        return (
            <ScrollView style={styles.container}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <View style={styles.TopImageViewStyle}>
                        <View style={styles.brandimgView}>
                            <Image
                                resizeMode={Image.resizeMode.contain}
                                source={brandimg ? {uri: brandimg} : require('../../../imgs/other/default131.png')}
                                style={{width: 120, height: 55}}/>
                        </View>
                        <View style={{marginLeft: 15, width: deviceWidth * 0.5}}>
                            <Text numberOfLines={2} style={styles.productNameTv}>{this.props.productname}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.tixiViewStyle}>
                    <Text style={styles.textViewStyle}>&bull;</Text>
                    <Text style={[styles.textViewStyle, {marginLeft: 4}]}>应用体系:</Text>
                    <Text style={[styles.textViewStyle, {marginLeft: 4}]}>{applicationsystem}</Text>
                </View>

                <View style={styles.tixiViewStyle}>
                    <Text style={styles.textViewStyle}>&bull;</Text>
                    <Text style={[styles.textViewStyle, {marginLeft: 4}]}>应用领域:</Text>
                    <Text
                        style={[styles.textViewStyle, {
                            marginLeft: 4,
                            width: deviceWidth - 90
                        }]}>{applarea}</Text>
                </View>

                <View style={{height: this.state.height}}>
                    <WebView
                        source={{html:setHtml(content,14)}}
                        style={{flex: 1}}
                        bounces={false}
                        scrollEnabled={false}
                        automaticallyAdjustContentInsets={true}
                        contentInset={{top: 0, left: 0}}
                        onNavigationStateChange={(title) => {
                            if (title.title != undefined) {
                                this.setState({
                                    height: (parseInt(title.title) + 20)
                                })
                            }
                        }}>
                    </WebView>
                </View>
            </ScrollView>
        );
    };

};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginTop: 15,
        marginBottom: 60,
    },
    webView: {
        width: deviceWidth,
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10
    },
    brandimgView: {
        backgroundColor: 'white',
        width: 120,
        height: 55,
        marginLeft: 3
    },
    productNameTv: {
        color: 'white',
        fontSize: px2dp(Sizes.listSize),
        width: deviceWidth * 0.45,
        lineHeight: 20
    },
    tixiViewStyle: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        marginLeft: 15
    },
    textViewStyle: {
        fontSize: px2dp(Sizes.searchSize),
        color: '#rgba(90,90,90,1)'
    },
    TopImageViewStyle: {
        width: deviceWidth * 0.9,
        height: 60,
        backgroundColor: 'rgba(0,60,130,1)',
        flexDirection: 'row',
        alignItems: 'center'
    }
});