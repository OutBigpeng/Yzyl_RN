/**我的订单
 * Created by Monika on 2016/12/27.
 */
'use strict';
import React, {Component} from "react";
import {Image, ListView, StyleSheet, Text, View} from "react-native";
import {getFollowData} from '../../../../common/FollowUtil'
import TimerEnhance from 'react-native-smart-timer-enhance'
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'
import {_renderFooter, _renderHeader} from '../../../../component/CommonRefresh'
import *as MeAction from '../../../../actions/MeAction'
import {NoDataView} from '../../../../component/CommonAssembly'
import {
    _,
    AvatarStitching,
    BGColor,
    BGTextColor,
    bindActionCreators,
    borderColor,
    borderRadius,
    Colors,
    connect,
    deviceWidth,
    Loading,
    MobclickAgent,
    px2dp,
    Sizes
} from '../../../../common/CommonDevice'
import ATouchableHighlight from "../../../../component/ATouchableHighlight";

let isLoadMore = false;
let pagesize = 10;
let page = 1;
let type = '';

class FollowView extends Component {
    // 构造
    constructor(props) {
        super(props);
        let dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });
        // 初始状态
        this.state = {
            dataSource: dataSource,
            showData: {},
            requestData: {},
            callbackTest: null,
            DataArray: [],
            isSearchData: true,  //判断 orderListData是否有数据，无数据显示无数据页面
            followListSearchData: [], //判断 orderListData是否有数据，无数据用他代替,
            selectArray: [],
            isFollow: true,
            allFollow: true,
            id: 0,
        };
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    componentDidMount() {
        if (this._pullToRefreshListView) {
            this._pullToRefreshListView.beginRefresh()
        }
    }

    componentWillUnmount() {
        type = '';
        MobclickAgent.onPageEnd('我的订单');
    }

    //网络数据处理
    componentWillReceiveProps(nextProps) {
        const {followListData, followRes} = nextProps.state.Me;
        if (followListData.length > 0) {
            this.getLoading().dismiss();
            if (followListData.length > 0 && followRes.result.length > 0) {
                this.setState({
                    followListSearchData: followRes.result,
                    isSearchData: true
                })
            }
            if (isLoadMore) {
                let loadedAll;
                if (followListData.length >= followRes.count) {
                    loadedAll = true;
                    this._pullToRefreshListView.endLoadMore(loadedAll)
                }
                else {
                    loadedAll = false;
                    this._pullToRefreshListView.endLoadMore(loadedAll)
                }
            } else {
                if (this.props.state.Me.followRes !== followRes) {
                    if (this._pullToRefreshListView) {
                        this._pullToRefreshListView.endRefresh()
                    }
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

    getLoading() {
        return this.refs['loading'];
    }

    render() {
        const {followListData} = this.props.state.Me;
        return (
            <View style={styles.container}>
                {this.state.isSearchData ? <PullToRefreshListView
                    ref={(component) => this._pullToRefreshListView = component}
                    viewType={PullToRefreshListView.constants.viewType.listView}
                    contentContainerStyle={{backgroundColor: 'transparent',}}
                    initialListSize={20}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource.cloneWithRows(_.isEmpty(followListData) ? this.state.followListSearchData : followListData)}
                    pageSize={20}
                    renderRow={this._renderRow}
                    renderHeader={_renderHeader}
                    renderFooter={_renderFooter}
                    onRefresh={this._onRefresh}
                    onLoadMore={this._onLoadMore}
                    removeClippedSubviews={false}
                /> : <NoDataView title="关注" onPress={() => this.getNetwork(1)}/>}
                <Loading ref={'loading'} text={'请等待...'}/>
            </View>
        );
    }

    _renderRow = (rowData, sectionId, rowId) => {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        let select;
        if (_.contains(this.state.selectArray, rowData.id)) {
            select = true
        } else {
            select = false;
        }
        let url = AvatarStitching(rowData.logo, domainObj.avatar);//rowData.logo +`-640x640`;
        return (
            <View style={[styles.rowViewStyle, {marginTop: rowId == 0 ? 10 : 0}]}>
                <View style={styles.allViewStyle}>
                    <Image source={rowData.logo ? {uri: url} : require('../../../../imgs/home/defaultVipAvatar.png')}
                           style={styles.imageStyle}/>
                    <Text style={styles.textStyle}>{rowData.nickname}</Text>
                </View>

                <ATouchableHighlight onPress={() => this.unfollow(2, rowData, select ? true : false)}>
                    {!select ?
                        <View style={styles.followViewStyle}>
                            <Text style={styles.followTextStyle}>已关注</Text>
                        </View>
                        : <View
                            style={[styles.followViewStyle, {
                                backgroundColor: 'white',
                                borderColor: BGTextColor,
                                borderWidth: 1,
                            }]}>
                            <Text style={[styles.followTextStyle, {color: BGTextColor}]}>＋ 关注</Text>
                        </View>
                    }
                </ATouchableHighlight>
            </View>
        )
    };
    //下拉刷新&上啦加载
    _onRefresh = () => {
        type = '';
        this.getNetwork(1);
    };
    _onLoadMore = () => {
        type = '';
        isLoadMore = true;
        this.getNetwork(2);
    };


    unfollow(option, rowData, status) {
        const {navigation} = this.props;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        this.getLoading().show();
        getFollowData(option, rowData.id, navigation, userObj, this, (res) => {
            let array = this.state.selectArray;
            if (_.contains(array, rowData.id)) {
                if (_.first(array) == rowData.id) {
                    array.shift()
                } else {
                    _.map(array, (element, index) => {
                        if (element == rowData.id)
                            array.splice(index, 1)
                    })
                }
            } else {
                array.push(rowData.id)
            }

            this.setState({
                selectArray: array,
                isFollow: res,
                allFollow: false,
                id: rowData.id
            })
        }, status);
    }

    //网络请求
    getNetwork(option) {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let data = {
            "followerId": userObj.userid
        };
        this.props.actions.fetchMeFollowListInfo(data, this.props.navigation, true)
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },

    refreshTextStyle: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row'
    },

    rowViewStyle: {
        width: deviceWidth,
        height: 50,
        backgroundColor: 'white',
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    allViewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    imageStyle: {
        width: 30,
        height: 30,
        borderRadius: 15
    },

    textStyle: {
        marginLeft: 10,
        color: 'gray',
        fontSize: px2dp(Sizes.listSize)
    },

    followTextStyle: {
        fontSize: px2dp(Sizes.searchSize),
        color: Colors.ExplainColor
    },

    followViewStyle: {
        backgroundColor: Colors.line,
        alignItems: 'center',
        width: 60,
        height: 25,
        borderRadius: borderRadius,
        justifyContent: 'center'
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(MeAction, dispatch)
    })
)(TimerEnhance(FollowView));