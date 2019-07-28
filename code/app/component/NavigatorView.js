/**导航条
 * Created by coatu on 2016/12/21.
 */
import React, {Component} from "react";
import {Image, Platform, StyleSheet, Text, TextInput, View,StatusBar} from "react-native";
import {actionBar, BGTextColor, borderRadius, deviceWidth, Metrics, PlatfIOS, px2dp} from "../common/CommonDevice";
import ATouchableHighlight from "./ATouchableHighlight";
import {scaleSize} from "../common/ScreenUtil";

const dismissKeyboard = require('dismissKeyboard');
export default class NavigatorView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            defaultText: this.props.defaultValues || '',
            leftTitle: '',
            leftImageSource: false,
            contentTitle: '',
            contentImageSource: true,
            defaultValues: '',
            rightTitle: '',
            rightImageSource: true,
            onRightPress: null,
        };
    }

    // 构造
    render() {
        const {rightMsgCount, placeholder, onChangeText,style,onTitleOnPress} = this.props;
        return (
            <View style={[styles.allViewStyle,style]}>
                <View style={{flexDirection: 'row', height: actionBar}}>
                    <View style={styles.leftViewStyle}>
                        <ATouchableHighlight onPress={() => {
                            dismissKeyboard();
                            this.props.leftOnPress ? this.props.leftOnPress() : this.props.navigation.goBack();
                        }}>
                            <View>
                                {
                                    this.props.leftTitle ?
                                        <Text
                                            style={[styles.titleStyle, {paddingLeft: PlatfIOS ? placeholder ? 7 : 10 : 10,textAlign:'left'},]}>{this.props.leftTitle}</Text> : null
                                }
                                {
                                    !this.props.leftImageSource?
                                        <View>
                                            <Image source={require('../imgs/navigator/back_btn.png')}
                                                     style={styles.leftImageStyle}/>
                                        </View> : null
                                }
                            </View>
                        </ATouchableHighlight>
                    </View>

                    {/*中间*/}
                    {this.props.contentTitleView?<View style={{alignItems: 'center',marginTop:scaleSize( PlatfIOS ? 34 : 0),
                        justifyContent: 'center',}}>{this.props.contentTitleView()}</View>:   <View style={styles.contentViewStyle}>
                        {
                            !this.props.contentTitle ?
                                this.props.isShowTabBar?
                                    <View/>:
                                    <View style={styles.TextInputViewStyle}>
                                        <TextInput
                                            style={styles.textStyle}
                                            defaultValue={this.props.defaultValues}
                                            placeholder={placeholder ? placeholder : '优众优料任你选'}
                                            placeholderTextColor='#rgba(0,0,0,0.5)'
                                            autoFocus={!this.props.defaultValues || false}
                                            underlineColorAndroid='transparent'
                                            onChangeText={onChangeText ? onChangeText : (text) => this.getSearchName(text)}
                                            clearButtonMode='always'

                                        />
                                    </View> :
                                <ATouchableHighlight onPress={onTitleOnPress}>
                                    <Text style={{
                                        justifyContent:"center",
                                        marginTop: PlatfIOS ? 7 : 0,
                                        alignItems: 'center',
                                        fontSize: px2dp(PlatfIOS ? 18 : Metrics.titleText),
                                        color: 'white',
                                        alignSelf: 'center',
                                    }}>{this.props.contentTitle}</Text>
                                </ATouchableHighlight>
                        }
                        {
                            this.props.contentImageSource ?
                                <Image source={this.state.contentImageSource} style={styles.leftImageStyle}/> : null
                        }
                    </View>}

                    {/*右边*/}
                    <View style={styles.rightViewStyle}>
                        <ATouchableHighlight
                            onPress={this.props.onRightPress ? this.props.onRightPress : this.onPressHandler}>
                            <View style={{justifyContent: 'center',alignItems:"center"}}>
                                {
                                    this.props.rightTitle !== '' ?
                                        <View style={[{flexDirection: 'row'}, PlatfIOS ? {} : {}]}>
                                            <Text
                                                style={[styles.titleStyle, {paddingRight: PlatfIOS ? placeholder ? 7 : 15 : 10,   textAlign: 'right',},]}>{this.props.rightTitle}</Text>
                                            {rightMsgCount > 0 ?
                                                <View style={styles.circularViewStyle}>
                                                    <Text
                                                        style={styles.circularTextStyle}>{rightMsgCount > 99 ? '···' : rightMsgCount}</Text>
                                                </View> : null}
                                        </View> : null

                                }
                                {
                                    this.props.rightImageSource !== undefined ?
                                        <Image source={require('../imgs/navigator/search_btn.png')}
                                               style={styles.rightImageStyle}/> : null
                                }
                            </View>
                        </ATouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }

    getSearchName(text) {
        this.setState({
            defaultText: text
        })
    }

    onPressHandler = () => {
        const {rightOnPress} = this.props;
        if (this.props.callback) {
            this.props.callback(this.state.defaultText);
        }
        rightOnPress();
    }
}


const styles = StyleSheet.create({
    allViewStyle: {
        backgroundColor: BGTextColor,
        width: '100%',
    },

    leftViewStyle: {
        flex: 1,
        // backgroundColor:"blue",
        justifyContent: 'center',
        // alignItems:"center",
    },

    leftImageStyle: {
        width: PlatfIOS ? 50 : 50,//21.6
        height: PlatfIOS ? 50 : 50,//45.6
        // position: PlatfIOS ? 'absolute' : 'relative',
        top: PlatfIOS ? 7 : 0,
    },

    contentViewStyle: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:"blue",
        marginTop: PlatfIOS ? 8 : 0
    },

    rightViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },

    titleStyle: {
        color: 'white',
        marginTop: PlatfIOS ? 18 : 0,
        fontSize: px2dp(Metrics.rightTitleText)
    },

    rightImageStyle: {
        width: PlatfIOS ? 60 : 50,
        height: PlatfIOS ? 60 : 50,
        top: Platform.OS === 'ios' ? -10 : -7,
    },

    TextInputViewStyle: {
        backgroundColor: 'transparent',
        marginTop: PlatfIOS ? 6 : 2,
    },

    textStyle: {
        width: PlatfIOS ? deviceWidth - 120 : deviceWidth - 100,
        height: 40,
        borderRadius: borderRadius,
        backgroundColor: 'white',
        fontSize: px2dp(14),
        paddingLeft: 10,
        alignItems:'center'
    },

    circularViewStyle: {
        width: scaleSize(PlatfIOS ? 36 : 32),
        height: scaleSize(PlatfIOS ? 36 : 32),
        backgroundColor: 'white',
        borderRadius: scaleSize(PlatfIOS ? 18 : 16),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: scaleSize(PlatfIOS ? 2 : 0),
        right: scaleSize(PlatfIOS ? 5 : 1)
    },
    circularTextStyle: {
        color: 'red',
        fontSize: px2dp(PlatfIOS ? 10 : 9),
        alignSelf: 'center'
    }
});
//
// export default NavigatorView;