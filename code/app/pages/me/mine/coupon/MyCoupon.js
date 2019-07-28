// /**我的优惠券
//  * Created by Monika on 2016/12/27.
//  */
// 'use strict';
// import React, {Component} from "react";
// import {AsyncStorage, StyleSheet, Text, View} from "react-native";
// import {getCouponNum} from "../../../../dao/CouponDao";
// import CountView from "./CountView";
// import CountedView from "./CountedView";
// import CountexView from "./CountexView";
// import {BGColor, borderColor, deviceWidth, Loading} from "../../../../common/CommonDevice";
// import ATouchableHighlight from "../../../../component/ATouchableHighlight";
//
// export default class MyCoupon extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         this.state = {
//             selectItem: 'first',
//             couponObj: {},
//             userId: 0,
//             userInfo: {},
//         };
//     }
//
//     componentDidMount() {
//         AsyncStorage.getItem(USERINFO, (error, result) => {
//             let item = JSON.parse(result);//
//             this.setState({
//                 userId: item.userid,
//                 userInfo: item,
//             });
//             this.onRefresh();
//         });
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 <View>
//                     {/*标题档*/}
//                     <View style={styles.titleViewStyle}>
//                         {this.itemHeaderRow(() => this.setState({selectItem: 'first'}), 'first', this.state.couponObj.countNoUse ? `未使用（${this.state.couponObj.countNoUse}）` : '未使用（0）')}
//                         {this.itemHeaderRow(() => this.setState({selectItem: 'second'}), 'second', this.state.couponObj.countUsed ? `已使用（${this.state.couponObj.countUsed}）` : '已使用（0）')}
//                         {this.itemHeaderRow(() => this.setState({selectItem: 'third'}), 'third', this.state.couponObj.countExpire ? `已过期（${this.state.couponObj.countExpire}）` : '已过期（0）')}
//                     </View>
//                     <View style={{flex: 1}}>{this.justToView()}</View>
//                 </View>
//
//                 <Loading ref={'loading'} text={'请等待...'}/>
//             </View>
//         );
//     }
//
//     itemHeaderRow(onPress, item, itemTitle) {
//         return (
//             <ATouchableHighlight onPress={onPress}>
//                 <Text
//                     style={{color: this.state.selectItem == item ? '#rgba(215,35,48,1)' : 'black'}}>{itemTitle}</Text>
//             </ATouchableHighlight>
//         )
//     }
//
//     getLoading() {
//         return this.refs['loading'];
//     }
//
//     onRefresh() {
//         this.getLoading().show();
//         getCouponNum(this.state.userId, (result) => {
//             this.getLoading().dismiss();
//             this.setState({
//                 couponObj: result
//             });
//         }, (error) => {
//             this.getLoading().dismiss();
//         });
//     }
//
//     justToView() {
//         switch (this.state.selectItem) {
//             case 'first':
//                 if (this.state.userId) {
//                     return (
//                         <CountView
//                             navigation={this.props.navigation}
//                             userid={this.state.userId}
//                             userInfo={this.state.userInfo}
//                             onRefresh={this.onRefresh.bind(this)}
//                         />
//                     );
//                 }
//                 break;
//             case 'second':
//                 return (
//                     <CountedView
//                         navigation={this.props.navigation}
//                         userid={this.state.userId}
//                     />
//                 );
//                 break;
//             case 'third':
//                 return (
//                     <CountexView
//                         navigation={this.props.navigation}
//                         userid={this.state.userId}
//                     />
//                 );
//                 break;
//             default:
//                 break;
//         }
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: BGColor
//     },
//     titleViewStyle: {
//         marginTop: 5,
//         backgroundColor: 'white',
//         width: deviceWidth,
//         borderBottomColor: borderColor,
//         borderBottomWidth: 1,
//         justifyContent: 'space-around',
//         alignItems: 'center',
//         flexDirection: 'row',
//         padding: 10
//     }
// });