/**跳转WebView
 * Created by coatu on 17/01/03.
 */

'use strict';
import React, {Component} from "react";
import {DeviceEventEmitter, Image, Platform, View, WebView} from "react-native";
// 引入外部组件
import {deviceHeight, deviceWidth,connect,bindActionCreators, PlatfIOS} from "../../../../common/CommonDevice";
import {Images, StyleSheet} from "../../../../themes";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";
import {scaleSize} from "../../../../common/ScreenUtil";
import *as LoginAction from "../../../../actions/LoginAction";

 class WebViews extends Component {
    isBack = () => {
        const {state, goBack} = this.props.navigation;
        if (state.params.callback) {
            state.params.callback();
        }
        goBack();
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            navigatePress: this.isBack,
        })
    }

    componentWillUnmount() {
        this.isBack();
    }

    render() {
        const {state} = this.props.navigation;
        return (
            <View style={styles.container}>
                <WebView
                    automaticallyAdjustContentInsets={true}
                    style={styles.webView}
                    source={{uri: state.params.downloadurl}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={this.state.scalesPageToFit}
                    onLoadStart={() => Platform.OS === 'ios' ? this.onLoadStart() : {}}/>

            </View>

        )
    };

    onLoadStart() {
        const {navigate,goBack} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        // goBack()
//         DeviceEventEmitter.emit('RootView');
        // if (item) {
        //     // InteractionManager.runAfterInteractions(() => {
        //     //     navigator.resetTo({
        //     //         component: TabBarView,
        //     //         name: 'TabBarView',
        //     //     });
        //     // })
        // } else {
        //     InteractionManager.runAfterInteractions(() => {
        //         navigator.resetTo({
        //             component: LoginView,
        //             name: 'LoginView',
        //         });
        //     })
        // }
    }

    // componentWillUnmount() {
    //     this.isBack();
    // }
 }
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: Platform.OS === 'ios' ? deviceHeight : deviceHeight,
        width: Platform.OS === 'ios' ? deviceWidth : deviceWidth
    },

    webView: {
        width: deviceWidth,
        height: deviceHeight
    },
    rightStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 10,
        top: 10,
        padding:10,
        borderColor:'white',
        borderWidth:1,
        // backgroundColor:"white",
        borderRadius:25,
        ios: {
            marginTop: 64 / 4
        }
    },

    delImageStyle: {
        width: scaleSize(35),
        height: scaleSize(35),
    }
});
export default connect(state => ({
        state: state,
        routes: state.nav.routes
    }),
    (dispatch) => ({
        loginAction: bindActionCreators(LoginAction, dispatch)
    })
)(WebViews);