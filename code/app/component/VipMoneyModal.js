// /**
//  * Created by coatu on 2016/12/29.
//  */
// import React, {Component} from "react";
// import {AsyncStorage, Image, Modal, ScrollView, StyleSheet, Text, View} from "react-native";
// import {BGTextColor, borderColor, borderRadius, deviceWidth} from "../common/CommonDevice";
// import {productVipMoneyById} from "../dao/FindDao";
// import {priceText} from "../common/CommonUtil";
// import ATouchableHighlight from "./ATouchableHighlight";
//
// let BuyerGradeArray = [];
//
// export default class ShareModalView extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         this.state = {
//             priceArray: []
//         };
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
//                     <View style={styles.allModalViewStyle}>
//                         <View style={styles.vipTopViewStyle}>
//                             <Text style={{fontSize:18,color:'gray'}}>会员价</Text>
//                         </View>
//
//                         <ScrollView >
//                             <View style={styles.ViewStyle}>
//                                 <View style={styles.vipBaozhuangViewStyle}>
//                                     <Text style={{fontSize:15,color:'gray'}}>包装:</Text>
//                                     <Text
//                                         style={{marginLeft:10,fontSize:15,color:'gray'}}>{this.props.packageList.packnum} {this.props.packageList.unitofmeasurement}/{this.props.packageList.packunit}</Text>
//                                 </View>
//
//                                 {this.vipMoney()}
//                             </View>
//                         </ScrollView>
//
//                         <View style={{alignItems:'center'}}>
//                             <ATouchableHighlight onPress={this.props.closeModal}>
//                                 <View style={styles.okViewStyle}>
//                                     <Text style={{fontSize:18,color:'white'}}>知道了</Text>
//                                 </View>
//                             </ATouchableHighlight>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         )
//     }
//
//     vipMoney(imageURl, newMoney, oldMoney) {
//         let priceDataArray = [];
//         for (let i = 0; i < this.state.priceArray.length; i++) {
//             for (let c = 0; c < BuyerGradeArray.length; c++) {
//                 if (BuyerGradeArray[c].id === this.state.priceArray[i].buyergradeid) {
//                     let price;
//                     if (this.state.priceArray[i].packprice === 0) {
//                         price = priceText
//                     } else {
//                         price = '￥' + this.state.priceArray[i].packprice + '/' + this.state.priceArray[i].unitofmeasurement
//                     }
//                     priceDataArray.push(
//                         <View key={c} style={styles.vipMoneyView}>
//                             <Image source={{uri:BuyerGradeArray[c].priceimgurl}} style={{width:52,height:15}}/>
//                             <Text style={{marginLeft:10,color:BGTextColor}}>{price}</Text>
//                             <Text
//                                 style={{marginLeft:10,color:'gray',textDecorationLine:'line-through'}}>￥{this.state.priceArray[i].markeunittprice}/{this.state.priceArray[i].markeunitofmeasurement}</Text>
//                         </View>
//                     )
//                 }
//             }
//         }
//         return priceDataArray;
//     }
//
//     componentDidMount() {
//         // AsyncStorage.getItem(BUYINFO, (err, id) => {
//         //     let item = JSON.parse(id);
//         //     let data = {
//         //         "pid": this.props.pid,
//         //         "areaid": item.areaid,
//         //         "prodpackid": this.props.packageList.prodpackid
//         //     };
//         //     productVipMoneyById(data, (res) => {
//         //         this.setState({
//         //             priceArray: res
//         //         })
//         //     }, (err) => {
//         //
//         //     })
//         // });
//
//         // AsyncStorage.getItem(BUYERGRADE, (error, imageID) => {
//         //     BuyerGradeArray = JSON.parse(imageID);
//         // })
//     }
// }
//
// const styles = StyleSheet.create({
//     bgViewStyle: {
//         backgroundColor: '#rgba(0,0,0,0.5)',
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//
//     },
//
//     vipMoneyView: {
//         flexDirection: 'row',
//         marginTop: 15,
//         marginLeft: 15,
//
//     },
//
//     allModalViewStyle: {
//         width: deviceWidth * 0.85,
//         backgroundColor: 'white',
//         borderRadius: borderRadius,
//         alignItems: 'center'
//     },
//     vipTopViewStyle: {
//         height: 40,
//         alignItems: 'center',
//         borderBottomColor: borderColor,
//         borderBottomWidth: 1,
//         width: deviceWidth * 0.8,
//         justifyContent: 'center'
//
//     },
//     vipBaozhuangViewStyle: {
//         flexDirection: 'row',
//         marginTop: 10,
//         marginLeft: 15,
//     },
//
//     okViewStyle: {
//         marginTop: 8,
//         width: deviceWidth * 0.7,
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: 40,
//         backgroundColor: BGTextColor,
//         marginBottom: 8,
//         borderRadius: borderRadius
//     },
//
//     ViewStyle: {
//         borderBottomColor: borderColor,
//         borderBottomWidth: 1,
//         paddingBottom: 20,
//         padding: 5,
//         width: deviceWidth * 0.8
//     },
//
// })
