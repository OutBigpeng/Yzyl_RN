// /**购物车的优惠券列表
//  * Created by Monika on 2016/12/29.
//  */
// 'use strict';
// import React, {Component} from "react";
// import {
//     View,
//     StyleSheet,
//     ListView,
//     AsyncStorage,
//     TouchableHighlight,
//     Text,
//     Dimensions,
//     Image,
//     Platform,
//     InteractionManager
// } from "react-native";
// import {deviceWidth, BGColor, bindActionCreators, connect, _, borderRadius, px2dp} from "../../common/CommonDevice";
// import NavigatorView from "../../component/NavigatorView";
// import * as ShowAddressAction from "../../actions/ShowAddressAction";
// import CouponDetaill from "../me/mine/coupon/CouponDetail";
// import BackKey from "../../common/BackKey";
// import ActionLoading from "../../common/ActionLoading";
// import ATouchableHighlight from "../../component/ATouchableHighlight";
// class CartCoupon extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         let dataSource = new ListView.DataSource({
//             rowHasChanged: (r1, r2) => r1 !== r2
//         });
//         // 初始状态
//         const {type,selectIds,orderMoney,products} = this.props.navigation.state.params;
//         this.state = {
//             dataSource: dataSource,
//             userId: 0,
//             type: type,
//             selectData: selectIds,
//             orderMoney: orderMoney,
//             products: products
//         };
//     }
//     componentWillUnmount() {
//         this. back();
//     }
//
//     componentDidMount() {
//         this.props.navigation.setParams({
//             rightOnPress:this.setDefault,
//             navigatePress:this.back,
//         });
//         this.loadDataFormNet();
//     }
//
//     loadDataFormNet() {
//         const {navigate} = this.props.navigation;
//         AsyncStorage.getItem(USERID, (error, id) => {
//             let userId = JSON.parse(id);
//             let data = {'userid': userId, 'orderMoney': this.state.orderMoney, "products": this.state.products};
//             this.props.actions.fetchCouponListIfNeeded(data,navigate);
//             if (this.state.selectData) {
//                 this.props.actions.fetchAddCouponIfNeeded(this.state.selectData, true);
//             }
//             this.setState({
//                 userId: userId,
//             });
//         })
//     }
//
//     back = ()=> {
//         const {goBack} = this.props.navigation;
//         this.props.state.Coupon.selectData = [];
//         this.props.state.Coupon.totalMoney = 0;
//         goBack();
//     };
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 {this.props.state.ShowAddress.isLoading ? <ActionLoading/> :
//                     !_.isEmpty(this.props.state.Coupon.CouponData) ? <ListView
//                             dataSource={this.state.dataSource.cloneWithRows(this.props.state.Coupon.CouponData)}
//                             renderRow={(rowData) => this.renderRow(rowData)}
//                             contentContainerStyle={styles.listView}
//                             enableEmptySections={true}
//                         /> : <View style={{flex:1,alignItems: 'center',justifyContent:'center'}}><Text
//                             style={{fontSize:px2dp(Platform.OS==='ios'?18:16),color:'gray'}}>暂无优惠券</Text></View>}
//             </View>
//         );
//     }
//
//     renderRow(rowData) {
//         return (
//             <ATouchableHighlight onPress={()=>this.pushToCouponView(rowData)}>
//                 <View style={styles.itemView}>
//                     <ATouchableHighlight style={styles.touchIv}
//                                         onPress={() => this.Instructions(rowData)}>
//                         <View style={styles.couponIvView}>
//                             {_.contains(this.props.state.Coupon.selectData, rowData.id) ?
//                                 <Image source={require('../../imgs/me/coupon/square_check_selected.png') }
//                                        style={styles.iv}/> :
//                                 <Image source={require('../../imgs/me/coupon/square_check_normal.png') }
//                                        style={styles.iv}/>}
//                         </View>
//                     </ATouchableHighlight>
//
//                     <View style={styles.couponView}>
//                         <View style={{flexDirection: 'row'}}>
//                             <View style={styles.couponTextView}>
//                                 <Text style={styles.couponTv}>优惠券</Text>
//                             </View>
//
//                             <Text style={styles.couponType}>{rowData.typename}</Text>
//                         </View>
//                         <Text style={styles.tv}>{rowData.startime}~{rowData.endtime}</Text>
//                         <Text style={styles.tv}>{rowData.description}</Text>
//                     </View>
//                 </View>
//             </ATouchableHighlight>
//         )
//     }
//
//     pushToCouponView(rowData) {
//         const {navigate}=this.props.navigation;
//         InteractionManager.runAfterInteractions(() => {
//             navigate('CouponDetaill',{
//                 title:'优惠券详情',
//                 name: 'CouponDetaill',
//                 detailData: rowData
//             })
//         })
//     }
//
//     Instructions(rowData) {//选择优惠券
//         this.props.actions.fetchAddCouponIfNeeded(rowData, false);
//     }
//
//     setDefault = () =>{
//         const {state,goBack} = this.props.navigation;
//         let join = this.props.state.Coupon.selectData.join();
//         this.props.actions.fetchDefaultCouponIfNeeded(join);
//         state.params.callback({"amount": this.props.state.Coupon.totalMoney, "id": join}, this.state.type);
//         goBack();
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: BGColor
//     },
//
//     listView: {
//         flexDirection: 'column',
//         width: deviceWidth,
//     },
//
//     itemView: {
//         flexDirection: 'row',
//         marginBottom: 10,
//         backgroundColor: 'white'
//     },
//
//     couponView: {
//         flexDirection: 'column',
//         padding: 8,
//         flex: 8,
//         justifyContent: 'center',
//         alignItems: 'flex-start'
//     },
//     couponTv: {
//         color: 'white',
//         fontSize: px2dp(Platform.OS === 'ios' ? 12 : 10),
//     },
//
//     couponIvView: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10
//     },
//
//     touchIv: {
//         padding: 5,
//         alignSelf: 'center',
//         flex: 1
//     },
//
//     couponTextView: {
//         backgroundColor: 'rgba(235,35,45,1)',
//         borderRadius: borderRadius,
//         padding: Platform.OS === 'ios' ? 4 : 1,
//         justifyContent: 'center',
//         marginLeft: 2,
//     },
//     couponType: {
//         color: 'black',
//         fontSize: px2dp(Platform.OS === 'ios' ? 16 : 14),
//         paddingBottom: 2,
//         marginLeft: 6
//     },
//     tv: {
//         color: 'gray',
//         fontSize: px2dp(Platform.OS === 'ios' ? 14 : 12),
//         alignSelf: 'flex-start',
//         paddingRight: 5,
//         marginTop: Platform.OS === 'ios' ? 4 : 0
//     },
//     iv: {
//         width: Platform.OS === 'ios' ? 20 : 15,
//         height: Platform.OS === 'ios' ? 20 : 15,
//         resizeMode: 'cover',
//         alignSelf: 'flex-start'
//     },
// });
//
// export default connect(state => ({
//         state: state
//     }),
//     (dispatch) => ({
//         actions: bindActionCreators(ShowAddressAction, dispatch)
//     })
// )(CartCoupon);