/**
 * Created by coatu on 2017/1/4.
 */
import React, {Component} from "react";
import {Linking, ListView, Platform, StyleSheet, Text, View} from "react-native";
import {getProductList} from "../../../dao/FindDao";
import ProductItem from "../ProductItem";
import {NoDataView} from '../../../component/CommonAssembly';
import {CustomPhone} from "../../../common/CommonUtil";
import {
    _,
    BGColor,
    BGTextColor,
    Colors,
    Loading,
    MobclickAgent,
    MobileAlerts,
    px2dp,
    Sizes, PlatfIOS
} from "../../../common/CommonDevice";
import PullToRefreshListView from "react-native-smart-pull-to-refresh-listview";
import {_renderFooter, _renderHeader} from "../../../component/CommonRefresh";
import ATouchableHighlight from "../../../component/ATouchableHighlight";

let defaultSearchName = '';//文本框输入的参数
let searchContent = '';//和defaultSearchName 意义一样 用于区分是文本框的值 还是从别处传过来的值
let paged = 0;//1、用户输入时搜索 2、品牌产品  3、分类  4、本地 5、从热门搜索进来 默认为关键字搜索。
let page = 1;
let pageSize = 15;
let isLoadMore = false;
let newText = '';


let dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

export default class ProductListView extends Component {
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
        searchContent = "";
        defaultSearchName = searchContent;
        this.state = {
            searchName: this.props.searchName || searchContent,//传过来的搜索参数
            isEmptyData: true,//是否是空数据————用来解决搜索出现列表前闪过empty页面的问题
            rowData: {},
            dataSource: dataSource,
            dataList: dataList,
            isSearchData: true,
            isNetWork: true,
        };
        paged = this.props.paged;
        this._isMounted;

    }

    componentDidMount() {
        this._isMounted = true;

        CustomPhone((res) => {
            this.customPhone = res;
        });
        if (paged === 5) {
            searchContent = this.props.searchName || "";
        }
        //如果一方搜索另一方也支持搜索
        if (searchContent) {
            console.log("P Start");
            if (this._pullToRefreshListView) {
                this._pullToRefreshListView.beginRefresh()
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        newText = nextProps.searchName;
        if (this.props.type) {
            if (this.props.searchName) {
                if (this.props.searchName !== nextProps.searchName) {
                    if (newText !== searchContent) {
                        searchContent = newText;
                        this.setReq( searchContent)
                    } else {
                        searchContent = nextProps.searchName;
                        this.setReq(searchContent)
                    }
                }
            } else {
                if (nextProps.searchName) {
                    searchContent = nextProps.searchName;
                    this.setReq(searchContent)
                }
            }
        }
    }

    setReq(searchName) {
        this.setState({
            dataSource: dataSource,
        }, () => {
            if (this._pullToRefreshListView) {
                this._pullToRefreshListView.beginRefresh()
            } else {
                this.getNetwork(1, searchName)
            }
        })
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
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
                    renderRow={(rowData) => this._renderRow(rowData)}
                    renderHeader={_renderHeader}
                    renderFooter={_renderFooter}
                    onRefresh={this._onRefresh}
                    onLoadMore={this._onLoadMore}
                    removeClippedSubviews={false}
                    scrollEnabled={!_.isEmpty(this.state.dataList)}
                /> : <NoDataView title="数据" onPress={() => this.getNetwork(1)}/>}
                <Loading ref={'loading'}/>

            </View>
        )
    }

    _renderRow(rowData) {
        if (rowData === searchContent) {
            return (
                this._renderEmptyView()
            )
        } else {
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
        }
    };

    _renderEmptyView() {
        return (
            <View style={styles.emptyView}>
                <Text style={styles.noDataText}>
                    没有找到与“{searchContent || this.props.navigation.state.params.bname}”相关的产品，
                </Text>
                <Text style={styles.noDataText}>
                    请换个词再试，
                </Text>
                <Text style={styles.noDataText}>
                    或者联系我们的工作人员帮您找到想要的产品。
                </Text>
                <ATouchableHighlight onPress={() => this.clickCall()}>
                    <Text style={{
                        fontSize: px2dp(Sizes.listSize),
                        color: BGTextColor,
                        marginTop: Platform.OS === 'ios' ? 12 : 0
                    }}>
                        联系客服: {this.customPhone}
                    </Text>
                </ATouchableHighlight>
            </View>
        );
    }

    clickCall() {
        MobileAlerts('拨打客服电话？', this.customPhone, () => {
            Linking.openURL("tel:" + this.customPhone)
        });
    }

    scrollToTop() {
        this._pullToRefreshListView && this._pullToRefreshListView._scrollView.scrollTo({x: 0, y: 0, animated: true})
    }

    getNetwork(option, searchname) {
        const {state} = this.props.navigation;
        let categoryid = null;
        if (paged === 5) {
            if (this.props.categoryid) {
                categoryid = this.props.categoryid;
            }
        }
        if (option === 1) {
            // this.scrollToTop();
            isLoadMore = false;
            // this._pullToRefreshListView && this._pullToRefreshListView.endLoadMore(false);
            page = 1
        } else {
            page++;
        }
        let data = {
            "pageIndex": page,
            "pageSize": pageSize,
            "searchname": searchname ? searchname : searchContent,
            "categoryid": categoryid
        };
        /**
         * { buyergradeid: 1,
  areaid: 1,
  pageIndex: 1,
  pageSize: 10,
  searchname: '乳液',
  categoryid: 0 },
         */
        if (searchContent || searchname) {
            let temp = {'name': searchContent || searchname};
            MobclickAgent.onEvent("yz_search", temp);
        }
        /*
                    if (state.params.paged === 1 || state.params.paged === 4) {
                        if (searchContent !== '' || searchname !== '') {
                            this.getLoadNetWork(option, data)
                        }
                    } */
        /*else if (state.params.paged === 3 || state.params.paged === 2) {//推荐品牌id 或者是分类id
                        this.getLoadNetWork(option, data, loading)
                    // }else {*/
        if (paged === 5 && (searchContent !== '' || searchname !== '')) {
            this.getLoadNetWork(option, data)
        }
        // }
    }

    getLoadNetWork(option, data) {//oo的出现只是为了刷新数据。让数据可以清空
        const {navigate} = this.props.navigation;
        getProductList(data, this.props.navigation, (res) => {
            this.getLoading().dismiss();

            let newDataList =option === 1?[].concat(res.data):this.state.dataList.concat(res.data);
            this._isMounted && this.setState({
                dataList: option === 1 ? _.isEmpty(res.data) ? [] : res.data : newDataList,
                dataSource: this.state.dataSource.cloneWithRows(option === 1 ? _.isEmpty(res.data) ? [].concat(searchContent) : [].concat(res.data) : [].concat(newDataList)),
                isSearchData: !_.isEmpty(res.data),
                isNetWork: true,
            },()=>{
            });

            if (option === 2) {
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
                this._pullToRefreshListView.endRefresh();
            }
        }, (err) => {
            this.getLoading().dismiss();
            this._isMounted && this.setState({
                isNetWork: false
            });
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
        defaultSearchName = searchContent = '';
        paged = 0;
        page = 0;
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

