// /**确认订单
//  * Created by Monika on 2016/11/3.
//  * 下订单
//  */
// 'use strict';
// import React, {Component} from "react";
// import {AsyncStorage, Image, InteractionManager, ListView, Platform, StyleSheet, Text, View} from "react-native";
// import * as ShowAddressAction from "../../actions/ShowAddressAction";
// import {perJsonOrderCommit, perJsonOrderConfirm} from "../../dao/OrderDao";
// import OrderComplete from "../me/mine/order/OrderComplete";
// import CommonOrderProductView from "../../component/CommonOrderProduct";
// import {
//     BGColor,
//     BGTextColor,
//     bindActionCreators,
//     borderColor,
//     borderRadius,
//     connect,
//     deviceWidth,
//     isEmptyObject,
//     Loading,
//     MobclickAgent,
//     px2dp,
//     toastShort
// } from "../../common/CommonDevice";
// import CartReceiveAddress from "./CartReceiveAddress";
// import CartBill from "./CartBill";
// import CartCoupon from "./CartCoupon";
// import ATouchableHighlight from "../../component/ATouchableHighlight";
//
// class ConfrimOrder extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//         // 初始状态
//         this.state = {
//             userInfo: {},
//             orderReceiver: {},
//             invoiceReceiver: {},
//             invoice: {},
//             dataSource: ds,
//             couponnum: 0,
//             couponData: {},
//             ordermoney: 0,
//             discount: 0,
//             products: this.props.navigation.state.params.carJson
//         };
//
//     }
//
//
//     render() {
//         let realMoney = 0.00;
//         if (this.state.couponData) {
//             realMoney = this.state.ordermoney - (isEmptyObject(this.state.couponData) ? 0 : this.state.couponData.amount);
//         } else {
//             realMoney = this.state.ordermoney;
//         }
//         return (
//             <View style={styles.container}>
//
//                 <View style={styles.listViewStyle}>
//                     <ListView
//                         dataSource={this.state.dataSource}
//                         renderRow={(rowData) => this.renderRow(rowData)}
//                         renderFooter={() => this.renderFooter()}
//                         enableEmptySections={true}
//                         style={styles.ListView}
//                     />
//                 </View>
//
//                 {/*底部数据*/}
//                 <View style={styles.bottomView}>
//                     <View style={{padding: 8}}>
//                         <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                             <Text style={styles.orderTextStyle}>订单金额</Text>
//                             <Text style={{color: BGTextColor}}>￥{(this.state.ordermoney).toFixed(2)}</Text>
//                         </View>
//                         <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 6}}>
//                             <Text style={styles.orderTextStyle}>优惠券</Text>
//                             <Text
//                                 style={{color: BGTextColor}}>￥{(isEmptyObject(this.state.couponData)) ? "0.00" : this.state.couponData.amount.toFixed(2)}</Text>
//                         </View>
//                     </View>
//                     <View style={styles.realMoneyView}>
//                         <View style={{flexDirection: 'row', alignItems: 'center', flex: 3}}>
//                             <Text
//                                 style={{fontSize: px2dp(14), paddingRight: 8, color: 'white'}}>实付款</Text>
//                             <Text
//                                 style={{
//                                     color: 'white',
//                                     fontSize: px2dp(Platform.OS === 'ios' ? 14 : 12)
//                                 }}>￥{realMoney.toFixed(2)}</Text>
//                         </View>
//                         <ATouchableHighlight onPress={() => this.commitOrder()}>
//                             <View style={styles.commitTv}>
//                                 <Text style={{
//                                     color: 'white',
//                                     fontSize: px2dp(Platform.OS === 'ios' ? 16 : 14)
//                                 }}>提交订单</Text>
//                             </View>
//                         </ATouchableHighlight>
//                     </View>
//                 </View>
//                 <Loading ref={'loading'}/>
//             </View>
//         )
//     }
//
//
//     getLoading() {
//         return this.refs['loading'];
//     }
//
//     commitOrder() {
//         const {navigate} = this.props.navigation;
//         if (isEmptyObject(this.state.orderReceiver)) {
//             toastShort("请选择收货人");
//             return;
//         }
//         if (!isEmptyObject(this.state.invoice)) {
//             if (isEmptyObject(this.state.invoiceReceiver)) {
//                 toastShort("请选择发票收件人");
//                 return;
//             }
//         }
//         this.getLoading().show('提交中...');
//         let data = {
//             "userid": this.state.userInfo.userid,
//             "buyergradeid": this.state.userInfo.buyergradeid,
//             "areaid": this.state.userInfo.areaid,
//             "orderRecId": this.state.orderReceiver.id,
//             "invoiceId": this.state.invoice ? this.state.invoice.id || 0 : 0,
//             "invoiceRecId": this.state.invoiceReceiver ? this.state.invoiceReceiver.id || 0 : 0,
//             "couponId": this.state.couponData ? this.state.couponData.id || "" : "",
//             carJson: this.state.products
//         };
//         perJsonOrderCommit(data, navigate, (result) => {
//             this.getLoading().dismiss();
//             this.props.actions.fetchResetCouponDataIfNeeded();
//             InteractionManager.runAfterInteractions(() => {
//                 navigate('OrderComplete', {
//                     name: 'OrderComplete',
//                     title: '订单提交成功',
//                     type: 3,
//                     orderId: result.orderId,
//                 });
//             })
//         }, (error) => {
//             let data = {'err': error};
//             MobclickAgent.onEvent("order_unsuccess", data);
//
//             this.getLoading().dismiss();
//         })
//     }
//
//     renderFooter() {
//         return (
//             <View style={{marginTop: 8, marginBottom: 8}}>
//                 {!isEmptyObject(this.state.orderReceiver) ? this.receiveAddress(1, "收货人", this.state.orderReceiver.name, this.state.orderReceiver.mobile,
//                     this.state.orderReceiver.province + " " + this.state.orderReceiver.city + this.state.orderReceiver.county + this.state.orderReceiver.address, this.state.orderReceiver.isDefault) : this.receiveAddress(1, "收货人")}
//                 {this.invoiceInfo()}
//                 {!isEmptyObject(this.state.invoiceReceiver) ? this.receiveAddress(3, "发票收货人", this.state.invoiceReceiver.name, this.state.invoiceReceiver.mobile,
//                     this.state.invoiceReceiver.province + " " + this.state.invoiceReceiver.city + this.state.invoiceReceiver.county + this.state.invoiceReceiver.address, this.state.invoiceReceiver.isDefault) : this.receiveAddress(3, "发票收货人")}
//                 {this.couponInfo()}
//             </View>
//         )
//     }
//
//     invoiceInfo() {
//         return (
//             <View
//                 style={styles.invoiceView}>
//                 <View style={{
//                     flex: 1,
//                     marginLeft: Platform.OS === 'ios' ? 2 : 0,
//                     marginTop: !isEmptyObject(this.state.invoice) && (this.state.invoice.isdefault == 1) ? 0 : Platform.OS === 'ios' ? 12 : 8,
//                     marginBottom: !isEmptyObject(this.state.invoice) && (this.state.invoice.isdefault == 1) ? 0 : Platform.OS === 'ios' ? 12 : 8
//                 }}>
//                     <Text style={{color: 'gray'}}>发票信息</Text>
//                     {!isEmptyObject(this.state.invoice) && (this.state.invoice.isdefault == 1 ?
//                         <View style={styles.defaultView}>
//                             <Text
//                                 style={styles.defaultText}>默认</Text></View> : null)}
//
//                 </View>
//                 <ATouchableHighlight style={{flex: 3}} onPress={() => this.jumpIndexPage(2)}>
//                     <View style={{flexDirection: 'row', paddingRight: 5, flex: 1, alignItems: 'center'}}>
//                         <View style={{flexDirection: 'column', flex: 2.5}}>
//                             <Text
//                                 style={{color: '#rgba(0,0,0,0.9)'}}>{!isEmptyObject(this.state.invoice) ? (isEmptyObject(this.state.invoice.title) ? "暂无" : this.state.invoice.title) : "暂无"}</Text>
//                         </View>
//                         <View style={styles.arrowView}>
//                             <Image style={styles.arrowIv}
//                                    source={require('../../imgs/other/right_arrow.png')}/>
//                         </View>
//                     </View>
//                 </ATouchableHighlight>
//             </View>
//         )
//     }
//
//     couponInfo() {
//
//         return (
//             <View style={styles.couponView}>
//                 <View style={{
//                     marginTop: this.state.couponnum !== 0 ? 0 : 8,
//                     marginBottom: this.state.couponnum !== 0 ? 0 : 8
//                 }}>
//                     <Text style={{color: 'gray', marginLeft: Platform.OS === 'ios' ? 2 : 0}}>优惠券</Text>
//                     {this.state.couponnum !== 0 ?
//                         <View style={styles.couponNumView}>
//                             <Text numberOfLines={1} style={styles.couponNumTv}>{this.state.couponnum + '张可用'}</Text>
//                         </View> : null}
//
//                 </View>
//                 <ATouchableHighlight style={{flex: 1, justifyContent: 'center',}}
//                                      onPress={(this.state.couponnum <= 0) ? null : () => this.jumpIndexPage(4)}>
//                     <View style={{flexDirection: 'row', paddingRight: 5, flex: 1, alignItems: 'center'}}>
//                         <View style={{flexDirection: 'column', flex: 3}}>
//                             <Text
//                                 style={{
//                                     alignSelf: 'flex-end',
//                                     color: isEmptyObject(this.state.couponData) ? '#rgba(0,0,0,0.9)' : this.state.couponData.amount !== 0 ? BGTextColor : '#rgba(0,0,0,0.9)'
//                                 }}>{this.state.couponnum > 0 ? isEmptyObject(this.state.couponData) ? '未使用' : this.state.couponData.amount !== 0 ? '减￥' + this.state.couponData.amount : '未使用' : '无可用优惠劵'}</Text>
//                         </View>
//                         <View style={{flex: 0.5, justifyContent: 'center'}}>
//                             <Image style={styles.arrowIv}
//                                    source={require('../../imgs/other/right_arrow.png')}/>
//                         </View>
//                     </View>
//                 </ATouchableHighlight>
//             </View>
//         )
//     }
//
//     receiveAddress(type, infoName, name, phone, detailAddress, isDefault) {
//         return (
//             <View>
//                 <Image source={require('../../imgs/me/receiver_bg.png')}
//                        style={styles.receiverIv}>
//                     <View style={{flexDirection: 'row', padding: 8}}>
//                         <View style={{flex: 1, justifyContent: 'center', marginLeft: Platform.OS === 'ios' ? 2 : 0}}>
//                             <Text style={{color: 'gray'}}>{infoName}</Text>
//                             {isDefault == 1 ?
//                                 <View style={styles.defaultView}>
//                                     <Text style={styles.defaultText}>默认</Text>
//                                 </View> : null}
//                         </View>
//                         <ATouchableHighlight style={{flex: 3}}
//                                              onPress={() => this.jumpIndexPage(type)}>
//                             <View style={{flexDirection: 'row', paddingRight: 5}}>
//                                 <View style={{flexDirection: 'column', flex: 2.5}}>
//                                     <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                                         <Image source={require('../../imgs/me/ucenter_icon.png')}
//                                                style={{width: 16, height: 16}}/>
//                                         <Text style={styles.addressTv}>{name || "暂无"}</Text>
//                                         <Image source={require('../../imgs/me/small_phone.png')}
//                                                style={{width: 11, height: 17}}/>
//                                         <Text style={styles.addressTv}>{phone || "暂无"}</Text>
//                                     </View>
//                                     <Text numberOfLines={1} style={{
//                                         fontSize: px2dp(12),
//                                         padding: 2,
//                                         marginTop: Platform.OS === 'ios' ? 5 : 0,
//                                         color: 'gray'
//                                     }}>{detailAddress || "暂无"}</Text>
//                                 </View>
//                                 <View style={{flex: 0.5, justifyContent: 'center'}}>
//                                     <Image
//                                         style={styles.arrowIv}
//                                         source={require('../../imgs/other/right_arrow.png')}/>
//                                 </View>
//                             </View>
//                         </ATouchableHighlight>
//                     </View>
//                 </Image>
//             </View>
//         );
//     }
//
//     jumpIndexPage(type) {
//         switch (type) {
//             case 1://收货人信息
//                 this.jump(CartReceiveAddress, 'CartReceiveAddress', 1, this.refreshCallBack.bind(this),
//                     isEmptyObject(this.state.orderReceiver) ? 0 : this.state.orderReceiver.id, '收货人管理');
//                 break;
//             case 2://发票信息
//                 this.jump(CartBill, 'CartBill', 3, this.refreshCallBack.bind(this),
//                     isEmptyObject(this.state.invoice) ? 0 : this.state.invoice.id, '发票信息');
//                 break;
//             case 3://发票收货人信息
//                 this.jump(CartReceiveAddress, 'CartReceiveAddress', 2, this.refreshCallBack.bind(this),
//                     isEmptyObject(this.state.invoiceReceiver) ? 0 : this.state.invoiceReceiver.id, '发票收件人管理');
//                 break;
//             case 4://优惠券信息
//                 this.jump(CartCoupon, 'CartCoupon', 4, this.refreshCallBack.bind(this),
//                     this.state.couponData, '优惠券', this.state.ordermoney, this.state.products.products,);
//                 break;
//             default:
//                 break;
//         }
//     }
//
//     jump(component, name, type, callback, selectId, title, orderMoney, products) {
//         const {navigate} = this.props.navigation;
//         InteractionManager.runAfterInteractions(() =>
//             navigate(name, {
//                 title: title,
//                 name: name,
//                 type: type,
//                 callback: callback,
//                 selectIds: selectId,
//                 orderMoney: orderMoney,
//                 products: products,//this.state.products.products,
//                 rightTitle: type == '4' ? '保存' : null
//             }));
//     }
//
//     refreshCallBack(obj, type) {
//         switch (type) {
//             case 1://收货人信息
//                 if (obj == null) {
//                     obj = this.props.state.ShowAddress.AddResult;
//                 }
//                 this.setState({
//                     orderReceiver: obj
//                 });
//                 break;
//             case 2://发票收货人信息
//                 if (obj == null) {
//                     obj = this.props.state.ShowAddress.AddResult;
//                 }
//                 this.setState({
//                     invoiceReceiver: obj
//                 });
//                 break;
//             case 3://发票信息
//                 this.setState({
//                     invoice: obj
//                 });
//                 break;
//             case 4://优惠券
//                 this.setState({
//                     couponData: obj
//                 });
//                 break;
//             default:
//                 break;
//         }
//     }
//
//     renderRow(rowData) {
//         return (
//             <CommonOrderProductView
//                 row={rowData}
//             />
//         );
//     }
//
//     componentDidMount() {
//         const {navigate, state} = this.props.navigation;
//         MobclickAgent.onPageStart('确认订单');
//         this.getLoading().show();
//         AsyncStorage.getItem(BUYINFO, (error, user) => {
//             let userInfo = JSON.parse(user);
//             let data = {
//                 "userid": userInfo.userid,
//                 "buyergradeid": userInfo.buyergradeid,
//                 "areaid": userInfo.areaid,
//                 carJson: state.params.carJson//this.state.products
//             };
//
//             perJsonOrderConfirm(data, navigate, (result) => {
//                 this.getLoading().dismiss();
//                 this.setState({
//                     orderReceiver: result.orderReceiver,
//                     invoiceReceiver: result.invoiceReceiver,
//                     invoice: result.invoice,
//                     dataSource: this.state.dataSource.cloneWithRows(result.carList),
//                     couponnum: result.couponnum,
//                     ordermoney: result.ordermoney,
//                     discount: result.discount,
//                     userInfo: userInfo
//                 })
//             }, (error) => {
//                 this.getLoading().dismiss();
//             });
//         });
//     }
//
//     componentWillUnmount() {
//         MobclickAgent.onPageEnd('确认订单');
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: BGColor
//     },
//
//     couponView: {
//         flexDirection: 'row',
//         backgroundColor: 'white',
//         marginBottom: 8,
//         marginTop: 8,
//         padding: 10,
//         alignItems: 'center'
//     },
//
//     couponNumView: {
//         backgroundColor: BGTextColor,
//         borderRadius: borderRadius,
//         marginTop: Platform.OS === 'ios' ? 5 : 2,
//         padding: Platform.OS === 'ios' ? 4 : 3,
//         alignItems: 'center'
//     },
//     couponNumTv: {
//         color: 'white',
//         fontSize: px2dp(Platform.OS === 'ios' ? 12 : 10),
//     },
//     commitTv: {
//         backgroundColor: BGTextColor,
//         height: 50,
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: 100
//     },
//
//     invoiceView: {
//         flexDirection: 'row',
//         backgroundColor: 'white',
//         marginBottom: 8,
//         marginTop: 8,
//         padding: 8,
//         alignItems: 'center',
//     },
//
//     addressTv: {
//         paddingLeft: 3,
//         paddingRight: 8,
//         color: '#rgba(0,0,0,0.8)'
//     },
//
//     receiverIv: {
//         width: deviceWidth,
//         resizeMode: 'stretch',
//         backgroundColor: 'transparent',
//         height: 60
//
//     },
//     arrowView: {
//         flex: 0.5,
//         justifyContent: 'center'
//     },
//
//     arrowIv: {
//         width: 8,
//         height: 12,
//         alignSelf: 'flex-end'
//     },
//
//     realMoneyView: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         backgroundColor: '#rgba(0,0,0,0.8)',
//         paddingLeft: 10,
//         height: 50
//     },
//
//     defaultView: {
//         backgroundColor: BGTextColor,
//         borderRadius: borderRadius,
//         margin: 2,
//         width: Platform.OS === 'ios' ? 35 : 30,
//         height: Platform.OS === 'ios' ? 20 : 18,
//         justifyContent: 'center',
//         padding: 4,
//         marginTop: Platform.OS === 'ios' ? 6 : 2
//     },
//
//     defaultText: {
//         color: 'white',
//         fontSize: px2dp(Platform.OS === 'ios' ? 12 : 10),
//         textAlign: 'center'
//     },
//     listViewStyle: {
//         marginTop: 5,
//         marginBottom: 150
//     },
//     bottomView: {
//         backgroundColor: 'white',
//         flexDirection: 'column',
//         position: 'absolute',
//         bottom: 0,
//         width: deviceWidth
//     },
//     proLvItem: {
//         backgroundColor: 'white',
//         paddingLeft: 5,
//         paddingTop: 3,
//         paddingBottom: 3,
//         flexDirection: 'row',
//         borderBottomColor: borderColor,
//         borderBottomWidth: Platform.OS === 'ios' ? 1 : 0.3
//     },
//
//     proLvItemRight: {
//         flexDirection: 'column',
//         width: deviceWidth - 70,
//         marginTop: Platform.OS === 'ios' ? 5 : 0,
//         marginLeft: Platform.OS === 'ios' ? 10 : 0
//     },
//
//     proView: {
//         margin: 3,
//         alignItems: 'center'
//     },
//
//     proIv: {
//         width: Platform.OS === 'ios' ? 60 : 55,
//         height: Platform.OS === 'ios' ? 60 : 55,
//         resizeMode: 'stretch',
//         borderRadius: borderRadius
//     },
//
//     packText: {
//         marginTop: 4,
//         color: 'gray',
//         fontSize: px2dp(Platform.OS === 'ios' ? 12 : 10)
//     },
//
//     orderTextStyle: {
//         fontSize: px2dp(Platform.OS === 'ios' ? 13 : 14),
//         color: 'gray'
//     },
//
//     ListView: {
//         marginBottom: 15
//     },
//
//     rightImageStyle: {
//         width: Platform.OS === 'ios' ? 55 : 52,
//         height: Platform.OS === 'ios' ? 16 : 15,
//         marginTop: 4
//     },
//
// });
//
// export default connect(state => ({
//         state: state
//     }),
//     (dispatch) => ({
//         actions: bindActionCreators(ShowAddressAction, dispatch)
//     })
// )(ConfrimOrder);