// /**
//  * Created by Monika on 2016/11/03.
//  * 我的确认订单收货人列表
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
//     InteractionManager,
//     Image,
//     Platform,
//     Alert
// } from "react-native";
// import {
//     deviceWidth,
//     BGTextColor,
//     BGColor,
//     bindActionCreators,
//     connect,
//     borderRadius,
//     textHeight,
//     borderColor,
//     _, px2dp
// } from "../../common/CommonDevice";
// import NavigatorView from "../../component/NavigatorView";
// import EditReceiveAddress from "../me/mine/billreceiveinfo/EditReceiveAddress";
// import * as ShowAddressAction from "../../actions/ShowAddressAction";
// import ActionLoading from "../../common/ActionLoading";
// import ATouchableHighlight from "../../component/ATouchableHighlight";
//
// let Swipeout = require('react-native-swipeout');
// class CartReceiveAddress extends Component {
//
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
//             itemData: {},
//             userId: 0,
//             type: state.params.type,
//             selectDefaultId: state.params.selectIds,
//         };
//     }
//
//     componentDidMount() {
//         const {navigate} = this.props.navigation;
//         AsyncStorage.getItem(USERID, (error, id) => {
//             let userId = JSON.parse(id);
//             this.props.actions.fetchAddressListIfNeeded(this.state.type,userId,navigate);
//             this.setState({
//                 userId: userId,
//             });
//         })
//     }
//
//     render() {
//         // let title = '收货人管理';
//         let addBtn = '新增收货人地址';
//         if (this.state.type == 2) {
//             // title = '发票收件人管理';
//             addBtn = '新增发票收件地址';
//         }
//         return (
//             <View style={styles.container}>
//                 {this.props.state.ShowAddress.isLoading ?
//                     <ActionLoading/> : !_.isEmpty(this.props.state.ShowAddress.listData) ?
//                         <ListView
//                             dataSource={this.state.dataSource.cloneWithRows(this.props.state.ShowAddress.listData)}
//                             renderRow={(rowData) => this.renderRow(rowData)}
//                             contentContainerStyle={styles.listView}
//                             enableEmptySections={true}
//                         /> : <View style={{flex:1,alignItems: 'center',justifyContent:'center'}}><Text
//                             style={{fontSize:px2dp(18),color:'gray'}}>暂无数据</Text></View>}
//
//                 <ATouchableHighlight onPress={() => this.editAddress(null,'add')} >
//                     <View style={{alignItems:'center'}}>
//                         <View style={styles.addView}>
//                             <Text style={{color: 'white',fontSize:px2dp(Platform.OS ==='ios'?16:14)}}>{addBtn}</Text>
//                         </View>
//                     </View>
//                 </ATouchableHighlight>
//             </View>
//         )
//     }
//
//     renderRow(rowData) {
//         let current = '';
//         let swipeoutBtns = [
//             {
//                 text: rowData.isDefault == 1 ? current = '默认地址' : current = '设为默认',
//                 backgroundColor: current === '默认地址' ? borderColor : '#rgba(0,0,0,0.5)',
//                 color: 'white',
//                 onPress: () => current === '默认地址' ? '哈哈' : this.setDefault(rowData)
//             },
//             {
//                 text: '删除',
//                 backgroundColor: BGTextColor,
//                 color: 'white',
//                 onPress: () => Alert.alert(
//                     '',
//                     '确定删除该收货人？',
//                     [
//                         {text: '取消', onPress: () => console.log('Cancel Pressed!')},
//                         {text: '确定', onPress: () => this.deleteItem(rowData)},
//                     ]
//                 )
//             }
//         ];
//         return (
//             <View style={styles.itemContent}>
//                 <Swipeout autoClose={true} right={swipeoutBtns} backgroundColor='white'>
//                     <ATouchableHighlight  onPress={() => this.setDefaultSelect(rowData)}>
//                         <View style={styles.itemView}>
//                             <ATouchableHighlight style={styles.touchSelect}
//                                                 onPress={() => this.setDefaultSelect(rowData)}>
//                                 <View style={styles.selectView}>
//                                     {rowData.id === this.state.selectDefaultId ?
//                                         <Image source={require('../../imgs/shop/select.png') }
//                                                style={styles.iv}/> :
//                                         <Image source={require('../../imgs/shop/unselected.png') }
//                                                style={styles.iv}/>}
//                                 </View>
//                             </ATouchableHighlight>
//
//                             <View style={styles.addressInfoView}>
//                                 <Text style={styles.userInfoTv}>{rowData.name} {rowData.mobile} </Text>
//                                 <View style={{flexDirection: 'row'}}>
//                                     {rowData.isDefault == 1 ?
//                                         <View style={styles.defaultView}>
//                                             <Text style={styles.defaultText}>默认</Text></View> : null}
//                                     <Text numberOfLines={1}
//                                         style={styles.tv}>{rowData.province} {rowData.city}{rowData.county}{rowData.address}</Text>
//                                 </View>
//                             </View>
//
//                             <View style={styles.verticalLine}/>
//                             <View style={styles.editView}>
//                                 <ATouchableHighlight onPress={() => this.editAddress(rowData,'edit')}
//                                                     style={{flexDirection: 'row', padding: 5}}>
//                                     <Image source={require('../../imgs/me/edit.png')} style={styles.editIv}/>
//                                 </ATouchableHighlight>
//                             </View>
//
//                         </View>
//                     </ATouchableHighlight>
//                 </Swipeout></View>
//         )
//     }
//
//     setDefault(rowData) {
//         const {navigate} = this.props.navigation;
//         let isSelect = false;
//         if (rowData.isDefault == 1) {
//             isSelect = true;
//         }
//         this.props.actions.fetchSetDefaultIfNeeded(this.state.type, this.state.userId, rowData.id, isSelect, navigate);
//     }
//
//     deleteItem(rowData) {
//         // const {navigator} = this.props;
//         this.props.actions.fetchDelAddressIfNeeded(this.state.type, this.state.userId, rowData.id, true, this.props.navigation);
//     }
//
//     setDefaultSelect(rowData) {
//         this.editCallBack(rowData);
//     }
//
//     editAddress(rowData, editOrAdd) {
//         const {navigate} =this.props.navigation;
//         InteractionManager.runAfterInteractions(() => {
//             navigate('EditReceiveAddress',{
//                 name: 'EditReceiveAddress',
//                 type: this.state.type,
//                 title:this.state.type == 2?'编辑发票收件人':'编辑收货人',
//                 page: editOrAdd,
//                 itemRow: rowData,
//                 userId: this.state.userId,
//                 isSelect: rowData ? (rowData.isDefault == 1) || false : false,
//                 from: true,
//                 callback: this.editCallBack.bind(this),
//             });
//         })
//     }
//
//     /**
//      * 编辑回调
//      * @param obj
//      */
//     editCallBack(obj) {
//         const {state,goBack} =this.props.navigation;
//         if (obj == null) {
//             obj = this.props.state.ShowAddress.AddResult;
//         }
//         this.setState({
//             selectDefaultId: obj
//         });
//
//         state.params.callback(obj, this.state.type);
//         goBack();
//     }
// }
//
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
//         marginBottom: 150,
//         marginTop: 10,
//     },
//     itemContent: {
//         backgroundColor: 'white',
//         width: deviceWidth,
//         flex: 1,
//         marginBottom: 10
//     },
//     itemView: {
//         flexDirection: 'row',
//     },
//
//     touchSelect: {
//         padding: 5,
//         alignSelf: 'center',
//         flex: 1
//     },
//
//     selectView: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10
//     },
//
//     addressInfoView: {
//         flexDirection: 'column',
//         padding: 8,
//         width: deviceWidth - 100
//     },
//
//     addView: {
//         marginBottom: 20,
//         borderRadius: borderRadius,
//         alignItems: 'center',
//         backgroundColor: BGTextColor,
//         height: textHeight,
//         width: deviceWidth - 20,
//         justifyContent: 'center'
//     },
//
//     userInfoTv: {
//         color: 'black',
//         fontSize: px2dp(Platform.OS === 'ios' ? 16 : 14),
//         paddingBottom: 2
//     },
//
//     defaultView: {
//         backgroundColor: BGTextColor,
//         borderRadius: borderRadius,
//         justifyContent: 'center',
//         height: 20,
//         width: 35,
//         alignItems: 'center',
//         marginRight: 6
//     },
//
//     defaultText: {
//         color: 'white',
//         fontSize: px2dp(Platform.OS === 'ios' ? 12 : 10),
//     },
//
//     verticalLine: {
//         backgroundColor: '#rgba(0,0,0,0.3)',
//         width: 0.5,
//         margin: 5
//     },
//
//     editView: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 3,
//         flex: 1
//     },
//
//     editIv: {
//         width: 22,
//         height: 22.25,
//         resizeMode: 'cover'
//     },
//
//     tv: {
//         color: 'gray',
//         fontSize: px2dp(Platform.OS === 'ios' ? 14 : 12),
//         alignSelf: 'center',
//         width: deviceWidth - 150,
//     },
//
//     iv: {
//         width: Platform.OS === 'ios' ? 20 : 15,
//         height: Platform.OS === 'ios' ? 20 : 15,
//         resizeMode: 'cover'
//     },
// });
//
//
// export default connect(state => ({
//         state: state
//     }),
//     (dispatch) => ({
//         actions: bindActionCreators(ShowAddressAction, dispatch)
//     })
// )(CartReceiveAddress);