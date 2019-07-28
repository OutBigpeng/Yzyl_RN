/**订单里面的产品条目
 * Created by coatu on 2017/1/12.
 */
import React, {Component} from "react";
import {View, Text, StyleSheet, Platform, Image, TouchableHighlight, InteractionManager} from "react-native";
import {deviceWidth, borderRadius, borderColor, isEmptyObject, BGTextColor,px2dp,Sizes} from "../../common/CommonDevice";
import ATouchableHighlight from "../../component/ATouchableHighlight";

export default class CommonOrderProduct extends Component {
    render() {
        let {row={}} = this.props;
        return (
            <ATouchableHighlight onPress={this.props.onPress}>
                <View style={styles.listRowViewStyle}>
                    {/*中间*/}
                    <View style={{padding:3}}>
                        { <Image style={styles.leftImageStyle}
                                 source={!(row.thumb )? require("../../imgs/other/defaultimg.png") : {uri:row.thumb} }/>}
                    </View>
                    {/*右边*/}
                    <View style={styles.rightTextViewStyle}>
                        {/**/}
                        <Text
                            style={{fontSize:px2dp(Sizes.listSize),color:'black'}}>{row.productname || row.name}</Text>
                        <Text
                            style={styles.baozhuangTextStyle}>包装:{row.packnum}{row.unitofmeasurement}/{row.packunit}x{row.quantity}</Text>

                        <View style={styles.textViewStyle}>
                            <Text
                                style={styles.textStyle}>￥{row.packprice}/{row.unitofmeasurement}</Text>
                        </View>
                    </View>
                </View>
            </ATouchableHighlight>
        )
    }

}

const styles = StyleSheet.create({
    leftImageStyle: {
        width: Platform.OS === 'ios' ? 70 : 50,
        height: Platform.OS === 'ios' ? 70 : 50,
        // borderRadius: borderRadius,
        resizeMode: 'contain'
    },

    rightTextViewStyle: {
        width: deviceWidth - 95,
        marginLeft: 10,
        marginTop: 5,
    },

    rightImageStyle: {
        width: Platform.OS === 'ios' ? 55 : 52,
        height: Platform.OS === 'ios' ? 16 : 15,
        marginTop: 4
    },

    textStyle: {
        color: BGTextColor,
        fontSize: px2dp(Sizes.searchSize),
        marginTop: Platform.OS === 'ios' ? 4 : 0
    },

    baozhuangTextStyle: {
        marginTop: 4,
        color: 'rgba(0,0,0,0.4)',
        fontSize: px2dp(Sizes.searchSize)
    },

    listRowViewStyle: {
        paddingLeft: 8,
        paddingTop: 3,
        paddingBottom: 3,
        flexDirection: 'row',
        borderBottomColor: borderColor,
        borderBottomWidth: Platform.OS === 'ios' ? 1 : 0.3,
        backgroundColor: 'white'
    }
});