/**我的订单
 * Created by Monika on 2016/12/27.
 */
'use strict';
import React, {Component} from "react";
import {InteractionManager, ListView, Platform, StyleSheet, Text, View} from "react-native";
import {perJsonReBuyMoney, perJsonReBuyOrder} from "../../../../dao/OrderDao";
import OrderDetail from "./OrderDetail";
import AgainBuyModal from "./AgainBuyModal";
import OrderComplete from "./OrderComplete";
import CommonOrderProductView from "../../../find/CommonOrderProduct";
import TimerEnhance from 'react-native-smart-timer-enhance'
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'
import {_renderFooter, _renderHeader} from '../../../../component/CommonRefresh'
import *as MeAction from '../../../../actions/MeAction'
import {NoDataView} from '../../../../component/CommonAssembly'
import {
    _,
    BGColor,
    BGTextColor,
    bindActionCreators,
    borderColor,
    Colors,
    connect,
    isEmptyObject,
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

class MyOrder extends Component {

    _renderRow = (rowData) => {
        return (
            <View style={styles.orderItem}>
                {/*上*/}
                <View style={styles.orderItemHeader}>
                    <Text style={{color: 'black', fontSize: px2dp(Sizes.searchSize)}}>订单号:{rowData.orderid}</Text>
                    <Text
                        style={{color: BGTextColor, fontSize: px2dp(Sizes.searchSize)}}>{rowData.orderstatus}</Text>
                </View>

                {this.listRow(rowData)}

                {/*下*/}
                <View style={styles.orderItemFoot}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            color: 'gray',
                            fontSize: Platform.OS === 'ios' ? px2dp(Sizes.searchSize) : px2dp(Sizes.listSize)
                        }}>实付款: </Text>
                        <Text style={{color: 'black', fontSize: px2dp(Sizes.searchSize)}}>￥{rowData.ordermoney}</Text>
                    </View>
                    {ISSHOWCART ?
                        <ATouchableHighlight onPress={() => this.againBuy(rowData.orderid)}>
                            <View
                                style={{
                                    borderRadius: borderRadius,
                                    backgroundColor: BGTextColor,
                                    padding: Platform.OS === 'ios' ? 7 : 4
                                }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: px2dp(Platform.OS === 'ios' ? Sizes.searchSize : Sizes.listSize)
                                }}>再次购买</Text>
                            </View>
                        </ATouchableHighlight> : null}
                </View>
            </View>
        );
    };
    _onChangeVisibleRows = (visibleRows, changedRows) => {
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

    // 构造
    constructor(props) {
        super(props);
        let dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });
        // 初始状态
        this.state = {
            dataSource: dataSource,
            modalVisible: false,
            showData: {},
            requestData: {},
            callbackTest: null,
            DataArray: [],
            isSearchData: true,  //判断 orderListData是否有数据，无数据显示无数据页面
            orderListSearchData: [], //判断 orderListData是否有数据，无数据用他代替
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
        MobclickAgent.onPageStart('我的订单');
    }

    componentWillUnmount() {
        type = '';
        MobclickAgent.onPageEnd('我的订单');
    }

    //网络数据处理
    componentWillReceiveProps(nextProps) {
        const {orderListData, orderRes} = nextProps.state.Me;
        if (orderListData.length > 0) {
            this.getLoading().dismiss();
            if (orderListData.length > 0 && orderRes.data.length > 0) {
                this.setState({
                    orderListSearchData: orderRes.data,
                    isSearchData: true
                })
            }
            if (isLoadMore) {
                let loadedAll;
                if (orderListData.length >= orderRes.count) {
                    loadedAll = true;
                    this._pullToRefreshListView.endLoadMore(loadedAll)
                }
                else {
                    loadedAll = false;
                    this._pullToRefreshListView.endLoadMore(loadedAll)
                }
            } else {
                if (this.props.state.Me.orderRes !== orderRes) {
                    this._pullToRefreshListView.endRefresh()
                }
            }
        } else {
            this.getLoading().dismiss();
            this.setState({
                isSearchData: false
            });
            if (type != 'callback') {
                if (this._pullToRefreshListView) {
                    this._pullToRefreshListView.endRefresh()
                }
            }
        }

    }

    childrenState(visible, isJump) {
        const {navigate} = this.props.navigation;
        this.setModalVisible(false);
        if (isJump) {
            this.getLoading().show();
            perJsonReBuyOrder(this.state.requestData, this.props.navigation, (result) => {
                this.getLoading().dismiss();
                InteractionManager.runAfterInteractions(() => {
                    navigate('OrderComplete', {
                        orderId: result.orderId,
                        type: 1,
                        title: '订单提交成功',
                        backCall: () => this.extracted(1, this.state.callbackTest)
                    });
                })
            }, (error) => {
                this.getLoading().dismiss();
            })
        }
    }

    render() {
        const {orderListData} = this.props.state.Me;
        return (
            <View style={styles.container}>
                {this.state.isSearchData ? <PullToRefreshListView
                    ref={(component) => this._pullToRefreshListView = component}
                    viewType={PullToRefreshListView.constants.viewType.listView}
                    contentContainerStyle={{backgroundColor: 'transparent',}}
                    initialListSize={20}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource.cloneWithRows(_.isEmpty(orderListData) ? this.state.orderListSearchData : orderListData)}
                    pageSize={20}
                    renderRow={this._renderRow}
                    renderHeader={_renderHeader}
                    renderFooter={_renderFooter}
                    onRefresh={this._onRefresh}
                    onLoadMore={this._onLoadMore}
                    onChangeVisibleRows={this._onChangeVisibleRows}
                    removeClippedSubviews={false}
                /> : <NoDataView title="订单" onPress={() => this.getNetwork(1)}/>}
                <AgainBuyModal
                    {...this.props}
                    showData={this.state.showData}
                    requestData={this.state.requestData}
                    onPress={() => this.setModalVisible(false)}
                    callCloseParent={this.childrenState.bind(this)}
                    visible={this.state.modalVisible}
                />
                <Loading ref={'loading'}/>
            </View>
        );
    }

    getLoading() {
        return this.refs['loading'];
    }

    againBuy(orderid) {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        this.getLoading().show();
        let data = {
            "orderId": orderid,
            "userid": userObj.userid,
            "buyergradeid": userObj.buyergradeid,
            "areaid": userObj.areaid
        };
        perJsonReBuyMoney(data, navigate, (result) => {
            this.getLoading().dismiss();
            this.setState({
                showData: result,
                requestData: data,
                modalVisible: true
            })
        }, (error) => {
            this.getLoading().dismiss();
        })
    }

    listRow(rowData) {
        let listRowArr = [];
        let prodlist = rowData.prodlist;
        if (!isEmptyObject(prodlist) && prodlist.length > 0) {
            for (let i = 0; i < prodlist.length; i++) {
                let row = prodlist[i];
                listRowArr.push(
                    <CommonOrderProductView
                        row={row}
                        key={i}
                        rowData={rowData}
                        onPress={() => this.onRowClick(rowData.orderid)}
                    />
                )
            }
        }
        return listRowArr;
    }

    onRowClick(id) {
        const {navigate} = this.props.navigation;
        InteractionManager.runAfterInteractions(() => {
            navigate('OrderDetail', {
                name: 'OrderDetail',
                title: '订单详情',
                orderId: id,
                type: 1,
                //backCall: () => {type ='callback';this.getNetwork(1)}
            })
        })
    }

    //网络请求
    getNetwork(option) {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        if (option == 1) {
            page = 1;
            isLoadMore = false
        } else {
            page++
        }
        let data = {
            "pageIndex": page,
            "pageSize": pagesize,
            "userid": userObj.userid
        };
        // //TODO:放到reducer里面 看一下效果
        this.props.actions.fetchMeOrderListInfo(data, navigate, option, true)
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },

    orderItem: {
        backgroundColor: 'white',
        marginTop: 5,
        borderBottomColor: borderColor,
        borderBottomWidth: Platform.OS === 'ios' ? 1 : 0.3
    },

    orderItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomColor: borderColor,
        borderBottomWidth: Platform.OS === 'ios' ? 1 : 0.3,
        alignItems: 'center'
    },
    orderItemFoot: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },

    listViewStyle: {},

    noDataText: {
        fontSize: px2dp(Platform.OS === 'ios' ? 16 : 14),
        lineHeight: 8

    },

    refreshTextStyle: {
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
)(TimerEnhance(MyOrder));