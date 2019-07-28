/**
 * Created by Monika on 2018/7/1.
 */
import React, {Component} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {scaleSize} from "../common/ScreenUtil";
import MultilineTextInput from "../containers/MultilineInput";

export default class AutoHeightTextInput extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {height:scaleSize(150)};
    }

    // onContentSizeChange(event) {
    //     console.log("数据 。。。", event.nativeEvent)
    //     let height = event.nativeEvent.contentSize.height;
    //     height <= scaleSize(180)&&this.setState({height:height});
    //
    // }
    focus() {
        this.refs.mulInput.focus();
    }
    render() {
        return (
                <MultilineTextInput
                    ref='mulInput'
                    autoFocus={true}
                    underlineColorAndroid='transparent'
                    clearButtonMode='always'
                    placeholderTextColor="#aaaaaa"
                    {...this.props}
                    // onContentSizeChange={this.onContentSizeChange.bind(this)}
                    style={[{height: scaleSize(150)},this.props.style]}
                />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});