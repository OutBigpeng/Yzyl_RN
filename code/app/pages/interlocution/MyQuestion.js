// /**
//  * Created by coatu on 2017/7/5.
//  */
// import React, {PureComponent} from "react";
// import {AsyncStorage, ListView, Platform, StyleSheet, Text, TouchableHighlight, View} from "react-native";
//
// import TimerEnhance from "react-native-smart-timer-enhance";
// import PullToRefreshListView from "react-native-smart-pull-to-refresh-listview";
// import {NoDataView} from "../../component/CommonAssembly";
// import {
//     _,
//     BGColor,
//     bindActionCreators,
//     connect,
//     Domain,
//     domainObj,
//     imageJSScript,
//     PlatfIOS,
//     questionScript
// } from "../../common/CommonDevice";
// import {_renderActivityIndicator} from "../../component/CommonRefresh";
// import *as QuestionAction from "../../actions/QuestionAction";
// import *as LoginAction from "../../actions/LoginAction";
//
// import AutoHeightWebView from "react-native-autoheight-webview";
//
// import ImageModal from '../../component/ImageModal'
//
// import HWebView from './HWebView';
//
// let isLoadMore = false;
// let pageIndex = 8;
// let Count = 0;
//
// let isSmallView = true;
// let isRefresh = true;
//
// class MyQuestion1 extends PureComponent {
//     // 构造
//     constructor(props) {
//         super(props);
//         let ds = new ListView.DataSource({
//             rowHasChanged: (r1, r2) => r1 !== r2,
//         });
//         this.state = {
//             dataSource: ds,
//             isNoData: false,
//             isSearchData: true,  //判断 orderListData是否有数据，无数据显示无数据页面
//             questionData: [],
//             userInfo: {},
//             modalVisible: false,
//             imageUrl: null
//         }
//         this.domainObj = {}
//     }
//
//     setModalVisible(visible) {
//         this.setState({
//             modalVisible: visible
//         });
//     }
//
//
//     componentDidMount() {
//         this.getUserInfo();
//
//     }
//
//     getUserInfo() {
//         AsyncStorage.getItem(USERINFO, (err, id) => {
//             let item = JSON.parse(id);
//             this.setState({
//                 userInfo: item
//             });
//             if (item) {
//                 Domain((res) => {
//                     this.domainObj = res;
//                 });
//
//                 if (this._pullToRefreshListView) {
//                     this._pullToRefreshListView.beginRefresh();
//                 }
//
//             }
//         })
//     }
//
//
//     componentWillUnmount() {
//         this.props.state.Question.questionList = [];
//         this.props.state.Question.questionRes = [];
//     }
//
//     //网络数据处理
//     componentWillReceiveProps(nextProps) {
//         const {questionList, questionRes, isLoading} = nextProps.state.Question;
//         if (questionList.length > 0) {
//             if (questionList.length > 0) {
//                 this.setState({
//                     questionData: questionRes.data ? questionRes.data : [],
//                     isSearchData: true
//                 })
//             }
//             if (isLoadMore) {
//                 let loadedAll;
//                 if (questionList.length >= questionRes.count) {
//                     loadedAll = true;
//                     this._pullToRefreshListView.endLoadMore(loadedAll)
//                 }
//                 else {
//                     loadedAll = false;
//                     this._pullToRefreshListView.endLoadMore(loadedAll)
//                 }
//             } else {
//                 if (this._pullToRefreshListView) {
//                     this._pullToRefreshListView.endRefresh()
//                 }
//
//             }
//         } else {
//             this.setState({
//                 isSearchData: false
//             });
//             if (this._pullToRefreshListView) {
//                 this._pullToRefreshListView.endRefresh()
//             }
//         }
//
//     }
//
//
//     render() {
//         const {questionList, isLoading} = this.props.state.Question;
//         if (_.isEmpty(this.state.userInfo)) {
//             return (
//                 <NoDataView title="您还没有登录，请先去登录" type={1} onPress={() => this.pushToLoginView()}/>
//             )
//         } else {
//             return (
//                 <View style={styles.container}>
//                     {isLoading || this.state.isSearchData ?
//                         <PullToRefreshListView
//                             ref={(component) => this._pullToRefreshListView = component}
//                             viewType={PullToRefreshListView.constants.viewType.listView}
//                             contentContainerStyle={{backgroundColor: 'transparent'}}
//                             initialListSize={1}
//                             enableEmptySections={true}
//                             dataSource={this.state.dataSource.cloneWithRows(_.isEmpty(questionList) ? this.state.questionData : questionList)}
//                             pageSize={20}
//                             renderRow={this._renderRow}
//                             renderHeader={this._renderHeader}
//                             renderFooter={this._renderFooter}
//                             onRefresh={this._onRefresh}
//                             onLoadMore={this._onLoadMore}
//                             onChangeVisibleRows={this._onChangeVisibleRows}
//                             removeClippedSubviews={false}
//                         /> : <NoDataView title="您还没有提问过问题！" onPress={() => this.getNetwork(1)} type={1}/>}
//                     <ImageModal
//                         modalVisible={this.state.modalVisible}
//                         imageUrl={this.state.imageUrl}
//                         onPress={() => this.cloneModal()}
//                     />
//
//                 </View>
//             )
//         }
//     }
//
//     pushToLoginView() {
//         const {navigate} = this.props.navigation;
//         navigate('LoginView', {
//             title: '登录',
//             rightTitle: '注册',
//             isReLogin: false,
//             pageIndex: 2,
//             pageChildIndex: 'first',
//             // callback: () => {
//             //     this.getUserInfo();
//             // }
//         })
//     }
//
//     cloneModal() {
//         this.setModalVisible(!this.state.modalVisible)
//     }
//
//     onPressU(e, rowData) {
//         if (e) {
//             if (e.nativeEvent && e.nativeEvent.data) {
//                 let data = JSON.parse(e.nativeEvent.data);
//                 if (data.type == 'AT' || data.type == 'image') {
//                     isSmallView = false;
//                     this.jumpPerson(data);
//                 } else {
//                     const {navigate} = this.props.navigation;
//                     if (isSmallView) {
//                         if (rowData) {
//                             navigate('QuestionDetail', {
//                                 title: '问题详情',
//                                 id: rowData.id,
//                                 data: rowData,
//                                 callback: () => {
//                                     isSmallView = true
//                                 },
//                                 infoPath: this.domainObj.info
//                             });
//                         }
//                     }
//                 }
//             }
//         }
//     }
//
//
//     _renderRow = (rowData) => {
//
//         let content = (rowData.content && rowData.content.replace(domainObj.info, this.domainObj.info)) || "";
//         return (
//             <View style={styles.rowViewStyle}>
//                 {Platform.OS == 'android' ?
//                     <HWebView
//                         ref='webview'
//                         htmlString={"<h3>" + rowData.title + "</h3>" + content}
//                         startInLoadingState={true}
//                         onMessage={(e) => {
//                             e.stopPropagation();
//                             this.onPressU(e, rowData);
//                         }}
//                     />
//                     :
//                     <AutoHeightWebView
//                         source={{
//                             html: `<div onclick="postQuestion(-1,'BigView')" ><h3> ${rowData.title}
//                         </h3><style> input{font-size: 14px;}</style>${questionScript}  </div>`
//                         }}
//                         onMessage={(e) => {
//                             this.onPressU(e, rowData);
//                         }}
//                     />}
//                 <TouchableHighlight underlayColor='transparent'
//                                     onPress={() => this.pushToDetail(rowData)}>
//                     <View style={styles.moreViewStyle}>
//                         <Text style={styles.textDel}>{rowData.replyCount}个回答</Text>
//                     </View>
//                 </TouchableHighlight>
//             </View>
//
//         )
//     };
//
//     pushToDetail(rowData) {
//         const {navigate} = this.props.navigation;
//         navigate('QuestionDetail', {
//                 title: '问题详情',
//                 id: rowData.id,
//                 replyCount: rowData.replyCount,
//                 //callback: () => this._onRefresh(),
//                 infoPath: this.domainObj.info
//             }
//         );
//     }
//
//     onBridgeMessage(event) {
//         let data = JSON.parse(event.nativeEvent.data);
//         this.jumpPerson(data);
//     }
//
//     jumpPerson(data) {
//         if (data.type == 'AT') {
//             const {navigate} = this.props.navigation;
//             navigate('HomeAbstractView', {
//                     title: ' ',
//                     id: data.id,
//                     userId: this.state.userInfo,
//                     type: 1,
//                     callback: () => {
//                         isSmallView = true;
//                         console.log("")
//                     }
//                 }
//             );
//         } else if (data.type == 'image') {
//             this.setState({
//                 imageUrl: data.id
//             })
//             this.setModalVisible(true)
//         }
//     }
//
//     //网络请求
//     getNetwork(option) {
//         if (this.state.userInfo.userid) {
//             this.request(option)
//         } else {
//             AsyncStorage.getItem(USERINFO, (err, id) => {
//                 let item = JSON.parse(id);
//                 this.setState({
//                     userInfo: item
//                 });
//                 this.request(option)
//             })
//         }
//     }
//
//     request(option) {
//         const {navigate} = this.props.navigation;
//         if (this.state.userInfo.userid) {
//             if (option == 1) {
//                 pageIndex = 1;
//             } else {
//                 pageIndex++
//             }
//             let data = {
//                 "pageIndex": pageIndex,
//                 "pageSize": 10,
//                 "status": 0,
//                 "createUserId": this.state.userInfo.userid
//             };
//             this.props.questionAction.fetchMyQuestionList(data, navigate, option, true)
//
//         }
//     }
//
//     _onChangeVisibleRows = (visibleRows, changedRows) => {
//     };
//
//     //下拉刷新&上啦加载
//     _onRefresh = () => {
//         isLoadMore = false;
//         this.getNetwork(1);
//
//     };
//
//     _onLoadMore = () => {
//         isLoadMore = true;
//         this.getNetwork(2);
//     };
//
//
//     //头部刷新 &底部刷新
//     _renderHeader = (viewState) => {
//         let {pullState, pullDistancePercent} = viewState;
//         let {refreshing,} = PullToRefreshListView.constants.viewState;
//         pullDistancePercent = Math.round(pullDistancePercent * 100);
//         switch (pullState) {
//             case refreshing:
//                 return (this._commonRefreshViews('', 1))
//         }
//     };
//
//     _renderFooter = (viewState) => {
//         let {pullState, pullDistancePercent} = viewState;
//         let {load_more_idle, loading_more, loaded_all,} = PullToRefreshListView.constants.viewState;
//         pullDistancePercent = Math.round(pullDistancePercent * 100);
//         switch (pullState) {
//             case load_more_idle:
//                 return (this._commonRefreshViews(`上拉加载更多 ${pullDistancePercent}%`));
//             case loading_more:
//                 return (this._commonRefreshViews('加载中...', 1));
//             case loaded_all:
//                 return (this._commonRefreshViews('- 已经到底了 -'))
//         }
//     };
//
//     _commonRefreshViews = (text, option) => {
//         return (
//             option === 1 ? <View style={styles.refreshTextStyle}>
//                     {_renderActivityIndicator()}<Text>{text}</Text>
//                 </View> :
//                 <View style={styles.refreshTextStyle}>
//                     <Text>{text}</Text>
//                 </View>
//         )
//     };
// }
//
//
// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: BGColor,
//         flex: 1,
//         paddingBottom: PlatfIOS ? 70 : 70
//     },
//
//     refreshTextStyle: {
//         height: 35,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'transparent',
//         flexDirection: 'row'
//     },
//
//     rowViewStyle: {
//         flex: 1,
//         backgroundColor: 'white',
//         marginTop: 5
//     },
//
//     textDel: {
//         fontSize: PlatfIOS ? 14 : 10,
//         color: 'gray',
//         padding: PlatfIOS ? 0 : 1,
//     },
//
//     moreViewStyle: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         padding: 10
//     }
// });
//
// export default connect(state => ({
//         state: state
//     }),
//     (dispatch) => ({
//         questionAction: bindActionCreators(QuestionAction, dispatch),
//         loginAction: bindActionCreators(LoginAction, dispatch)
//     })
// )(TimerEnhance(MyQuestion1));
