/**优惠券条目
 *
 * */
'use strict';
import React, {Component} from "react";
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    Image,
    Modal,
    Alert,
    ListView,
    AsyncStorage,
    ScrollView,
    TouchableHighlight,
    InteractionManager
} from "react-native";
// 引入外部组件

import {deviceWidth, borderColor} from "../common/CommonDevice";
import ATouchableHighlight from "./ATouchableHighlight";

export default class commonCoupon extends Component {

    static defaultProps = {
        couponBgImage: '',
        rowData: ''
    };
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }


    render() {
        let rowData = this.props.rowData;
        let description = rowData.description.replace('\\n', '\n');
        return (
            <View style={styles.containerView}>
                <ATouchableHighlight  onPress={()=>this.pushToCouponView(rowData)}>
                    <View style={styles.contentViewStyle}>
                        <Image source={this.props.couponBgImage}
                               style={{width: deviceWidth * 0.95, height: deviceWidth * 0.95/2.29}}>
                            <View style={{backgroundColor:'transparent'}}>
                                <Text
                                    style={{color:'white',fontSize:16,marginTop: 10,marginLeft:15}}>{rowData.typename}</Text>
                                <View style={styles.couponCenterViewStyle}>
                                    <View style={{flexDirection:'row'}}>
                                        <Text
                                            style={{color:'white',fontSize:20,fontWeight:'bold',marginTop:30}}>￥</Text>
                                        <Text
                                            style={{color:'white',fontSize:50,fontWeight:'bold'}}>{rowData.amount}</Text>
                                    </View>
                                    <View style={styles.textStyle}>
                                        <Text style={{color:'white',fontSize:13}}>{description}</Text>
                                    </View>
                                </View>

                                <View style={[styles.bottomStyle]}>
                                    <Text style={{color:'white',fontSize:13}}>有效期</Text>
                                    <Text
                                        style={{color:'white',fontSize:13}}>{rowData.startime}~{rowData.endtime}</Text>
                                </View>

                            </View>
                        </Image>
                    </View>
                </ATouchableHighlight>
            </View>
        );
    };

    pushToCouponView(rowData) {
        const {navigate} = this.props.navigation;
        InteractionManager.runAfterInteractions(() => {
            navigate('CouPonDetailView',{
                name: 'CouPonDetailView',
                title: '优惠券详情',
                detailData: rowData
            })
        })
    }

};

const styles = StyleSheet.create({
    containerView: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
    },

    couponViewStyle: {
        marginTop: 15,
        borderWidth: 1,
        borderColor: borderColor,
        justifyContent: 'center',
        alignItems: 'center',
        width: deviceWidth * 0.95,
        height: 50,
        marginBottom: 20
    },

    contentViewStyle: {
        marginTop: 20
    },

    couponCenterViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 7,
        height: deviceWidth * 0.95 / 2.29 - 55,
        // backgroundColor:'red'
        //marginTop:10
    },
    bottomStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 0
        // height:25
        //backgroundColor:'red'
        // height:width * 0.95/2.29 - 35
    },

    textStyle: {
        width: deviceWidth - 140,
        padding: 3,
    }


});