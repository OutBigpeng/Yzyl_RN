/**
 * 个人主页
 * Created by coatu on 2017/6/26.
 */
import React, {Component} from "react";
import {
    Image,
    ImageBackground,
    InteractionManager,
    ListView,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    _,
    actionBar,
    AvatarStitching,
    BGColor,
    bindActionCreators,
    connect,
    defName,
    deviceWidth,
    Loading,
    LoginAlerts,
    PlatfIOS,
    px2dp,
    Sizes
} from "../../common/CommonDevice";
import {getHomeUserWithCertifiedData} from "../../dao/HomeDao";
import * as HomeAction from "../../actions/HomeAction";

import CommonHomeListView from "../../component/CommonHomeListView";
import {NoDataView} from "../../component/CommonAssembly";
import {getFollowData} from "../../common/FollowUtil";

import ATouchableHighlight from "../../component/ATouchableHighlight";
import HomeAbstractCommonList from './HomeAbstractCommonList'
import {FooterIngView, FooterWanView} from "../../component/CommonListHeaderFooter";
import {scaleSize} from "../../common/ScreenUtil";

let pageSize = 10;
let page = 1;

class HomeAbstractView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds,
            currentUser: {},
            isMore: false,
            isFollow: '',
            rows: 4,
            firstName: ''
        };
        this._isMounted;
        this.props.state.Home.homeMyDataArray = [];
        this.props.state.Home.homeMyListData = []
    }

    getLoading() {
        return this.refs['loading'];
    }

    componentDidMount() {
        this._isMounted = true;
        this.getData();
    }

    getData() {
        const {navigate, state} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        let data = {'id': state.params.id};
        if (this.getLoading()) {
            this.getLoading().show();
        }
        getHomeUserWithCertifiedData(data, this.props.navigation, (res) => {
            this._isMounted && this.setState({
                currentUser: res,
                firstName: res.cetifiedReturns && res.cetifiedReturns[0]
            });
            if (isLoginIn) {
                this.FollowData(1, res.id);
            }
            this.loadNetWork(0, res, userObj);
        }, (err) => {
            if (this.getLoading()) {
                this.getLoading().dismiss();
            }
            this.backView();
        })

    }


    loadNetWork(opation, res) {
        const {navigate, state} = this.props.navigation;
        if (page > 1) {
            page = 1
        }
        let data = {
            "pageSize": 10,
            "pageIndex": page,
            'authorId': this.state.firstName === "article" ? (state.params.type === 1 ? state.params.id : res.id) : null,
            'userid': this.state.firstName === "product" ? (state.params.type === 1 ? state.params.id : res.id) : null,
            "brandid": state.params.page ? state.params.page === "proBrand" ? state.params.brandid : null : null
        };
        if (opation === 0) {
            this.props.actions.fetchHomeMyListInfo(data, this.props.navigation, false, true, true, false, this.state.firstName, this.getLoading())
        } else {
            this.props.actions.fetchHomeMyListInfo(data, this.props.navigation, true, false, false, false, this.state.firstName, this.getLoading());
        }
    }

    _onRefresh() {
        this.loadNetWork(1, this.state.currentUser, this.state.firstName)
    }


    // 服务器有没有更多数据
    isMore() {
        const {homeMyDataArray, homeMyListData} = this.props.state.Home;
        return homeMyListData.length !== homeMyDataArray.count;
    }

    onEndReached() {
        const {isLoadMore} = this.props.state.Home;
        if (!this.isMore() || isLoadMore) {

        } else {
            const {homeMyDataArray, homeMyListData} = this.props.state.Home;
            const {navigate, state} = this.props.navigation;
            if (!_.isEmpty(homeMyListData)) {
                if (page < homeMyDataArray.pageCount) {
                    page++;
                    let data = {
                        "pageIndex": page,
                        "pageSize": pageSize,
                        'authorId': this.state.firstName === "article" ? state.params.type === 1 ? state.params.id : this.state.currentUser.id : null,
                        'userid': this.state.firstName === "product" ? state.params.type === 1 ? state.params.id : this.state.currentUser.id : null
                    };
                    this.props.actions.fetchHomeMyListInfo(data, this.props.navigation, false, false, false, true, this.state.firstName, this.getLoading());
                }
            }
        }
    }


    //是否关注或者取消关注
    FollowData(option, items, status) {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let that = this;
        const {navigation} = this.props;
        if (!isLoginIn) {
            LoginAlerts(this.props.navigation, {
                callback: () => {
                    this.FollowData(1, that.state.currentUser.id)
                }
            })
        } else {
            getFollowData(option, items, navigation, userObj, this, (res) => {
                this.props.actions.fetchHomeFollowInfo(res)
            }, status);
        }
    }


    backView() {
        const {goBack, state} = this.props.navigation;
        goBack();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    render() {
        let imageUrl;
        const {certifiedTypeName, logo, certifiedInfo} = this.state.currentUser;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        if (this.state.currentUser && logo) {
            imageUrl = AvatarStitching(logo, domainObj.avatar);
        }
        const {homeMyListData, homeMyLoading} = this.props.state.Home;
        return (
            <View style={styles.container}>
                {/*最上面定义的返回按钮*/}
                <ImageBackground source={require('../../imgs/home/bg1.png')} resizeMode={Image.resizeMode.cover}
                                 style={{
                                     width: deviceWidth,
                                     height: deviceWidth / 16 * 9,
                                     backgroundColor: 'transparent'
                                 }}>
                    <View style={styles.navViewStyle}>
                        <ATouchableHighlight onPress={() => this.backView()}>
                            <Image source={require('../../imgs/navigator/back_btn.png')}
                                   style={styles.navImageStyle}/>
                        </ATouchableHighlight>
                    </View>

                    {/*头部*/}
                    <View style={styles.headerViewStyle}>
                        <Image
                            source={imageUrl ? {uri: imageUrl} :
                                require('../../imgs/home/defaultVipAvatar.png')} style={styles.imageStyle}
                        />

                        <View style={styles.headerRightViewStyle}>
                            <Text style={styles.rightTextStyle}>{this.state.currentUser.nickname || defName}</Text>
                            <View style={styles.renZhengViewStyle}>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: px2dp(Sizes.searchSize)
                                    }}>{`认证${this.state.currentUser.certifiedTypeName || ''}`}</Text>
                                <Image source={require('../../imgs/home/V1.png')} style={styles.VStyle}/>
                            </View>
                        </View>
                    </View>
                </ImageBackground>

                {/*下面的ListView*/}
                {homeMyListData ?
                    <ListView
                        initialListSize={10}
                        dataSource={this.state.dataSource.cloneWithRows(!_.isEmpty(homeMyListData) ? homeMyListData : [])}
                        renderRow={(rowData, sectionId, rowId) => this.renderItem(rowData, sectionId, rowId)}
                        scrollEventThrottle={16}
                        pageSize={8}
                        removeClippedSubviews={false}
                        enableEmptySections={true}
                        onEndReached={() => this.onEndReached()}
                        onEndReachedThreshold={2}
                        //onScroll={(e)=>this.onScroll(e)}
                        renderFooter={() => this.renderFooter()}
                        renderHeader={() => this.header()}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.props.state.Home.homeMyIsRefreshing}
                                onRefresh={() => this._onRefresh()}/>}
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            this.listHeight = contentHeight;
                        }}
                    /> : <NoDataView title="数据" onPress={() => this._onRefresh()}/>}

                <Loading ref={'loading'}/>
            </View>
        )
    }

    header() {
        const {homeFollowStatus} = this.props.state.Home;
        const {state} = this.props.navigation;
        return (
            <HomeAbstractCommonList
                {...this.props}
                currentUser={this.state.currentUser}
                askPushToView={() => this.pushToView()}
                FollowData={() => this.FollowData(2, state.params.id, !homeFollowStatus)}
                FirstName={this.state.firstName}
                onPressTab={(title) => this.onPressTab(title)}
            />
        )
    }

    onPressTab(title) {
        this._isMounted && this.setState({
            firstName: title
        });
        this.props.state.Home.homeMyDataArray = [];
        this.props.state.Home.homeMyListData = [];
        this.loadNetWork(0, this.state.currentUser, title)
    }

    //renderItem
    renderItem(rowData, sectionId, rowID) {
        const {certifiedTypeName} = this.state.currentUser;
        return (
            <View>
                <CommonHomeListView
                    {...this.props}
                    imgSizeType={"60"}
                    view={this.state.firstName}
                    onPress={() => this.pushToDetail(rowData)}
                    item={rowData}
                />
            </View>
        )
    }

    //底部刷新
    renderFooter() {
        const {homeIsLoadMore, homeMyDataArray, homeMyListData} = this.props.state.Home;
        if (homeMyListData.length >= 10) {
            if (homeMyListData.length >= homeMyDataArray.count) {
                return (
                    <FooterWanView/>
                )
            } else {
                return (
                    <FooterIngView/>
                )
            }
        }
        return null;
    }


    pushToView() {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let that = this;
        if (!isLoginIn) {
            LoginAlerts(this.props.navigation, {
                callback: () => this.FollowData(1, that.state.currentUser.id)
            })
        } else {
            navigate('ChatMsg', {
                personId:  this.state.currentUser.id,
            });
          /*  navigate('PutQuestions', {
                title: '提问',
                rightTitle: '发布',
                leftTitle: '取消',
                type: 1,
                atArray: [{name: this.state.currentUser.nickname || defName, id: this.state.currentUser.id}]
            })*/
        }
    }

