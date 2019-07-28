/**
 * 积分商城
 * Created by Monika on 2018/5/21.
 */
import React, {Component} from "react";
import {Image, ListView, StyleSheet, Text, View} from "react-native";
import {_, bindActionCreators, connect, deviceWidth, Loading, PlatfIOS} from "../../../../common/CommonDevice";
import ScoreHeaderView from "./ScoreHeaderView";
import {getUserScoreGoods} from "../../../../dao/MeDao";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";
import Images from "../../../../themes/Images";
import {cloneObj, px2dp} from "../../../../common/CommonUtil";
import {scaleSize} from "../../../../common/ScreenUtil";
import MallGoodsOrder from "./MallGoodsOrder";
import PullToRefreshListView from "react-native-smart-pull-to-refresh-listview";
import {_renderFooter, _renderHeader} from "../../../../component/CommonRefresh";
import {NoDataView} from "../../../../component/CommonAssembly";
import *as MeAction from '../../../../actions/MeAction'
import * as Colors from "../../../../common/CommonDevice";

// 一些常亮设置
const cols = 2;
const padding = 10;
const cellWH = (deviceWidth ) / cols - padding / 4;
const vMargin = (deviceWidth - cellWH * cols) / (cols + 1);
const iconParams = cellWH-padding;

let page = 1;
let pageSize = 15;
let isLoadMore = false;

let dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

class ScoreMallView extends Component {

    _renderRow = (item) => {
        let {myScore = 0} = this.props.state.Me;
        if (item) {
            return (
                <View style={{
                    flexDirection: 'row',
                    paddingTop: padding,
                    // paddingLeft: padding,
                    // paddingRight: padding,
                    justifyContent: "space-between",
                }}>
                    {item && item.map((obj, pos) => {
                        if(obj&&obj.name){
                            let {
                                name,
                                score,
                                description,
                                status = 0,//为1才是可以兑换的
                                imgUrl
                            } = obj;
                            let isExchange = myScore >= score && status === 1;
                            let btColor = isExchange ? "#e4393c" : "#aaaaaa";
                            return (
                                <View key={pos} style={styles.innerViewStyle}>
                                    <Image resizeMode={Image.resizeMode.cover}
                                           source={imgUrl ? {uri: imgUrl} : Images.defaultImage} style={styles.iconStyle}/>
                                    <Text style={{
                                        color: 'rgba(0,0,0,0.8)',
                                        fontSize: px2dp(PlatfIOS ? 18 : 14),
                                        marginTop: 5
                                    }}
                                          numberOfLines={1}>{name}</Text>
                                    <View style={{
                                        position: 'absolute', bottom: -10, width: iconParams, marginBottom: padding,padding:3,
                                        flexDirection: 'row', justifyContent: "space-between", alignItems: "center"
                                    }}>
                                        <Text style={{
                                            color: '#ff9622',
                                            fontSize: px2dp(PlatfIOS ? 14 : 12)
                                        }}>{`${score}积分`}</Text>
                                        <ATouchableHighlight onPress={isExchange ? () => this.jumpOrder(obj) : null}>
                                            <View style={{
                                                width: scaleSize(120),
                                                height: scaleSize(60),
                                                borderRadius: scaleSize(8),
                                                borderWidth: scaleSize(1),
                                                borderColor: btColor,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <Text style={{color: btColor}}>兑换</Text>
                                            </View>
                                        </ATouchableHighlight>
                                    </View>
                                </View>
                            )
                        }else {
                            return(<View key={pos}/>)
                        }
                    })}
                </View>)
        } else {
            return (<View/>)
        }

    };

    _header = () => {
        return (
            <ScoreHeaderView
                ref={(com) => {
                    this.ScoreHeader = com;
                }}
                {...this.props}
                view={"mall"}
                onPress={() => {
                    let {navigate, goBack} = this.props.navigation;
                    navigate("ScoreMyExchangeGoodsListView", {title: "我的礼品订单"})
                }}
            />
        )
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
            scoreDataList: [],
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

    render() {
        const {state} = this.props.navigation;
        return (
            <View style={styles.container}>
                    {this._header()}
                {this.state.isNetWork ?
                    <PullToRefreshListView
                        ref={(component) => this._pullToRefreshListView = component}
                        viewType={PullToRefreshListView.constants.viewType.listView}
                        contentContainerStyle={{
                            backgroundColor: 'transparent',
                        }}
                        initialListSize={pageSize}
                        enableEmptySections={true}
                        dataSource={this.state.dataSource}
                        pageSize={pageSize}
                        renderRow={this._renderRow}
                        renderHeader={_renderHeader}
                        renderFooter={_renderFooter}
                        onRefresh={this._onRefresh}
                        onLoadMore={this._onLoadMore}
                        removeClippedSubviews={false}
                        scrollEnabled={_.isEmpty(this.state.dataList) ? false : true}
                    />

                : <NoDataView title="可兑换商品" onPress={() => this.getNetwork(1)}/>
                }
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
        getUserScoreGoods(data, this.props.navigation, (res) => {
            // res.data = [
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
            let allData = [];
            if (res && !_.isEmpty(res.data)) {
                let data = res.data;
                for (let i = 0; i < data.length; i = i + 2) {
                    let temp = [];
                    temp.push(data[i]);
                    if (data.length > 1&&data[i + 1]) {
                        temp.push(data[i + 1]);
                    }
                    allData.push(temp);
                }
            }
            let newDataList = this.state.dataList.concat(allData);
            this.setState({
                dataList: option === 1 ? _.isEmpty(allData) ? [] : allData : newDataList,
                dataSource: this.state.dataSource.cloneWithRows(option === 1 ? _.isEmpty(allData) ? [].concat('') : allData : newDataList),
                isSearchData: _.isEmpty(allData) ? false : true,
                isNetWork: true,
            });
            if (option == 2) {
                let loadedAll;
                if (page >= res.pageCount) {
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
            this.getLoading() && this.getLoading().dismiss();
            this.setState({
                isNetWork: false
            });
            if (loading) {
                this.getLoading() && this.getLoading().dismiss();
            }
        })
    }

    componentWillUnmount() {
        page = 1;
    }

    jumpOrder(item) {
        const {navigate} = this.props.navigation;
        navigate("MallGoodsOrder", {
            title: '积分兑换', item: cloneObj(Object.assign(item, {goodsImgUrl: item.imgUrl})),
            callback: () => {
                this.props.meAction.fetchMyScore()
            }
        });
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.BGColor,
        flex: 1
    },
    listViewStyle: {
        // 主轴方向
        // flexDirection: 'row',
        // // 一行显示不下,换一行
        // flexWrap: 'wrap',
        // // 侧轴方向
        // alignItems: 'center', // 必须设置,否则换行不起作用
    },

    innerViewStyle: {
        width: cellWH,
        height: iconParams + iconParams /2.5,
        backgroundColor:'white',
        paddingLeft:padding/2,
        paddingRight:padding/2
        // 文字内容居中对齐
    },

    iconStyle: {
        width: iconParams,
        height: iconParams
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        meAction: bindActionCreators(MeAction, dispatch)
    })
)(ScoreMallView);