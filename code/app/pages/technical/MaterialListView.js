/**
 * 原材料列表页面
 * Created by Monika on 2018/4/2.
 */
import React, {Component} from "react";
import {ListView, Platform, StyleSheet, View} from "react-native";
import {getProductList} from "../../dao/FindDao";
import ProductItem from "../find/ProductItem";
import {NoDataView} from '../../component/CommonAssembly';
import {
    _,
    actionBar,
    BGColor,
    BGTextColor,
    borderColor,
    borderRadius,
    Colors,
    connect,
    deviceWidth,
    Loading,
    px2dp,
    Sizes
} from "../../common/CommonDevice";
import PullToRefreshListView from "react-native-smart-pull-to-refresh-listview";
import {_renderFooter, _renderHeader} from "../../component/CommonRefresh";

let page = 1;
let pageSize = 15;
let isLoadMore = false;

let dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

class MaterialListView extends Component {

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
                    scrollEnabled={_.isEmpty(this.state.dataList) ? false : true}
                /> : <NoDataView title="数据" onPress={() => this.getNetwork(1)}/>}
                <Loading ref={'loading'}/>
            </View>
        )
    }

    _renderRow = (rowData) => {
        if (rowData && rowData.productid) {
            return (
                <ProductItem
                    {...this.props}
                    rowData={rowData}
                />
            );
        } else {
            return <View/>
        }
    };
    //下拉刷新 & 上啦加载
    _onRefresh = () => {
        this.getNetwork(1);
    };
    _onLoadMore = () => {
        isLoadMore = true;
        this.getNetwork(2);
    };

    getNetwork(option, loading) {
        const {state} = this.props.navigation;
        if (option == 1) {
            isLoadMore = false;
            page = 1
        } else {
            page++;
        }
        let data = {
            "pageIndex": page,
            "pageSize": pageSize,
            "formulaid": state.params.formulaId
        };
        this.getLoadNetWork(option, data, loading)

    }

    getLoadNetWork(option, data, loading) {//oo的出现只是为了刷新数据。让数据可以清空
        const {navigate} = this.props.navigation;
        if (loading) {
            this.getLoading().show();
        }
        getProductList(data, this.props.navigation, (res) => {
            if (loading) {
                this.getLoading().dismiss();
            }
            let newDataList = this.state.dataList.concat(res.data);
            this.setState({
                dataList: option === 1 ? _.isEmpty(res.data) ? [] : res.data : newDataList,
                dataSource: this.state.dataSource.cloneWithRows(option === 1 ? _.isEmpty(res.data) ? [].concat(searchContent) : res.data : newDataList),
                isSearchData: _.isEmpty(res.data) ? false : true,
                isNetWork: true,
            });
            if (option == 2) {
                let loadedAll;
                if (newDataList.length >= res.count) {
                    loadedAll = true;
                    this._pullToRefreshListView.endLoadMore(loadedAll)
                }
                else {
                    loadedAll = false;
                    this._pullToRefreshListView.endLoadMore(loadedAll)
                }
            } else {
                this._pullToRefreshListView.endRefresh()
            }
        }, (err) => {
            this.getLoading().dismiss();
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
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
        // height: deviceHeight
    },

    noDataText: {
        fontSize: px2dp(Sizes.listSize),
        marginTop: Platform.OS === 'ios' ? 8 : 0,
        color: 'gray'
    },
    emptyView: {
        justifyContent: 'center',
        padding: 20,
        marginTop: 25,
        flex: 1,
        backgroundColor: BGColor,
    },
    searchViewStyle: {
        width: deviceWidth,
        height: Platform.OS === 'ios' ? 64 : actionBar,
        flexDirection: 'row',
        backgroundColor: BGTextColor,
        alignItems: 'center'
    },
    left_img: {
        width: 40,
        height: actionBar,
    },
    textInputStyle: {
        width: deviceWidth - 100,
        borderRadius: 3,
        backgroundColor: 'white',
        margin: 5,
        borderWidth: 1,
        borderColor: borderColor,
        fontSize: px2dp(14)
    },

    refreshTextStyle: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row'
    },

    radiusButtonViewStyle: {
        padding: 8,
        borderColor: Colors.line,
        borderWidth: 1,
        borderRadius: borderRadius
    },

    radiusButtonTextStyle: {
        fontSize: px2dp(Sizes.listSize),
        color: Colors.contactColor
    },

    refreshingTextStyle: {
        color: Colors.ExplainColor,
        fontSize: px2dp(Sizes.searchSize)
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(MaterialListView);