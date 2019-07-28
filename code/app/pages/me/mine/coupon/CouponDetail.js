// /**优惠券详情
//  * Created by Monika on 2016/12/28.
//  */
// 'use strict';
// import React, {Component} from "react";
// import {Text, View, StyleSheet, WebView, Platform} from "react-native";
// import NavigatorView from "../../../../component/NavigatorView";
// import {deviceWidth, borderColor, deviceHeight, BGColor, px2dp} from "../../../../common/CommonDevice";
// export default class CouponDetail extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         this.state = {
//             detailData: this.props.navigation.state.params.detailData
//         };
//     }
//
//     componentDidMount() {
//         window.onload = function () {
//             let height = document.body.clientHeight;
//             window.location.hash = '#' + height;
//         }
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 <View style={{borderBottomWidth: 0.3, borderBottomColor: borderColor,paddingBottom:10,marginTop:5, backgroundColor: 'white',}}>
//                     <Text style={{padding:10,color:'black',fontWeight:'bold'}}>{this.state.detailData.typename}</Text>
//                     <Text
//                         style={{paddingLeft:10,}}>有效期：{this.state.detailData.startime}~{this.state.detailData.endtime}</Text>
//                     <Text style={{paddingLeft:10,paddingTop:8}}>{this.state.detailData.description}</Text>
//                 </View>
//                 <View style={{height:deviceHeight}}>
//                     <Text
//                         style={{padding:10,color:'black',fontWeight:'bold',fontSize:px2dp(Platform.OS === 'ios'?14:12)}}>使用说明</Text>
//                     <WebView
//                         automaticallyAdjustContentInsets={true}
//                         style={styles.webView}
//                         source={Platform.OS === 'ios'?{html:this.state.detailData.instructions,baseUrl:''}:{html:this.state.detailData.instructions}}
//                         javaScriptEnabled={true}
//                         domStorageEnabled={true}
//                         startInLoadingState={true}
//                         scalesPageToFit={this.state.scalesPageToFit}
//                     />
//                 </View>
//             </View>
//         )
//     }
// }
// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: BGColor,
//         flex: 1
//     },
//
//     listView: {
//         width: deviceWidth,
//         paddingBottom: 15
//     },
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
// });
