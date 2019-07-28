// /**订单完成
//  * Created by Monika on 2016/12/27.
//  */
// 'use strict';
// import React, {Component} from "react";
// import {Image, InteractionManager, StyleSheet, Text, View} from "react-native";
// import OrderDetail from "./OrderDetail";
// import {BGColor, BGTextColor, borderRadius, deviceHeight, MobclickAgent} from "../../../../common/CommonDevice";
// import {NavigationActions} from 'react-navigation'
// import ATouchableHighlight from "../../../../component/ATouchableHighlight";
//
// export default class OrderComplete extends Component {
//     render() {
//         return (
//             <View style={styles.container}>
//                 <View style={{flexDirection: 'column', alignItems: 'center', marginTop: 40}}>
//                     <Image source={require('../../../../imgs/me/note_tip_big.png')}
//                            style={{width: 77.5, height: 87, marginBottom: 30}}/>
//                     <Text>您的订单已提交成功！</Text>
//                     <Text style={{marginTop:8}}>我们的工作人员会尽快联系您沟通后续事情！</Text>
//
//                     <View style={{flexDirection: 'row', marginTop: 20}}>
//                         <ATouchableHighlight  onPress={()=>this.jumpCart()}
//                                             style={styles.touchBack}>
//                             <Text style={styles.tvBack}>返回购物车</Text>
//                         </ATouchableHighlight>
//                         <ATouchableHighlight  onPress={()=>this.jumpMyOrderDetail()}
//                                             style={[styles.touchBack,{marginLeft:20}]}>
//                             <Text style={styles.tvBack}>查看订单</Text>
//                         </ATouchableHighlight>
//                     </View>
//                 </View>
//             </View>
//         );
//     }
//
//     // back() {
//     //     const {state, goBack} = this.props.navigation;
//     //     if (state.params.type == 1) {
//     //         state.params.backCall();
//     //     }
//     //     goBack();
//     // }
//
//     jumpCart() {
//         // const {state, goBack} = this.props.navigation;
//         // goBack('HomeTabNavigator')
//         // this.props.navigation.goBack('HomeTabNavigator');
//         // this.props.navigation.navigate('ShopView');
//         const resetAction = NavigationActions.reset({
//             index: 0,
//             actions: [
//                 NavigationActions.navigate({routeName: 'HomeTabNavigator'}),
//             ]
//         });
//         this.props.navigation.dispatch(resetAction);
//     }
//
//     jumpMyOrderDetail() {
//         const {navigate, state} = this.props.navigation;
//         InteractionManager.runAfterInteractions(() => {
//             navigate('OrderDetail', {
//                 title: '订单详情',
//                 name: 'OrderDetail',
//                 orderId: state.params.orderId,
//             })
//         })
//     }
//
//     componentDidMount() {
//         this.props.navigation.setParams({
//             navigatePress: this.back(),
//         });
//         MobclickAgent.onPageStart('订单成功');
//     }
//
//     componentWillUnmount() {
//         MobclickAgent.onPageEnd('订单成功');
//     }
//
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: BGColor
//     },
//     listViewStyle: {
//         marginTop: 5,
//         height: deviceHeight - 220
//     },
//     touchBack: {
//         borderRadius: borderRadius,
//         borderColor: BGTextColor,
//         borderWidth: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: 35,
//         padding: 5,
//         width: 120
//     },
//     tvBack: {},
// });