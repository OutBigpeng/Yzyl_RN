/**
 * 积分任务
 * Created by Monika on 2018/5/21.
 */
import React, {Component} from "react";
import Images from "../../../../themes/Images";
import {FlatList, Image, Platform, StyleSheet, Text, View} from "react-native";
import {_, connect, bindActionCreators, Loading} from "../../../../common/CommonDevice";
import {px2dp} from "../../../../common/CommonUtil";
import {scaleSize} from "../../../../common/ScreenUtil";
import {getMyUserScoreTasks} from "../../../../dao/MeDao";
import ScoreHeaderView from "./ScoreHeaderView";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";
import {NoDataView} from "../../../../component/CommonAssembly";
import *as MeAction from '../../../../actions/MeAction'

let completeStatus = {
    completing: '去完成',
    completed: '已完成',
};

class ScoreTaskView extends Component {
    /**
     *  {
                        "id": 2,
                        "name": "签到",//任务名称
                        "sn": "sign",
                        "description": "每日签到送积分10",//任务描述
                        "score": 10,//可得积分
                        "intervalType": "day",//任务周期： day每天/week每周/month每月/oneTime一次性
                        "interval": 1,//可获得积分次数
                        "status": 1,
                        "nextTaskTime": "2018-05-19 00:00:00", //下一个任务周期
                        "countInTask": 1,//本任务周期内已获得次数
                        "redirect": null,//跳转界面参数
                        "iconUrl": null//图标地址
                    },
     * @returns {*}
     */
    renderRow = ({item, index}) => {
        let text = this.renderText(item);
        let colorT = text === completeStatus.completing ? 'red' : '#66666688';
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: "space-between",
                paddingLeft: 10,
                paddingTop: 5,
                paddingRight: 10,
                paddingBottom: 5,
                borderBottomColor: '#aaaaaa66',
                borderBottomWidth: 0.5
            }}>
                <Image source={item.iconUrl ? {uri: item.iconUrl} : Images.defaultImage}
                       style={{width: scaleSize(80), height: scaleSize(80), alignSelf: 'center'}}/>
                <View style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: 'space-between',
                    padding: 8,
                    paddingTop: 3,
                    paddingBottom: 3
                }}>
                    <Text style={{fontSize: px2dp(15), color: 'rgba(0,0,0,0.8)'}}>{item.name}</Text>
                    <Text style={{color: "#aaaaaa88", fontSize: px2dp(12)}}>{item.description}</Text>
                </View>
                <ATouchableHighlight style={{
                    alignSelf: 'flex-end',
                }} onPress={text === completeStatus.completing ?() => this.jump(item.redirect):null}>
                    <View style={{
                        width: scaleSize(120),
                        height: scaleSize(50),
                        borderRadius: scaleSize(10),
                        borderColor: colorT,
                        borderWidth:scaleSize(1),
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Text style={{
                            fontSize: px2dp(12),
                            color: colorT
                        }}>{text}</Text>
                    </View>
                </ATouchableHighlight>
            </View>
        )
    };
    _header = () => {
        return (
            <View style={{
                height: scaleSize(100),
                borderBottomColor: '#aaaaaa66',
                borderBottomWidth: 0.5,
                alignItems:'center',
                justifyContent:'center'
            }}>
                <Text style={{color:'#aaaaaa66'}}>积分可以去 【我的-积分商城】 内兑换礼品哦！</Text>
            </View>
        )
    };

// 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {scoreDataList: [],
        isNetWork:true};
    }

    jump(str = "") {
        const {navigate, state} = this.props.navigation;
        let data = JSON.parse(str);
        if (data.name) {
            navigate(data.name, Object.assign(data.params, {
                callback: () => {
                    this.props.meAction.fetchMyScore();
                    this.getNetWork()
                }
            }))
        }//
        // switch (name) {//{"name":"HomeArticleView","params":{"title":"正文","name":"HomeArticleView","sn":"f5b471fa55a247c9a159ca3ea1038298","isRightFirstImage":true,"isShare":true}}
        //     case "注册":
        //         navigate('RegisterView',  {name: 'RegisterView', title: '注册'})
        //         break;
        //     case "签到":
        //         navigate('SignView', {
        //             title: '签到',
        //             callback: (score) => {
        //             }
        //         })
        //         break;
        //     case "索样":
        //         navigate('WelcomeView', {index: 1})
        //         break;
        //     case "分享":
        //         navigate('WelcomeView', {index: 0})
        //         break;
        // }
    }

    judgeDate(date) {
        return new Date(new Date().Format()).getTime() >= new Date(date).getTime();
    }

    renderText({intervalType, nextTaskTime, countInTask = 0, interval = 0, remainCount = 0}) {
        //      "intervalType": "day",//任务周期： day每天/week每周/month每月/oneTime一次性
        //      "interval": 1,//可获得积分次数
        //      "status": 1,
        //      "nextTaskTime": "20
        let text;
        if (interval > 0) {
            switch (intervalType) {
                case "day":
                case "week":
                case "month":
                case "oneTime":
                    if (remainCount > 0) {
                        text = completeStatus.completing
                    } else {
                        text = completeStatus.completed;
                    }
                    break;
                default:
                    break;
            }
        }
        return text;
    }

    componentDidMount() {
        this.getNetWork()
    }

    getNetWork() {
        const {navigate} = this.props.navigation;

        this.getLoading() &&this.getLoading().show();
        getMyUserScoreTasks(this.props.navigation, (res) => {
            this.getLoading() &&this.getLoading().dismiss();
            this.setState({scoreDataList: res,isNetWork:false})
        }, () => {
            this.getLoading() &&this.getLoading().dismiss();
            this.setState({scoreDataList: [],isNetWork:false})
        })
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        return (
            <View style={styles.container}>
                <ScoreHeaderView
                    ref={(com) => {
                        this.ScoreHeader = com;
                    }}
                    {...this.props}
                />
               {!_.isEmpty(this.state.scoreDataList) ?
                    <FlatList
                        ListHeaderComponent={this._header}
                        // ListFooterComponent={this._footer}
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => item.id}
                        getItemLayout={(data, index) => ({length: 100, offset: (100 + 2) * index, index})}
                        data={this.state.scoreDataList}/>
                    : (!this.state.isNetWork?<NoDataView title="积分任务" onPress={() => this.getNetWork(1)}/>:<View/>)
                }
                <Loading ref={'loading'}/>
            </View>
        );
    }

    componentWillUnmount() {
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',

        // borderTopWidth: 5,
        // borderTopColor: BGColor,
        // height: deviceHeight,
        // width: deviceWidth
    },
    avatar: {
        borderRadius: Platform.OS === 'ios' ? 35 : 25,
        width: Platform.OS === 'ios' ? 70 : 50,
        height: Platform.OS === 'ios' ? 70 : 50,
        margin: 3
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        meAction: bindActionCreators(MeAction, dispatch)

    })
)(ScoreTaskView);