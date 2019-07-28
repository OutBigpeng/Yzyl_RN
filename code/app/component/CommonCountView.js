// /**加入购物车的加减
//  * Created by coatu on 2016/12/23.
//  */
// import React, {Component} from "react";
// import {Platform, StyleSheet, Text, View} from "react-native";
// import {bindActionCreators, borderColor, connect, deviceWidth, px2dp} from "../common/CommonDevice";
// import * as ShopAction from "../actions/ShopAction";
// import ATouchableHighlight from "./ATouchableHighlight";
//
// class CommonCountView extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         this.state = {
//             count: 1
//         };
//     }
//
//     render() {
//         let dataId = this.props.rowData.prodpackid;
//         let count = this.props.state.ShopCart.quantity[`${dataId}`];
//         return (
//             <View style={styles.container}>
//                 <View style={styles.countRightViewStyle}>
//                     <ATouchableHighlight onPress={()=>this.reduce(count,this.props.rowData.prodpackid)}>
//                         <Text
//                             style={[styles.jianStyle,Platform.OS==='ios'?{}:{borderBottomLeftRadius:2,borderTopLeftRadius:2}]}>-</Text>
//                     </ATouchableHighlight>
//                     <Text
//                         style={[styles.textStyle,{width:this.props.isShop ? 60 :100}]}>{this.props.isShop ? count : this.state.count}</Text>
//                     <ATouchableHighlight onPress={()=>this.add(count,this.props.rowData.prodpackid)}>
//                         <Text
//                             style={[styles.jianStyle,Platform.OS==='ios'?{}:{borderBottomRightRadius:2,borderTopRightRadius:2}]}>+</Text>
//                     </ATouchableHighlight>
//
//                     <Text style={{marginLeft:8}}>{this.props.typeName}</Text>
//                 </View>
//             </View>
//         )
//     }
//
//     reduce(quantity, prodpackid) {
//         if (this.props.isShop) {
//             this.props.actions.fetchShopReduceCountInfo(quantity, prodpackid)
//         } else {
//             if (this.state.count > 1) {
//                 this.setState({
//                     count: this.state.count - 1
//                 })
//                 this.props.callback(this.state.count - 1);
//             }
//         }
//     }
//
//     add(quantity, prodpackid) {
//         if (this.props.isShop) {
//             this.props.actions.fetchShopAddCountInfo(quantity, prodpackid)
//         } else {
//             this.setState({
//                 count: this.state.count + 1
//             });
//             this.props.callback(this.state.count + 1);
//         }
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flexDirection: 'row'
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
//     jianStyle: {
//         borderColor: borderColor,
//         borderWidth: 0.5,
//         textAlign: 'center',
//         padding: Platform.OS === 'ios' ? 8 : 6,
//         fontSize: px2dp(15)
//     },
//
//     textStyle: {
//         padding: Platform.OS === 'ios' ? 8 : 6,
//         fontSize: px2dp(15),
//         textAlign: 'center',
//         width: 100,
//         borderColor: borderColor,
//         borderWidth: 0.5,
//     },
// });
//
// export default connect(state => ({
//         state: state
//     }),
//     (dispatch) => ({
//         actions: bindActionCreators(ShopAction, dispatch)
//     })
// )(CommonCountView);
