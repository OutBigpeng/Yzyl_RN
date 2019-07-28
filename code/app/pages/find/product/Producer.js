/**生产商介绍
 * Created by coatu on 16/8/10.
 */
'use strict';
import React, {Component} from "react";
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    ScrollView,
    Image,
    InteractionManager,
    TouchableOpacity,
    AsyncStorage,
    WebView
} from "react-native";
// 引入外部组件
import {Colors, deviceWidth, px2dp, Sizes} from "../../../common/CommonDevice";
import {HTMLSource} from "../../../common/CommonUtil";
import AutoHeightWebView from "../../../component/autoHeightWebView/index";
import {setHtml} from "./Detail";

export default class producer extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            detailData: {},
            introduce: '',
            height: 800,
        };
    }

    render() {
        const html = this.props.supplier&&this.props.supplier.introduce||"";
        let sss = setHtml(`<div>${html}</div>`,13);
        return (
            <ScrollView style={styles.container}>
                <Image
                    source={this.props.supplier.banner?{uri:this.props.supplier.banner} :require('../../../imgs/other/default131.png')}
                    style={{width:deviceWidth-10,height:120, resizeMode:'contain'}}/>
                <View style={{height: this.state.height}}>
                    <WebView
                        source={{html:sss}}
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
        flex: 1,
        marginBottom: 60,
        // alignItems: 'center'
    },

    webView: {
        width: deviceWidth - 20,
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: 10,
        height: 500
    },

    tixiViewStyle: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        marginLeft: 15
    },

    textViewStyle: {
        fontSize: px2dp(13),
        color: '#rgba(90,90,90,1)'
    }
});