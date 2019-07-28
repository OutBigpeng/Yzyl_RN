// /**产品条目点击——>加入购物车
//  * Created by coatu on 2016/12/22.
//  */
// import React, {Component} from "react";
// import {AsyncStorage, Image, Modal, Platform, StyleSheet, Text, View} from "react-native";
// import {
//     BGTextColor,
//     bindActionCreators,
//     borderColor,
//     borderRadius,
//     connect,
//     deviceWidth,
//     MobclickAgent
// } from "../common/CommonDevice";
// import * as ShopAction from "../actions/ShopAction";
// import ATouchableHighlight from "./ATouchableHighlight";
//
//
// class ModalProductShopView extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         this.state = {
//             count: 1,
//             userInfo:{}
//         };
//     }
//
//     componentDidMount() {
//         AsyncStorage.getItem(BUYINFO,(err,id)=>{
//             let item = JSON.parse(id);
//             this.setState({
//                 userInfo:item
//             })
//         })
//     }
//
//     render() {
//         return (
//             <Modal
//                 animationType={"none"}
//                 transparent={true}
//                 visible={this.props.visible}
//                 onRequestClose={()=>this.props.visible}
//             >
//                 <View style={styles.bgViewStyle}>
//                     <View style={styles.allViewStyle}>
//                         <ATouchableHighlight onPress={this.props.closeModal} >
//                             <View style={styles.cloneViewStyle}>
//                                 <Image source={require('../imgs/other/close.png')}/>
//                             </View>
//                         </ATouchableHighlight>
//
//                         <View style={styles.topViewStyle}>
//                             <View>
//                                 <Image
//                                     source={this.props.rowData.thumb?{uri:this.props.rowData.thumb}:require('../imgs/other/defaultimg.png')}
//                                     style={styles.proIv}/>
//                             </View>
//
//                             <View style={styles.topRightViewStyle}>
//                                 <Text>{this.props.rowData.brandname} {this.props.rowData.name}</Text>
// {/*
//                                 <Image source={{uri:this.state.userInfo.priceimgurl}} style={styles.rightImageStyle}/>
// */}
//                                 <Text
//                                     style={{fontSize:12,marginTop:4,flexDirection:'row',color:BGTextColor}}>￥{this.props.rowData.packprice}/{this.props.rowData.unitofmeasurement}
//                                     &nbsp;
//                                     <Text style={{fontSize:12,color:'gray', textDecorationLine: 'line-through',}}>
//                                         ￥{this.props.rowData.markeunittprice}/{this.props.rowData.markeunitofmeasurement}</Text>
//                                 </Text>
//                             </View>
//                         </View>
//
//                         <View style={styles.centerViewStyle}>
//                             <Text style={{marginTop:8}}>包装</Text>
//                             <View style={styles.centerRightViewStyle}>
//                                 <Text style={{ textAlign:'center'}}>
//                                     {this.props.rowData.packnum} {this.props.rowData.unitofmeasurement}/{this.props.rowData.packunit}</Text>
//                             </View>
//                         </View>
//
//                         <View style={styles.bottomStyle}>
//                             {/*左边*/}
//                             <ATouchableHighlight onPress={()=>this.pushToShopView()} >
//                                 <View style={styles.leftViewStyle}>
//                                     <Image source={require('../imgs/navigator/shoping.png')}
//                                            style={{width:27,height:25,marginTop:5}}/>
//                                     <Text style={{color:'white',fontSize:12,marginTop:4}}>购物车</Text>
//                                     <View style={styles.shopCountStyle}>
//                                         <Text
//                                             style={{color:BGTextColor,textAlign:'center',fontSize:Platform.OS==='ios'?14:10}}>
//                                             {this.props.state.ShopCart.ShopCount}</Text>
//                                     </View>
//
//                                 </View>
//                             </ATouchableHighlight>
//
//                             {/*中间*/}
//                             <View style={styles.contentViewStyle}>
//                                 <ATouchableHighlight onPress={()=>this.reduce()} >
//                                     <Text
//                                         style={[styles.jianStyle,Platform.OS==='ios'?{}:{borderBottomLeftRadius:2,borderTopLeftRadius:2}]}>-</Text>
//                                 </ATouchableHighlight>
//                                 <Text style={styles.textStyle}>{this.state.count}</Text>
//                                 <ATouchableHighlight onPress={()=>this.add()} >
//                                     <Text
//                                         style={[styles.jianStyle,Platform.OS==='ios'?{}:{borderBottomRightRadius:2,borderTopRightRadius:2}]}>+</Text>
//                                 </ATouchableHighlight>
//                                 <Text
//                                     style={{color:'white',fontSize:Platform.OS==='ios'?17:15,marginLeft: 6}}>{this.props.rowData.packunit}</Text>
//                             </View>
//
//                             {/*右边*/}
//                             <ATouchableHighlight onPress={()=>this.addShopCart()}>
//                                 <View style={[styles.RightViewStyle,{backgroundColor: BGTextColor}]}>
//                                     <Text style={{color:'white',fontSize:Platform.OS==='ios'?18:14}}>加入购物车</Text>
//                                 </View>
//                             </ATouchableHighlight>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         )
//     }
//
//     pushToShopView() {
//         this.props.closeModal();
//         this.props.jumpCart();
//     }
//
//     reduce() {
//         if (this.state.count > 1) {
//             this.setState({
//                 count: this.state.count - 1
//             })
//         }
//     }
//
//     add() {
//         this.setState({
//             count: this.state.count + 1
//         })
//     }
//
//     //加入购物车
//     addShopCart() {
//         const {navigate} = this.props.navigation;
//         AsyncStorage.getItem(USERID, (err, id) => {
//             let item = JSON.parse(id);
//             let data = {
//                 "userid": item,
//                 "prodpackid": this.props.rowData.prodpackid,
//                 "quantity": this.state.count
//             };
//             let mobData = {"name": this.props.rowData.brandname +  this.props.rowData.name};
//             MobclickAgent.onEvent("yz_addShopCart", mobData);
//             this.props.actions.fetchAddShopIfNeeded(data, this.state.count, navigate);
//             this.setState({
//                 count: 1
//             });
//             this.props.closeModal();
//         })
//     }
// }
//
// const styles = StyleSheet.create({
//     bgViewStyle: {
//         flex: 1,
//         backgroundColor: '#rgba(0,0,0,0.2)',
//     },
//     productViewStyle: {
//         width: deviceWidth,
//         padding: 10,
//         flexDirection: 'row',
//         borderBottomWidth: 1,
//         borderBottomColor: borderColor
//     },
//     proIv: {
//         width: 70,
//         height: 70,
//         borderRadius: borderRadius,
//         resizeMode: 'contain'
//
//     },
//     allViewStyle: {
//         position: 'absolute',
//         backgroundColor: 'white',
//         bottom: 0,
//         flexDirection: 'column'
//     },
//     topViewStyle: {
//         width: deviceWidth,
//         padding: 10,
//         flexDirection: 'row',
//         borderBottomColor: borderColor,
//         borderBottomWidth: 1,
//         marginTop: 10
//     },
//
//     topRightViewStyle: {
//         marginLeft: 10,
//         width: deviceWidth - 90
//     },
//
//     bottomViewStyle: {
//         width: deviceWidth,
//         height: 45,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: BGTextColor
//     },
//
//     countViewStyle: {
//         padding: 10,
//         width: deviceWidth,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between'
//     },
//
//     countRightViewStyle: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//
//     centerViewStyle: {
//         flexDirection: 'row',
//         height: 70,
//         borderBottomColor: borderColor,
//         borderBottomWidth: 1,
//         padding: 10
//     },
//
//     centerRightViewStyle: {
//         marginLeft: 10,
//         padding: 5,
//         borderColor: BGTextColor,
//         borderWidth: 1,
//         borderRadius: borderRadius,
//         height: 30,
//     },
//     cloneViewStyle: {
//         marginTop: 8,
//         justifyContent: 'flex-end',
//         height: 15,
//         flexDirection: 'row',
//         width: deviceWidth - 10,
//     },
//     rightImageStyle: {
//         width: Platform.OS === 'ios' ? 55 : 52,
//         height: Platform.OS === 'ios' ? 16 : 15,
//         marginTop: 4
//     },
//     bottomStyle: {
//         width: deviceWidth,
//         height: 50,
//         backgroundColor: 'black',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//     },
//
//     leftViewStyle: {
//         marginLeft: 10,
//         alignItems: 'center',
//         paddingRight: Platform.OS === 'ios' ? 0 : 8
//     },
//
//     contentViewStyle: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginLeft: 10
//         // flex:3
//     },
//
//     RightViewStyle: {
//         backgroundColor: BGTextColor,
//         height: 50,
//         width: Platform.OS === 'ios' ? 110 : 90,
//         alignItems: 'center',
//         justifyContent: 'center',
//
//     },
//     shopCountStyle: {
//         position: 'absolute',
//         paddingLeft: 6,
//         paddingRight: 6,
//         paddingTop: 1,
//         paddingBottom: 1,
//         backgroundColor: 'white',
//         top: 1,
//         right: Platform.OS === 'ios' ? -6 : 0,
//         borderRadius: 15
//     },
//
//     jianStyle: {
//         backgroundColor: 'white',
//         padding: 10,
//         borderWidth: 0.5,
//         borderColor: '#rgba(236,236,236,1)',
//     },
//
//     textStyle: {
//         textAlign: 'center',
//         backgroundColor: 'white',
//         padding: 10,
//         width: Platform.OS === 'ios' ? 50 : 40,
//         // paddingLeft: 15,
//         borderWidth: 0.5,
//         borderColor: '#rgba(236,236,236,1)'
//
//     }
// });
//
//
// export default connect(state => ({
//         state: state
//     }),
//     (dispatch) => ({
//         actions: bindActionCreators(ShopAction, dispatch)
//     })
// )(ModalProductShopView);