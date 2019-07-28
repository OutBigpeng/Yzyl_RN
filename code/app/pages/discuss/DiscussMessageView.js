/**
 * 通知消息列表
 * Created by Monika on 2018/8/10.
 */

import React, {Component} from "react";
import {FlatList, Image, StyleSheet, Text, View} from "react-native";
import {_, bindActionCreators, connect, deviceWidth, Loading, PlatfIOS} from "../../common/CommonDevice";
import NavigatorView from "../../component/NavigatorView";
import {px2dp, ShowTwoButtonAlerts} from "../../common/CommonUtil";
import {NoDataView} from "../../component/CommonAssembly";
import {scaleSize} from "../../common/ScreenUtil";
import * as DiscussAction from "../../actions/DiscussAction";
import Images from "../../themes/Images";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import ShowCopyModal from "./ShowCopyModal";
import {toastShort} from "../../common/ToastUtils";
import {FooterIngView, FooterWanView} from "../../component/CommonListHeaderFooter";

let pageOption = 0;
let pageSize = 10;

class DiscussMessageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isNetWork: true,
            isShowDel: false,
            longObj: {},
        };
        this._isMounted;
    }

    jumpDetail(type, msgId, msgStatus) {
        let {navigate} = this.props.navigation;
        if (msgStatus !== 1) {
            toastShort('已被删除');
            return;
        }
        if (type !== 'qa') {
            navigate('DiscussDetailView', {
                name: 'DiscussDetailView',
                title: '详情',
                msgId: msgId,
                pageParams: "release",
            });
        } else {
            navigate('DiscussQaDetailView', {
                name: 'DiscussQaDetailView',
                title: '详情',
                msgId: msgId,
                pageParams: "release",
            });
        }
    }

    componentDidMount() {
        this.getLoading().show();
        this._isMounted = true;
        pageOption = 1;
        let data = {
            option: 1,
            pageSize: pageSize,
            isRead: 0,
        };
        this.getNetWork(data, 1)
    }

    //返回itemView
    _renderItemView({item, index}) {
        let {content, logo, nickName, msgId, ctime, type, typeStr, id, likeId, msgStatus, typeName} = item;
        let color = content ? '#050505' : likeId ? '#050505' : '#aaaaaa';
        content = content ? content : likeId ? '赞了你' : '评论已删除';
        return (
            <ATouchableHighlight onPress={() => this.jumpDetail(type, msgId, msgStatus)} onLongPress={() => {
                item.index = index;
                this._isMounted && this.setState({
                    isShowDel: true,
                    longObj: item
                });
            }}>
                <View style={{
                    flexDirection: 'row',
                    padding: scaleSize(20),
                    borderBottomColor: '#eeeeee',
                    borderBottomWidth: scaleSize(1)
                }}>
                    <Image source={logo ? {uri: logo} : Images.discussDefaultHead} style={{
                        width: scaleSize(80),
                        height: scaleSize(80),
                        marginRight: scaleSize(20)
                    }}/>
                    <View style={{width: deviceWidth - scaleSize(160)}}>
                        <Text numberOfLines={1} ellipsizeMode={'middle'}
                              style={{fontSize: px2dp(PlatfIOS ? 16 : 15), color: '#5F729A'}}>{nickName}</Text>
                        <Text style={{
                            fontSize: px2dp(PlatfIOS ? 14 : 13,),
                            color: color,
                            paddingVertical: scaleSize(10)
                        }}>{content}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: scaleSize(3)}}>
                            {typeName && <View style={{
                                borderColor: 'red',
                                borderWidth: scaleSize(1),
                                paddingHorizontal: scaleSize(10),
                                paddingVertical: scaleSize(PlatfIOS ? 4 : 0),
                                marginRight: scaleSize(10),
                                borderRadius: scaleSize(4),
                                marginVertical: 0,
                            }}><Text style={{
                                textAlign: 'center',
                                fontSize: px2dp(PlatfIOS ? 11 : 10)
                            }}>{typeName}</Text></View>}
                            <Text style={{fontSize: px2dp(PlatfIOS ? 14 : 12,), color: '#838383'}}>{ctime}</Text>
                        </View>
                    </View>
                </View>
            </ATouchableHighlight>

        );
    }

    commonFooterView() {
        if (pageOption) {
            return (
                <View key={new Date().getTime()} style={{
                    height: scaleSize(100),
                    alignItems: 'center',
                    justifyContent: "center",
                    backgroundColor: 'white',
                    borderColor: '#eeeeee',
                    borderWidth: scaleSize(1),
                    borderRightWidth: 0,
                    borderLeftWidth: 0
                }}>
                    <ATouchableHighlight onPress={() => {
                        const {navigate} = this.props.navigation;
                        pageOption = pageOption === 1 ? 0 : 1;
                        this._onLoadMore(2);
                    }}>
                        <View style={{
                            borderRadius: scaleSize(5),
                            paddingRight: scaleSize(30),
                            paddingVertical: scaleSize(20),
                            flexDirection: "row",
                            alignItems: 'center'
                        }}>
                            <Text style={{color: '#050505'}}>点击查看更早的消息</Text>
                        </View>
                    </ATouchableHighlight>
                </View>
            )
        } else if (this.state.showFoot === 1) {
            let {notifyMsgListObj: {data = [], count, pageCount}} = this.props.state.Discuss;
            if (data.length < 8) {
                return null
            }
            return (
                <FooterWanView/>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <FooterIngView/>
            );
        }
        return null;
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let {notifyMsgListObj: {data = [], count, pageCount}} = this.props.state.Discuss;
        let {isShowDel, longObj, isNetWork} = this.state;
        return (
            <View style={styles.container}>
                <NavigatorView
                    {...this.props}
                    rightTitle={'清空'}
                    contentTitle={'消息'}
                    onRightPress={() => {
                        ShowTwoButtonAlerts('', '清空所有消息', () => {
                            //清空 消息请求。。
                            this.props.actions.fetchDiscussClearDiscussNotice({
                                type: "all",
                            }, this.props.navigation);
                        })
                    }}
                />
                {!_.isEmpty(data) ? <FlatList
                    data={data}
                    renderItem={this._renderItemView.bind(this)}
                    ListFooterComponent={() => this.commonFooterView()}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    onEndReached={() => this._onEndReached()}
                    onEndReachedThreshold={PlatfIOS ? 1 : 20}
                /> : isNetWork ? <View/> :
                    <View style={{flex: 1}}>
                        <NoDataView title={`最新消息`} onPress={() => {
                        }}/>
                        {this.commonFooterView(data, count)}
                    </View>}

                <ShowCopyModal
                    {...this.props}
                    key={'DiscussMessage_ShowCopyModal'}
                    modalVisible={isShowDel}
                    list={['删除']}
                    onPress={(pos = -1) => {
                        switch (pos) {
                            case 0://删除
                                this.props.actions.fetchDiscussClearDiscussNotice({
                                    type: "single",
                                    id: longObj.id,
                                    index: longObj.index
                                }, this.props.navigation);
                                break;
                            default:
                                break;
                        }
                        this._isMounted && this.setState({
                            isShowDel: false
                        });
                    }}
                />
                <Loading ref={'loading'}/>

            </View>);
    }

    _onEndReached() {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot !== 0) {
            return;
        }
        this._onLoadMore();
    }

    _onLoadMore(option) {
        let {notifyMsgListObj: {data = [], count, pageCount}} = this.props.state.Discuss;
        if (!option && data.length >= count) {
            return;
        } else {
        }

        //底部显示正在加载更多数据
        this._isMounted && this.setState({showFoot: 2});
        let reqData = {
            option: 2,
            pageSize: pageSize,
            id: !_.isEmpty(data) ? data[data.length - 1].id : null
        };
        this.getNetWork(reqData, option)
    }

    getNetWork(dataT = {}, option) {
        if (!dataT.option) {
            dataT = {
                option: 1,
                pageSize: pageSize,
            }
        }
        this.props.actions.fetchDiscussPageDiscussNotice(dataT, this.props.navigation, (res) => {
            if (res === 'err') {
                this._isMounted && this.setState({
                    isNetWork: false,
                }, () => {
                    pageOption = 1;
                })
            } else {
                let foot = 0;
                // let {notifyMsgListObj: {data = [], count, pageCount}} = this.props.state.Discuss;
                if (option === 1 && res.data.length >= res.count) {
                    foot = 1;//listView底部显示没有更多数据了
                }
                this._isMounted && this.setState({
                    //复制数据源
                    showFoot: foot,
                    isNetWork: false,
                }, () => {
                    if (option === 2 && res.data.length === 0) {
                        toastShort('没有更多了')
                    }
                });
            }
            this.getLoading().dismiss();
        });
    }

    componentWillUnmount() {
        const {navigate, state} = this.props.navigation;
        this._isMounted = false;
        pageOption = 0;
        state.params.callback && state.params.callback();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    title: {
        fontSize: 15,
        color: 'blue',
    },
    footer: {
        flexDirection: 'row',
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    content: {
        fontSize: 15,
        color: 'black',
    }
});
export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(DiscussAction, dispatch),
    })
)(DiscussMessageView);