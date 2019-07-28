// /**首页——购物车
//  * Created by coatu on 2016/12/21.
//  */
// import React, {Component} from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     ListView,
//     Image,
//     TouchableHighlight,
//     InteractionManager,
//     AsyncStorage,
//     Platform,
//     Alert,
//     NativeAppEventEmitter,
//     DeviceEventEmitter
// } from "react-native";
// import {
//     deviceHeight,
//     deviceWidth,
//     BGTextColor,
//     connect,
//     bindActionCreators,
//     BGColor,
//     toastShort,
//     MobclickAgent,
//     actionBar,
//     iosDownLoadUrl, Sizes, textHeight, px2dp
// } from "../../common/CommonDevice";
// import ConfrimOrder from "./ConfrimOrder";
// import * as ShopAction from "../../actions/ShopAction";
// import CommonShopProductCell from "../../component/CommonShopProductCell";
// import Loadings from "../../common/ActionLoading";
// import {getUpdate} from "../../dao/SysDao";
// import WebViews from "../../pages/me/mine/set/WebViews";
// import CommonModalAppStore from '../../component/CommonModalAppStore'
// // import JpushView from '../../containers/JpushView'
// import ATouchableHighlight from "../../component/ATouchableHighlight";
//
// class ShopView extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//         this.state = {
//             modalVisible: false,
//             dataSource: ds,
//             info: {}
//         };
//     }
//
//     setModalVisible(visible) {
//         this.setState({
//             modalVisible: visible
//         });
//     }
//
//     render() {
//         let money = 0.00;
//         for (let i = 0; i < this.props.state.ShopCart.TotalPrice.length; i++) {
//             let moneyCount = this.props.state.ShopCart.allMoney[`${this.props.state.ShopCart.TotalPrice[i].dataId}`];
//
//             if (moneyCount) {
//                 money = money + moneyCount * 1
//             }
//         }
//         let orderCount = this.props.state.ShopCart.selectArray.length;
//         return (
//             <View style={styles.container}>
//                 {this.props.state.ShopCart.isLoading ? <Loadings /> :
//                     <View>
//                         {/*<JpushView navigation = {this.props.navigation}/>*/}
//                     <ListView
//                         dataSource={this.state.dataSource.cloneWithRows(this.props.state.ShopCart.shopListData)}
//                         renderRow={(rowData)=>this.renderRow(rowData)}
//                         renderFooter={()=>this.renderFooter()}
//                         enableEmptySections={true}
//                         removeClippedSubviews={false}
//                         style={[ISSHOWCART?styles.ListView:{}]}
//                     />
//
//                      </View>
//                 }
//                 {ISSHOWCART ? <View style={styles.bottomViewStyle}>
//                         <View>
//                             <Text
//                                 style={{color:'white',marginLeft:10,fontSize:px2dp(Platform.OS === 'ios'?16:14)}}>总计:￥{money.toFixed(2)}</Text>
//                         </View>
//                         <ATouchableHighlight onPress={()=>this.sureOrder()} >
//                             <View style={styles.bottomRightViewStyle}>
//                                 <Text
//                                     style={{color:'white',fontSize:px2dp(Platform.OS === 'ios'?16:14)}}>下订单({orderCount})</Text>
//                             </View>
//                         </ATouchableHighlight>
//                     </View> : null}
//                 <CommonModalAppStore
//                     visible={this.state.modalVisible}
//                     closeModal={()=>this.setModalVisible(!this.state.modalVisible)}
//                 />
//             </View>
//         )
//     }
//
//     sureOrder() {
//         let products = [];
//         let carJson = [];
//         if (this.props.state.ShopCart.selectDataArray) {
//             for (let i = 0; i < this.props.state.ShopCart.selectDataArray.length; i++) {
//                 if (this.props.state.ShopCart.selectDataArray) {
//                     products.push(this.props.state.ShopCart.selectDataArray[i]);
//                 }
//             }
//             carJson = {'products': products};
//         }
//         let data = {'name': Platform.OS === 'ios' ? carJson : carJson.toString()};
//         MobclickAgent.onEvent("yz_shopCart", data);
//         if (this.props.state.ShopCart.selectArray.length > 0) {
//             const {navigate} = this.props.navigation;
//             InteractionManager.runAfterInteractions(() => {
//                 navigate('ConfrimOrder', {
//                     title: '确认订单',
//                     name: 'ConfrimOrder',
//                     carJson: carJson,
//                     // callBack:()=>this.refreshView()
//                 })
//             });
//         } else {
//             toastShort('还没选择任何商品哦');
//         }
//     }
//
//     renderRow(rowData) {
//         return (
//             <View style={{marginTop:8,flex:1,}} key={rowData.id}>
//                 <CommonShopProductCell
//                     navigation={this.props.navigation}
//                     rowData={rowData}
//                     priceimgurl={this.state.info.priceimgurl}
//                 />
//             </View>
//         )
//     }
//
//     renderFooter() {
//         return (
//             <ATouchableHighlight  onPress={()=>this.pushToFind()}>
//                 <View style={styles.ListViewBottomStyle}>
//                     <Image source={require('../../imgs/shop/add.png')}/>
//                     <Text style={{marginLeft:15,fontSize:px2dp(Sizes.searchSize)}}>点击添加更多产品</Text>
//                 </View>
//             </ATouchableHighlight>
//         )
//     }
//
//     pushToFind() {
//         //TODO:需要修改
//         const {navigate} = this.props.navigation;
//         navigate('FindView');
//         // this.props.callbackParent(1);
//     }
//
//     componentDidMount() {
//         {
//             this.isUpdate()
//         }
//         this.props.actions.fetchClearSelectCartIfNeeded();
//         const {navigate} = this.props.navigation;
//         AsyncStorage.getItem(BUYINFO, (res, id) => {
//             let item = JSON.parse(id);
//             this.props.actions.fetchShopListInfo(item, navigate, true);
//             this.setState({
//                 info: item
//             })
//         })
//
//     }
//
//     isUpdate() {
//         const {navigate} = this.props.navigation;
//         getUpdate(navigate, (result) => {
//             {
//                 this.getData(result)
//             }
//         }, (err) => {
//         })
//     }
//
//     getData(result) {
//         const {navigate} = this.props.navigation;
//         if (result.isforceupdate === 0 || result.isforceupdate === 1) {
//             if (result.isforceupdate === 0) {
//                 Alert.alert(
//                     '温馨提示',
//                     result.description,
//                     [
//                         {text: '取消', onPress: () => console.log('')},
//                         {
//                             text: '确定', onPress: () => {
//                             {
//                                 Platform.OS === 'ios' ? this.setModalVisible(true) :
//                                     InteractionManager.runAfterInteractions(() => {
//                                         navigate('WebViews', {
//                                             name: 'WebViews',
//                                             downloadurl: Platform.OS === 'ios' ? iosDownLoadUrl : result.downloadurl,
//                                             callback: () => null
//                                         })
//                                     })
//                             }
//                         }
//                         }
//                     ], Platform.OS == 'android' ? {cancelable: false} : {}
//                 );
//             } else {
//                 AsyncStorage.setItem(USERINFO, JSON.stringify(''));
//                 AsyncStorage.setItem(USERANDPWD, JSON.stringify(''));
//                 Alert.alert(
//                     '温馨提示',
//                     result.description,
//                     [
//                         {
//                             text: '确定', onPress: () => {
//                             {
//                                 Platform.OS === 'ios' ? this.setModalVisible(true) :
//                                     InteractionManager.runAfterInteractions(() => {
//                                         navigate('WebViews', {
//                                             name: 'WebViews',
//                                             downloadurl: Platform.OS === 'ios' ? iosDownLoadUrl : result.downloadurl,
//                                             callback: this.callback.bind(this)
//                                         })
//                                     })
//                             }
//                         }
//                         }
//                     ], Platform.OS == 'android' ? {cancelable: false} : {}
//                 );
//             }
//         }
//     }
//
//     callback() {
//         this.isUpdate()
//     }
// }
//
// let bottom = 80;
//
// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: BGColor,
//         height: Platform.OS=='ios'?deviceHeight-114:deviceHeight-actionBar,
//     },
//
//     bottomViewStyle: {
//         width: deviceWidth,
//         height: actionBar,
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         position: 'absolute',
//         bottom: Platform.OS=='ios'?0:bottom,
//         backgroundColor: '#rgba(65,65,65,1)',
//         flexDirection: 'row',
//     },
//
//     bottomRightViewStyle: {
//         width: 100,
//         height: actionBar,
//         backgroundColor: BGTextColor,
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//
//     ListViewBottomStyle: {
//         marginTop: 10,
//         alignItems: 'center',
//         backgroundColor: 'white',
//         width: deviceWidth,
//         padding: 20,
//         flexDirection: 'row',
//         marginBottom: 10
//     },
//
//     ListView: {
//         marginBottom:Platform.OS=='ios'?50: bottom+actionBar
//     }
// });
//
// export default connect(state => ({
//         state: state
//     }),
//     (dispatch) => ({
//         actions: bindActionCreators(ShopAction, dispatch)
//     })
// )(ShopView);
