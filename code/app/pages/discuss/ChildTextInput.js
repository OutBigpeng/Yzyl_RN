/**
 * Created by Monika on 2018/7/1.
 */
import React, {Component} from 'react';
import {PixelRatio, StyleSheet, Text, View,} from 'react-native';
import {PlatfIOS, px2dp,} from "../../common/CommonDevice";
import ATouchableHighlight from '../../component/ATouchableHighlight'
import {scaleSize} from "../../common/ScreenUtil";
import AutoHeightTextInput from "../../component/AutoHeightTextInput";

export default class ChildTextInput extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            focused: this.props.value.length > 0,
        };
    }
    focus() {
        this.refs.autoInput.focus();
    }
    render() {
        let {placeholder, onChangeText, onPress = {}, value = ''} = this.props;
        return (
            <View style={styles.inputRow}>
                <View style={styles.searchRow}>
                    <AutoHeightTextInput
                        ref='autoInput'
                        multiline={true}
                        allowAutoHeight={false}
                        blurOnSubmit={false}
                        {...this.props}
                        style={[styles.searchInput]}
                        defaultValue={value}
                        value={value}
                        underlineColorAndroid='transparent'
                        onChange={(event) => {
                            let text = event.nativeEvent.text;
                            this.setState({
                                focused: text.length > 0,
                            });
                        }}
                        onChangeText={onChangeText}
                        placeholder={placeholder}/>

                </View>
                {this._renderSendButton(onPress)}
            </View>

        );
    }

    _renderSendButton(onPress = {}) {
        const {focused} = this.state;
        return focused ? (
            <ATouchableHighlight style={styles.searchExtra} onPress={onPress}>
                <Text style={styles.sendText}>发送</Text>
            </ATouchableHighlight>
        ) : null
    }
}

const styles = StyleSheet.create({
    inputRow: {
        paddingHorizontal: scaleSize(12),
        flexDirection: 'row',
        paddingVertical: scaleSize(15),
        backgroundColor: 'white',
        borderTopWidth: PixelRatio.roundToNearestPixel(0.4),
        borderTopColor: 'rgba(173, 185, 193, 0.5)'
    },
    searchRow: {
        flex: 6,
        backgroundColor: 'white',
        paddingHorizontal: scaleSize(6),
        paddingVertical: scaleSize(4),
        borderRadius: scaleSize(6),
        borderWidth: PixelRatio.roundToNearestPixel(0.4),
        borderColor: 'rgba(190, 190, 190, 1)',
    },
    searchInput: {
        textAlignVertical: 'top',
        justifyContent: 'flex-start',
        textAlign: 'left',
        fontSize: px2dp(13),
        paddingHorizontal: scaleSize(5),
    },
    searchExtra: {
        justifyContent: 'center',
        flex: 1,
        alignItems: "center",
        // backgroundColor:"blue"
    },
    sendText: {
        color: 'rgba(0, 186, 110, 1)',
        fontSize: px2dp(PlatfIOS ? 15 : 13)
    },
});