//页面跳转
    pushToDetail(rowData) {
        const {navigate} = this.props.navigation;
        const {certifiedTypeName, logo, certifiedInfo} = this.state.currentUser;
        if (this.state.firstName !== 'product' && rowData && rowData.sn) {
            navigate('HomeArticleView', {
                title: '正文',
                sn: rowData.sn,
                rightImageSource: true,
                isCollection: true,
                isShare: true,
                isRightFirstImage: true,
            })
        } else {
            if (rowData && rowData.productid) {
                InteractionManager.runAfterInteractions(() => {
                    navigate('ProductDetail', {
                        name: 'ProductDetail',
                        title: '产品详情',
                        pid: rowData.productid,
                        rightImageSource: true,
                        callback: () => {
                            this.FollowData(1, this.state.currentUser.id)
                        }
                    })
                })
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },

    headerViewStyle: {
        width: deviceWidth,
        height: 200,
        flexDirection: 'row',
        margin: 15
    },

    imageStyle: {
        width: 65,
        height: 65,
        borderRadius: 65 / 2,
        marginTop: scaleSize(10),
        marginLeft: scaleSize(30),
        overflow: 'hidden',
    },

    headerRightViewStyle: {
        marginLeft: scaleSize(40),
        // marginTop:10
        // justifyContent: 'center',
        // flexDirection: 'row'
    },

    rightTextStyle: {
        color: 'white',
        fontSize: px2dp(Sizes.titleSize),
        marginTop: scaleSize(40),
    },

    headerBottomViewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: scaleSize(20),
    },

    headerBottomTextViewStyle: {
        width: 100,
        height: 33,
        backgroundColor: '#rgba(253,134,36,1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        flexDirection: 'row'
    },

    headerBottomImageStyle: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    moreViewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10
    },

    renderHeaderViewStyle: {
        marginTop: 10,
        backgroundColor: 'white',
        padding: 10
    },

    renderHeaderImageStyle: {
        width: 128,
        height: 31,
        marginBottom: 10
    },
    footerStyle: {fontSize: px2dp(PlatfIOS ? 16 : 12), margin: PlatfIOS ? 10 : 5,},

    footViewStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    navViewStyle: {
        width: deviceWidth,
        height: PlatfIOS ? 64 : actionBar,
        justifyContent: 'center',

    },

    navImageStyle: {
        width: PlatfIOS ? 24 : 24,//21.6
        height: PlatfIOS ? 50 : 50,//45.6
        marginLeft: scaleSize(30),
        marginTop: PlatfIOS ? 20 : 10,

    },

    renZhengViewStyle: {
        flexDirection: 'row',
        marginTop: 8,
        alignItems: 'center'
    },

    VStyle: {
        marginLeft: 3,
        width: 15,
        height: 15
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(HomeAction, dispatch),
    })
)(HomeAbstractView);
