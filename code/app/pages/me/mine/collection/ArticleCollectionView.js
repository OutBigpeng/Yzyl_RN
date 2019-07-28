/**
 * Created by coatu on 2017/6/29.
 */
import React, {Component} from 'react';
import {ListView, StyleSheet, View} from 'react-native'

import {
    BGColor,
    bindActionCreators,
    borderRadius,
    Colors,
    connect,
    deviceWidth,
    Domain,
    Loading,
    px2dp,
    Sizes
} from '../../../../common/CommonDevice'
import TimerEnhance from 'react-native-smart-timer-enhance'
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'
import {_renderFooter, _renderHeader} from '../../../../component/CommonRefresh'
import *as MeAction from '../../../../actions/MeAction'
import {NoDataView} from '../../../../component/CommonAssembly'
import CommonHomeListView from '../../../../component/CommonHomeListView'
import {pushToHomeDetail} from "../../../home/HomeJumpUtil";

let isLoadMore = false;
let pagesize = 10;
let page = 1;
let type = '';

class ArticleCollectionView extends Component {
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
            collectListSearchData: [], //判断 orderListData是否有数据，无数据用他代替
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

    componentWillUnmount() {
        type = '';
        this.props.state.Me.followListData = [];
        this.props.state.Me.followRes = [];
        this.props.state.Me.collectListData = [];
        this.props.state.Me.collectRes = [];
    }


    //网络数据处理
    componentWillReceiveProps(nextProps) {
        const {collectListData, collectRes, collectLoading} = nextProps.state.Me;
        if (collectListData.length > 0) {
            this.getLoading().dismiss();
            if (collectListData.length > 0 && collectRes.length > 0) {
                this._isMounted&& this.setState({
                    collectListSearchData: collectRes,
                    isSearchData: true
                })
            }
            if (!collectLoading) {
                this._isMounted&& this.setState({
                    isSearchData: false
                });
            } else {
                this._isMounted&&this.setState({
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
                    if (this.props.state.Me.collectRes !== collectRes) {
                        this._pullToRefreshListView.endRefresh()
                    }
                }
            }
        } else {
            this.getLoading().dismiss();
            this._isMounted&& this.setState({
                isSearchData: false
            });
            if (type !== 'callback') {
                if (this._pullToRefreshListView) {
                    this._pullToRefreshListView.endRefresh()
                }
            }
        }
    }

    render() {
        const {collectListData, collectLoading} = this.props.state.Me;
        return (
            <View style={styles.container}>
                {collectLoading || this.state.isSearchData ?
                    <PullToRefreshListView
                        ref={(component) => this._pullToRefreshListView = component}
                        viewType={PullToRefreshListView.constants.viewType.listView}
                        contentContainerStyle={{backgroundColor: 'transparent', marginTop: 10}}
                        initialListSize={20}
                        enableEmptySections={true}
                        dataSource={this.state.dataSource.cloneWithRows(collectListData)}
                        pageSize={20}
                        renderRow={this._renderRow}
                        renderHeader={_renderHeader}
                        renderFooter={_renderFooter}
                        onRefresh={this._onRefresh}
                        onLoadMore={this._onLoadMore}
                        onChangeVisibleRows={this._onChangeVisibleRows}
                        removeClippedSubviews={false}
                    /> : <NoDataView title="收藏" onPress={() => this.getNetwork(1)}/>}
                <Loading ref={'loading'}/>
            </View>
        );
    }

    _renderRow = (rowData, sectionId, rowId) => {
        const {navigate} = this.props.navigation;
        return (
            <CommonHomeListView
                {...this.props}
                item={rowData}
                imgSizeType = {"80"}
                onPress={() => {
                    pushToHomeDetail(navigate, rowData, "", 0, (status, item) => this.callBack(status, item))
                }}
                />
        );
    };

    callBack(status, item) {
        if (status === 0) {
            this.props.actions.fetchDeleteMeCollectListInfo(item);
        }
    }

//网络请求
    getNetwork(option) {
        const {navigate} = this.props.navigation;
        if (option === 1) {
            page = 1;
            isLoadMore = false
        } else {
            page++
        }
        let data = {
            'pageIndex': page,
            'pageSize': 10
        };
        // //TODO:放到reducer里面 看一下效果
        this.props.actions.fetchMeCollectListInfo(data, navigate, true, option)

    }

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

    componentWillUnmount() {
        this._isMounted = false;
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
    },

    footStyle: {
        color: '#999999',
        fontSize: px2dp(Sizes.searchSize)
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(MeAction, dispatch)
    })
)(TimerEnhance(ArticleCollectionView));
