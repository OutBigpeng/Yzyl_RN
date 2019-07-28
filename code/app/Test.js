//
// 'use strict';
// import React, {Component} from "react";
// import {Dimensions, Image, ListView, StyleSheet, Text, View} from "react-native";
// import {_, bindActionCreators, connect, deviceWidth, Loading, PlatfIOS} from "../../common/CommonDevice";
// import NavigatorView from "../../component/NavigatorView";
// import {px2dp, ShowTwoButtonAlerts} from "../../common/CommonUtil";
// import {NoDataView} from "../../component/CommonAssembly";
// import {scaleSize} from "../../common/ScreenUtil";
// import * as DiscussAction from "../../actions/DiscussAction";
// import Images from "../../themes/Images";
// import ATouchableHighlight from "../../component/ATouchableHighlight";
// import ShowCopyModal from "./ShowCopyModal";
// import PullToRefreshListView from "react-native-smart-pull-to-refresh-listview";
// import {_renderFooter} from "../../component/CommonRefresh";
// import {toastShort} from "../../common/ToastUtils";
//
// const {height, width} = Dimensions.get('window');
//
// let pageOption = 0;
// let pageSize = 10;
//
// class DiscussMessageView extends Component {
//
//     _renderRow = (rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) => {
//         /**
//          * { content: '第2条回复评论',
// I/ReactNativeJS( 7432):        id: 3,
// I/ReactNativeJS( 7432):        logo: 'http://avatar.qntest.youzhongyouliao.com/ece7f440-d1c0-43fc-913d-2dd22c50da20.jpeg',
// I/ReactNativeJS( 7432):        nickName: '11111',
// I/ReactNativeJS( 7432):        company: '11',
// I/ReactNativeJS( 7432):        msgId: 320,
// I/ReactNativeJS( 7432):        ctime: '2018-08-10 13:22:04' }
//          */
//
//         let {content, logo, nickName, msgId, ctime, type, typeStr,id, likeId, msgStatus} = rowData;
//         let color =  content ? '#050505' : likeId ?  '#050505':'#aaaaaa'
//         content = content ? content : likeId ? '赞了你' : '评论已删除';
//         return (
//             <ATouchableHighlight onPress={() => this.jumpDetail(type, msgId, msgStatus)} onLongPress={() => {
//                 rowData.index = rowID;
//                 this._isMounted && this.setState({
//                     isShowDel: true,
//                     longObj: rowData
//                 });
//             }}>
//                 <View style={{
//                     flexDirection: 'row',
//                     padding: scaleSize(20),
//                     borderBottomColor: '#eeeeee',
//                     borderBottomWidth: scaleSize(1)
//                 }}>
//                     <Image source={logo ? {uri: logo} : Images.discussDefaultHead} style={{
//                         width: scaleSize(80),
//                         height: scaleSize(80),
//                         marginRight: scaleSize(20)
//                     }}/>
//                     <View style={{width: deviceWidth - scaleSize(160)}}>
//                         <Text numberOfLines={1} ellipsizeMode={'middle'}
//                               style={{fontSize: px2dp(PlatfIOS ? 16 : 15), color: '#5F729A'}}>{nickName}</Text>
//                         <Text style={{
//                             fontSize: px2dp(PlatfIOS ? 14 : 13,),
//                             color: color
//                         }}>{content}</Text>
//                         <Text style={{fontSize: px2dp(PlatfIOS ? 14 : 12,), color: '#838383'}}>{ctime}</Text>
//                     </View>
//                 </View>
//             </ATouchableHighlight>
//
//         );
//     };
//     _header = () => {
//         return <View/>;
//     };
//     _footer = () => {
//         let {notifyMsgListObj: {data = [], count, pageCount}} = this.props.state.Discuss;
//         return this.commonFooterView(data, count);
//     };
//
//     // 构造
//     constructor(props) {
//         super(props);
//         let dataSource = new ListView.DataSource({
//             rowHasChanged: (r1, r2) => r1 !== r2
//         });
//
//         // 初始状态
//         this.state = {
//             dataSource: dataSource,
//             isShowDel: false,
//             longObj: {},
//             isNetWork: true,
//         };
//         this._isMounted;
//     };
//
//     jumpDetail(type, msgId, msgStatus) {
//         let {navigate} = this.props.navigation;
//         if (msgStatus !== 1) {
//             toastShort('已被删除')
//             return;
//         }
//         if (type !== 'qa') {
//             navigate('DiscussDetailView', {
//                 name: 'DiscussDetailView',
//                 title: '详情',
//                 msgId: msgId,
//                 pageParams: "release",
//             });
//         } else {
//             navigate('DiscussQaDetailView', {
//                 name: 'DiscussQaDetailView',
//                 title: '详情',
//                 msgId: msgId,
//                 pageParams: "release",
//             });
//         }
//     }
//
//     commonFooterView(data, count) {
//         if (pageOption) {
//             return (
//                 <View style={{
//                     height: scaleSize(100),
//                     alignItems: 'center',
//                     justifyContent: "center",
//                     backgroundColor: 'white',
//                     borderColor: '#eeeeee',
//                     borderWidth: scaleSize(1),
//                     borderRightWidth: 0,
//                     borderLeftWidth: 0
//                 }}>
//                     <ATouchableHighlight onPress={() => {
//                         const {navigate} = this.props.navigation;
//                         pageOption = 0;
//                         this._onLoadMore();
//                     }}>
//                         <View style={{
//                             borderRadius: scaleSize(5),
//                             paddingRight: scaleSize(30),
//                             paddingVertical: scaleSize(20),
//                             flexDirection: "row",
//                             alignItems: 'center'
//                         }}>
//                             <Text style={{color: '#050505'}}>点击查看更早的消息</Text>
//                         </View>
//                     </ATouchableHighlight>
//                 </View>
//             )
//         }
//         return null;
//     }
//
//     componentDidMount() {
//         this._isMounted = true;
//         this.getLoading().show();
//         pageOption = 1;
//         let data = {
//             option: 1,
//             pageSize: pageSize,
//             isRead: 0
//         };
//         this.getNetWork(data)
//     }
//
//     getNetWork(dataT = {}, option) {
//         if (option) {
//             dataT = {
//                 option: 1,
//                 pageSize: pageSize,
//             }
//         }
//         this.props.actions.fetchDiscussPageDiscussNotice(dataT, this.props.navigation, () => {
//             this.setState({
//                 isNetWork: false
//             })
//             setTimeout(() => {
//                 pageOption = 0;
//                 if (dataT.option === 2) {
//                     let loadedAll;
//                     let {notifyMsgListObj: {data = [], count, pageCount}} = this.props.state.Discuss;
//                     if (data.length >= count) {
//                         loadedAll = true;
//                         this._pullToRefreshListView && this._pullToRefreshListView.endLoadMore(loadedAll)
//                     } else {
//                         loadedAll = false;
//                         this._pullToRefreshListView && this._pullToRefreshListView.endLoadMore(loadedAll)
//                     }
//                 } else {
//                     // this._pullToRefreshListView && this._pullToRefreshListView.endRefresh()
//                 }
//             }, 1000);
//             this.getLoading().dismiss();
//         });
//     }
//
//     //获取加载进度的组件
//     getLoading() {
//         return this.refs['loading'];
//     }
//
//     render() {
//         let {notifyMsgListObj: {data = [], count, pageCount}} = this.props.state.Discuss;
//         let {isShowDel, longObj, isNetWork} = this.state;
//         return (
//             <View style={styles.container}>
//                 <NavigatorView
//                     {...this.props}
//                     // leftImageSource={true}
//                     // contentTitleView={() => }
//                     rightTitle={'清空'}
//                     // leftTitle={'我的'}
//                     contentTitle={'消息'}
//                     onRightPress={() => {
//                         ShowTwoButtonAlerts('', '清空所有消息', () => {
//                             //清空 消息请求。。
//                             this.props.actions.fetchDiscussClearDiscussNotice({
//                                 type: "all",
//                             }, this.props.navigation);
//                         })
//                     }}
//                 />
//                 {!_.isEmpty(data) ? <View style={{flex: 1}}>
//                     <PullToRefreshListView
//                         ref={(component) => this._pullToRefreshListView = component}
//                         viewType={PullToRefreshListView.constants.viewType.listView}
//                         contentContainerStyle={{
//                             backgroundColor: 'transparent',
//                         }}
//                         initialListSize={pageSize}
//                         enableEmptySections={true}
//                         dataSource={this.state.dataSource.cloneWithRows(_.isEmpty(data) ? [] : data)}
//                         pageSize={pageSize}
//                         renderRow={this._renderRow}
//                         renderHeader={() => {
//                             return <View/>
//                         }}
//                         renderFooter={_renderFooter}
//                         // onRefresh={this._onRefresh}
//                         onLoadMore={() => this._onLoadMore()}
//                         removeClippedSubviews={false}
//                     />
//                 </View> : isNetWork ? <View/> : <NoDataView title="最新消息" onPress={() => this.getNetWork()}/>}
//                 {pageOption ? this.commonFooterView(data, count) : null}
//
//                 <ShowCopyModal
//                     {...this.props}
//                     key={'DiscussMessage_ShowCopyModal'}
//                     modalVisible={isShowDel}
//                     list={['删除']}
//                     onPress={(pos = -1) => {
//                         switch (pos) {
//                             case 0://删除
//                                 this.props.actions.fetchDiscussClearDiscussNotice({
//                                     type: "single",
//                                     id: longObj.id,
//                                     index: longObj.index
//                                 }, this.props.navigation);
//                                 break;
//                             default:
//                                 break;
//                         }
//                         this._isMounted && this.setState({
//                             isShowDel: false
//                         });
//                     }}
//                 />
//                 <Loading ref={'loading'}/>
//
//             </View>
//         );
//     }
//
//     componentWillUnmount() {
//         const {navigate, state} = this.props.navigation;
//         this._isMounted = false;
//         pageOption = 0;
//         state.params.callback && state.params.callback();
//     }
//
//     _onLoadMore() {
//         let {notifyMsgListObj: {data = [], count, pageCount}} = this.props.state.Discuss;
//         console.log("我起了加载 更多。。。。。。。。。。。。。。。。。。。。。", data.length, count);
//         if (data.length <= count) {
//             let reqData = {
//                 option: 2,
//                 pageSize: pageSize,
//                 id: !_.isEmpty(data) ? data[data.length - 1].id : null
//             };
//             this.getNetWork(reqData)
//         } else {
//             this._pullToRefreshListView && this._pullToRefreshListView.endLoadMore(false)
//         }
//
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//
// });
//
// export default connect(state => ({
//         state: state
//     }),
//     (dispatch) => ({
//         actions: bindActionCreators(DiscussAction, dispatch),
//     })
// )(DiscussMessageView);
var arr = new Array(6);
arr[0] = "George";
arr[1] = "John";
arr[2] = "Thomas";
arr[3] = "James";
arr[4] = "Adrew";
arr[5] = "Martin";
console.log(arr);
arr.splice(0,1,"William");
console.log(arr);