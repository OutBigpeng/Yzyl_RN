/**
 * 积分使用明细列表
 * Created by Monika on 2018/5/18.
 */
import React, {Component} from "react";
import {ListView, Platform, StyleSheet, Text, View} from "react-native";
import {NoDataView} from '../../../../component/CommonAssembly';
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
    Loading, PlatfIOS,
    px2dp,
    Sizes
} from "../../../../common/CommonDevice";
import PullToRefreshListView from "react-native-smart-pull-to-refresh-listview";
import {_renderFooter, _renderHeader} from "../../../../component/CommonRefresh";
import {getMyUserScoreDetail} from "../../../../dao/MeDao";

let page = 1;
let pageSize = 15;
let isLoadMore = false;

let dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

class ScoreUserListView extends Component {
    /**
     * {
        "id": 15,
        "scoreId": 1,
        "userId": 1,
        "score": -500,
        "createTime": "2018-05-18 15:29:49",
        "taskId": null,
        "reason": "兑换",
        "remark": "iphone充电线1根",
        "nextTaskTime": null,
        "totalScore": 580,
        "countInTask": null
    },
     */
    _renderRow = (rowData = {}) => {
        let {reason="", id, score=0, createTime,remark=""} = rowData;
        if (id) {
            return (
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:10,backgroundColor:'white',marginTop:10}}>
                    <View style={{flex:5}}>
                        <Text style={{color:'rgba(0,0,0,0.8)',fontSize:px2dp(PlatfIOS?16:15)}}>{`${reason}${remark?"：":""}${remark}`}</Text>
                        <Text style={{fontSize:px2dp(12),marginTop:5,}}>{`${createTime}`}</Text>
                    </View>
                    <Text style={{color:score*1>0?'red':'green',fontSize:px2dp(PlatfIOS?16:14),flex:1,textAlign:'right'}}>{score}</Text>
                </View>
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
                /> : <NoDataView title="积分使用记录" onPress={() => this.getNetwork(1)}/>}
                <Loading ref={'loading'}/>
            </View>
        )
    }

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

    getLoadNetWork(option, data, loading) {
        const {navigate} = this.props.navigation;
        if (loading) {
            this.getLoading().show();
        }
        getMyUserScoreDetail(data, this.props.navigation, (res) => {
            if (loading) {
                this.getLoading().dismiss();
            }
            let newDataList = this.state.dataList.concat(res.data);
            this.setState({
                dataList: option === 1 ? _.isEmpty(res.data) ? [] : res.data : newDataList,
                dataSource: this.state.dataSource.cloneWithRows(option === 1 ? _.isEmpty(res.data) ? [].concat('') : res.data : newDataList),
                isSearchData: _.isEmpty(res.data) ? false : true,
                isNetWork: _.isEmpty(newDataList)?false:true,
            });
            if (option == 2) {
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
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(ScoreUserListView);