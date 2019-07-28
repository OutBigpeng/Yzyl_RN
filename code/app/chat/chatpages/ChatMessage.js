// import React, {Component} from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     AsyncStorage,
//     Clipboard,
//     Dimensions,
//     Image,
//     InteractionManager,
//     Keyboard,
//     LayoutAnimation,
//     PixelRatio,
//     Platform,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableHighlight,
//     TouchableOpacity,
//     View
// } from "react-native";
//
// import * as MessageActions from "../actions/ChatMessageAction";
// import {Images} from "../themes";
// import ImagePro from "../../common/ImageProgress";
// import Permissions from 'react-native-permissions'
// import BaseListView from "../view/BaseListView";
// import ImagePicker from "react-native-image-picker";
// import Emoji from "react-native-emoji";
// import Swiper from "react-native-swiper";
// import WebIM from "../lib/WebIM";
// import {
//     BGColor,
//     bindActionCreators,
//     compare,
//     connect,
//     deviceWidth,
//     Loading,
//     toastShort
// } from "../../common/CommonDevice";
// import {sendQueryValueBySCKey} from "../dao/ChatDao";
// import {defaultSend, DuplicateRemoval} from "../utils/ChatMessageUtil";
// import BrannerDetailView from "../../pages/find/product/BrannerDetailView";
// import ShowCopyModal from "./ShowCopyModal";
// import ATouchableHighlight from "../../component/ATouchableHighlight";
// //
// // import {Overlay} from "teaset";
// const dismissKeyboard = require('dismissKeyboard');
//
// const {width, height} = Dimensions.get('window');
// const Options = {
//     title: 'Select Avatar',
//     customButtons: [
//         {name: 'fb', title: 'Choose Photo from Facebook'},
//     ],
//     storageOptions: {
//         skipBackup: true,
//         path: 'images'
//     }
// };
//
// let count = 0;
// let messageArray = [];
// class ChatMessage extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             height: 34,
//             isRefreshing: false,
//             modalVisible: false,
//             txtCopy: '',
//             focused: false,
//             visibleHeight: width < height ? height : width,
//             isEmoji: false,
//             sendId: this.props.navigation.state.params.kefuAccount,
//             messages: {messages: []},
//             userInfo: {},
//             //权限
//             add: false,
//             status: {},
//         };
//     }
//
//     // ------------ logic  ---------------
//     updateList(props, isAdd, welcomeTxt) {
//         let chatId = this.state.sendId;
//         AsyncStorage.getItem(`CHATHISTORY${this.state.userInfo.imusername}`, (err, id) => {
//                 let item = JSON.parse(id);
//                 if (item) {
//                     let ids = item.chat[chatId];
//                     if (ids) {
//                         console.log("");
//                         let length = ([].concat((props.state.ChatMessage.chat && props.state.ChatMessage.chat[chatId]) || [])).length || 0;
//                         if (length < ids.length) {
//                             //chat
//                             let itemTemp = (props.state.ChatMessage.chat && props.state.ChatMessage.chat[chatId]) || [];
//                             let itemChat = [].concat(itemTemp);
//                             let temp = defaultSend(chatId, welcomeTxt || '');
//                             itemChat.push(temp.chat[chatId]);
//                             let itemAll = ids.concat(itemChat);
//                             itemAll = DuplicateRemoval(itemAll);
//                             //byId
//                             for (let m = 0; m < itemAll.length; m++) {
//                                 item.byId[itemAll[m]] = props.state.ChatMessage.byId[itemAll[m]] || item.byId[itemAll[m]] || temp.byId[itemAll[m]];
//                             }
//                             let timeArr = [];
//                             for (let i = 0; i < itemAll.length; i++) {
//                                 let aa = item.byId[itemAll[i]];
//                                 if (aa) {
//                                     timeArr.push({
//                                         "time": aa.time,
//                                         "id": aa.id,
//                                         "msg": aa.body.msg
//                                     });
//                                 }
//                             }
//                             let aadd = [];
//                             let timeSort = timeArr.sort(compare("time"));//时间倒序排列
//                             for (let m = 0; m < timeSort.length; m++) {
//                                 aadd.push(timeSort[m].id);
//                             }
//
//                             item.chat[chatId] = DuplicateRemoval(aadd);
//
//                             props.state.ChatMessage.chat = item.chat;
//                             props.state.ChatMessage.byId = item.byId;
//                             this.saveState(item);
//                         } else {
//                         }
//                     }
//                 } else {
//                     if (isAdd) {
//                         if (welcomeTxt) {
//                             item = defaultSend(chatId, welcomeTxt, props.state.ChatMessage);
//                             props.state.ChatMessage.chat = item.chat;
//                             props.state.ChatMessage.byId = item.byId;
//
//                             this.saveState(item);
//                         }
//                     }
//                 }
//                 this.setPropsData(props);
//             }, (err) => {
//             }
//         );
//     }
//
//     saveState(item) {
//         if (this.state.userInfo.imusername) {
//             AsyncStorage.setItem(`CHATHISTORY${this.state.userInfo.imusername}`, JSON.stringify(item));
//         } else {
//             AsyncStorage.getItem(USERINFO, (error, result) => {
//                 let user = JSON.parse(result);
//                 this.setState({
//                     userInfo: user,
//                 });
//                 AsyncStorage.setItem(`CHATHISTORY${user.imusername}`, JSON.stringify(item));
//             });
//         }
//     }
//
//     setPropsData(props, flag) {
//         let chatTypeData = props.state.ChatMessage['chat'] || {};
//         let chatData = chatTypeData[this.state.sendId] || [];
//         this.setState({
//             messages: {
//                 messages: (chatData ? [].concat(chatData).slice(-10, chatData.length) : [])
//             },
//             showMessage: {
//                 messages: [].concat(chatData),
//             }
//         }, function () {
//             setTimeout(() => {
//                 this.saveState(props.state.ChatMessage);
//             }, 1000);
//             if (!this.state.add) {
//                 this.getMessageList()
//             } else {
//                 messageArray = this.state.messages.messages
//             }
//         });
//     }
//
//     // ------------ lifecycle ------------
//     componentDidMount() {
//         this.props.navigation.setParams({
//             navigatePress: this.back,
//         });
//         // let types = Permissions.getPermissionTypes();
//         // this.setState({types});
//         // this._updatePermissions(types);
//         // AppState.addEventListener('change', this._handleAppStateChange.bind(this));
//
//         this.getLoading().show();
//         sendQueryValueBySCKey("IM_welcome", this.props.navigation.navigate, (res) => {
//             AsyncStorage.getItem(USERINFO, (error, result) => {
//                 this.getLoading().dismiss();
//                 let user = JSON.parse(result);
//
//                 let welcomeTxt = res ? res : '';
//                 this.setState({
//                     userInfo: user,
//                 });
//                 if (user.imusername) {
//                     this.updateList(this.props, true, welcomeTxt)
//                 } else {
//                     toastShort("该功能即将启用，敬请期待！！！");
//                     this.back();
//                 }
//             }, (err) => {
//                 this.getLoading().dismiss();
//             })
//         }, (err) => {
//             this.getLoading().dismiss();
//         })
//     }
//
//     // tellPosition(flag) {
//     //     let data = {"imusername ": this.state.userInfo.imusername, "isChatUI": flag};
//     //     setChatPage(data, (callBack) => {
//     //     }, (error) => {
//     //     })
//     // }
//     componentWillReceiveProps(nextProps) {
//         if (nextProps.state.ChatMessage.chat && nextProps.state.ChatMessage.chat[this.state.sendId]) {
//             if (nextProps && this.state.messages.messages && (this.state.messages.messages.length != nextProps.state.ChatMessage.chat[this.state.sendId].length)) {
//                 count = 0;
//                 this.setPropsData(nextProps, true)
//             }
//         }
//     }
//
//     componentWillMount() {
//         // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
//         // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
//         if (Platform.OS === 'ios') {
//             this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
//             this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide)
//         } else {
//             // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
//             // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
//         }
//     }
//
//     componentWillUnmount() {
//         this.back();
//
//         // this.tellPosition(false);
//         // AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
//         this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
//         this.keyboardDidHideListener && this.keyboardDidHideListener.remove()
//     }
//
//     keyboardDidShow = (e) => {
//         // Animation chatTypes easeInEaseOut/linear/spring
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         let newSize = (width < height ? height : width) - e.endCoordinates.height;
//         this.setState({
//             keyboardHeight: e.endCoordinates.height,
//             visibleHeight: newSize,
//         })
//     };
//
//     keyboardDidHide = (e) => {
//         // Animation chatTypes easeInEaseOut/linear/spring
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         this.setState({
//             keyboardHeight: 0,
//             visibleHeight: width < height ? height : width
//         })
//     };
//
//     getMessageList() {
//         const {showMessage = {}, messages} = this.state;
//         let messageData = [].concat(showMessage.messages).reverse();
//         let pageCount = parseInt(messageData.length / 10);
//         if (pageCount > 0 && pageCount > count) {
//             if (count !== 0) {
//                 let lastData = [].concat(messageData).splice(0 + 10 * count, 10).reverse();
//                 messageArray = lastData.concat(messageArray);
//                 let data = {messages: messageArray};
//                 this.setState({
//                     messages: data
//                 });
//             } else {
//                 messageArray = this.state.messages.messages
//             }
//         } else {
//             messageArray = [];
//             this.setState({
//                 messages: showMessage
//             })
//         }
//     }
//
//     handleRefresh() {
//         this.setState({isRefreshing: true, add: false});
//         count++;
//         this.getMessageList();
//         // TODO: 刷新成功/刷新失败
//         setTimeout(() => {
//             this.setState({isRefreshing: false});
//             this.refs['baselist'].refs['list'].scrollTo({y: 0, animated: !this.state.isRefreshing});
//         }, 1000)
//     }
//
//     handleFocusSearch() {
//         this.setState({
//             focused: true,
//             isEmoji: false,
//         })
//     }
//
//     handleBlurSearch() {
//         this.setState({focused: false})
//     }
//
//     handleChangeText(v) {
//         // 场景1：正常+ -
//         // 场景2：从中间位置+ - -> 如果删除一个字符后字符串匹配，则非中间位置
//         // 场景3：删除操作可以从textInput直接编辑，适应于以上情况
//         // 场景5：从emoji的删除按钮删除，则从末尾位置编辑
//         // 场景6：点击外部区域隐藏emoji框
//         const splitValue = this.state.value ? this.state.value.split('') : [];
//         splitValue.pop();
//         if (v === splitValue.join('')) {
//             this.handleEmojiCancel()
//         }
//     }
//
//     //request permission to access photos
//     _requestPermission(type) {
//         let perType = type == 1 ? 'camera' : 'photo';
//         Permissions.requestPermission(perType)
//             .then(response => {
//                 //returns once the user has chosen to 'allow' or to 'not allow' access
//                 //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
//                 // console.log("response_requestPermission", response);
//                 this.judgeResponse(type, response)
//             });
//     }
//
//     judgeResponse(type, response) {
//         let perTypeText = type == 1 ? '调用相机' : '调用图库';
//         let perTypeText2 = type == 1 ? '调用相机' : '调用图库(存储|读写)';
//         if (!response) {
//             Alert.alert(
//                 '温馨提示：',
//                 `需要的权限:${perTypeText}已被拒绝。请点击确定后去<权限管理>设置权限`,
//                 [
//                     {text: '确定', onPress: () => this._openSettings()},
//                     {text: '取消', onPress: () => toastShort(`当前${perTypeText2}不能操作`)},
//                 ]
//             )
//         } else {
//             this.setCamOrPhoto(type, type == 1 ? response.camera : response.photo)
//         }
//     }
//
//     //check the status of multiple permissions
//     _checkCameraAndPhotos(type) {
//         if (Platform.OS === 'android') {
//             let perType = type == 1 ? 'camera' : 'photo';
//             Permissions.checkMultiple([perType])
//                 .then(response => {
//                     //response is an object mapping type to permission
//                     // console.log("response_checkCameraAndPhotos", response);
//                     this.judgeResponse(type, response)
//                 });
//         } else {
//             if (type == 1) {
//                 this.handleCameraPicker();
//             } else {
//                 this.handleImagePicker();
//             }
//         }
//
//     }
//
//     setCamOrPhoto(type, responseTxt) {
//         // console.log("setCamOrPhoto--", responseTxt);
//         this.setPermissioned(type, responseTxt)
//     }
//
//     /**
//      *  response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
//      响应是：'授权'，'拒绝'，'限制'，或'待定'
//      * */
//     setPermissioned(type, responseTxt) {
//         // console.log("setPermissioned--", responseTxt);
//         let perType = type == 1 ? '调用相机' : '调用图库';
//         let perTypeText2 = type == 1 ? '调用相机' : '调用图库(存储|读写)';
//         switch (responseTxt) {
//             case 'authorized':
//                 if (type == 1) {
//                     this.handleCameraPicker();
//                 } else {
//                     this.handleImagePicker();
//                 }
//                 break;
//             case 'denied':
//                 Alert.alert(
//                     '温馨提示：',
//                     `本应用需要的${perTypeText2}权限已被拒绝。请去<权限管理>设置权限`,
//                     [
//                         {text: '确定', onPress: () => this._openSettings()},
//                         {text: '取消', onPress: () => toastShort(`当前${perTypeText2}不能操作`)},
//                     ]
//                 );
//                 break;
//             case 'restricted':
//             case 'undetermined':
//                 Alert.alert(
//                     '温馨提示：',
//                     `本应用需要以下权限:${perTypeText2}。点击确定去设置权限`,
//                     [
//                         {text: '确定', onPress: () => this._requestPermission(type)},
//                     ]
//                 );
//                 break;
//         }
//     }
//
//     _openSettings() {
//         return Permissions.openSettings()
//     }
//
//     handleImagePicker() {
//         this.setState({
//             isEmoji: false
//         });
//         // console.log('handleImagePicker');
//         ImagePicker.launchImageLibrary(Options, (response) => {
//             // Same code as in above section!
//             // console.log('2handleImagePicker --Response = ', response);
//             this.sendImage(response);
//         });
//     }
//
//     handleCameraPicker() {
//         this.setState({
//             isEmoji: false
//         });
//         // console.log('handleCameraPicker');
//         ImagePicker.launchCamera(Options, (response) => {
//             // Same code as in above section!
//             // console.log('2handleCameraPicker Response = ', response);
//             this.sendImage(response)
//         });
//     }
//
//     sendImage(response) {
//         if (response.didCancel) {
//             console.log('User cancelled image picker');
//         }
//         else if (response.error) {
//             console.log('ImagePicker Error: ', response.error);
//         }
//         else if (response.customButton) {
//             console.log('User tapped custom button: ', response.customButton);
//         }
//         else {
//             // You can display the image using either data...
//             //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
//             // or a reference to the platform specific asset location
//             let source = null;
//             if (Platform.OS === 'ios') {
//                 source = {uri: response.uri.replace('file://', ''), isStatic: true};
//             } else {
//                 source = {uri: response.uri, isStatic: true};
//             }
//             response.uri = source.uri || '';
//             if (response.uri) {
//                 this.props.actions.sendImgMessage('chat', this.state.sendId, this.state.userInfo.imusername, {}, response)
//             }
//         }
//     }
//
//     handleEmojiCancel() {
//         if (!this.state.value) return;
//         const arr = this.state.value.split('');
//         const len = arr.length;
//         let newValue = '';
//
//         if (arr[len - 1] != ']') {
//             arr.pop();
//             newValue = arr.join('')
//         } else {
//             const index = arr.lastIndexOf('[');
//             newValue = arr.splice(0, index).join('')
//         }
//
//         this.setState({
//             value: newValue
//         })
//     }
//
//     handleSend() {
//         if (!this.state.value || !this.state.value.trim()) return;
//         this.props.actions.sendTxtMessage('chat', this.state.sendId, {
//             msg: this.state.value.trim()
//         });
//         this.setState({
//             value: '',
//             height: 34,
//             add: true,
//             // isMessageSend:true
//         });
//         count = 0;
//         messageArray = [];
//     }
//
//     handleEmojiOpen() {
//         this.setState({
//             isEmoji: !this.state.isEmoji
//         });
//         this.refs.search.blur()
//     }
//
//     handleEmojiClick(v) {
//         this.setState({
//             value: (this.state.value || '') + v
//         })
//     }
//
//     _renderSendButton() {
//         const {focused} = this.state;
//
//         return focused ? (
//             <TouchableOpacity style={styles.searchExtra} onPress={this.handleSend.bind(this)}>
//                 <Text style={styles.sendText}>发送</Text>
//             </TouchableOpacity>
//         ) : null
//     }
//
//     _renderRow(rowId) {
//         const rowData = this.props.state.ChatMessage.byId[rowId] || {};
//         if (rowData.bySelf) {
//             return this._renderRightRow(rowData)
//         } else {
//             return this._renderLeftRow(rowData)
//         }
//     }
//
//     _renderRightRow(rowData) {
//         const chatType = (rowData.body && rowData.body.type) || 'chat';
//         const obj = {
//             txt: this._renderRightTxt.bind(this),
//             img: this._renderRightImg.bind(this),
//         };
//         return typeof
//             obj[chatType] === 'function' ? (obj[chatType](rowData)) : null
//     }
//
//     _renderRightTxt(rowData = {}) {
//         let txt = this._renderTxt(rowData.body.msg || '');
//         return (
//             <View style={[styles.row, styles.directionEnd]}>
//                 <Image source={Images.userQuiz} resizeMode='cover' style={[styles.rowLogo, styles.rowLogoRight]}/>
//                 <View style={styles.rowMessage}>
//                     {/*<Text style={[styles.nameText, styles.textRight]}>{rowData.from}</Text>   */}
//                     <ATouchableHighlight   onLongPress={Platform.OS == 'android' ? () => this.showCopy(txt, true) : null}>
//                         <View style={[styles.message, styles.messageRight]}>
//                             <Text selectable={Platform.OS == 'ios' ? true : false}
//                                   style={[styles.messageText, styles.messageTextRight]}>{txt}</Text>
//                         </View>
//                     </ATouchableHighlight>
//                     <Text style={[styles.timeText, styles.textRight]}>{this._renderDate(rowData.time)}</Text>
//                 </View>
//             </View>
//         )
//     }
//
//     showCopy(txt, visible) {
//         this.setState({
//             modalVisible: visible,
//             txtCopy: txt
//
//         });
//     }
//
//     onLongPressCopyClipboard(txt) {
//         if (txt) {
//             Clipboard.setString(txt.toString());
//             toastShort("已复制");
//             this.showCopy('', false);
//         }
//     }
//
//     _renderRightImg(rowData = {}) {
//         const {body} = rowData;
//         const maxWidth = 250;
//         let width, height;
//         if (body.width && body.height) {
//             width = Math.min(maxWidth, body.width) * 0.7;
//             height = body.height * width / body.width;
//         } else {
//             width = 200;
//             height = 200
//         }
//
//         const loading = rowData.status == 'sending' ? (
//             <ActivityIndicator style={{margin: 5, alignItems: 'flex-end',}}/>
//         ) : null;
//         let imageUrl = '';
//         if (body.url) {
//             imageUrl = body.url;
//         } else {
//             imageUrl = body.uri;
//         }
//
//         return (
//             <View style={[styles.row, styles.directionEnd]}>
//                 <Image source={Images.userQuiz} resizeMode='cover' style={[styles.rowLogo, styles.rowLogoRight]}/>
//                 <View style={styles.rowMessage}>
//                     {/*<Text style={[styles.nameText, styles.textRight]}>{rowData.from}</Text>*/}
//                     <ATouchableHighlight onPress={() => this.pushDetail(imageUrl, body)}>
//                         <View style={[styles.message, styles.messageRight, styles.messageImage, {
//                             alignItems: 'flex-end',
//                         }]}>
//                             <ImagePro source={{uri: imageUrl}}
//                                       resizeMode={Image.resizeMode.contain}
//                                       style={[styles.rowImage, {width: width, height: height}]}/>
//                         </View>
//                     </ATouchableHighlight>
//                     <Text style={[styles.timeText, styles.textRight]}>{this._renderDate(rowData.time)}</Text>
//                 </View>
//                 {loading}
//             </View>
//         )
//     }
//
//     pushDetail(img, body) {
//         const maxWidth = 250;
//         let width = (Math.min(maxWidth, body.width));
//         let height = ( body.height * width / body.width);
//         const {navigate} = this.props.navigation;
//         InteractionManager.runAfterInteractions(() => {
//             navigate('BrannerDetailView', {
//                 name: 'BrannerDetailView',
//                 title: '详情',
//                 imageUrl: img,
//                 width,
//                 height,
//                 view: 2,
//                 rightTitle: '保存'
//             });
//         })
//     }
//
//     _renderLeftRow(rowData) {
//         const chatType = (rowData.body && rowData.body.type) || 'chat';
//         const obj = {
//             txt: this._renderLeftTxt.bind(this),
//             img: this._renderLeftImg.bind(this),
//         };
//         return typeof
//             obj[chatType] === 'function' ? (obj[chatType](rowData)) : null
//     }
//
//     _renderLeftTxt(rowData) {
//         let txt = this._renderTxt(rowData.body.msg || '');
//         return (
//             <View style={styles.row}>
//                 <Image source={Images.customQuiz} resizeMode='cover' style={styles.rowLogo}/>
//                 <View style={styles.rowMessage}>
//                     {/* <Text style={styles.nameText}>{rowData.from}</Text> onLongPress={() => this.showCopy(txt)}*/}
//                     <ATouchableHighlight  onLongPress={Platform.OS == 'android' ? () => this.showCopy(txt,true) : null}>
//                         <View style={styles.message}>
//                             <Text selectable={Platform.OS == 'ios' ? true : false}
//                                   style={styles.messageText}>{txt}</Text>
//                         </View>
//                     </ATouchableHighlight>
//                     <Text style={styles.timeText}>{this._renderDate(rowData.time)}</Text>
//                 </View>
//             </View>
//         );
//     }
//
//     _renderTxt(txt) {
//         const emoji = WebIM.emoji;
//
//         // 替换不能直接用replace，必须以数组组合的方式，因为混合着dom元素
//         let rnTxt = [];
//         let match = null;
//         const regex = /(\[.*?\])/g;
//         let start = 0;
//         let index = 0;
//         while (match = regex.exec(txt)) {
//             index = match.index;
//             if (index > start) {
//                 rnTxt.push(txt.substring(start, index))
//             }
//             if (match[1] in emoji.map) {
//                 rnTxt.push((
//                     <Emoji style={{marginBottom: 3}} key={`emoji-${index}-${match[1]}`} name={emoji.map[match[1]]}/>
//                 ))
//             } else {
//                 rnTxt.push(match[1])
//             }
//             start = index + match[1].length
//         }
//         rnTxt.push(txt.substring(start, txt.length));
//
//         return rnTxt
//     }
//
//     _renderLeftImg(rowData) {
//         const {body} = rowData;
//         const maxWidth = 250;
//         let width, height;
//         if (body.width && body.height) {
//             width = Math.min(maxWidth, body.width) * 0.7;
//             height = body.height * width / body.width;
//         } else {
//             width = 200;
//             height = 200
//         }
//
//         const loading = rowData.status == 'sending' ? (
//             <ActivityIndicator style={{margin: 5}}/>
//         ) : null;
//         let imageUrl = '';
//
//         if (body.url) {
//             imageUrl = body.url;
//         } else {
//             imageUrl = body.uri;
//         }  //{/*<Text style={styles.nameText}>{rowData.from}</Text>( body.uri||( body.url+"."+body.filetype))*/}
//
//         return (
//             <View style={styles.row}>
//                 <Image source={Images.customQuiz} resizeMode='cover' style={styles.rowLogo}/>
//                 <View style={styles.rowMessage}>
//                     <ATouchableHighlight onPress={() => this.pushDetail(imageUrl, body)} >
//                         <View style={[styles.message, styles.messageImage]}>
//                             <ImagePro source={{uri: imageUrl}} resizeMode={Image.resizeMode.contain}
//                                       style={[styles.rowImage, {width: width, height: height}]}/>
//                         </View>
//                     </ATouchableHighlight>
//                     <Text style={styles.timeText}>{this._renderDate(rowData.time)}</Text>
//                 </View>
//                 {loading}
//             </View>
//         )
//     }
//
//     _renderDate(time) {
//         const d = new Date(time);
//         // console.log("时间显示--", d);
//         // console.log("ksks--", `${d.getMonth() + 1}-${d.getDate() > 9 ? d.getDate() : '0' + d.getDate()  } ${d.getHours()}:${d.getMinutes()}`)
//         let month = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
//         let date = d.getDate() > 9 ? d.getDate() : '0' + d.getDate();
//         let hour = d.getHours() > 9 ? d.getHours() : '0' + d.getHours();// d.getHours()%12 === 0 ? 12 : d.getHours()%12+12;
//         let minute = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes();
//         return `${month}-${date} ${hour}:${minute}`
//     }
//
//     _renderMessageBar() {
//         const {value = '', isEmoji} = this.state;
//
//         return (
//             <View style={styles.search}>
//                 <View style={styles.inputRow}>
//                     <View style={styles.searchRow}>
//                         <TextInput
//                             ref="search"
//                             style={[styles.searchInput, {
//                                 height: Math.min(Math.max(this.state.height, 34), 100),
//                                 width: deviceWidth - deviceWidth / 5
//                             }]}
//                             value={value}
//                             editable={true}
//                             keyboardType='default'
//                             returnKeyType='default'
//                             autoCapitalize='none'
//                             autoCorrect={false}
//                             multiline={true}
//                             onChange={(event) => {
//                                 this.setState({
//                                     value: event.nativeEvent.text,
//                                     // 5 for padding
//                                     height: event.nativeEvent.contentSize.height + 5,
//                                 });
//                             }}
//                             onFocus={this.handleFocusSearch.bind(this)}
//                             onBlur={this.handleBlurSearch.bind(this)}
//                             onChangeText={this.handleChangeText.bind(this)}
//                             onEndEditing={() => {
//                             }}
//                             onLayout={() => {
//                             }}
//                             underlineColorAndroid='transparent'
//                             onSubmitEditing={() => this.refs.search.focus()}
//                             placeholder={'发送消息'}
//                         />
//                     </View>
//                     {this._renderSendButton()}
//                 </View>
//                 <View style={styles.iconRow}>
//                     <TouchableOpacity style={styles.iconTouch} onPress={() => this.handleCameraPicker()}>
//                         <Image source={Images.iconCamera}/>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.iconTouch} onPress={() => this.handleImagePicker()}>
//                         <Image source={Images.iconImage}/>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.iconTouch} onPress={this.handleEmojiOpen.bind(this)}>
//                         {
//                             isEmoji ? <Image source={Images.iconEmojiActive}/> : <Image source={Images.iconEmoji}/>
//                         }
//                     </TouchableOpacity>
//                 </View>
//                 {this._renderEmoji()}
//             </View>
//         )
//     }
//
//     _renderEmoji() {
//         const {isEmoji, focused} = this.state;
//         const emoji = WebIM.emoji;
//         const emojiStyle = [];
//         const rowIconNum = 7;
//         const rowNum = 3;
//         const emojis = Object.keys(emoji.map).map((v, k) => {
//             const name = emoji.map[v];
//             return (
//                 <TouchableOpacity key={v + k} onPress={() => {
//                     this.handleEmojiClick(v)
//                 }}>
//                     <Text style={[styles.emoji, emojiStyle]}><Emoji name={name}/></Text>
//                 </TouchableOpacity>
//             )
//         });
//         return isEmoji ? (
//             <View style={styles.emojiRow}>
//                 <Swiper style={styles.wrapper} loop={false}
//                         height={125}
//                         dotStyle={ {bottom: -30} }
//                         activeDotStyle={ {bottom: -30} }
//                 >
//                     <View style={styles.slide}>
//                         <View style={styles.slideRow}>
//                             {emojis.slice(0, rowIconNum)}
//                         </View>
//                         <View style={styles.slideRow}>
//                             {emojis.slice(1 * rowIconNum, rowIconNum * 2)}
//                         </View>
//                         <View style={styles.slideRow}>
//                             {emojis.slice(2 * rowIconNum, rowIconNum * 3 - 1)}
//                             <TouchableOpacity onPress={this.handleEmojiCancel.bind(this)}>
//                                 <Text style={[styles.emoji, emojiStyle]}><Emoji name="arrow_left"/></Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                     <View style={styles.slide}>
//                         <View style={styles.slideRow}>
//                             {emojis.slice(3 * rowIconNum - 1, rowIconNum * 4 - 1)}
//                         </View>
//                         <View style={styles.slideRow}>
//                             {emojis.slice(4 * rowIconNum - 1, rowIconNum * 5 - 1)}
//                         </View>
//                         <View style={styles.slideRow}>
//                             {emojis.slice(5 * rowIconNum - 1, rowIconNum * 6 - 1)}
//                             <TouchableOpacity>
//                                 <Text style={[styles.emoji, emojiStyle]}><Emoji name="arrow_left"/></Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </Swiper>
//                 <View style={styles.sendRow}>
//                     <TouchableOpacity style={styles.send} onPress={this.handleSend.bind(this)}>
//                         <Text style={styles.sendText}>发送</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         ) : null
//     }
//
//     back = () => {
//         const {state, goBack} = this.props.navigation;
//         // dismissKeyboard();
//         state.params.callback();
//         goBack();
//     };
//
//     //获取加载进度的组件
//     getLoading() {
//         return this.refs['loading'];
//     }
//
//     render() {
//         const {messages = {}, keyboardHeight} = this.state;
//         // console.log('this.state.modalVisible',this.state.modalVisible)
//         return (
//             <View style={[styles.container, {flex: 1, flexDirection: 'column'}]}>
//
//                 <BaseListView
//                     ref="baselist"
//                     autoScroll={true}
//                     data={messages}
//                     handleRefresh={this.handleRefresh.bind(this)}
//                     renderRow={this._renderRow.bind(this)}
//                     renderSeparator={() => null}
//                 />
//                 {this._renderMessageBar()}
//                 <ShowCopyModal
//                     modalVisible={this.state.modalVisible}
//                     press={() => this.onLongPressCopyClipboard(this.state.txtCopy)}
//                 />
//                 <Loading ref={'loading'} text={'请等待...'}/>
//                 <View style={{height: keyboardHeight}}/>
//             </View>
//         )
//     }
//
//     clearMsg() {
//         // this.props.state = {};
//         // AsyncStorage.setItem(CHATHISTORY, JSON.stringify(''), (error) => {
//         // });
//         // this.setState({
//         //     messages: {messages: []}
//         // })
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flexDirection: 'column',
//         backgroundColor: BGColor
//     },
//
//     topViewStyle: {
//         width: width,
//         height: 64,
//         backgroundColor: 'blue',
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'row'
//     },
//     search: {
//         // position: 'absolute',
//         // left: 0,
//         // right: 0,
//         // bottom: 0,
//         // width: 50,
//         // height: 30
//         marginTop: 5,
//         flexDirection: 'column',
//         paddingTop: 10,
//         backgroundColor: 'white',
//         borderTopWidth: PixelRatio.roundToNearestPixel(0.4),
//         borderTopColor: 'rgba(173, 185, 193, 0.5)'
//     },
//     inputRow: {
//         paddingHorizontal: 15,
//         flexDirection: 'row',
//         alignItems: 'center',
//
//     },
//     iconRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingTop: 4,
//         paddingBottom: 2,
//         paddingHorizontal: 12,
//         borderBottomWidth: PixelRatio.roundToNearestPixel(0.4),
//         borderBottomColor: 'rgba(173, 185, 193, 0.5)'
//     },
//     iconTouch: {
//         padding: 8,
//     },
//     searchRow: {
//         // flex: 1,
//         backgroundColor: 'white',
//         // alignItems:'center',
//     },
//     searchInput: {
//         borderRadius: 3,
//         height: 34,
//         fontSize: 13,
//         paddingHorizontal: 12,
//         paddingVertical: 5,
//         borderWidth: PixelRatio.roundToNearestPixel(0.4),
//         borderColor: 'rgba(190, 190, 190, 1)',
//         alignItems: 'center',
//         paddingTop: Platform.OS == 'ios' ? 10 : 5
//     },
//     searchIcon: {
//         alignItems: 'flex-end',
//         justifyContent: 'center',
//     },
//     searchFocus: {
//         flex: 0,
//         width: 20,
//         alignItems: 'center'
//     },
//     searchExtra: {
//         marginLeft: 15,
//         alignItems: 'center',
//         justifyContent: 'center',
// // width:deviceWidth/5,
// //         backgroundColor:'red'
//     },
//     searchPlus: {
//         width: 30,
//         height: 30,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     sendText: {
//         // ...Fonts.rowText,
//         color: 'rgba(0, 186, 110, 1)',
//         textAlign: 'center',
//     },
//     // message left
//     row: {
//         flex: 1,
//         flexDirection: 'row',
//         paddingLeft: 15,
//         paddingTop: 15,
//     },
//     rowLogo: {
//         width: Platform.OS === 'ios' ? 35 : 25,
//         height: Platform.OS === 'ios' ? 35 : 25,
//         marginRight: 5,
//         // marginTop: 12
//     },
//     rowImage: {
//         // flex: 1,
//         // height: 100,
//         // alignSelf: 'flex-start',
//         // minHeight: 50,
//         // borderRadius: 10,
//     },
//     rowLogoRight: {
//         marginLeft: 5
//     },
//     rowMessage: {},
//     nameText: {
//         // ...Fonts.normal,
//         fontSize: 11,
//         color: 'rgba(64, 94, 122, 1)',
//         marginLeft: 12,
//         marginBottom: 7
//     },
//     message: {
//         maxWidth: 250,
//         borderRadius: 10,
//         backgroundColor: 'white',
//         padding: 11,
//     },
//     messageImage: {
//         width: 250,
//         backgroundColor: 'transparent',
//         padding: 0
//     },
//     messageRight: {
//         backgroundColor: 'rgba(50,140,210,1)'
//     },
//     messageText: {
//         color: 'rgba(12, 18, 24, 1)',
//         paddingBottom: 2,
//         // textAlign: 'center'
//         // textAlignVertical: 'center'
//     },
//     messageTextRight: {
//         color: 'white'
//     },
//     timeText: {
//         // ...Fonts.normal,
//         fontSize: 11,
//         color: 'rgba(112, 126, 137, 1)',
//         marginTop: 3,
//         marginLeft: 12,
//     },
//     directionEnd: {
//         flexDirection: 'row-reverse'
//     },
//     textRight: {
//         textAlign: 'right',
//         marginRight: 12
//     },
//     emojiRow: {
//         backgroundColor: '#e8ebef',
//     },
//     wrapper: {
//         backgroundColor: '#e8ebef'
//     },
//     slide: {
//         height: 120,
//         paddingTop: 5,
//         paddingHorizontal: 11,
//         justifyContent: 'flex-start',
//         flexDirection: 'column',
//         flexWrap: 'wrap'
//     },
//     slideRow: {
//         flex: 1,
//         justifyContent: 'space-between',
//         flexDirection: 'row',
//         height: 30,
//     },
//     sendRow: {
//         justifyContent: 'flex-end',
//         flexDirection: 'row'
//     },
//     emoji: {
//         // flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         fontSize: 30,
//         paddingLeft: 4,
//         paddingBottom: 1,
//         // height: 30
//         color: '#fff'
//     },
//     send: {
//         marginRight: 12,
//         paddingVertical: 8,
//         width: 50,
//     }
// });
//
//
// export default connect(state => ({
//         state: state
//     }),
//     (dispatch) => ({
//         actions: bindActionCreators(MessageActions, dispatch)
//     })
// )(ChatMessage);