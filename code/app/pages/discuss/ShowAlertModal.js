/**
 * Created by Monika on 2018/8/15.
 */


'use strict';
import React, {Component} from "react";
import {Modal, ScrollView, StyleSheet, Text, View, TouchableHighlight, TextInput} from "react-native";
import {connect, deviceHeight, deviceWidth, PlatfIOS} from "../../common/CommonDevice";
import {scaleSize} from "../../common/ScreenUtil";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import PropTypes from "prop-types";
import {px2dp} from "../../common/CommonUtil";
import MultilineTextInput from "../../containers/MultilineInput";

const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];

class ShowAlertModal extends Component {
    static propTypes = {
        isShowCancel: PropTypes.bool,
        isShowSure: PropTypes.bool,
        cancelText: PropTypes.string,
        sureText: PropTypes.string,
        titleText: PropTypes.string,
        contentText: PropTypes.string,
        placeholder: PropTypes.string,
        surePress: PropTypes.func,
        isShowInput: PropTypes.bool
    };
    static defaultProps = {
        isShowCancel: true,
        isShowSure: true,
        isShowInput: false,
        cancelText: '取消',
        sureText: '确定',
        title: '',
        content: ''
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {text: '', height: scaleSize(150)};
    };

    componentDidMount() {
    }

    render() {// dismissKeyboard()
        let {modalVisible, onPress, style = {}, title = '', isShowInput, content = '', sureText = '确定', cancelText = '取消', isShowCancel, isShowSure,} = this.props;
        let {text} = this.state;
        return (
            <Modal
                visible={modalVisible}
                animationType={"none"}
                transparent={true}
                onRequestClose={() => onPress()}
            >

                <View style={styles.bgViewStyle}
                      onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}>
                    <View style={[{
                        width: deviceWidth / 3 * 2,
                        backgroundColor: 'white',
                        borderRadius: scaleSize(10)
                    }, style]}>
                        <View minHeight={scaleSize(100)}
                              maxHeight={deviceHeight / 4 * 3}
                              style={{
                                  paddingHorizontal: scaleSize(30), paddingVertical: scaleSize(20)
                              }}>
                            {title ? <Text style={{
                                fontWeight: 'bold',
                                color: '#040404',
                                fontSize: px2dp(PlatfIOS ? 19 : 17),
                                paddingVertical: scaleSize(20)
                            }} numberOfLines={2} ellipsizeMode={'middle'}>{title}</Text> : null}
                            {content ? this.showContentView(content) : null}
                            {isShowInput ? this.showInputView() : null}
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            borderTopColor: '#DBDBDD',
                            alignItems: 'center',
                            borderTopWidth: scaleSize(1)
                        }}>
                            {isShowCancel && <ATouchableHighlight
                                style={{flex: 1, borderRightColor: '#DBDBDD', borderRightWidth: scaleSize(1)}}
                                onPress={() => onPress()}>
                                <Text style={[styles.buttonStyle,]}>{cancelText}</Text>
                            </ATouchableHighlight>}
                            {isShowSure && <ATouchableHighlight style={{flex: 1,}} onPress={() => {
                                onPress(true, text);
                                this.setState({
                                    text: ''
                                })
                            }}>
                                <Text style={styles.buttonStyle}>{sureText}</Text>
                            </ATouchableHighlight>}
                        </View>
                    </View>
                </View>

            </Modal>
        );
    }

    showInputView() {
        let {placeholder} = this.props;
        return (
            <View style={[{
                height: scaleSize(220),
                borderColor: '#353535',
                borderWidth: scaleSize(1),
                borderRadius: scaleSize(10),
                marginVertical: scaleSize(15)
            }, PlatfIOS && {padding: scaleSize(10)}]}>
                <MultilineTextInput
                    ref='mulInput'
                    autoFocus={true}
                    value={this.state.text}
                    placeholder={placeholder}
                    underlineColorAndroid='transparent'
                    clearButtonMode='always'
                    placeholderTextColor="#aaaaaa"
                    {...this.props}
                    onLayout={this._inputOnLayout.bind(this)}
                    onChangeText={(text) => {
                        this.setState({
                            text: text
                        })
                    }}
                    // onContentSizeChange={this.onContentSizeChange.bind(this)}
                    style={[this.props.style, {height: scaleSize(200)}]}
                />
            </View>
        );
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

    onContentSizeChange(event) {
        let height = event.nativeEvent.contentSize.height;
        let maxHeight = deviceHeight / 2;
        this.setState({height: height > maxHeight ? maxHeight : height});
    }

    showContentView(content) {
        return (
            <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{alignItems: 'center'}}>
                <Text style={{
                    color: '#040404',
                    paddingVertical: scaleSize(20),
                    fontSize: px2dp(PlatfIOS ? 16 : 15),
                    lineHeight: scaleSize(40)
                }}>{content}</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgViewStyle: {
        backgroundColor: '#rgba(0,0,0,0.5)',
        flex: 1,
        width: deviceWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonStyle: {
        color: '#3292FF',
        paddingVertical: scaleSize(PlatfIOS ? 30 : 25),
        textAlign: 'center',
        fontSize: px2dp(PlatfIOS ? 16 : 15)
    },

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(ShowAlertModal);