/**订单详情
 * Created by Monika on 2016/12/27.
 */
'use strict';
import React, {Component} from "react";
import {AsyncStorage, Image, InteractionManager, ListView, Platform, StyleSheet, Text, View} from "react-native";
import {perJsonOrderDetail, perJsonReBuyMoney, perJsonReBuyOrder} from "../../../../dao/OrderDao";
import OrderTrack from "./OrderTrack";
import AgainBuyModal from "./AgainBuyModal";
import OrderComplete from "./OrderComplete";
import CommonOrderProductView from "../../../find/CommonOrderProduct";
import {
    BGColor,
    BGTextColor,
    borderColor,
    deviceHeight,
    deviceWidth,
    isEmptyObject,
    Loading,
    MobclickAgent,
    px2dp,
    Sizes
} from "../../../../common/CommonDevice";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";
import ProductDetail from "../../../find/product/ProductDetailView";

export default class OrderDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // 初始状态
        this.state = {
            detailData: {},
            dataSource: ds,
            modalVisible: false,
            showData: {},
            requestData: {},
            addressindeterminate: '',
            invoice: '',
            invoiceReceiver: '',
            orderReceiver: '',
            confirmSource: '',
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.listViewStyle]}>
                    <ListView
                        dataSource={this.state.dataSource}
                        contentContainerStyle={{
                            marginTop: 5,
                            paddingBottom: 10,
                        }}
                        renderRow={(rowData) => this.renderRow(rowData)}
                        renderHeader={() => this.renderHeader()}
                        renderFooter={() => this.renderFooter()}
                    />
                </View>
                {/*底部数据*/}
                <View style={styles.bottomView}>
                    <View
                        style={{
                            borderBottomWidth: Platform.OS === 'ios' ? 1 : 0.3,
                            borderBottomColor: borderColor,
                            padding: 8
                        }}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={styles.textStyle}>总额</Text>
                            <Text style={{color: BGTextColor}}>￥{this.state.detailData.prodmoney}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
                            <Text style={styles.textStyle}>优惠券</Text>
                            <Text
                                style={{color: BGTextColor}}>￥{(isEmptyObject(this.state.detailData)) ? "0.00" : this.state.detailData.discount}</Text>
                        </View>
                    </View>
                    <View style={{borderBottomWidth: 0.3, borderBottomColor: '#rgba(0,0,0,0.1)', padding: 8,}}>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Text style={{
                                fontSize: Platform.OS === 'ios' ? px2dp(Sizes.listSize) : px2dp(Sizes.searchSize),
                                paddingRight: 8
                            }}>实付款</Text>
                            <Text style={{color: BGTextColor}}>￥{this.state.detailData.ordermoney}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5}}>
                            <Text
                                style={{fontSize: Platform.OS === 'ios' ? px2dp(Sizes.searchSize) : px2dp(Sizes.otherSize)}}>{this.state.detailData.acttime}</Text>
                        </View>
                    </View>
                </View>
                <AgainBuyModal
                    {...this.props}
                    showData={this.state.showData}
                    requestData={this.state.requestData}
                    onPress={() => this.setModalVisible(false)}
                    callCloseParent={this.childrenState.bind(this)}
                    visible={this.state.modalVisible}
                />

                <Loading ref={'loading'} text={'请等待...'}/>
            </View>
        );
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    childrenState(visible, isJump) {
        const {navigate} = this.props.navigation;
        this.setModalVisible(false);
        if (isJump) {
            this.getLoading().show();
            perJsonReBuyOrder(this.state.requestData, this.props.navigation, (result) => {
                this.getLoading().dismiss();
                InteractionManager.runAfterInteractions(() => {
                    navigate('OrderComplete', {
                        name: 'OrderComplete',
                        type: 2,
                        title: '订单提交成功',
                        orderId: result.orderId
                    });
                })
            }, (error) => {
                this.getLoading().dismiss();
            })
        }
    }

    back = () => {
        // const {type} = this.props.navigation.state.params;
        const {goBack} = this.props.navigation;
        // if (type == 1) {
        //     backCall();
        // }
        goBack();
    };

    againBuy() {
        const {navigate} = this.props.navigation;
        this.getLoading().show();
        const {isLoginIn,userObj={},domainObj} = this.props.state.Login;
            let data = {
                "orderId": this.state.detailData.id,
                "userid": userObj.userid,
                "buyergradeid": userObj.buyergradeid,
                "areaid": userObj.areaid
            };
            perJsonReBuyMoney(data, this.props.navigation, (result) => {
                this.getLoading().dismiss();
                this.setState({
                    showData: result,
                    requestData: data,
                    modalVisible: true
                })
            }, (error) => {
                this.getLoading().dismiss();
            })
    }

    renderHeader() {
        return (
            <View style={{flexDirection: 'column', width: deviceWidth, backgroundColor: 'white', marginBottom: 8}}>
                <View style={styles.item_header}>
                    <Text
                        style={{color: 'black', fontSize: px2dp(Sizes.listSize)}}>订单号:{this.state.detailData.id}</Text>
                    <Text style={{
                        color: BGTextColor,
                        fontSize: px2dp(Sizes.listSize)
                    }}>{this.state.detailData.orderstatus}</Text>
                </View>
                <ATouchableHighlight onPress={() => this.jumpTrack()}>
                    <View style={{
                        flexDirection: 'row', width: deviceWidth, justifyContent: 'space-between',
                        borderBottomColor: borderColor,
                        borderBottomWidth: Platform.OS === 'ios' ? 1 : 0.3
                    }}>
                        <View style={{padding: 8}}>
                            <Text
                                style={{fontSize: Platform.OS === 'ios' ? px2dp(Sizes.searchSize) : px2dp(Sizes.listSize)}}>{this.state.detailData.content}</Text>
                            <Text style={{
                                fontSize: px2dp(Sizes.searchSize),
                                marginTop: 5
                            }}>{this.state.detailData.acttime}</Text>
                        </View>
                        <Image style={{width: 8, height: 12, alignSelf: 'center', marginRight: 10}}
                               source={require('../../../../imgs/other/right_arrow.png')}/>
                    </View>
                </ATouchableHighlight>
            </View>
        )
    }

    getLoading() {
        return this.refs['loading'];
    }

    jumpTrack() {
        const {navigate,state} = this.props.navigation;
        InteractionManager.runAfterInteractions(() => {
            navigate('OrderTrack', {
                title: '订单跟踪',
                name: 'OrderTrack',
                orderId: state.params.orderId,
                orderNum: this.state.detailData.id,
                orderStatu: this.state.detailData.orderstatus,
            })
        })
    }

    renderFooter() {
        return (
            <View style={{marginTop: Platform.OS === 'ios' ? 5 : 0, marginBottom: 5}}>
                {this.receiveAddress("收货人", this.state.orderReceiver.name, this.state.orderReceiver.mobile, this.state.orderReceiver.province + this.state.orderReceiver.city + this.state.orderReceiver.address, 1)}
                {this.invoiceInfo()}
                {this.receiveAddress("发票收货人", this.state.invoiceReceiver.name, this.state.invoiceReceiver.mobile, this.state.invoiceReceiver.province + this.state.invoiceReceiver.city + this.state.invoiceReceiver.address, 2)}
            </View>
        )
    }

    renderRow(rowData) {

        return (
            <View style={{backgroundColor: 'white'}}>
                <CommonOrderProductView
                    row={rowData}
                    onPress={() => {
                        // const {navigate} = this.props.navigation;
                        // console.log("哈哈。。。。。。。。。。。。。", rowData);
                        // InteractionManager.runAfterInteractions(() => {
                        //     navigate('ProductDetail', {
                        //         name: "ProductDetail",
                        //         title: '产品详情',
                        //         pid: rowData.productid,
                        //         rightImageSource: true
                        //     })
                        // })
                    }}
                />
            </View>
        );
    }

    invoiceInfo() {
        return (
            <View style={styles.invoiceInfoViewStyle}>
                <Text style={styles.userTextStyle}>发票信息</Text>
                <View style={{flexDirection: 'column', flex: 3.5}}>
                    <Text
                        style={{
                            color: '#rgba(0,0,0,0.9)',
                            fontSize: px2dp(Sizes.listSize)
                        }}>{this.state.invoice.title || "暂无"}</Text>
                </View>
            </View>
        )
    }

    receiveAddress(infoName, name, phone, detailAddress, type) {
        let noAdress = "暂无";
        if (type == 1) {//如果是收货地址
            if (this.state.addressindeterminate == 1) {
                name = "待定";
                phone = "待定";
                detailAddress = "待定";
            }
        }
        return (
            <View style={{marginTop: 5,}}>
                <Image source={require('../../../../imgs/me/receiver_bg.png')}
                       style={styles.receiverIv}>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={[styles.userTextStyle, {paddingLeft: 10}]}>{infoName}</Text>
                        <View style={{flexDirection: 'column', flex: 3.5}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={require('../../../../imgs/me/ucenter_icon.png')}
                                       style={{width: 16, height: 16}}/>
                                <Text style={styles.addressTv}>{name || noAdress}</Text>
                                <Image source={require('../../../../imgs/me/small_phone.png')}
                                       style={{width: 11, height: 17}}/>
                                <Text style={styles.addressTv}>{phone || noAdress}</Text>
                            </View>
                            <Text numberOfLines={3} style={styles.detailTv}>{detailAddress || noAdress}</Text>
                        </View>
                    </View>
                </Image>
            </View>
        );
    }

    componentDidMount() {
        this.props.navigation.setParams({
            navigatePress: this.back,
        });
        MobclickAgent.onPageStart('订单详情');
        const {navigate,state} = this.props.navigation;
        this.getLoading().show();
        perJsonOrderDetail(state.params.orderId, this.props.navigation, (result) => {
            this.getLoading().dismiss();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result.prodlist),
                detailData: result,
                addressindeterminate: result.addressindeterminate,
                invoice: result.invoice ? result.invoice : '',
                invoiceReceiver: result.invoiceReceiver ? result.invoiceReceiver : '',
                orderReceiver: result.orderReceiver ? result.orderReceiver : '',
            });
        }, (error) => {
            this.getLoading().dismiss();
        });
    }

    componentWillUnmount() {
        MobclickAgent.onPageEnd('订单详情');
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },
    item_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomColor: borderColor,
        borderBottomWidth: Platform.OS === 'ios' ? 1 : 0.3,
        alignItems: 'center'
    },
    addressTv: {
        paddingLeft: 3,
        paddingRight: 8,
        color: '#rgba(0,0,0,0.8)',
        fontSize: px2dp(Sizes.listSize)
    },
    detailTv: {
        fontSize: px2dp(Sizes.searchSize),
        color: 'gray',
        marginTop: Platform.OS === 'ios' ? 5 : 2,
    },
    receiverIv: {
        width: deviceWidth,
        height: 75,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },

    againBuy_style: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#rgba(0,0,0,0.8)',
        height: 45,
    },

    bottomView: {
        backgroundColor: 'white',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 0,
        width: deviceWidth
    },
    listViewStyle: {
        height: ISSHOWCART ? deviceHeight - 230 : deviceHeight - 182,
    },

    buyViewStyle: {
        backgroundColor: BGTextColor,
        height: 45,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },

    userTextStyle: {
        flex: 1,
        alignSelf: 'center',
        color: 'gray',
        fontSize: px2dp(Sizes.listSize)
    },

    rightImageStyle: {
        width: Platform.OS === 'ios' ? 55 : 52,
        height: Platform.OS === 'ios' ? 16 : 15,
        marginTop: 4
    },

    invoiceInfoViewStyle: {
        width: deviceWidth,
        backgroundColor: 'white',
        marginBottom: Platform.OS === 'ios' ? 5 : 0,
        marginTop: Platform.OS === 'ios' ? 10 : 5,
        padding: 8,
        height: Platform.OS === 'ios' ? 60 : 45,
        alignItems: 'center', flexDirection: 'row'
    },

    textStyle: {
        fontSize: px2dp(Sizes.listSize)
    }

});