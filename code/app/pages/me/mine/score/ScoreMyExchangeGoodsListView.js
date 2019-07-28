/**
 * 兑换礼品的记录
 * Created by Monika on 2018/5/18.
 */
import React, {Component} from "react";
import {ListView, Platform, StyleSheet, Text, View} from "react-native";
import {NoDataView} from '../../../../component/CommonAssembly';
import {_, BGColor, connect, Loading, px2dp, Sizes} from "../../../../common/CommonDevice";
import PullToRefreshListView from "react-native-smart-pull-to-refresh-listview";
import {_renderFooter, _renderHeader} from "../../../../component/CommonRefresh";
import {MallGoodsItemView} from "./MallGoodsChildrenView";
import {getMyExchangeGoods} from "../../../../dao/MeDao";
import MallGoodsOrder from "./MallGoodsOrder";
import {cloneObj} from "../../../../common/CommonUtil";

let page = 1;
let pageSize = 15;
let isLoadMore = false;

let dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

class ScoreMyExchangeGoodsListView extends Component {

    _renderRow = (rowData) => {
        let {createTime,id} = rowData;
        if(id){
            return (
                <View style={{marginTop:10,backgroundColor:'white'}}>
                    <MallGoodsItemView
                        {...this.props}
                        type={"view"}
                        goodsItem = {rowData}
                        onPress={()=>{
                            let {navigate, goBack} = this.props.navigation;
                            navigate("MallGoodsOrder",{title:"我的礼品订单",type:'detail',item:cloneObj(rowData)})
                        }}
                    />
                </View>
            )
        }else {
            return(<View/>)
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
        // if (this._pullToRefreshListView) {
        //     this._pullToRefreshListView.beginRefresh()
        // }
        this.getNetwork(1,this.getLoading())
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
                    // renderHeader={()=>{return(<View/>)}}
                    renderRow={this._renderRow}
                    removeClippedSubviews={false}
                    scrollEnabled={_.isEmpty(this.state.dataList) ? false : true}
                /> : <NoDataView title="礼品订单" onPress={() => this.getNetwork(1)}/>}
                <Loading ref={'loading'}/>
            </View>
        )
    }

    /**
     *   renderHeader={_renderHeader}
     renderFooter={_renderFooter}
     onRefresh={this._onRefresh}
     onLoadMore={this._onLoadMore}

     */

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
        };
        this.getLoadNetWork(option, data, loading)

    }

    getLoadNetWork(option, data, loading) {//oo的出现只是为了刷新数据。让数据可以清空
        const {navigate} = this.props.navigation;
        if (loading) {
            this.getLoading().show();
        }
        getMyExchangeGoods(data, this.props.navigation, (res) => {
            // res = [
            //     {
            //         "id": 2,
            //         "userId": 1,
            //         "detailId": 16,
            //         "goodsId": 1,
            //         "goodsName": "iphone充电线1根",
            //         "score": 500,
            //         "linkman":"小明",
            //         "address": "address",
            //         "remark": "remark",
            //         "status": 1,
            //         "createTime": "2018-05-18 15:39:47",
            //         "contact": "contact"
            //     },
            //     {
            //         "id": 1,
            //         "userId": 1,
            //         "detailId": 15,
            //         "goodsId": 1,
            //         "linkman":"小红",
            //         "goodsName": "iphone充电线1根",
            //         "score": 500,
            //         "address": "address",
            //         "remark": "remark",
            //         "status": 1,
            //         "createTime": "2018-05-18 15:29:50",
            //         "contact": "contact"
            //     }
            // ];
            if (loading) {
                this.getLoading().dismiss();
            }
            let data = res;
            let newDataList = this.state.dataList.concat(data);
            this.setState({
                dataList: option === 1 ? _.isEmpty(data) ? [] : data : newDataList,
                dataSource: this.state.dataSource.cloneWithRows(option === 1 ? _.isEmpty(data) ? [].concat('') : data : newDataList),
                isSearchData: !_.isEmpty(data),
                isNetWork: !_.isEmpty(newDataList),
            });
            if (option === 2) {
                let loadedAll;
                if (newDataList.length >= res.count) {
                    loadedAll = true;
                    if(this._pullToRefreshListView)
                        this._pullToRefreshListView.endLoadMore(loadedAll)
                }
                else {
                    loadedAll = false;
                    if(this._pullToRefreshListView)
                        this._pullToRefreshListView.endLoadMore(loadedAll)
                }
            } else {
                if(this._pullToRefreshListView)
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
        // height: deviceHeight#666666
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(ScoreMyExchangeGoodsListView);