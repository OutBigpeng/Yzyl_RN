/**
 * Created by coatu on 2016/12/28.
 */
import React, {Component} from "react";
import {Image, InteractionManager, ScrollView, StyleSheet, Text, View} from "react-native";

import {
    BGTextColor,
    borderColor,
    borderRadius,
    Colors,
    deviceWidth,
    PlatfIOS,
    px2dp,
    Sizes
} from "../../../common/CommonDevice";
import ProductBrannerView from "./ProductBrannerView";
import ProductForSample from "./ProductForSample";
import DetailView from "./Detail";
import ProducerView from "./Producer";
import TechnicalView from "./TechnicalpParameter";
import ATouchableHighlight from "../../../component/ATouchableHighlight";
import {scaleSize} from "../../../common/ScreenUtil";
import {formatCurrency} from "../../../common/CommonUtil";

let alertTitle = '拨打客服电话';
let packageList, product;

export default class ProductCenterView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedItem: 'first',
            modalVisible: false,
            vipModalVisible: false,
            mobile: '',
            detail: '',
            supplier: '',
            techParams: ''
        };
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    setVipModalVisible(visible) {
        this.setState({
            vipModalVisible: visible
        });
    }

    render() {
        packageList = this.props.packageList || [];
        product = this.props.productDetailObj && this.props.productDetailObj.product || {};
        let {brandname = '', productname = '', inaworddescription = '', applarea, sampleCount, viewCount, applicationsystem, markeunitofmeasurement, markeunittprice = 0} = product;
        return (
            <ScrollView>
                <View style={styles.allViewStyle}>
                    <View style={styles.TopViewStyle}>
                        <View style={styles.bannerViewStyle}>
                            <ProductBrannerView
                                {...this.props}
                                BrannerData={this.props.BrannerData}
                            />
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                paddingHorizontal: scaleSize(20),
                                paddingTop: scaleSize(20),
                                paddingBottom: scaleSize(15)
                            }}>
                                <Text style={{fontSize: px2dp(PlatfIOS ? 14 : 12)}}>浏览量:{viewCount}</Text>
                                <Text style={{
                                    fontSize: px2dp(PlatfIOS ? 14 : 12),
                                    paddingLeft: scaleSize(15)
                                }}>索样量:{sampleCount}</Text>
                            </View>
                        </View>
                        <View style={styles.NameViewStyle}>

                            <Text style={{
                                color: Colors.titleColor,
                                fontSize: px2dp(Sizes.listSize)
                            }}>{brandname} {productname}</Text>
                            <Text
                                style={{
                                    marginTop: 6,
                                    fontSize: px2dp(Sizes.searchSize),
                                    color: BGTextColor, lineHeight: 20
                                }}>{inaworddescription}</Text>
                        </View>


                        <View style={styles.boxViewStyle}>
                            {this.commonTixiView(applarea, 1)}
                            {this.commonTixiView(applicationsystem, 2)}

                        </View>

                        <View style={styles.NameViewStyle}>
                            <Text style={{fontSize: px2dp(Sizes.listSize)}}>包装</Text>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.packBottomViewStyle}>
                                <View style={styles.packAllViewStyle}>
                                    {packageList.map((obj, pos) => {
                                        return (
                                            <View key={pos} style={styles.packLeftViewStyle}>
                                                <Text
                                                    style={{
                                                        fontSize: px2dp(Sizes.searchSize),
                                                        color: 'gray'
                                                    }}>{obj.packnum} {obj.unitofmeasurement}/{obj.packunit}</Text>
                                            </View>
                                        )
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                        {markeunittprice ?
                            <View style={[styles.NameViewStyle, {flexDirection: 'row', alignItems: 'center'}]}>
                                <Text style={{fontSize: px2dp(Sizes.listSize)}}>指导价 : </Text>
                                <Text
                                    style={{}}>￥{formatCurrency(markeunittprice.toFixed(2))}/{markeunitofmeasurement}</Text>
                            </View> : null}
                    </View>

                    {/*d底部*/}
                    <View style={styles.bottomViewStyle}>
                        <View style={styles.bottomTopStyle}>
                            {this.commonBottomViewStyle('first', '技术参数')}
                            {this.commonBottomViewStyle('second', '产品详情')}
                            {this.commonBottomViewStyle('three', '生产商介绍')}
                        </View>

                        <View>
                            {this.justToView()}
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }

    commonTixiView(item, option) {
        return (
            <View style={[styles.txViewStyle, {marginTop: option === 1 ? 0 : 8}]}>
                <Image source={require('../../../imgs/find/Instructions.png')} style={styles.boxImageStyle}/>
                <Text style={[styles.boxTextStyle]}>{item}</Text>
            </View>
        )
    }

    commonShareView(name, imageSoure, number) {
        return (
            <ATouchableHighlight onPress={() => this.press(number)}>
                <View style={styles.ShareViewStyle}>
                    <Image source={imageSoure} style={{width: 20, height: 20}}/>
                    <Text
                        style={{
                            marginLeft: 5,
                            color: name === '索样' ? (product.samples === 1 ? '#000' : 'gray') : '#000'
                        }}>{name}</Text>
                </View>
            </ATouchableHighlight>
        )
    }

    commonBottomViewStyle(selectedItem, name) {
        return (
            <ATouchableHighlight onPress={() => this.setState({selectedItem: selectedItem})}>
                <Text
                    style={{
                        color: this.state.selectedItem === selectedItem ? BGTextColor : 'black',
                        fontSize: px2dp(Sizes.listSize)
                    }}>{name}</Text>
            </ATouchableHighlight>
        )
    }

    press(number) {
        const {navigate} = this.props.navigation;
        switch (number) {
            case 1: {
                product.samples === 1 ?
                    InteractionManager.runAfterInteractions(() => {
                        navigate('ProductForSample', {
                            name: 'ProductForSample',
                            productName: (product.brandname || "") + product.productname,
                            productDetail: product.inaworddescription,
                            pid: this.props.pid
                        })
                    }) : null
            }
                break;
            case 2: {
                this.setModalVisible(true)
            }
                break;
            default:
                break;
        }
    }

    componentDidMount() {
        // //获取技术参数 产品详情 生产商介绍的接口
        const {navigate, state} = this.props.navigation;
    }


    justToView() {// api_url={this.props.API_PRODUCTPARAMETER}
        if (this.state.selectedItem === 'first') {
            if (product) {
                return (
                    <TechnicalView
                        {...this.props}
                        techParams={this.props.productDetailObj.techParams}
                    />
                )
            }
        } else if (this.state.selectedItem === 'second') {
            return (
                <DetailView
                    {...this.props}
                    productname={product.productname}
                    detail={this.props.productDetailObj.product}
                />
            )
        } else if (this.state.selectedItem === 'three') {
            return (
                <ProducerView
                    supplier={this.props.productDetailObj.supplier}
                />
            )
        }
    }
}

const styles = StyleSheet.create({
    allViewStyle: {},

    TopViewStyle: {
        width: deviceWidth,
        backgroundColor: 'white'
    },

    bannerViewStyle: {
        width: deviceWidth,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        // paddingBottom: scaleSize(5)
    },

    NameViewStyle: {
        width: deviceWidth,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        padding: 10
    },
    xunjiaView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20
    },
    xunjiaIcon: {
        color: BGTextColor,
        fontSize: px2dp(20)
    },
    xunjiaText: {
        color: BGTextColor,
        fontSize: px2dp(15),
        marginLeft: 2
    },
    packBottomViewStyle: {
        flexDirection: 'row',
        marginTop: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    ShareViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },

    packLeftViewStyle: {
        padding: 3,
        borderColor: BGTextColor,
        borderWidth: 1,
        borderRadius: borderRadius,
        marginRight: 5
    },

    bottomViewStyle: {
        marginTop: 20,
        backgroundColor: 'white'
    },

    bottomTopStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1,
        height: 45
    },

    packAllViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    packImageStyle: {
        width: 20,
        height: 20,
        marginLeft: 20
    },

    boxViewStyle: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.line,
        padding: 10
    },

    boxTextStyle: {
        color: Colors.contactColor,
        fontSize: px2dp(Sizes.searchSize),
        marginLeft: 6
    },

    boxImageStyle: {
        width: 10,
        height: 10
    },

    txViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});