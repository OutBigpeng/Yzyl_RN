/**跳转AppStore
 * Created by coatu on 2017/1/16.
 */
import React, {Component} from "react";
import {Modal, StyleSheet, View, WebView} from "react-native";

export default class commonModalAppStore extends Component {
    render() {//    url = 'itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?mt=8&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software&id=APP_ID';

        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => this.props.closeModal()}
            >
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    <WebView
                        automaticallyAdjustContentInsets={true}
                        style={styles.webView}
                        source={{uri: 'https://itunes.apple.com/cn/app/you-zhong-you-liao/id1089097137?mt=8'}}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        onLoadStart={() => {
                            const {navigate, goBack} = this.props.navigation;
                            goBack();
                            this.props.closeModal()
                        }}
                        onLoad={() => {
                        }}
                        onLoadEnd={() => {
                        }}
                        //{/*scalesPageToFit={this.state.scalesPageToFit}*/}
                    />
                </View>
            </Modal>
        )
    }

    // onLoadStart(){
    //     this.setWebViewVisible(!this.state.isModalWebViewVisible)
    // }
}

const styles = StyleSheet.create({
    webView: {
        // width:deviceWidth,
        // height:deviceHeight
    }
});