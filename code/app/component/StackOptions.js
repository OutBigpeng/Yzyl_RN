/**
 * Created by coatu on 2017/6/7.
 */


import React from 'react';
import {Image, Text, TextInput, View,} from 'react-native';


import {actionBar, BGTextColor, borderRadius, deviceWidth, PlatfIOS, px2dp, Sizes} from '../common/CommonDevice'
import {Metrics, StyleSheet} from "../themes";
import ATouchableHighlight from "./ATouchableHighlight";
import {scaleSize} from "../common/ScreenUtil";

let textInputContent;
const dismissKeyboard = require('dismissKeyboard');

//封装导航
export const StackOptions = (navigation, option) => {
    const {state, goBack} = navigation.navigation;
    const headerStyle = {
        backgroundColor: BGTextColor, elevation: 0,//android阴影,
        shadowOpacity: 0, height: PlatfIOS ? 64 : actionBar//+ StatusBar.currentHeight,
        // paddingTop: StatusBar.currentHeight
    };
    let headerTitle;
    const headerTitleStyle = {
        fontSize: px2dp(PlatfIOS ? 18 : Metrics.titleText), color: 'white', alignSelf: 'center',
        fontWeight: 'normal'
    };
    const headerBackTitle = false;

    //左边
    let headerLeft;
    let leftImageSource = state.params && state.params.leftImageSource ? state.params.leftImageSource : false;
    if (state.params) {
        headerLeft = (
            !leftImageSource ? <ATouchableHighlight
                onPress={state.params && state.params.navigatePress ? () => {
                    dismissKeyboard();
                    state.params.navigatePress()
                } : () => {
                    dismissKeyboard();
                    goBack()
                }}>
                <Image source={require('../imgs/navigator/back_btn.png')}
                       style={{width: 24, height: PlatfIOS ? 50 : 50.667, marginLeft: 10}}/>
            </ATouchableHighlight> : <View style={{width: PlatfIOS ? 36 : 9,}}/>
        )
    } else {
        headerLeft = (<View style={{width: PlatfIOS ? 36 : 9,}}/>);
    }

    //中间
    if (option) {
        headerTitle = option
    } else {
        if (state.params.title) {
            headerTitle = state.params.title
        } else if (state.params) {
            textInputContent = '';
            let {defaultValues = "", onChangeText, isAutoFocus = true} = state.params;
            headerTitle = (
                <View style={[styles.TextInputViewStyle, PlatfIOS ? {} : {width: deviceWidth}]}>
                    <TextInput
                        style={[styles.textStyle, {width: deviceWidth / 4 * 3 + scaleSize(20),}]}
                        defaultValue={defaultValues}
                        placeholder='优众优料任你选'
                        placeholderTextColor='#rgba(0,0,0,0.5)'
                        autoFocus={isAutoFocus}
                        underlineColorAndroid='transparent'
                        onChangeText={onChangeText ? (text) => {
                            textInputContent = text;
                            onChangeText(text)
                        } : (text) => getSearchName(text)}
                        clearButtonMode='always'
                    />
                </View>
            )
        }
    }

    let headerRight, rightTitle, rightImageSource, rightImage, isCollection, isShare, isRightFirstImage, rightLeftImage,
        rightRightImage,
        headerRightHandle;

    if (option) {
        rightTitle = '注册'
    } else {
        rightTitle = state.params.rightTitle;
        rightImageSource = state.params.rightImageSource;
        rightImage = state.params.rightImage;
        isCollection = state.params.isCollection;
        isShare = state.params.isShare;
        isRightFirstImage = state.params.isRightFirstImage || false;
        rightLeftImage = state.params.rightLeftImage;
        rightRightImage = state.params.rightRightImage;
        headerRightHandle = state.params.headerRightHandle
    }
    //右边
    {
        rightTitle ? headerRight = (
            <ATouchableHighlight onPress={() => right(navigation)}>
                <View style={[{
                    alignItems: 'center',
                    justifyContent: 'center',
                }, PlatfIOS ? {marginRight: 10,} : {padding: 10}]}>
                    <Text style={{
                        color: 'white', fontSize: px2dp(PlatfIOS ? 16 : Metrics.rightTitleText),
                    }}>{rightTitle}</Text>
                </View>
            </ATouchableHighlight>
        ) : headerRight = (<View style={{alignItems: 'center', justifyContent: 'center', marginRight: 10}}/>
        )
    }
    {
        rightImageSource ?
            headerRight = headerRightHandle ? headerRightHandle : (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {isRightFirstImage ? <ATouchableHighlight onPress={() => right(navigation, 1)}>
                        <Image source={rightLeftImage ? rightLeftImage : require('../imgs/shop/shoucang.png')}
                               style={{
                                   width: 20,
                                   height: 20, marginRight: 15
                               }}
                               resizeMode={Image.resizeMode.contain}
                        />
                    </ATouchableHighlight> : null}

                    <ATouchableHighlight onPress={() => right(navigation, 2)}>
                        <Image
                            source={isShare ? require('../imgs/home/share.png') : isCollection ? (rightRightImage || require('../imgs/shop/shoucang.png')) : rightImage ? rightImage : require('../imgs/navigator/search_btn.png')}
                            style={{
                                width: rightImage ? 20 : (isShare ? 20 : isCollection ? 20 : 50),
                                height: rightImage ? 20 : (isShare ? 20 : isCollection ? 20 : 50),
                                marginRight: state.params.title ? (!rightImage ? (isShare ? 15 : isCollection ? 15 : 0) : 15) : 0
                            }}
                            resizeMode={Image.resizeMode.contain}
                        />
                    </ATouchableHighlight>
                </View>
            ) : null
    }


    let header;
    if (!option) {
        if (state.params && state.params.isVisible) {
            header = null
        }
    }
    return {
        leftImageSource,
        headerStyle,
        headerTitle,
        headerTitleStyle,
        headerBackTitle,
        headerLeft,
        header,
        headerRight
    }
};


const getSearchName = (text) => {
    textInputContent = text
};

const right = (navigation, type) => {
    const {state, goBack} = navigation.navigation;
    dismissKeyboard();
    setTimeout(() => {
        // if (state.params && state.params.callback) {
        //     state.params.callback(textInputContent);
        // }
        if (type == 1) {
            state.params.rightFirstOnPress();
        } else {
            state.params.rightOnPress && state.params.rightOnPress();
        }
    }, 80)
};

const styles = StyleSheet.create({
    TextInputViewStyle: {
        height: scaleSize(70),
        backgroundColor: 'transparent',//
        alignItems: 'flex-start',
        justifyContent: 'center',
    },

    textStyle: {
        height: scaleSize(70),
        backgroundColor: 'white',
        fontSize: px2dp(PlatfIOS ? Sizes.listSize : 13),
        paddingLeft: scaleSize(35),
        borderRadius: scaleSize(45),
        alignItems: 'center',
        justifyContent: 'center',
        android: {
            // borderRadius: 3,
            paddingVertical: scaleSize(6),
        }
    }
});