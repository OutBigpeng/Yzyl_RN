/**我的消息
 * Created by Monika on 2016/12/27.
 */
'use strict';
import React, {Component} from "react";
import {AsyncStorage, Image, InteractionManager, ListView, Platform, StyleSheet, Text, View} from "react-native";
import JPushModule from "jpush-react-native";
import {
    _,
    BGColor,
    bindActionCreators,
    connect,
    Colors,
    deviceHeight,
    deviceWidth,
    isEmptyObject,
    Loading,
    px2dp,
    Sizes
} from "../../../../common/CommonDevice";
import {readMessageCountById} from "../../../../dao/UserInfoDao";
import TimerEnhance from 'react-native-smart-timer-enhance'
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'
import {_renderFooter, _renderHeader} from '../../../../component/CommonRefresh'
import *as MeAction from '../../../../actions/MeAction'
import {NoDataView} from '../../../../component/CommonAssembly'
import ATouchableHighlight from "../../../../component/ATouchableHighlight";


let isLoadMore = false;
let pagesize = 10;
let page = 1;

let isBack = false;

class MyMessage extends Component {
    // 构造
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        // 初始状态
        this.state = {
            dataSource: dataSource,
            callbackTest: null,
            DataArray: [],
            isSearchData: true,  //判断 orderListData是否有数据，无数据显示无数据页面
            messsageListSearchData: [], //判断 orderListData是否有数据，无数据用他代替
        };
        isBack = false;
    }

    getLoading() {
        return this.refs['loading'];
    }

    componentDidMount() {
        if (this._pullToRefreshListView) {
            this._pullToRefreshListView.beginRefresh()
        }

        let data = {
            "msgids": "all",
            "usertype": "merchant",
            "isread": 1
        };
        readMessageCountById(data, (res) => {
            if (Platform.OS === 'android') {
                JPushModule.clearAllNotifications();
            }else {
                JPushModule.setBadge(0, () => {
                });
            }
        }, (err) => {
        });
    }

    componentWillUnmount() {
        this.backView()
    }


    //网络数据处理
    componentWillReceiveProps(nextProps) {
        const {messageListData, messageRes} = nextProps.state.Me;
        if (!isBack) {
            if (!_.isEmpty(messageListData)) {
                this.getLoading().dismiss();
                if (messageListData.length > 0) {
                    this.setState({
                        messsageListSearchData: messageRes.data ? messageRes.data : [],
                        isSearchData: true
                    })
                }
                if (isLoadMore) {
                    let loadedAll;
                    if (messageListData.length >= messageRes.count) {
                        loadedAll = true;
                        this._pullToRefreshListView.endLoadMore(loadedAll)
                    }
                    else {
                        loadedAll = false;
                        this._pullToRefreshListView.endLoadMore(loadedAll)
                    }
                } else {
                    if (this.props.state.Me.messageRes !== messageRes) {
                        this._pullToRefreshListView.endRefresh()
                    }
                }
            } else {
                this.getLoading().dismiss();
                this.setState({
                    isSearchData: false
                });
                if (this._pullToRefreshListView) {
                    this._pullToRefreshListView.endRefresh()
                }
            }
        }
    }

    render() {
        const {messageListData, messageLoading} = this.props.state.Me;
        return (
            <View style={styles.container}>
                {this.state.isSearchData || messageLoading ?
                    <PullToRefreshListView
                        ref={(component) => this._pullToRefreshListView = component}
                        viewType={PullToRefreshListView.constants.viewType.listView}
                        contentContainerStyle={{backgroundColor: 'transparent',}}
                        initialListSize={20}
                        enableEmptySections={true}
                        dataSource={this.state.dataSource.cloneWithRows(_.isEmpty(messageListData) ? this.state.messsageListSearchData : messageListData)}
                        pageSize={20}
                        renderRow={this._renderRow}
                        renderHeader={_renderHeader}
                        renderFooter={_renderFooter}
                        onRefresh={this._onRefresh}
                        onLoadMore={this._onLoadMore}
                        onChangeVisibleRows={this._onChangeVisibleRows}
                        removeClippedSubviews={false}
                    /> : <NoDataView title="消息" onPress={() => this.getNetwork(1)}/>}
                <Loading ref={'loading'}/>
            </View>
        );
    }

    _renderRow = (rowData) => {
        if (!rowData) {
            return (<View/>)
        }
        return (
            <ATouchableHighlight onPress={() => this.jumpDetail(rowData)}>
                <View style={{backgroundColor: 'white', marginTop: 8}}>
                    <Text style={styles.msgTime}> {rowData.ctime}</Text>
                    <View style={styles.viewbottom}>
                        <View>
                            <Text style={styles.msgTitle}>{rowData.title}</Text>
                            <Text style={styles.contentStyle}>{rowData.content}</Text>
                        </View>
                        {(rowData.isjump && rowData.isjump === 1) && (rowData.type && rowData.type !== 'coupon') ?
                            <Image source={require('../../../../imgs/other/right_arrow.png')}
                                   style={styles.imageStyle}/> :
                            <View/>}
                    </View>
                </View>
            </ATouchableHighlight>
        )
    };

    jumpDetail(rowData) {
        const {navigate} = this.props.navigation;
        if (!isEmptyObject(rowData)) {
            if (rowData.isjump === 1) {
                switch (rowData.type) {
                    case 'discuss':
                        let params = JSON.parse(rowData.params);
                        if(params.msgId) {
                            if (params.type !== 'qa') {
                                navigate('DiscussDetailView', {
                                    name: 'DiscussDetailView',
                                    title: '详情',
                                    msgId:params.msgId,
                                    pageParams: "release",
                                });
                            } else {
                                navigate('DiscussQaDetailView', {
                                    name: 'DiscussQaDetailView',
                                    title: '详情',
                                    msgId:params.msgId,
                                    pageParams: "release",
                                });
                            }
                        }else {
                            navigate('MyDiscussList', {
                                name: 'MyDiscussList',
                                title: '我的发布',
                                type: 'mine',
                            });
                        }
                        break;
                    case 'link'://link 跳转网页
                        InteractionManager.runAfterInteractions(() => {
                            navigate('MessageWebView', {
                                rowData: rowData,
                                name: 'MessageWebView',
                                title: rowData.title
                            })
                        });
                        break;
                    case 'product':// product 跳转产品详情
                        let result = rowData.params.split(",");
                        InteractionManager.runAfterInteractions(() => {
                            navigate('ProductDetail', {
                                name: 'ProductDetail',
                                title: '详情',
                                pid: result[0],
                            })
                        });
                        break;
                    case 'coupon':// coupon 跳转优惠券
                        // InteractionManager.runAfterInteractions(() => {
                        //     navigate('MyCoupon', {
                        //         name: 'MyCoupon',
                        //         title: '优惠券'
                        //     })
                        // });
                        break;
                    case 'qa':
                        if (rowData.params && rowData.params.indexOf(',')) {
                            let QuestResult = rowData.params.split(",");
                            InteractionManager.runAfterInteractions(() => {
                                const {navigate} = this.props.navigation;
                                navigate('QuestionDetail', {
                                        title: '问题详情',
                                        id: QuestResult[0],
                                        callback: () => this._onRefresh(),
                                        key: 'askQuestion',

                                    }
                                );
                            });
                        }
                        break;
                    case "formula"://跳转配方页面
                        if (rowData.params) {
                            let result = rowData.params.split(",");
                            navigate("FormulaXNView", {
                                name: "FormulaXNView",
                                title: result[1],
                                id: result[0],
                                rightImageSource:true,
                                isCollection: true,
                            });
                        }
                        break;
                    case "course"://跳转课程表
                        if (rowData.params) {
                            let result = rowData.params.split(",");
                            navigate("CurriculumDetailView", {
                                name: "CurriculumDetailView",
                                title: '课程详情',
                                id: result[0],
                                rightImageSource:true,
                                isCollection: true,
                            });
                        }
                        break;
                    case "article":
                        if (rowData.params) {
                            let result = rowData.params.split(",");
                            navigate('HomeArticleView', {
                                title: '正文',
                                sn: result[0],
                                label: result[1],
                                rightImageSource: true,
                                isCollection: true,
                                isShare: true,
                                isRightFirstImage: true
                            });
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    backView = () => {
        const {navigate, state, goBack} = this.props.navigation;
        if (state.params && state.params.name) {
            if (state.params.name === 'MyMessage') {
                state.params.callBack();
            }
        }
        isBack = true;
        goBack();
    };

//网络请求
    getNetwork(option) {
        const {navigate} = this.props.navigation;
        AsyncStorage.getItem(USERINFO, (err, id) => {
            let item = JSON.parse(id);
            if (option == 1) {
                page = 1;
                isLoadMore = false
            } else {
                page++
            }
            let data = {
                "pageIndex": page,
                "pageSize": pagesize,
                "userid": item.userid
            };
            // //TODO:放到reducer里面 看一下效果
            this.props.actions.fetchMeMessageListInfo(data, this.props.navigation, option, true)
        })
    }

    _onChangeVisibleRows = (visibleRows, changedRows) => {
    };

    //下拉刷新&上啦加载
    _onRefresh = () => {
        this.getNetwork(1);
    };

    _onLoadMore = () => {
        isLoadMore = true;
        this.getNetwork(2);
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },
    msgTime: {
        padding: 10,
        fontSize: px2dp(Sizes.listSize),
        color: Colors.titleColor
    },
    msgTitle: {
        color: 'black',
        fontSize: px2dp(Sizes.listSize),
        paddingBottom: 5
    },

    listView: {
        flexDirection: 'column',
        width: deviceWidth,
        height: deviceHeight
    },

    viewbottom: {
        padding: 12,
        borderTopColor: Colors.line,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    noDataText: {
        fontSize: px2dp(Platform.OS === 'ios' ? 16 : 14)
    },

    contentStyle: {
        fontSize: px2dp(Platform.OS === 'ios' ? 13 : 10),
        marginTop: 5,
        marginRight: 8
    },
    paginationView: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },

    imageStyle: {
        width: 10,
        height: 15,
        alignSelf: 'center',
    },

    refreshTextViewStyle: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row'
    },

    refreshingTextStyle: {
        color: Colors.ExplainColor,
        fontSize: px2dp(Sizes.searchSize)
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(MeAction, dispatch)
    })
)(TimerEnhance(MyMessage));



