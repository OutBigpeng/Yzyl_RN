// /**
//  * Created by coatu on 2017/7/5.
//  */
// import React, {PureComponent} from 'react';
// import {AsyncStorage, Image, ListView, Platform, StyleSheet, Text, TouchableHighlight, View} from 'react-native'
//
// import TimerEnhance from 'react-native-smart-timer-enhance'
// import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'
// import {_renderActivityIndicator} from "../../component/CommonRefresh";
// import {NoDataView} from '../../component/CommonAssembly';
// import {
//     _,
//     AvatarStitching,
//     BGColor,
//     bindActionCreators,
//     Colors,
//     connect,
//     Domain,
//     domainObj,
//     PlatfIOS,
//     questionScript,
//     Sizes,
//     subString
// } from '../../common/CommonDevice';
// import *as QuestionAction from '../../actions/QuestionAction'
// import *as LoginAction from '../../actions/LoginAction'
// import AutoHeightWebView from 'react-native-autoheight-webview'
// import HWebView from "./HWebView";
// import ImageModal from '../../component/ImageModal'
//
// let isLoadMore = false;
// let pageIndex = 1;
// let isSmallView = true;
//
// class AskMeQuestion extends PureComponent {
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
//             askQuestionData: [],
//             modalVisible: false,
//             imageUrl: null,
//             userInfo: {}
//         }
//     }
//
//     setModalVisible(visible) {
//         this.setState({
//             modalVisible: visible,
//             domains: []
//         });
//     }
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
//             })
//             if (item) {
//                 Domain((res) => {
//                     this.setState({
//                         domains: res
//                     })
//                 })
//                 if (this._pullToRefreshListView) {
//                     this._pullToRefreshListView.beginRefresh();
//                 }
//             }
//         })
//     }
//
//     componentWillUnmount() {
//         this.props.state.Question.askQuestionList = [];
//         this.props.state.Question.askQuestionRes = [];
//     }
//
//     //网络数据处理
//     componentWillReceiveProps(nextProps) {
//         const {askQuestionList, askQuestionRes} = nextProps.state.Question;
//         if (askQuestionList.length > 0) {
//             this.setState({
//                 askQuestionData: askQuestionRes.data ? askQuestionRes.data : [],
//                 isSearchData: true
//             })
//             if (isLoadMore) {
//                 let loadedAll;
//                 if (askQuestionList.length >= askQuestionRes.count) {
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
//
//         }
//     }
//
//     render() {
//         const {askQuestionList, askLoading} = this.props.state.Question;
//         if (_.isEmpty(this.state.userInfo)) {
//             return (
//                 <NoDataView title="您还没有登录，请先去登录" type={1} onPress={() => this.pushToLoginView()}/>
//             )
//         } else {
//             return (
//                 <View style={styles.container}>
//                     {askLoading || this.state.isSearchData ?
//                         <PullToRefreshListView
//                             ref={ (component) => this._pullToRefreshListView = component }
//                             viewType={PullToRefreshListView.constants.viewType.listView}
//                             contentContainerStyle={{backgroundColor: 'transparent'}}
//                             initialListSize={20}
//                             enableEmptySections={true}
//                             dataSource={this.state.dataSource.cloneWithRows(_.isEmpty(askQuestionList) ? this.state.askQuestionData : askQuestionList)}
//                             pageSize={20}
//                             renderRow={this._renderRow}
//                             renderHeader={this._renderHeader}
//                             renderFooter={this._renderFooter}
//                             onRefresh={this._onRefresh}
//                             onLoadMore={this._onLoadMore}
//                             onChangeVisibleRows={this._onChangeVisibleRows}
//                             removeClippedSubviews={false}
//                         /> : <NoDataView title="暂时还没人向您提问问题！" onPress={() => this.getNetwork(1)} type={1}/>}
//                     <ImageModal
//                         modalVisible={this.state.modalVisible}
//                         imageUrl={this.state.imageUrl}
//                         onPress={()=>this.cloneModal()}
//                     />
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
//             // callback: () => {
//             //     this.getUserInfo();
//             // }
//             pageIndex: 2,
//             pageChildIndex: 'second',
//         })
//     }
//
//
//     cloneModal() {
//         this.setModalVisible(!this.state.modalVisible)
//     }
//
//     _renderRow = (rowData) => {
//         var url;
//         // rowData.answerUserLogo?{uri:rowData.answerUserLogo+'-640x640'}:rowData.aquestionUserLogo?{uri:rowData.aquestionUserLogo+'-640x640'
//         if (!_.isEmpty(this.state.domains)) {
//             url = rowData.answerUserLogo ?AvatarStitching(rowData.answerUserLogo, this.state.domains.avatar):null
//         }
//         let time = rowData.answerDate ? subString(rowData.answerDate) : ''
//
//         return (
//             <TouchableHighlight onPress={()=>this.pushToDetail(rowData)}>
//                 <View style={styles.rowDataViewStyle}>
//
//                     <View style={styles.rowDataTitleViewStyle}>
//                         <Text numberOfLines={1}
//                               style={{fontSize:PlatfIOS?16:14}}>{rowData.title ? rowData.title : ''}</Text>
//                     </View>
//
//
//                     {rowData.answerUserName ?
//                         <View style={styles.replayViewStyle}>
//                             <View style={styles.replayBoxViewStyle}>
//                                 <View style={styles.replayLeftViewStyle}>
//                                     <Image source={{'uri':url}} style={styles.imageStyle}/>
//                                     <Text style={styles.textStyle}>{rowData.answerUserName}</Text>
//                                     <Text style={styles.textStyle}>{time}</Text>
//                                 </View>
//                                 <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
//                                     <Image source={require('../../imgs/problem/replay.png')} style={{width:16,height:16,marginTop:4}}/>
//                                     <Text style={styles.textStyle}>回复</Text>
//                                 </View>
//                             </View>
//
//                             {this.commonRowView(rowData)}
//                         </View> : null}
//                 </View>
//             </TouchableHighlight>
//         )
//     };
//
//
//     commonRowView(rowData) {
//         let str = rowData.answerContent ? rowData.answerContent : rowData.questionContent
//         let content = str.replace(domainObj.info, this.props.domainObj.info) || "";
//         return (
//             <View style={styles.rowViewStyle}>
//                 {Platform.OS == 'android' ?
//                     <View style={{minHeight:Math.min(this.state.height,50)}}>
//                         <HWebView
//                             ref='webview'
//                             htmlString={content}
//                             onMessage={(e) =>{
//                                  e.stopPropagation();
//                             this.onPressU(e, rowData);
//                             }}
//                             onNavigationStateChange={(e) => {
//                                 if (e.title != undefined) {
//                                     this.setState({
//                                         height: (parseInt(e.title) + 10),
//                                     })
//                                 }
//                             }}
//                         />
//                     </View> :
//
//                     <AutoHeightWebView
//                         source={{html:`<div onclick="postQuestion(-1,'BigView')"><style> input{font-size: 14px;}</style>${content}${questionScript}`}}
//                         onMessage={(e) => {
//                             this.onPressU(e, rowData);
//                         }}
//                     />}
//             </View>
//
//         )
//     }
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
//     pushToDetail(rowData) {
//         const {navigate} = this.props.navigation;
//         navigate('QuestionDetail', {
//                 title: '问题详情',
//                 id: rowData.questionId,
//                 data: rowData,
//                 callback: () => console.log(""),
//                 infoPath: this.props.domainObj.info
//
//             }
//         );
//     }
//
//     onBridgeMessage(event) {
//         // alert(3333)
//         let id = JSON.parse(event.nativeEvent.data);
//         this.jumpPerson(id);
//     }
//
//     jumpPerson(data) {
//         console.log(data);
//         if (data.type == 'AT') {
//             const {navigate} = this.props.navigation;
//             navigate('HomeAbstractView', {
//                     title: ' ',
//                     id: data.id,
//                     callback: () => console.log("")
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
//
//     //网络请求
//     getNetwork(option) {
//         const {navigate} = this.props.navigation;
//         if (option == 1) {
//             pageIndex = 1;
//         } else {
//             pageIndex++
//         }
//         // AsyncStorage.getItem(USERINFO, (err, id) => {
//         //     let item = JSON.parse(id);
//         let data = {
//             "pageIndex": pageIndex,
//             "pageSize": 10,
//             "userId": this.state.userInfo.userid
//         };
//         this.props.questionAction.fetchAskQuestionList(data, navigate, option, true)
//         // })
//     }
//
//
//     _onChangeVisibleRows = (visibleRows, changedRows) => {
//     };
//
//     //下拉刷新&上啦加载
//     _onRefresh = () => {
//         isLoadMore = false;
//         this.getNetwork(1);
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
//         paddingBottom: PlatfIOS ? 70 : 60
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
//     textDel: {
//         fontSize: PlatfIOS ? 14 : 12,
//         color: 'gray',
//         padding: PlatfIOS ? 0 : 3,
//     },
//
//     rowViewStyle: {
//         flex: 1,
//         marginTop: 5,
//         marginLeft: 5
//     },
//
//     moreViewStyle: {
//         flexDirection: 'row',
//         justifyContent: 'flex-end',
//         padding: 10
//     },
//
//     rowDataViewStyle: {
//         backgroundColor: '#rgba(250,250,250,1)',
//         marginTop: 8
//     },
//
//     rowDataTitleViewStyle: {
//         marginTop: 5,
//         padding: PlatfIOS ? 10 : 8,
//         // borderBottomWidth:1,
//         // borderBottomColor:'#rgba(236,236,236,1)'
//     },
//
//     rowDataImageViewSytle: {
//         flexDirection: 'row',
//         marginTop: 10,
//         marginLeft: 10,
//         alignItems: 'center'
//     },
//
//     textStyle:{
//         color: Colors.contactColor,
//         fontSize:Sizes.searchSize,
//         marginLeft:5
//     },
//
//     replayViewStyle:{
//         padding:10,
//         borderTopWidth:1,
//         borderTopColor:Colors.line,
//     },
//
//     replayBoxViewStyle:{
//         flexDirection:'row',
//         alignItems: 'center',
//         justifyContent:'space-between'
//     },
//
//     imageStyle:{
//         width:20,
//         height:20,
//         borderRadius: 10
//     },
//
//     replayLeftViewStyle:{
//         flexDirection:'row',
//         alignItems:'center'
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
// )(TimerEnhance(AskMeQuestion));
