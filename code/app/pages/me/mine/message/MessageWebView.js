 /** 跳转WebView 例如消息
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
    ListView,
    AsyncStorage,
    TouchableOpacity,
    Alert,
    WebView
} from "react-native";
// 引入外部组件
import NavigatorView from "../../../../component/NavigatorView";

export default class MessageWebView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            detailData: ''
        };
    }
    componentWillMount() {
        const {navigate, state} = this.props.navigation;
        this.rowData = state.params && state.params.rowData || {};
    }


    render() {
        let {content="",title=""} = this.rowData;



        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    {/*导航*/}
                    <NavigatorView
                        {...this.props}
                        contentTitle={title}
                    />

                    {/*加载webView*/}
                    <WebView
                        automaticallyAdjustContentInsets={true}
                        style={styles.webView}
                        source={Platform.OS === 'ios'?{html:content,baseUrl:''}:{html:content}}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        scalesPageToFit={this.state.scalesPageToFit}
                    />
                </View>
            </View>

        );
    };

};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#rgba(241,242,243,1)',
        flex: 1,
    },

    webView: {
        padding: 10,
        paddingTop: 20
    }
});



