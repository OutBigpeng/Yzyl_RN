/**
 * Created by coatu on 2017/6/29.
 */
import React, {Component} from 'react';
import {Image, ListView, StyleSheet, Text, View} from 'react-native'

import {
    _,
    BGColor,
    bindActionCreators,
    Colors,
    connect,
    deviceWidth,
    Loading,
    px2dp,
    Sizes
} from '../../../../common/CommonDevice'
import TimerEnhance from 'react-native-smart-timer-enhance'
import *as FindAction from '../../../../actions/FindAction'
import * as TabSwitchAction from "../../../../actions/TabSwitchAction";
import CommonShopProductCell from "../../../find/CommonShopProductCell";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";
import PullToRefreshListView from "react-native-smart-pull-to-refresh-listview";
import {NoDataView} from "../../../../component/CommonAssembly";
import {_renderFooter, _renderHeader} from "../../../../component/CommonRefresh";

let isLoadMore = false;
let pagesize = 10;
let page = 1;

class ProductCollectionView extends Component {

    _renderRow = (rowData, sectionId, rowId) => {
        const {collectListData, collectLoading} = this.props.state.Find;
        if (_.isEmpty(collectListData) && rowData === '无数据') {
            if (this.state.isSearchData || collectLoading) {
                return (<View/>)
            }
            return (<NoDataView title="收藏" onPress={() => this.getNetwork(1)}/>)
        }
        if (rowData && rowData.productid) {
            return (
                <View style={{marginTop: 5, flex: 1,}}>
                    <CommonShopProductCell
                        {...this.props}
                        rowData={rowData}
                    />
                </View>
            )
        } else {
            return (
                <View/>
            )
        }
    };
    //下拉刷新&上啦加载
    _onRefresh = () => {
        this.getNetwork(1);
    };
    _onLoadMore = () => {
        isLoadMore = true;
        this.getNetwork(2);
    };
    _footItem = () => {
        return (
            <ATouchableHighlight style={{position: 'absolute', bottom: 0, width: deviceWidth}}
                                 onPress={() => this.pushToProductView()}>
                <View
                    style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        alignItems: 'center',
                        padding: 10
                    }}>
                    <Image source={require('../../../../imgs/shop/add.png')} style={{width: 90, height: 90}}/>
                    <Text style={{
                        marginLeft: 20,
                        fontSize: px2dp(Sizes.listSize),
                        color: Colors.textColor
                    }}>点击添加更多产品</Text>
                </View>
            </ATouchableHighlight>
        )
    };

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
            isSearchData: true,
            collectListSearchData: [],
            refreshing: false
        };
        this._isMounted;
    }

    getLoading() {
        return this.refs['loading'];
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._pullToRefreshListView) {
            this._pullToRefreshListView.beginRefresh()
        }
    }

    // 网络数据处理
    componentWillReceiveProps(nextProps) {
        const {collectListData, collectRes, collectLoading} = nextProps.state.Find;
        if (collectListData.length > 0) {
            this.getLoading().dismiss();
            if (collectListData.length > 0 && collectRes.length > 0) {
                this._isMounted && this.setState({
                    collectListSearchData: collectRes,
                    isSearchData: true
                })
            }
            if (!collectLoading) {
                this._isMounted && this.setState({
                    isSearchData: false
                });
            } else {
                this._isMounted && this.setState({
                    isSearchData: true
                });
            }
            if (isLoadMore) {
                let loadedAll;
                if (collectListData.length >= collectRes.count) {
                    loadedAll = true;
                    this._pullToRefreshListView.endLoadMore(loadedAll)
                }
                else {
                    if (collectListData.length >= collectRes.count) {
                        loadedAll = false;
                        this._pullToRefreshListView.endLoadMore(loadedAll)
                    }
                }
            } else {
                if (this._pullToRefreshListView) {
                    if (this.props.state.Find.collectRes !== collectRes) {
                        this._pullToRefreshListView.endRefresh()
                    }
                }
            }
        } else {
            this.getLoading().dismiss();
            this._isMounted && this.setState({
                isSearchData: false
            });
            if (this._pullToRefreshListView) {
                this._pullToRefreshListView.endRefresh()
            }
        }
    }

    render() {
        const {collectListData, collectLoading} = this.props.state.Find;
        return (
            <View style={styles.container}>
                {(collectLoading || this.state.isSearchData) ?
                    <PullToRefreshListView
                        ref={(component) => this._pullToRefreshListView = component}
                        viewType={PullToRefreshListView.constants.viewType.listView}
                        style={{backgroundColor: 'transparent', marginTop: 2, marginBottom: 110}}
                        initialListSize={20}
                        enableEmptySections={true}
                        dataSource={!_.isEmpty(collectListData) ? this.state.dataSource.cloneWithRows(collectListData) : this.state.dataSource.cloneWithRows(collectLoading ? [] : ['无数据'])}
                        pageSize={20}
                        renderRow={this._renderRow}
                        renderHeader={_renderHeader}
                        renderFooter={_renderFooter}
                        onRefresh={this._onRefresh}
                        onLoadMore={this._onLoadMore}
                        removeClippedSubviews={false}
                    /> : <NoDataView title="收藏" onPress={() => this.getNetwork(1)}/>}
                {this._footItem()}
                <Loading ref={'loading'}/>
            </View>
        )
    }

    getNetwork(option) {
        const {navigate} = this.props.navigation;
        if (option === 1) {
            page = 1;
            isLoadMore = false
        } else {
            page++
        }
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let data = {
            "userid": userObj.userid,
            'pageIndex': page,
            'pageSize': pagesize
        };
        // //TODO:放到reducer里面 看一下效果
        this.props.findAction.fetchCollectProductList(data, this.props.navigation, true, option)
    }

    pushToProductView() {
        const {state, goBack, navigate} = this.props.navigation;
        const {routes} = this.props;

        if (routes && routes.length > 1) {//切换tab页面。 如果当前tab页面被埋藏。 那么我们返回当前第一个页面，也就是tab 页面。
            // if (state.params && state.params.callbackParent) {
            //     state.params.callbackParent(1);
            //     goBack();
            // } else {
            //     this.props.navigation.setParams({
            //         index: 1,
            //     });
            // routes[0]['params'] = {index:1}
            this.props.tabSwitchAction.chageGoBack(true);
            this.props.navigation.goBack(routes[1].key);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        let {state, navigate} = this.props.navigation;
        const {collectListData, collectLoading, isOperation} = this.props.state.Find;
        isOperation && state.params.callback && state.params.callback();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
    },

    refreshTextStyle: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row'
    }
});

export default connect(state => ({
        state: state,
        routes: state.nav.routes,
    }),
    (dispatch) => ({
        findAction: bindActionCreators(FindAction, dispatch),
        tabSwitchAction: bindActionCreators(TabSwitchAction, dispatch)
    })
)(TimerEnhance(ProductCollectionView));

