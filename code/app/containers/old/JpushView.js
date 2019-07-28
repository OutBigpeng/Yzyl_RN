// /**
//  * Created by coatu on 2017/6/22.
//  */
// import React, {Component} from 'react';
// import {Platform, AsyncStorage, DeviceEventEmitter, NativeAppEventEmitter, InteractionManager,AppState} from 'react-native'
// import JPushModule from "jpush-react-native";
//
// let type = '';
//
// export default class JpushView extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         this.state = {
//             item: ''
//         };
//         //设置一个标记，表示从后台进入前台的时候，处理其他逻辑<span style="white-space:pre">  </span>
//         this.flage = false
//     }
//
//     componentDidMount() {
//         // AsyncStorage.getItem(WEBIMTOKEN,(err,id)=>{
//         //     var item = JSON.parse(id);
//         //     if(!item){
//         //         store.dispatch(ChatLoginAction.login(0,this.props.navigation));
//         //     }
//         // })
//
//         AppState.addEventListener('change',this._handleAppStateChange);
//         if (Platform.OS === 'ios') {
//             this.iosJpush();
//         } else {
//             this.androidJpush();
//         }
//     }
//
//     _handleAppStateChange = (nextAppState)=>{
//         if (nextAppState!= null && nextAppState === 'active') {
//
//             //如果是true ，表示从后台进入了前台 ，请求数据，刷新页面。或者做其他的逻辑
//             if (this.flage) {
//                 //这里的逻辑表示 ，第一次进入前台的时候 ，不会进入这个判断语句中。
//                 // 因为初始化的时候是false ，当进入后台的时候 ，flag才是true ，
//                 // 当第二次进入前台的时候 ，这里就是true ，就走进来了。
//
//                 //测试通过
//                 // alert("从后台进入前台");
//
//                 // 这个地方进行网络请求等其他逻辑。
//             }
//             this.flage = false ;
//         }else if(nextAppState != null && nextAppState === 'background'){
//             this.flage = true;
//         }
//
//     };
//
//     componentWillUnmount() {
//         AppState.removeEventListener('change', this._handleAppStateChange);
//     }
//
//     render() {
//         // alert('不走这里么')
//         return null
//     }
//
//     androidJpush() {
//         JPushModule.notifyJSDidLoad((cc)=>{});
//         JPushModule.addReceiveNotificationListener((map)=>{
//             console.log("我走啦。addReceiveNotificationListener。")
//             // DeviceEventEmitter.emit('Jpush')
//         })
//         JPushModule.addReceiveOpenNotificationListener((map) => {
//             // isAndroidPush = true;
//             //     alert("点击打开");
//             // DeviceEventEmitter.emit('Jpush')
//
//             console.log("我走啦。addReceiveOpenNotificationListener。")
//             if (map && map.extras) {
//                 let temp = JSON.parse(map.extras);
//                 if (temp && temp.type) {
//                     type = temp.type;
//                 }
//                 this.addListenerResult(temp);
//             }
//             // this.isToken(1);
//         })
//     }
//
//
//     iosJpush() {
//         var subscription = NativeAppEventEmitter.addListener(
//             'OpenNotification',
//             (notification) => {
//                 this.addListenerResult(notification)
//             }
//         );
//     }
//
//
//     addListenerResult(map) {
//         console.log('进来了么')
//         AsyncStorage.getItem(USERINFO, (err, id) => {
//             var items = JSON.parse(id);
//             if (!items) {
//                 DeviceEventEmitter.emit('RootView')
//             } else {
//                 this.jumpTabView(map)
//             }
//         })
//     }
//
//
//     jumpTabView(option) {
//         if (this.props.navigation) {
//             const {navigate, state} = this.props.navigation;
//             if (option) {
//                 let name = state.routeName;
//                 if (name) {
//                     if (option && option.type === 'im') {
//                         type = option.type;
//                         if (name && name != 'ChatMessage') {
//                             this.pushToDetail('ChatView', 0)
//                         }
//                     } else if(option && option.type === 'qa'){
//                         type = option.type;
//                         if (name && name != 'QuestionDetail') {
//                             this.pushToDetail('QuestionDetail', 0,option)
//                         }
//                     } else if(option && option.type == 'chat'){
//
//                     }
//                     else {
//                         type = '';
//                         if (name && name != 'MyMessage') {
//                             this.pushToDetail('MyMessage', 1)
//                         }
//                     }
//                 } else {
//                     if (option && option.type === 'im') {
//                         this.pushToDetail('ChatView', 0,option)
//                     }else if(option && option.type === 'qa'){
//                         this.pushToDetail('QuestionDetail', 0)
//                     }
//                     else {
//                         this.pushToDetail('MyMessage', 1)
//                     }
//                 }
//             } else {
//                 this.pushToDetail('ChatView', 0)
//             }
//         }
//     }
//
//     pushToDetail(name, isPush,option) {
//
//         const {navigate} = this.props.navigation;
//         if(this.flage){
//             InteractionManager.runAfterInteractions(() => {
//                 if (name === 'MyMessage') {
//                     navigate(name, {
//                         name: name,
//                         title: '我的消息',
//                         isPush: isPush,
//                     })
//                 } else if(name == 'QuestionDetail') {
//                     let QuestResult = option.params.split(",");
//                     const {navigate} = this.props.navigation;
//                     navigate('QuestionDetail', {
//                             title: '问题详情',
//                             id: QuestResult[0],
//                             callback: () => this._onRefresh(),
//                             key:'askQuestion',
//                             rightImageSource: true,
//                         }
//                     );
//                 }else {
//                     // const resetAction = NavigationActions.reset({
//                     //     index: 0,
//                     //     actions: [
//                     //         NavigationActions.navigate({routeName: 'ChatView'}),
//                     //     ]
//                     // });
//                     // this.props.navigation.dispatch(resetAction);
//                     navigate(name
//                     )
//                 }
//
//             })
//         }
//     }
//
//     _onRefresh(){
//
//     }
// }