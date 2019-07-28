/**反馈信息
 * Created by Monika on 2016/12/28.
 */
'use strict';
import React, {Component} from "react";
import {Alert, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {setFeedBack} from "../../../../dao/SysDao";
import {
    BGColor,
    BGTextColor,
    borderColor,
    borderRadius,
    connect,
    Loading,
    px2dp,
    textHeight,
    toastShort
} from "../../../../common/CommonDevice";
import CommonLoginButton from "../../../../component/CommonLoginButton";
import TimerEnhance from "react-native-smart-timer-enhance";

const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];

class FeedBack extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            stringLen: '0/200',
            content: ''
        };
    }

    getLoading() {
        return this.refs['loading'];
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView scrollEnabled={false} keyboardShouldPersistTaps='always'>
                    <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}>
                        <View style={styles.inputbg}>
                            <TextInput
                                style={styles.tv_content}
                                placeholder='请输入您对我们的建议'
                                placeholderTextColor='#aaaaaa'
                                autoFocus={true}
                                multiline={true}
                                maxLength={200}
                                underlineColorAndroid='transparent'
                                onLayout={this._inputOnLayout.bind(this)}
                                onChangeText={(text) => this.textChange(text)}/>
                        </View>
                        <View style={{}}>
                            <Text style={{textAlign: 'right', padding: 5}}>
                                {this.state.stringLen}
                            </Text>
                        </View>

                        <View style={{alignItems: 'center', marginTop: 10}}>
                            <CommonLoginButton
                                {...this.props}
                                name='提交'
                                num={0}
                                compent={this}
                                style={{backgroundColor: this.state.content ? BGTextColor : '#rgba(190,190,190,1)'}}
                                onPress={() => this.submitFeedBack()}
                            /></View>
                    </View>

                </ScrollView>
                <Loading ref={'loading'}/>
            </View>
        )
    }

    textChange(text) {
        let strTemp = '';
        if (text.length == 0) {
            strTemp = "0/200";
        } else {
            strTemp = text.length + "/200"
        }
        this.setState({
            content: text,
            stringLen: strTemp
        });
    }

    _onStartShouldSetResponderCapture(event) {
        let target = event.nativeEvent.target;
        if (!inputComponents.includes(target)) {
            dismissKeyboard();
        }
        return false;
    }

    _inputOnLayout(event) {
        inputComponents.push(event.nativeEvent.target);
    }

    submitFeedBack() {
        const {navigate, goBack} = this.props.navigation;
        if (!this.state.content) {
            toastShort("请输入您的建议再进行提交操作！！！");
            return;
        }
        this.getLoading().show();
        //请求列表数据
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        setFeedBack(this.state.content, userObj.userid, this.props.navigation, (result) => {
            //返回ok 表示提交成功
            this.getLoading().dismiss();
            if (result === "ok") {
                Alert.alert("", "反馈提交成功，我们会尽快处理！！！", [
                    // {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                    {text: '确定', onPress: () => goBack()},
                ]);
            }
        }, (error) => {
            this.getLoading().dismiss();
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
        flexDirection: 'column'
    },
    tv_content: {
        height: 100,
        justifyContent: 'flex-start',
        textAlign: 'left',
        fontSize: px2dp(14)
    },
    inputbg: {
        backgroundColor: 'white',
        padding: 5,
        marginTop: 10,
    },
    commitView: {
        borderRadius: borderRadius,
        borderColor: borderColor,
        margin: 10,
        backgroundColor: BGTextColor,
        alignItems: 'center',
        height: textHeight,
        justifyContent: 'center'
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(TimerEnhance(FeedBack));