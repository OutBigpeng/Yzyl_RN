// /**
//  * Created by Monika on 2017/4/6.
//  * 找支持
//  */
// import React, {Component} from "react";
// import {Alert, AsyncStorage, Image, InteractionManager, Platform, StyleSheet, Text, View} from "react-native";
// import {
//     _,
//     BGColor,
//     bindActionCreators,
//     connect,
//     deviceHeight,
//     deviceWidth,
//     Loading,
//     LoginAlerts,
//     PlatfIOS,
//     px2dp,
//     toastShort
// } from "../../common/CommonDevice";
// import {ChatLoginAction, ChatRosterAction, ChatSubscribeAction} from "../../chat/actions";
// import store from "../../store/Store";
// import TechnicalFormula from "./TechnicalFormula";
// import {Colors, Images} from "../../pstyle";
// import {sendQueryValueBySCKey} from "../../chat/dao/ChatDao";
// import JPushModule from "jpush-react-native";
// import ATouchableHighlight from "../../component/ATouchableHighlight";
//
// let BadgeAndroid = (PlatfIOS ? '' : require('react-native-android-badge'));
//
// let kefuAccount;
//
// class FindSupport extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         this.state = {
//             userinfo: {}
//         };
//     }
//
//     componentDidMount() {
//         AsyncStorage.getItem(BUYINFO, (err, id) => {
//             let item = JSON.parse(id);
//             this.setState({
//                 userinfo: item
//             })
//         });
//
//         this.props.actions.getContacts();
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
//                 <View style={styles.buttonView}>
//                     {this.button('在线问答', Images.iconOnlineQuiz, 1)}
//                     <View style={styles.lineGray}/>
//                     {this.button('技术配方', Images.iconTechnicalFormula, 2)}
//                 </View>
//
//                 <Loading ref={'loading'} text={'请等待...'}/>
//             </View>
//         )
//     }
//
//     button(name, img, type) {
//         return (
//             <View style={[styles.buttonViewStyle, {}]}>
//                 <ATouchableHighlight onPress={() => this.onPressButton(type)}>
//                     <View style={{alignItems: 'center', justifyContent: 'center'}}>
//                         <Image source={img} style={{width: 65, height: 65}}/>
//                         {(type % 2 !== 0 && this.props.state.ChatSubscribe.msgCount > 0)
//                             ?
//                             <View style={styles.whiteRadio}>
//                                 <Text style={{
//                                     color: 'white',
//                                     fontSize: px2dp(9)
//                                 }}>{this.props.state.ChatSubscribe.msgCount}</Text>
//                             </View>
//                             : null}
//                         <Text style={{fontSize: px2dp(16), marginTop: 7}}>{name}</Text>
//                     </View>
//                 </ATouchableHighlight>
//             </View>
//         )
//     }
//
//     onPressButton(type) {
//         const {navigate} = this.props.navigation;
//         if (_.isEmpty(this.state.userinfo)) {
//             LoginAlerts((okOnPress) => {
//                 InteractionManager.runAfterInteractions(() => {
//                     navigate('LoginView', {
//                         title: '登录',
//                         rightTitle: '注册',
//                         isReLogin: false,
//                     })
//                 })
//             })
//         } else {
//             switch (type) {
//                 case 1://找客服
//                     if (Platform.OS == 'android') {
//                         JPushModule.clearAllNotifications();
//                     }
//                     this.getLoading().show();
//                     sendQueryValueBySCKey("IM_isOpen", navigate, (res) => {
//                         let isOpen = res;
//                         if (isOpen && isOpen == 'Y') {
//                             // alert('success' + 'Y');
//                             AsyncStorage.getItem(WEBIMTOKEN, (err, result) => {
//
//                                 let data = JSON.parse(result);
//                                 if (this.props.state.ChatRoster && this.props.state.ChatRoster.roster.length > 0) {
//                                     kefuAccount = this.props.state.ChatRoster.roster[0].name;
//                                 } else {
//                                     AsyncStorage.getItem('contactList', (err, id) => {
//                                         let item = JSON.parse(id);
//                                         if (item) {
//                                             kefuAccount = item[0].name;
//                                         }
//                                     })
//                                 }
//
//                                 if (data) {
//                                     if (kefuAccount) {
//                                         this.getLoading().dismiss();
//                                         InteractionManager.runAfterInteractions(() => {
//                                             navigate('ChatMessage', {
//                                                 name: 'ChatMessage',
//                                                 title: '客服',
//                                                 kefuAccount: kefuAccount,
//                                                 callback: this.callBack.bind(this)
//                                             })
//                                         })
//                                     } else {
//                                         this.getLoading().dismiss();
//                                         AsyncStorage.setItem('isAgainLogin', JSON.stringify(''));
//                                         AsyncStorage.setItem(WEBIMTOKEN, JSON.stringify(''));
//                                         // Alert.alert("", "客服不在线，稍候再试111");
//                                         toastShort("再点一次....")
//                                     }
//                                 } else {
//                                     // alert('success-data' + 'wu');
//                                     this.setReLogin(true)
//                                 }
//                             }, (err) => {
//                                 // alert('error-data' + 'wu');
//                                 this.setReLogin(true)
//                             });
//                         } else {
//                             // alert('fail' + 'N');
//                             this.setReLogin(false)
//                         }
//                     }, (error) => {
//                         this.getLoading().dismiss();
//                         toastShort('网络发生错误，请重试')
//                     });
//                     break;
//                 case 2://配方
//                     InteractionManager.runAfterInteractions(() => {
//                         navigate('TechnicalFormula', {
//                             name: 'TechnicalFormula',
//                             title: '技术配方'
//                         })
//                     });
//                     /**
//                      * { subscription: 'to',
//                       jid: '1120161123115550#rntest_2@easemob.com',
//                       name: '2',
//                      groups: [] }
//                      */
//                     // InteractionManager.runAfterInteractions(() => {
//                     //     navigator.push({
//                     //         component: ChatMessage,
//                     //         componentName: '客服',
//                     //         name: '1'
//                     //     })
//                     // });
//                     break;
//                 default:
//                     break;
//             }
//         }
//
//     }
//
//     setReLogin(flag) {
//         if (flag) {
//             AsyncStorage.setItem('isAgainLogin', JSON.stringify(''));
//             AsyncStorage.setItem(WEBIMTOKEN, JSON.stringify(''));
//             store.dispatch(ChatLoginAction.login(1, this.props.navigation));
//             if (!this.props.state.ChatLogin.fetching) {
//                 this.getLoading().dismiss();
//             }
//             setTimeout(() => {
//                 this.getLoading().dismiss();
//             }, 3000)
//         } else {
//             this.getLoading().dismiss();
//             Alert.alert("", "该功能即将启用，敬请期待！！！");
//         }
//     }
//
//     callBack() {
//         // console.log("-------回呀回调-------------------");
//         store.dispatch(ChatSubscribeAction.removeMsgCount());
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         height: PlatfIOS ? deviceHeight - 100 : deviceHeight - 120,
//         backgroundColor: BGColor,
//     },
//     lineGray: {
//         height: 0.5,
//         backgroundColor: Colors.steel,
//         width: deviceWidth / 2,
//         alignSelf: 'center',
//         margin: 10
//     },
//     buttonView: {
//         marginTop: 5,
//         flex: 1,
//         backgroundColor: 'white',
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     buttonViewStyle: {
//         alignItems: 'center',
//         padding: 15,
//         justifyContent: 'center'
//     },
//     whiteRadio: {
//         width: PlatfIOS ? 16 : 12,
//         height: PlatfIOS ? 16 : 12,
//         borderRadius: PlatfIOS ? 8 : 6,
//         backgroundColor: 'white',
//         position: 'absolute',
//         right: 4,
//         top: 4,
//     },
//     redRadio: {
//         width: PlatfIOS ? 16 : 12,
//         height: PlatfIOS ? 16 : 12,
//         borderRadius: PlatfIOS ? 8 : 6,
//         backgroundColor: 'red',
//         alignSelf: 'center',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//
// });
//
// export default connect(state => ({
//         state: state
//     }),
//     (dispatch) => ({
//         actions: bindActionCreators(ChatRosterAction, dispatch)
//     })
// )(FindSupport);
