/**
 * 结帖列表
 * Created by Monika on 2018/8/3.
 */


'use strict';
import React, {Component} from "react";
import {FlatList, Image, StyleSheet, Text, TextInput, View} from "react-native";
import {_, BGTextColor, connect, deviceWidth, Loading, px2dp} from "../../common/CommonDevice";
import {getDiscussFinishReward, getDiscussListReplier} from "../../dao/DiscussDao";
import {CommonButton, NoDataView} from "../../component/CommonAssembly";
import {scaleSize} from "../../common/ScreenUtil";
import {toastShort} from "../../common/ToastUtils";
import {Alerts} from "../../common/CommonUtil";
import {getSysAgreement} from "../../dao/SysDao";
import Images from "../../themes/Images";


class ReplierListView extends Component {

    /**
     *
     */
    renderRow = ({item, index}) => {
        let {content, replyCompany, replyUserId, contentCount, replyLogo, replyNickName, score = ''} = item;
        console.log(item);
        return (
            <View style={{
                backgroundColor: 'white',
                padding: scaleSize(20),
                borderBottomWidth: scaleSize(2),
                borderBottomColor: '#eeeeee',
                flexDirection: 'row',
                width: deviceWidth,
                alignItems: 'center'
            }}>
                <TextInput
                    keyboardType='numeric'
                    style={[{
                        width: deviceWidth / 4.5,
                        fontSize: px2dp(14),
                        height: scaleSize(80),
                        borderColor: '#eeeeee',
                        borderWidth: scaleSize(1),
                        borderRadius: scaleSize(3),
                        textAlign: 'center',
                        padding: 0,
                        marginHorizontal: scaleSize(10)
                    }]}
                    placeholder={"请输入积分"}
                    placeholderTextColor='#aaaaaa66'
                    underlineColorAndroid='transparent'
                    onChangeText={(text) => {
                        item.score = text
                    }}
                />
                <Image source={replyLogo ? {uri: replyLogo} : Images.discussDefaultHead}
                       style={{width: scaleSize(80), height: scaleSize(80)}}/>
                <Text numberOfLines={2} style={{width:deviceWidth/5*3-scaleSize(10),
                    color: '#353535',
                    marginHorizontal: scaleSize(10)
                }}>{replyNickName}{contentCount&&`(共${contentCount}条回复)`}</Text>

            </View>
        )
    };

    _footer = () => {
        return (
            <View style={styles.bottomViewStyle}>
                <CommonButton
                    title={'提交'}
                    buttonOnPress={() => this.pushToCommit()}
                    buttonStyle={[{
                        backgroundColor: BGTextColor,
                    }]}
                />
            </View>
        )
    };
    _header = () => {
        return (
            <View style={{
                // alignItems: 'center',
                borderBottomWidth: scaleSize(2),
                padding: scaleSize(30),
                borderBottomColor: '#eeeeee'
            }}>
                <Text>当前悬赏积分 : {this.rewardScore}</Text>
                <Text style={{paddingTop: scaleSize(10)}}>请根据<Text onPress={() => {
                    Alerts(this.state.content, "结帖规则")
                }} style={{color: BGTextColor, textDecorationLine: 'underline'}}>结帖规则</Text>对以下回复分配悬赏积分</Text>
            </View>
        )
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            data: [],
            isNetWork: true,
            content: ''
        };
    };


    pushToCommit() {
        let {data} = this.state;
        let {msgId, rewardScore} = this.props.navigation.state.params;

        let targetScore = 0;
        let replyUsers = [];
        let callUsers = [];
        for (let i = 0; i < data.length; i++) {
            let {replyUserId, score = 0, replyNickName} = data[i];
            targetScore += score * 1;
            if (score * 1 > 0) {
                replyUsers.push({replyUserId, score});
                callUsers.push({replyUserId, score, nickName: replyNickName})
            }
        }

        if (this.rewardScore < targetScore) {
            toastShort('分配积分不能大于悬赏积分！！')
        } else {
            if (targetScore === this.rewardScore || targetScore === 0) {
                this.getLoading() && this.getLoading().show();
                getDiscussFinishReward({msgId, replyUsers}, this.props.navigation, (res) => {
                    this.getLoading() && this.getLoading().dismiss();
                    let {goBack, state} = this.props.navigation;
                    state.params.callback && state.params.callback(callUsers);
                    goBack()
                }, () => {
                    this.getLoading() && this.getLoading().dismiss();
                })
            } else {
                toastShort("请仔细阅读结帖规则")
            }

        }

    }

    componentDidMount() {
        this.getNetWork();
        getSysAgreement('结帖规则', (res) => {
            this.setState({
                content: res.content
            })
        }, () => {
        })
    }

    getNetWork() {
        let {msgId, rewardScore} = this.props.navigation.state.params;
        this.rewardScore = rewardScore;
        this.getLoading() && this.getLoading().show();
        getDiscussListReplier({msgId}, this.props.navigation, (res) => {
            this.getLoading() && this.getLoading().dismiss();
            this.setState({
                isNetWork: false,
                data: res
            });
        }, () => {
            this.getLoading() && this.getLoading().dismiss();
            this.setState({
                isNetWork: false,
            })
        })
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        return (
            <View style={styles.container}>
                {!_.isEmpty(this.state.data) ?
                    <FlatList
                        ListHeaderComponent={this._header}
                        ListFooterComponent={this._footer}
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => item.replyUserId}
                        getItemLayout={(data, index) => ({length: 100, offset: (100 + 2) * index, index})}
                        data={this.state.data}/>
                    : (!this.state.isNetWork ? <NoDataView title="数据" onPress={() => this.getNetWork(1)}/> : <View/>)
                }
                <Loading ref={'loading'}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomViewStyle: {
        marginTop: scaleSize(80),
        paddingHorizontal: scaleSize(deviceWidth / 8),
        alignItems: 'center'
    },

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(ReplierListView);