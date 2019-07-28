// /**过期优惠券
//  * Created by Monika on 2016/10/17.
//  */
// 'use strict';
// import React, {Component} from "react";
// import {ListView, StyleSheet, View} from "react-native";
// import {getCouponList} from "../../../../dao/CouponDao";
// import {BGColor, deviceHeight, deviceWidth, Loading, px2dp} from "../../../../common/CommonDevice";
// import CommonCouponView from "../../../../component/CommonCoupon";
//
// export default class CountedView extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         const dataSource = new ListView.DataSource({
//             rowHasChanged: (r1, r2) => r1 !== r2
//         });
//         // 初始状态
//         this.state = {
//             dataSource: dataSource,
//             userInfo: this.props.userInfo,
//             type: 'expire',
//         };
//     }
//
//     getLoading() {
//         return this.refs['loading'];
//     }
//
//     componentDidMount() {
//         this.getLoading().show();
//         const {navigate} = this.props.navigation;
//         getCouponList(this.props.userid, this.state.type, navigate, (result) => {
//             this.getLoading().dismiss();
//             this.setState({
//                 dataSource: this.state.dataSource.cloneWithRows(result)
//             });
//         }, (error) => {
//             this.getLoading().dismiss()
//         })
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 <ListView
//                     dataSource={this.state.dataSource}
//                     renderRow={(rowData) => this.renderRow(rowData)}
//                     contentContainerStyle={styles.listView}
//                     enableEmptySections={true}
//                 />
//                 <Loading ref={'loading'} text={'请等待...'}/>
//             </View>
//         )
//     }
//
//     renderRow(rowData) {//
//         return (
//             <CommonCouponView
//                 couponBgImage={require('../../../../imgs/me/coupon/coupon_gray.png')}
//                 rowData={rowData}
//                 navigation={this.props.navigation}
//             />
//         )
//     }
// }
//
//
// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: BGColor,
//         height: deviceHeight - 120
//     },
//
//     listView: {
//         width: deviceWidth,
//         paddingBottom: 15,
//         marginTop: 8
//     },
//
//     viewbottom: {
//         padding: 10,
//         flexDirection: 'column'
//
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
//     descriptionText: {
//         color: 'white',
//         fontSize: px2dp(14),
//         marginTop: 5,
//         marginLeft: 5,
//     },
//     timeView: {
//         flexDirection: 'row',
//         alignItems: 'center', padding: 10
//     },
// });