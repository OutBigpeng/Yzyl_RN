// /**
//  * Created by Monika on 2016/10/17.
//  */
// 'use strict';
// import React, {Component} from "react";
// import {Alert, Platform, ScrollView, StyleSheet, TextInput, View} from "react-native";
// import {bindCoupon} from "../../../../dao/CouponDao";
// import VerificationCodeView from "../../../../component/VerificationCode";
// import {
//     BGColor,
//     BGTextColor,
//     borderColor,
//     borderRadius,
//     deviceWidth,
//     isEmptyObject, px2dp,
//     textHeight
// } from "../../../../common/CommonDevice";
// import {toastShort} from '../../../../common/ToastUtils';
// import CommonPhoneTextView from '../../../../component/CommonPhoneTextView';
// import Loading from '../../../../common/Loading';
// import CommonLoginButton from '../../../../component/CommonLoginButton';
//
// const dismissKeyboard = require('dismissKeyboard');
// const inputComponents = [];
//
// export default class ActivationCoupon extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         this.state = {
//             smstype: this.props.navigation.state.params.smstype,
//             vcode: '',
//             coupon: '',
//         };
//     }
//
//     //获取加载进度的组件
//     getLoading() {
//         return this.refs['loading'];
//     }
//     componentWillUnmount() {
//         this. isBack();
//     }
//
//
//     isBack() {
//         const {goBack} = this.props.navigation;
//         this.state.timer && clearTimeout(this.state.timer);
//         goBack();
//     }
//
//
//     render() {
//        const {hint,userInfo} = this.props.navigation.state.params;
//         return (
//             <View style={styles.container}>
//                 <ScrollView scrollEnabled = {false} keyboardShouldPersistTaps = 'always'>
//                     <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}>
//                         <View style={{marginTop:10,marginBottom:15}}>
//                             <View style={styles.inputbg}>
//                                 {this.commonTextInputView(hint, 1)}
//                             </View>
//
//                             <View style={styles.inputbg}>
//                                 {this.commonTextInputView('验证码', 2)}
//                                 <VerificationCodeView
//                                     mobile={userInfo.mobile}
//                                     smstype={6}
//                                     callBack={this.timers.bind(this)}
//                                     compent = {this}
//                                 />
//                             </View>
//
//                             <View style={styles.inputbg}>
//                                 {this.commonTextInputView('优惠券激活码', 3)}
//                             </View>
//                         </View>
//
//                       <View style={{alignItems: 'center'}}>
//                           <CommonLoginButton
//                               {...this.props}
//                               name='下一步'
//                               num={0}
//                               compent = {this}
//                               style = {{backgroundColor:this.inspect() ? BGTextColor:'#rgba(190,190,190,1)'}}
//                               onPress = {() => this.next()}
//                           />
//                       </View>
//                         <View style={styles.secondViewStyle}>
//                             <CommonPhoneTextView/>
//                         </View>
//                     </View>
//                 </ScrollView>
//                 <Loading ref={'loading'}/>
//             </View>
//
//         )
//     }
//     inspect(){
//         return (this.state.vcode && this.state.coupon ) || false;
//     }
//
//     _onStartShouldSetResponderCapture (event) {
//         let target = event.nativeEvent.target;
//         if(!inputComponents.includes(target)) {
//             dismissKeyboard();
//         }
//         return false;
//     }
//
//     _inputOnLayout(event){
//         inputComponents.push(event.nativeEvent.target);
//     }
//
//     commonTextInputView(placeholder, num) {
//         return (
//             <View>
//                 <TextInput
//                     style={[styles.textInputStyle,{width:num===2?deviceWidth-100:deviceWidth}]}
//                     placeholder={placeholder}
//                     placeholderTextColor='#aaaaaa'
//                     numberOfLines={1}
//                     editable={num!=1||false}
//                     maxLength={num==1?11:6}
//                     underlineColorAndroid='transparent'
//                     onChangeText={(text) =>this.onChangeTextView(text,num)}
//                     onLayout={this._inputOnLayout.bind(this)}
//                 />
//             </View>
//         )
//     }
//
//     timers(timer) {
//         this.setState({
//             timer: timer
//         })
//     }
//
//     onChangeTextView(text, num) {
//         switch (num) {
//             case 2:
//                 this.setState({vcode: text});
//                 break;
//             case 3:
//                 this.setState({coupon: text});
//                 break;
//             default:
//                 break;
//         }
//     }
//
//     next() {
//         const {navigate,goBack,state} = this.props.navigation;
//         if (isEmptyObject(this.state.vcode)) {
//             toastShort('请输入验证码');
//             return;
//         }
//         if (isEmptyObject(this.state.coupon )) {
//             toastShort('请输入优惠券激活码');
//             return;
//         }
//
//         bindCoupon(state.params.userInfo.userid, this.state.coupon, this.state.vcode,navigate, (result) => {
//             if (result) {
//                 Alert.alert("温馨提示", "恭喜您激活一张代金券!", [
//                     {text: '取消', onPress: () => console.log('Cancel Pressed!')},
//                     {
//                         text: '确定', onPress: () => {
//                         state.params.callBack();
//                         goBack();
//                     }
//                     },
//                 ])
//             }
//         }, (error) => {
//
//         })
//     }
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: BGColor
//     },
//
//     inputbg: {
//         backgroundColor: 'white',
//         borderBottomColor: borderColor,
//         borderBottomWidth: 1,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: deviceWidth,
//         alignItems: 'center',
//         paddingRight: 10
//     },
//
//     textInputStyle: {
//         height: textHeight,
//         width: deviceWidth,
//         paddingLeft: 10,
//         fontSize: px2dp(14)
//     },
//
//     nextStyle:{
//         borderRadius: borderRadius,
//         margin: 10,
//         backgroundColor: BGTextColor,
//         alignItems: 'center',
//         height:textHeight,
//         justifyContent:'center'
//     },
//
//     nextText:{
//         color: 'white',
//         padding: 8,
//         fontSize:px2dp(Platform.OS === 'ios'?16:14)
//     },
//
//     secondViewStyle:{
//         alignItems:'center',
//         justifyContent:'flex-end',
//         width:deviceWidth-18,
//         flexDirection:'row',
//         marginTop:8
//     },
// });