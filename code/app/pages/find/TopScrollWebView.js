/**WebView页面   首页产品跳转
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
import NavigatorView from "../../component/NavigatorView";
import {BGColor, deviceHeight,deviceWidth} from "../../common/CommonDevice";

export default class WebViews extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            detailData: '',
            webViewHeight: deviceHeight
        };
    }

    render() {
        // console.log("哈哈-----",this.props.navigation.state.params.linkurl)
        return (
            <View style={styles.container}>
                {/*导航*/}
                    <WebView
                        ref={(c) => {this.web = c}}
                        source={{uri: this.props.navigation.state.params.linkurl}}
                        scalesPageToFit={this.state.scalesPageToFit}
                        javaScriptEnabled={true}
                        scrollEnabled={true}
                        startInLoadingState={true}
                        automaticallyAdjustContentInsets={true}
                    />
            </View>/*this.props.route.linkurl*/
        );
    };
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
});