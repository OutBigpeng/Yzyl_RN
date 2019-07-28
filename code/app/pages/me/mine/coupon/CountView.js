// /** 已使用优惠券
//  * Created by Monika on 2016/10/17.
//  */
// 'use strict';
// import React, {Component} from "react";
// import {Image, InteractionManager, ListView, Platform, StyleSheet, Text, View} from "react-native";
// import {getCouponList} from "../../../../dao/CouponDao";
// import {BGColor, BGTextColor, borderColor, deviceHeight, deviceWidth, px2dp} from "../../../../common/CommonDevice";
// import CommonCouponView from "../../../../component/CommonCoupon";
// import ATouchableHighlight from "../../../../component/ATouchableHighlight";
//
// export  default class CountView extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         const dataSource = new ListView.DataSource({
//             rowHasChanged: (r1, r2) => r1 !== r2
//         });
//         // 初始状态
//         this.state = {
//             dataSource: dataSource,
//             type: 'nouse',
//             userInfo: this.props.userInfo,
//         };
//     }
//
//     // onRefresh
//     componentDidMount() {
//         this.refreshView();
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 <ListView
//                     dataSource={this.state.dataSource}
//                     renderRow={(rowData) => this.renderRow(rowData)}
//                     renderHeader={() => this.renderHeader() }
//                     contentContainerStyle={styles.listView}
//                     enableEmptySections={true}
//                 />
//             </View>
//         )
//     }
//
//
//     renderRow(rowData) {//
//         return (
//             <CommonCouponView
//                 couponBgImage={require('../../../../imgs/me/coupon/coupon_red.png')}
//                 rowData={rowData}
//                 navigation={this.props.navigation}
//             />
//         )
//     }
//
//     renderHeader() {
//         return (
//             <ATouchableHighlight onPress={() => this.pushToActivationCoupon()} >
//                 <View style={styles.couponViewStyle}>
//                     <Text style={{color: BGTextColor, fontSize: px2dp(14), flex: 1, textAlign: 'center'}}>激活优惠券</Text>
//                     <Image source={require('../../../../imgs/me/coupon/red_arrow.png')}
//                            style={{width: 18, height: 18}}/>
//                 </View>
//             </ATouchableHighlight>
//         )
//     }
//
//     pushToActivationCoupon() {
//         const {navigate} = this.props.navigation;
//         let tempUserInfo = this.props.userInfo;
//         InteractionManager.runAfterInteractions(() => {
//             navigate('ActivationCoupon',{
//                 name: 'ActivationCoupon',
//                 title: '激活优惠券',
//                 hint: '已验证手机号 ' + this.props.userInfo.mobile.substr(0, 3) + '****' + this.props.userInfo.mobile.substr(this.props.userInfo.mobile.length - 4, this.props.userInfo.mobile.length),
//                 smstype: 6,
//                 userInfo: tempUserInfo,
//                 callBack: () => this.callRefreshAndParent()
//             })
//         });
//     }
//
//     callRefreshAndParent() {
//         this.props.onRefresh();
//         this.refreshView();
//     }
//
//     refreshView() {
//         const {navigate} =this.props.navigation;
//         getCouponList(this.props.userid, this.state.type, navigate, (result) => {
//             this.setState({
//                 dataSource: this.state.dataSource.cloneWithRows(result)
//             });
//         }, (error) => {
//         });
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: BGColor,
//         height: deviceHeight - 120
//     },
//
//     listView: {
//         width: deviceWidth,
//         paddingBottom: 15
//     },
//     viewbottom: {
//         padding: 10,
//         flexDirection: 'column'
//     },
//     contentViewStyle: {
//         marginLeft: 10,
//         marginRight: 10,
//         marginTop: 10
//     },
//
//     couponCenterViewStyle: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: 10
//     },
//     couponViewStyle: {
//         margin: 5,
//         borderWidth: 1,
//         borderColor: borderColor,
//         padding: 10,
//         backgroundColor: 'white',
//         borderRadius: 3,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     descriptionText: {
//         color: 'white',
//         fontSize: px2dp(14),
//         marginTop: 5,
//         marginLeft: 8,
//     },
//     timeView: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//         marginTop: Platform.OS === 'ios' ? 10 : 0
//     },
// });