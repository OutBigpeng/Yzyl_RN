/**
 * Created by coatu on 2017/6/26.
 */
import React, {Component} from 'react';
import {Image, StyleSheet, Text, View,} from 'react-native';

import {
    bindActionCreators,
    Colors,
    connect,
    defName,
    deviceWidth,
    ImageStitching,
    px2dp,
    Sizes
} from '../common/CommonDevice'
import Images from '../themes/Images'
import ATouchableHighlight from "./ATouchableHighlight";
import * as LoginAction from "../actions/LoginAction";
import {scaleSize} from "../common/ScreenUtil";
import {formatCurrency} from "../common/CommonUtil";

class CommonHomeListView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
        this._isMounted;
    }

    render() {
        const {item, onPress, view, pageType} = this.props;
        let {markeunitofmeasurement, markeunittprice = 0, publishTime = ''} = item;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let isProduct = view === 'product';
        let time = publishTime;
        let title = '', thumb = '', subText = '';
        let imgStyle = isProduct ? pageType === 'Coating' ? {
            width: scaleSize(160),
            height: scaleSize(120),
            resizeMode: 'contain'
        } : {
            width: scaleSize(120),
            height: scaleSize(120),
            resizeMode: 'contain'
        } : {
            width: scaleSize(160),
            height: scaleSize(120),
        };
        if (isProduct) {
            title = `${item.name}`;//${item.brandname}
            thumb = item.thumb;
            subText = item.inaworddescription// `包装:${item.packnum} ${item.unitofmeasurement}/${item.packunit}`
        } else {
            title = item.title;
            subText = item.catId ? (item.catId === 10 ? item.campus : item.catId === 11 ? '' : item.authorName ? item.authorName : defName) : item.authorName ? item.authorName : defName;

            let domainT = domainObj.info;

            if (item.catId && (item.catId === 10 || item.catId === 11)) {
                domainT = domainObj.prd;
            }
            thumb = item.thumb && item.thumb.indexOf("[") > -1 ? ImageStitching(item.thumb, domainT, true) : item.thumb;
        }
        // markeunittprice=88.999
        return (
            <ATouchableHighlight onPress={onPress}>
                <View style={[styles.rowViewStyle, {}]}>
                    <Image resizeMode={Image.resizeMode.cover}
                           source={thumb ? {uri: thumb} : Images.articleDefaultImage}
                           style={[imgStyle, {}]}/>

                    <View
                        style={[styles.rightViewStyle, !isProduct ? {justifyContent: 'space-between'} : {}]}>
                        <View style={{flex: 3}}>
                            <Text numberOfLines={2}
                                  style={styles.titleStyle}>{title}</Text>
                            {isProduct && <Text numberOfLines={markeunittprice ? 1 : 2} style={{
                                fontSize: px2dp(Sizes.searchSize),
                                color: Colors.ExplainColor, marginTop: scaleSize(8)
                            }}>{subText}</Text>}
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            {subText && !isProduct ? <Text numberOfLines={1}
                                                           style={styles.nameStyle}>{subText}  </Text> : <View/>}
                            <Text
                                style={styles.timeStyle}>{time}</Text>
                            {markeunittprice ?
                                <View style={{flex: 1, alignItems: 'flex-end'}}>
                                    <Text style={{
                                        color: Colors.titleColor,
                                        fontSize: px2dp(Sizes.searchSize),
                                        alignSelf: 'flex-end',
                                        paddingRight: scaleSize(12),
                                        paddingTop: scaleSize(3)
                                    }}>指导价：￥{formatCurrency(markeunittprice.toFixed(2))}/{markeunitofmeasurement}</Text>
                                </View> : null}

                        </View>
                    </View>
                </View>
            </ATouchableHighlight>
        )
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const styles = StyleSheet.create({
    rowViewStyle: {
        width: '100%',
        borderBottomColor: Colors.line,
        borderBottomWidth: scaleSize(2),
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: scaleSize(18),
        paddingVertical: scaleSize(20),
        alignItems: 'center'
    },

    titleStyle: {
        fontSize: px2dp(Sizes.listSize),
        color: Colors.titleColor,
    },

    timeStyle: {
        color: Colors.inputColor,
        fontSize: px2dp(Sizes.otherSize),
        marginBottom: 0,
    },

    nameStyle: {
        color: Colors.inputColor,
        fontSize: px2dp(Sizes.otherSize),
        maxWidth: deviceWidth / 3
    },

    rightViewStyle: {
        flex: 1,
        marginLeft: scaleSize(20),
    }
});
export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        loginAction: bindActionCreators(LoginAction, dispatch),
    })
)(CommonHomeListView);