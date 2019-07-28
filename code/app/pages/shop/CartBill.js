// /**购物车的发票信息
//  * Created by Monika on 2016/12/29.
//  */
// 'use strict';
//
// import React, {Component} from "react";
// import {AsyncStorage, Image, InteractionManager, ListView, Platform, StyleSheet, Text, View} from "react-native";
// import MyBillShow from "../me/mine/billreceiveinfo/MyBillShow";
// import {getBillList, getBillSetDefault, getBillShow} from "../../dao/UserBillDao";
// import {
//     _, BGColor, BGTextColor, borderColor, borderRadius, deviceWidth, Loading,
//     px2dp
// } from "../../common/CommonDevice";
// import ATouchableHighlight from "../../component/ATouchableHighlight";
//
// let Swipeout = require('react-native-swipeout');
// class CartBill extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         let dataSource = new ListView.DataSource({
//             rowHasChanged: (r1, r2) => r1 !== r2
//         });
//         // 初始状态
//         const {state} = this.props.navigation
//         this.state = {
//             dataSource: dataSource,
//             userId: 0,
//             type: state.params.type,
//             selectId: state.params.selectIds,
//             array: [],
//
//         };
//     }
//
//     componentDidMount() {
//         this.loadDataFormNet();
//     }
//
//     loadDataFormNet() {
//         const {navigate} = this.props.navigation;
//         this.getLoading().show();
//         AsyncStorage.getItem(USERID, (error, id) => {
//             this.getLoading().dismiss();
//             let userId = JSON.parse(id);
//             getBillList(userId, navigate, (result) => {
//                 this.setState({
//                     userId: userId,
//                     dataSource: this.state.dataSource.cloneWithRows(result),
//                     array: result
//                 });
//             }, (error) => {
//                 this.getLoading().dismiss();
//             });
//         })
//     }
//
//     //获取加载进度的组件
//     getLoading() {
//         return this.refs['loading'];
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 {!_.isEmpty(this.state.array) ?
//                     <ListView
//                         dataSource={this.state.dataSource}
//                         renderRow={(rowData) => this.renderRow(rowData)}
//                         contentContainerStyle={styles.listView}
//                         enableEmptySections={true}
//                     /> :
//                     <View style={{flex:1,alignItems: 'center',justifyContent:'center'}}><Text
//                         style={{fontSize:px2dp(Platform.OS==='ios'?18:16),color:'gray'}}>暂无发票信息,请联系客服</Text></View>}
//                 <Loading ref={'loading'} />
//
//             </View>
//         );
//     }
//
//     renderRow(rowData) {
//         let current = '设为默认';
//         if (rowData.isdefault == 1) {
//             current = '取消默认';
//         }
//         let swipeoutBtns = [
//             {
//                 text: current,
//                 backgroundColor: current === '取消默认' ? borderColor : '#rgba(0,0,0,0.5)',
//                 color: 'white',
//                 onPress: () => this.setDefault(rowData)
//             },
//         ];
//         return (
//             <View style={{backgroundColor: 'white', width: deviceWidth,flex:1,marginBottom:10 }}>
//                 <Swipeout autoClose={true} right={swipeoutBtns} backgroundColor='white'>
//                     <ATouchableHighlight onPress={() => this.setDefaultSelect(rowData)}>
//                         <View style={styles.itemView}>
//                             <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
//                                 {rowData.id === this.state.selectId ?
//                                     <Image source={require('../../imgs/shop/select.png') }
//                                            style={styles.iv}/> :
//                                     <Image source={require('../../imgs/shop/unselected.png') }
//                                            style={styles.iv}/>}
//                             </View>
//                             <View style={styles.ViewStyle}>
//                                 {rowData.isdefault == 1 ?
//                                     <View style={styles.defaultView}>
//                                         <Text style={styles.defaultText}>默认</Text>
//                                     </View> : <View/>}
//                                 <Text style={styles.billText}>{rowData.title} </Text>
//
//                             </View>
//                             <View style={styles.verticalLine}/>
//                             <View style={styles.arrowView}>
//                                 <ATouchableHighlight onPress={() => this.showDetail(rowData)}
//                                                     style={{flexDirection: 'row', padding: 5}}>
//                                     <Image source={require('../../imgs/other/right_arrow.png')} style={styles.arrowIv}/>
//                                 </ATouchableHighlight>
//                             </View>
//                         </View>
//                     </ATouchableHighlight>
//                 </Swipeout>
//             </View>
//         )
//     }
//
//     /**
//      * 设置默认
//      * @param rowData
//      */
//     setDefault(rowData) {
//
//         let data = {
//             'userid': this.state.userId,
//             'id': rowData.id,
//             'isdefault': rowData.isdefault == 1 ? 0 : 1
//         };
//         this.getLoading().show();
//         getBillSetDefault(data, this.props.navigation.navigate, (result) => {
//             this.getLoading().dismiss();
//             //修改当前item的值
//             let temp = rowData;
//             temp.isdefault = rowData.isdefault == 1 ? 0 : 1;
//             this.editCallBack(temp,true);
//         }, (error) => {
//             this.getLoading().dismiss();
//         });
//     }
//
//     /**
//      * 设置选中的item
//      * @param rowData
//      */
//     setDefaultSelect(rowData) {
//         const {state,goBack} = this.props.navigation
//         state.params.callback(rowData, this.state.type);
//         goBack();
//     }
//
//     /**
//      * 跳转详情
//      * @param rowData
//      */
//     showDetail(rowData) {
//         const {navigate} = this.props.navigation;
//         this.getLoading().show();
//         getBillShow(this.state.userId, rowData.id, navigate, (result) => {
//             this.getLoading().dismiss();
//             InteractionManager.runAfterInteractions(() => {
//                 navigate('MyBillShow',{
//                     title: '我的发票详情',
//                     name: 'MyBillShow',
//                     showData: result,
//                     userId: this.state.userId,
//                     id: rowData.id,
//                     callBack: this.editCallBack.bind(this)
//                 });
//             });
//         }, () => {
//             this.getLoading().dismiss();
//         });
//     }
//
//     /**
//      * state 修改list 达到刷新界面
//      * @param data
//      */
//     editCallBack(data,isRefresh) {
//         if(isRefresh) {
//             let detail = [].concat(this.state.array);
//             this.state.array.shift();
//             detail.map((item, index) => {
//                 if (item.id === data.id) {
//                     detail[index] = data;
//                 } else {
//                     item.isdefault = 0;
//                     detail[index] = item;
//                 }
//             });
//             this.setState({
//                 array: detail,
//                 dataSource: this.state.dataSource.cloneWithRows(detail),
//             });
//         }
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: BGColor
//     },
//     listView: {
//         flexDirection: 'column',
//         width: deviceWidth, marginTop: 10
//     },
//     itemView: {
//         flexDirection: 'row',
//         padding: 5
//     },
//     touchSelect: {
//         padding: 5,
//         alignSelf: 'center',
//         flex: 1
//     },
//     verticalLine: {
//         backgroundColor: '#rgba(0,0,0,0.3)',
//         width: 0.5,
//         margin: 5
//     },
//     arrowView: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 3,
//         flex: 1
//     },
//     arrowIvf: {
//         width: 9,
//         height: 15.5,
//         resizeMode: 'cover'
//     },
//     defaultText: {
//         color: 'white',
//         fontSize:px2dp( Platform.OS === 'ios' ? 12 : 10),
//
//     },
//     defaultView: {
//         backgroundColor: BGTextColor,
//         borderRadius: borderRadius,
//         justifyContent: 'center',
//         height: 20,
//         width: 35,
//         alignItems: 'center',
//     },
//     billText: {
//         color: 'black',
//         fontSize: px2dp(14),
//         padding: 2,
//         marginLeft: 3
//     },
//     tv: {
//         color: 'gray',
//         fontSize: px2dp(12),
//         alignSelf: 'center'
//     },
//     iv: {
//         width: Platform.OS === 'ios' ? 20 : 15,
//         height: Platform.OS === 'ios' ? 20 : 15,
//         resizeMode: 'cover'
//     },
//
//     arrowIv: {
//         width: 10,
//         height: 15,
//         marginLeft: 6
//     },
//
//     ViewStyle: {
//         flexDirection: 'row',
//         padding: 8,
//         alignItems: 'center',
//         width: deviceWidth - 100
//     }
// });
// export default CartBill;