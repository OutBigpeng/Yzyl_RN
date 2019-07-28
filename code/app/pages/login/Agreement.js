/** 协议
 * Created by coatu on 16/8/10.
 */
'use strict';
import React, {Component} from "react";
import {Platform, StyleSheet, View, WebView} from "react-native";
import {BGColor, deviceHeight, Loading} from "../../common/CommonDevice";
import {userAgreementById} from "../../dao/UserInfoDao";

export default class Agreement extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            detailData: ''
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    {/*加载webView*/}
                    <WebView
                        automaticallyAdjustContentInsets={true}
                        style={styles.webView}
                        source={Platform.OS === 'ios' ? {
                            html: this.state.detailData.content,
                            baseUrl: ''
                        } : {html: this.state.detailData.content}}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        scalesPageToFit={this.state.scalesPageToFit}
                    />
                </View>
                <Loading ref={'loading'}/>
            </View>

        );
    };


    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    componentDidMount() {
        let {state} = this.props.navigation;
        this.getLoading().show();
        let data = {'agreementName': state.params.agreementName || state.params.title};
        userAgreementById(data, (res) => {
            if (this.getLoading()) {
                this.getLoading().dismiss();
            }
            this.setState({
                detailData: res
            })
        }, (err) => {
            if (this.getLoading()) {
                this.getLoading().dismiss();
            }
        })
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: BGColor,
        flex: 1,
        height: deviceHeight
    },

    webView: {
        padding: 10,
        paddingTop: 20

    }
});