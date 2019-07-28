/**
 * 我的专家分列表
 * Created by Monika on 2018/8/3.
 */


'use strict';
import React, {Component} from "react";
import {Image, ListView, StyleSheet, Text, View} from "react-native";
import {NoDataView} from '../../../../component/CommonAssembly';
import {
    _,
    BGColor,
    bindActionCreators,
    connect,
    deviceWidth,
    Loading,
    PlatfIOS,
    px2dp
} from "../../../../common/CommonDevice";
import PullToRefreshListView from "react-native-smart-pull-to-refresh-listview";
import {_renderFooter, _renderHeader} from "../../../../component/CommonRefresh";
import {getPageYzChatAccount} from "../../../../dao/ChatMsgDao";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";
import {scaleSize} from "../../../../common/ScreenUtil";
import {Colors, Images} from "../../../../themes";
import * as ChatMsgAction from "../../../../actions/ChatMsgAction";
import {cloneObj} from "../../../../common/CommonUtil";


let page = 1;
let pageSize = 15;
let isLoadMore = false;

let dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

class MyChatMsgListView extends Component {
    /**
     { content: '完美',
I/ReactNativeJS(31297):        id: 5544,
I/ReactNativeJS(31297):        logo: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLjJ5A6sRPHOTAxibIj7gQNiauyagibZH2q4YUxLhhFjjpIdib54Gl2wGicfiaI5QkJRSfFGCqDKTa0YX3w/132',
I/ReactNativeJS(31297):        certifiedType: 'undefined',
I/ReactNativeJS(31297):        nickname: 'samhua',
I/ReactNativeJS(31297):        unRead: 0,
I/ReactNativeJS(31297):        ctime: '2018-08-23 14:35:26' },
     * @param rowData
     * @returns {*}
     * @private
     */
    _renderRow = (rowData = {}, rowId) => {
        let {logo, id, nickname, unRead, ctime, content} = rowData;
        return (
            <ATouchableHighlight underlayColor='transparent' onPress={() => {
                let {navigate} = this.props.navigation;
                navigate('ChatMsg', {
                    personId: id,
                    callback: () => {
                        const {messageListObj, resObj} = this.props.state.ChatMsg;
                        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
                        let key = `${userObj.userid}-${id}`;
                        let messageList = messageListObj[key] || [];
                        let personObj = resObj[key] && resObj[key].personObj || {};
                        let obj = messageList[messageList.length - 1];
                        rowData.content = obj.content;
                        rowData.ctime = obj.ctime;
                        rowData.unRead = 0;
                        let list = this.state.dataList.filter((item) => {
                            return item.id !== rowData.id;
                        });
                        list.unshift(cloneObj(rowData));
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(list)
                        });
                    }
                });
            }}>
                <View style={{
                    flexDirection: 'row', padding: scaleSize(20), backgroundColor: 'white',
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.line,
                    alignItems: 'center',
                    // justifyContent: 'center'
                }}>
                    <Image source={logo ? {uri: logo} : Images.discussDefaultHead} resizeMode='cover'
                           style={{width: scaleSize(80), height: scaleSize(80), borderRadius: scaleSize(10)}}/>
                    {unRead && unRead > 0 ?
                        <View style={{
                            backgroundColor: 'red',
                            borderRadius: scaleSize(25),
                            width: scaleSize(35),
                            height: scaleSize(35),
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            left: scaleSize(75),
                            top: scaleSize(10)
                        }}>
                            <Text style={{
                                fontSize: px2dp(10),
                                color: 'white',
                            }}>{unRead > 99 ? "99⁺" : unRead}</Text>
                        </View> : null}
                    <View style={{
                        paddingLeft: scaleSize(15)
                    }}>
                        <View style={{
                            justifyContent: "space-between",
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text numberOfLines={1}
                                  style={{color: Colors.fontColor}}>{nickname}</Text>
                            <Text numberOfLines={1}
                                  style={[{
                                      flex: 1,
                                      fontSize: px2dp(PlatfIOS ? 11 : 10),
                                      textAlign: 'right'
                                  }]}>{ctime}</Text>
                        </View>
                        <Text numberOfLines={1}
                              style={[{
                                  width: deviceWidth / 6 * 5,
                                  marginTop: scaleSize(10)
                              }]}>{content}</Text>
                    </View>
                </View>
            </ATouchableHighlight>
        );
    };
    //下拉刷新 & 上啦加载
    _onRefresh = () => {
        this.getNetwork(1);
    };
    _onLoadMore = () => {
        isLoadMore = true;
        this.getNetwork(2);
    };

// 构造
    constructor(props) {
        super(props);
        // 初始状态
        let dataList = [];

        this.state = {
            dataSource: dataSource,
            dataList: dataList,
            isSearchData: true,
            isNetWork: true,
        };
    }

