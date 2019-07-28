// /**
//  * Created by coatu on 2017/6/27.
//  */
//
// import React, {Component} from "react";
// import {
//     AppRegistry,
//     StyleSheet,
//     Text,
//     View,
//     ListView,
//     Image,
//     TouchableHighlight,
//     InteractionManager,
//     RefreshControl,
//     ActivityIndicator,
//     AsyncStorage,
//     ScrollView,
//     Dimensions, Platform
// } from "react-native";
//
// import {
//     deviceHeight,
//     deviceWidth,
//     bindActionCreators,
//     connect,
//     BGTextColor,
//     BGColor,
//     Loading, PlatfIOS, Sizes
// } from "../../common/CommonDevice";
// import BrannerView from '../../component/BrannerView'
// import CommonHomeListView from '../../component/CommonHomeListView'
// import * as HomeAction from "../../actions/HomeAction";
// import Loadings from "../../common/ActionLoading";
// import _ from 'underscore';
// import {NoDataView} from '../../component/CommonAssembly';
// import JpushView from '../../containers/JpushView'
// import HomeTypeView from './HomeTypeView'
// import RecommendedBrand from '../../component/RecommendedBrand'
// import CommonArticleTypeView from '../../component/CommonArticleTypeView'
// import {FooterIngView, FooterWanView} from "../../component/CommonListHeaderFooter";
//
// let pageSize = 10;
// let page = 1;
// let canLoadMore;
// let loadMoreTime = 0;
//
//
// const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
// class Home extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         this.state = {
//             dataSource: ds,
//             pageIndex: 1,
//             movieCount: 0,
//             userInfoData: {},
//             headType: false,
//         };
//         canLoadMore = false;
//         this._isMounted;
//     }
//
//     loadNetWork(opation) {
//         const {navigate} = this.props.navigation;
//         if (page > 1) {
//             page = 1
//         }
//         let data = {
//             "pageSize": 10,
//             "pageIndex": page
//         };
//
//         if (opation === 0) {
//             this.props.actions.fetchHomeListInfo(data, navigate, false, true, true)
//         } else {
//             this.props.actions.fetchHomeListInfo(data, navigate, true, false, false);
//         }
//
//     }
//
//     componentDidMount() {
//         this._isMounted = true;
//         this.loadNetWork(0)
//     }
//
//     componentWillUnmount(){
//         this._isMounted = false;
//     }
//
//     getLoading() {
//         return this.refs['loading'];
//     }
//
//     onScroll(e) {
//         this.listMoveHeight = e.nativeEvent.contentOffset.y;
//
//         if (this.listMoveHeight > 126) {
//             this.setState({
//                 headType: true
//             })
//         } else {
//             this.setState({
//                 headType: false
//             })
//         }
//
//         if (!canLoadMore) {
//             canLoadMore = true;
//         }
//     }
//
//     onEndReached() {
//         const {navigate} = this.props.navigation;
//         const {isLoadMore, DataArray, homeListData} = this.props.state.Home;
//         const time = Date.parse(new Date()) / 1000;
//         if (homeListData.length < DataArray.count) {
//             if (canLoadMore && time - loadMoreTime > 1) {
//                 page++;
//                 let data = {
//                     "pageIndex": page,
//                     "pageSize": pageSize,
//                 };
//                 this.props.actions.fetchHomeListInfo(data, navigate, false, false, false, true);
//                 canLoadMore = false;
//                 loadMoreTime = Date.parse(new Date()) / 1000;
//             }
//         }
//     }
//
//
//     renderFooter() {
//         const {isLoadMore, DataArray, homeListData} = this.props.state.Home;
//         if (!_.isEmpty(homeListData)) {
//             if (homeListData.length >= DataArray.count && DataArray.count > 1) {
//                 return <FooterWanView/>
//             } else {
//                 if (isLoadMore) {
//                     return <FooterIngView/>
//                 }
//             }
//         }
//         return null;
//     }
//
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 <JpushView navigation={this.props.navigation}/>
//                 {this._headBGStyle()}
//                 {this.props.state.Home.isView ? <Loadings /> :
//                     this.props.state.Home.homeListData ?
//                         <ListView
//                             ref='listView'
//                             initialListSize={1}
//                             dataSource={ds.cloneWithRows(this.props.state.Home.homeListData?this.props.state.Home.homeListData:[])}
//                             renderRow={this.renderItem}
//                             onEndReached={() => this.onEndReached()}
//                             onEndReachedThreshold={20}
//                             onScroll={(e)=>this.onScroll(e)}
//                             renderFooter={()=>this.renderFooter()}
//                             renderHeader={()=>this.header()}
//                             enableEmptySections={true}
//                             removeClippedSubviews={false}
//                             refreshControl={
//                         <RefreshControl
//                             refreshing={false}
//                             onRefresh={()=>this._onRefresh()}
//                             title="加载中..."
//                             titleColor="black"
//                         />
//                     }
//                             onContentSizeChange={(contentWidth,contentHeight)=>{
//                                this.listHeight=contentHeight; }}
//                             scrollEventThrottle={16}
//                         /> : this.NoDataView()}
//
//             </View>
//
//         );
//     }
//
//     NoDataView() {
//         return (
//             <View>
//                 {/*{this._headBGStyle()}*/}
//                 <NoDataView title="数据" onPress={() => this._onRefresh(1)}/>
//             </View>
//         )
//     }
//
//     header() {
//         return (
//             <View>
//                 <BrannerView navigation={this.props.navigation}/>
//                 <HomeTypeView/>
//                 {/*<RecommendedBrand/>*/}
//                 <CommonArticleTypeView/>
//             </View>
//         )
//     }
//
//     _onRefresh() {
//         canLoadMore = false;
//         this.loadNetWork(1)
//     }
//
//
//     _headBGStyle() {
//         const {headType}=this.state;
//         if (!this.props.state.Home.homeListData || headType) {
//             return (
//                 <View key="sticky-header" style={styles.stickySection}>
//                     <Text style={styles.stickySectionText}>首页</Text>
//                 </View>
//             )
//         }
//     }
//
//
//     renderItem = (rowData, sectionId, rowID) => {
//         return (
//             <CommonHomeListView
//                 item={rowData}
//                 onPress={()=>this.pushToDetail(rowData)}
//                 navigation={this.props.navigation}/>
//         )
//     }
//
//     pushToDetail(rowData) {
//         const {navigate} = this.props.navigation;
//         navigate('HomeArticleView', {
//             title: '正文',
//             sn: rowData.sn,
//             rightImageSource: true,
//             rightImage: require('../../imgs/home/share.png'),
//         })
//
//     }
//
//     // callback(){
//     //     console.log('this',this.props)
//     //     // this.loadNetWork(0)
//     //     // this.setState({
//     //     //
//     //     // })
//     // }
// }
//
// const styles = StyleSheet.create({
//     container: {
//
//         backgroundColor: BGColor,
//         height: deviceHeight -40
//     },
//     view_content: {
//         marginTop: 8,
//         backgroundColor: 'red',
//     },
//     listView: {},
//     footerStyle: {fontSize: Sizes.screenSize, margin: PlatfIOS ? 10 : 5,},
//
//     messageListView: {
//         width: deviceWidth,
//         padding: 5,
//         borderBottomColor: '#e8e8e8',
//         borderBottomWidth: 1,
//         backgroundColor: 'white',
//         flexDirection: 'row'
//     },
//
//     leftViewStyle: {
//         width: 60,
//         height: 60,
//         backgroundColor: 'red',
//         borderRadius: 60 / 2
//     },
//
//     rightStyle: {
//         marginLeft: 10,
//         width: deviceWidth - 93,
//     },
//
//     rightTopViewStyle: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 5,
//     },
//
//     rightBottomViewStyle: {
//         width: deviceWidth - 93,
//         marginTop: 10
//     },
//
//     bottomStyle: {
//         marginTop: 20,
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//
//     stickySection: {
//         height: Platform.OS == 'ios' ? 64 : 50,
//         backgroundColor: BGTextColor,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingTop: Platform.OS == 'ios' ? 15 : 0
//     },
//     stickySectionText: {
//         color: 'white',
//         fontSize: PlatfIOS ? 20 : 18,
//         margin: 10,
//         alignSelf: 'center'
//     },
//
//     footViewStyle: {
//         flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: 5
//     }
// });
// export default connect(state => ({
//         state: state
//     }),
//     (dispatch) => ({
//         actions: bindActionCreators(HomeAction, dispatch)
//     })
// )(Home);
