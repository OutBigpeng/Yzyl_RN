/**
 * Created by Monika on 2018/5/22.
 */
import React, {Component} from 'react';
import {Image, StyleSheet, Text, TextInput, View,} from 'react-native';
import {actionBar, BGTextColor, deviceWidth, PlatfIOS, Sizes} from "../../../../common/CommonDevice";
import Images from "../../../../themes/Images";
import {px2dp} from "../../../../common/CommonUtil";
import {scaleSize} from "../../../../common/ScreenUtil";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";

class MallGoodsItemView extends Component {
    render() {
        let {style = {}, goodsItem: {goodsImgUrl, score = 0, name, goodsName, createTime}, onPress, type = ""} = this.props;
        return (
            <View style={[{backgroundColor: 'white'}, style]}>
                {type == "view" &&
                <View style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#aaaaaa66',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10
                }}>
                    <Text style={{color: "#999999"}}>{createTime}</Text>
                    <Text style={{color: '#999999'}}>已兑换</Text>
                </View>}
                <View style={[styles.container]}>
                    <Image  resizeMode={Image.resizeMode.cover}
                        source={goodsImgUrl ? {uri: goodsImgUrl} : Images.defaultImage} style={styles.iconStyle}/>
                    <View style={{paddingLeft: 10, justifyContent: 'space-between',flex:1}}>
                        <View>
                            <Text style={{
                                color: 'rgba(0,0,0,0.8)',
                                fontSize: px2dp(PlatfIOS ? 18 : 16)
                            }}>{name || goodsName}</Text>
                            <Text style={{color: '#ff9622', fontSize: px2dp(PlatfIOS ? 14 : 12),marginTop:5}}>{`${score}积分`}</Text>
                        </View>
                        {type == "view" && <ATouchableHighlight onPress={onPress || null}>
                            <View style={{
                                width: scaleSize(120),
                                height: scaleSize(60),
                                borderRadius: scaleSize(8),
                                borderWidth: scaleSize(2),
                                borderColor: "#e4393c",
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{color: "#e4393c"}}>查看</Text>
                            </View>
                        </ATouchableHighlight>}
                    </View>
                </View>
            </View>
        );
    }
}

class ReceiveInfoView extends Component {
    render() {
        let {infoList, returnData, style = {},type='view'} = this.props;
        return (
            <View style={[{marginTop: 10, backgroundColor: 'white',flex:1}, style,]}>
                {
                    infoList.map((item, pos) => {
                        let returnDatum = returnData[item.params];
                        return (
                            <View key={pos} style={[{
                                flexDirection: "row",
                                borderBottomWidth: 0.5,
                                borderBottomColor: '#aaaaaa66',
                                width:deviceWidth,
                                paddingRight:10,
                            },!returnDatum&&{ paddingLeft: 10,}]}>
                                {item.isMust ? <View style={{justifyContent: 'center', alignItems: 'center', width: 8}}>
                                    <Text style={{color: BGTextColor, marginTop: 2}}>*</Text>
                                </View> : <View style={{justifyContent: 'center', alignItems: 'center', width: 8}}/>}
                                {type=="detail" ?
                                    returnDatum?<Text style={[{color:'#666666',
                                            fontSize: px2dp(Sizes.listSize),paddingTop:10,paddingBottom:10,paddingLeft:2,
                                        alignSelf:'center'}]}>{returnDatum}</Text>:<View/>
                                    :
                                    <TextInput
                                        placeholderTextColor={'#999999'}
                                        numberOfLines={1}
                                        placeholder={returnDatum ? "" : item.name}
                                        defaultValue={returnDatum}
                                        keyboardType={item.keyboardType || 'default'}
                                        style={[styles.textInputStyle, {}]}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(text) => {
                                            returnData[item.params] = text;
                                        }}
                                        clearButtonMode='always'
                                    />
                                }
                            </View>)
                    })
                }
            </View>
        )
    }
}

class OrderBottomBtView extends Component {
    render() {
        let {totalScore = 0, onPress = null} = this.props;
        return (
            <View style={styles.bottom}>
                <Text style={{
                    color: 'white',
                    fontSize: px2dp(15),
                    paddingLeft: 20,
                    alignSelf: 'center',
                    flex: 2
                }}>总计：{totalScore}积分</Text>
                <ATouchableHighlight onPress={onPress}>
                    <View style={{
                        backgroundColor: BGTextColor,
                        flexDirection: 'row',
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        paddingLeft: 20,
                        paddingRight: 20
                    }}>
                        <Text style={{color: 'white', fontSize: px2dp(18),}}>提交订单</Text>
                    </View>
                </ATouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 110,
        backgroundColor: "white",
        flexDirection: "row",
        padding: 10,
    },
    iconStyle: {
        width: scaleSize(180),
        height: scaleSize(180),
        alignSelf:'center'
    },
    textInputStyle: {
        flex: 1,
        height: 40,
        fontSize: px2dp(Sizes.listSize),
        flexWrap: 'wrap',
    },
    bottom: {
        height: scaleSize(100),
        backgroundColor: "#404040",
        justifyContent: 'space-between',
        flexDirection: "row",
    }
});

export {MallGoodsItemView, ReceiveInfoView, OrderBottomBtView};