    componentDidMount() {
        if (this._pullToRefreshListView) {
            this._pullToRefreshListView.beginRefresh()
        }
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    //获取加载进度的组件
    getList() {
        return this.refs['list'];
    }

    render() {
        const {state} = this.props.navigation;
        return (
            <View style={styles.container}>
                {this.state.isNetWork ? <PullToRefreshListView
                    ref={(component) => this._pullToRefreshListView = component}
                    viewType={PullToRefreshListView.constants.viewType.listView}
                    contentContainerStyle={{
                        backgroundColor: 'transparent',
                    }}
                    initialListSize={20}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    pageSize={20}
                    renderRow={this._renderRow}
                    renderHeader={_renderHeader}
                    renderFooter={_renderFooter}
                    onRefresh={this._onRefresh}
                    onLoadMore={this._onLoadMore}
                    removeClippedSubviews={false}
                    scrollEnabled={!_.isEmpty(this.state.dataList)}
                /> : <NoDataView title="私聊记录" onPress={() => this.getNetwork(1)}/>}
                <Loading ref={'loading'}/>
            </View>
        )
    }

    getNetwork(option, loading) {
        const {state} = this.props.navigation;
        if (option === 1) {
            isLoadMore = false;
            page = 1
        } else {
            page++;
        }
        let data = {
            "pageIndex": page,
            "pageSize": pageSize,
        };
        this.getLoadNetWork(option, data, loading)
    }

    getLoadNetWork(option, data, loading) {
        const {navigate} = this.props.navigation;
        if (loading) {
            this.getLoading().show();
        }
        getPageYzChatAccount(data, this.props.navigation, (res) => {
            if (loading) {
                this.getLoading().dismiss();
            }
            let newDataList = this.state.dataList.concat(res.data);
            this.setState({
                dataList: option === 1 ? _.isEmpty(res.data) ? [] : res.data : newDataList,
                dataSource: this.state.dataSource.cloneWithRows(option === 1 ? _.isEmpty(res.data) ? [].concat('') : res.data : newDataList),
                isSearchData: !_.isEmpty(res.data),
                isNetWork: !_.isEmpty(newDataList),
            });
            if (option === 2) {
                let loadedAll;
                if (newDataList.length >= res.count) {
                    loadedAll = true;
                    if (this._pullToRefreshListView)
                        this._pullToRefreshListView.endLoadMore(loadedAll)
                }
                else {
                    loadedAll = false;
                    if (this._pullToRefreshListView)
                        this._pullToRefreshListView.endLoadMore(loadedAll)
                }
            } else {
                if (this._pullToRefreshListView)
                    this._pullToRefreshListView.endRefresh()
            }
        }, (err) => {
            this.setState({
                isNetWork: false
            });
            if (loading) {
                this.getLoading().dismiss();
            }
        })
    }

    componentWillUnmount() {
        page = 1;
        let {state} = this.props.navigation;
        state.params.callBack && state.params.callBack();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
    },

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        chatMsgAction: bindActionCreators(ChatMsgAction, dispatch),
    })
)(MyChatMsgListView);