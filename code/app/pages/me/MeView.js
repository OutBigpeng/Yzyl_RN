/**首页——我的
 * Created by coatu on 2016/12/21.
 */
import React, {Component} from "react";
import {
    AsyncStorage,
    DeviceEventEmitter,
    Image,
    ImageBackground,
    InteractionManager,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import CommonMineItemView from "../../component/CommonMineItemView";
import {
    BGTextColor,
    bindActionCreators,
    borderColor,
    connect,
    deviceHeight,
    deviceWidth,
    LoginAlerts,
    MobileAlerts,
    PlatfIOS,
    px2dp,
    textHeight
} from "../../common/CommonDevice";
import JPushModule from "jpush-react-native";
import {getUnReadYzChatMsgCount, messageCountById} from '../../dao/UserInfoDao'
import MeHeaderView from './MeHeaderView'
import LoadingView from '../../common/ActionLoading'
import {Images} from "../../themes";
import ShareModalView from "../../component/ShareModalView";
import {CustomMobile, CustomPhone} from "../../common/CommonUtil";
import *as MeAction from '../../actions/MeAction'
import Interlocution from "../interlocution/InterlocutionView";
import {scaleSize} from "../../common/ScreenUtil";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import * as LoginAction from "../../actions/LoginAction";

let count = 0;
// let RNPhoneManager = NativeModules.RNPhoneManager;
let BadgeAndroid = (Platform.OS === 'ios' ? '' : require('react-native-android-badge'));


class MeView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            modalVisible: false,
            messageIsReadCount: '',
            isLoading: true,
            isJpush: false,
        };
        this._isMounted;
        //写个通知？？？
        this.subscription = DeviceEventEmitter.addListener('Jpush', (status) => {
            // console.log('status', status);
            this.setState({isJpush: status})
        });
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.setState({
                isLoading: false,
            })
        }
        CustomPhone((res) => {
            this.customPhone = res;
        });
        this.refreshView();
        if (Platform.OS === 'android') {
            JPushModule.addReceiveNotificationListener((map) => {
                if (this._isMounted) {
                    this.setState({
                        messageIsReadCount: this.state.messageIsReadCount + 1
                    })
                }
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.subscription.remove();
    }

    getSiLiaoUnRead() {
        getUnReadYzChatMsgCount((res) => {
            this.setState({
                isChatUnRead: res
            })
        }, () => {
        })
    }

    getMessageCount(id) {
        this.getSiLiaoUnRead();
        let data = {
            "userid": id,
            "usertype": "merchant",
            "isread": 0
        };
        messageCountById(data, (res) => {
            count = res;
            AsyncStorage.setItem(NOMESSAGECOUNT, JSON.stringify(res ? res : 0));
            if (this._isMounted) {
                this.setState({
                    messageIsReadCount: res && res || 0
                })
            }
        }, (err) => {
        })
    }

    refresh() {
        this.refreshView();
    }

    refreshView() {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        if (isLoginIn && userObj.userid) {
            this.getMessageCount(userObj.userid);
            this.props.meAction.fetchMyScore();
            this.props.meAction.fetchMyExpertScore((res) => {
                this.props.loginAction.updateUserInfo(res);
            });
        }
    }

    render() {
        let {myScore = 0, expertScore: {gradeName = '', expertScore = 0, gradeImgUrl = ''}} = this.props.state.Me;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let {isChatUnRead} = this.state;
        if (this.state.isLoading) {
            return (
                <LoadingView/>
            )
        } else {
            return (
                <View style={styles.container}>
                    <ImageBackground source={Images.mineBg} resizeMode={Image.resizeMode.cover}
                                     style={{
                                         height: deviceWidth / 16 * 9 / 4 * 3,
                                         width: deviceWidth
                                     }}>
                        <MeHeaderView
                            ref={(con) => {
                                this.MyHeader = con
                            }}
                            {...this.props}
                            callback={(score) => {
                                if (score) {

                                } else {
                                    this.refreshView();
                                }
                            }}
                        />
                    </ImageBackground>

                    <ScrollView contentContainerStyle={{
                        backgroundColor: 'white',
                        paddingBottom: PlatfIOS ? 0 : textHeight,
                    }}>
                        <View style={{
                            flexDirection: "row",
                            padding: scaleSize(10),
                            borderColor: '#aaaaaa66',
                            borderBottomWidth: scaleSize(10),
                            borderBottomColor: borderColor
                        }}>
                            {this.renderItem("普通积分", isLoginIn ? myScore + '' : '0', () => this.judgeLogin(() => myScore*1>0?this.jumpScoreUse():null))}
                            {this.renderItem("专家分", isLoginIn ? expertScore + '' : '0', () => this.judgeLogin(() => {
                                let {navigate} = this.props.navigation;
                                expertScore * 1 > 0 && navigate('MyExpertScore', {
                                    title: '专家分记录',
                                })
                            }))}
                            {this.renderItem('签到', '', () => this.judgeLogin(() => {
                                const {navigate} = this.props.navigation;
                                navigate('SignView', {
                                    title: '签到',
                                    callback: (score) => {
                                        if (score) {
                                        } else {
                                            this.refreshView();
                                        }
                                    }
                                })
                            }), Images.mineSignIcon)}

                        </View>
                        {Debug && this.itemRow(31, '测试视频', '测试。。。', require('../../imgs/me/order.png'), 'VideoPlay')}
                        {Debug && this.itemRow(3, '测试', '测试工。。。', require('../../imgs/me/order.png'), 'TestView')}
                        {Debug && this.itemRow(4, '测试2', '测试工2。。。', require('../../imgs/me/order.png'), 'Demo')}
                        {/*{this.itemRow(100, '问答', '查看问答', require('../../imgs/me/wen.png'), 'Interlocution')}*/}
                        {this.itemRow(99, '我的发布', '查看我的发布内容', require('../../imgs/me/mysend.png'), 'MyDiscussList')}
                        {this.itemRow(98, '我的私聊', '我的消息', require('../../imgs/me/chat.png'), 'MyChatMsgList', isChatUnRead)}
                        {this.itemRow(1, '我的消息', '评论/通知/动态', require('../../imgs/me/mymsg.png'), 'MyMessage', count > 0 ? count : 0)}
                        {this.itemRow(9, '积分任务', '完成奖励积分', require('../../imgs/me/score_task.png'), 'ScoreTaskView')}
                        {this.itemRow(10, '积分商城', '积分换礼品', require('../../imgs/me/score_mall.png'), 'ScoreMallView')}
                        {this.itemRow(2, '收藏夹', '查看收藏消息', require('../../imgs/me/shoucang.png'), 'CollectionView')}
                        {this.itemRow(0, '我的关注', '查看我的关注', require('../../imgs/me/guanzhu.png'), 'FollowView')}
                        {/* {this.itemRow(3, '我的订单', '查看全部订单', require('../../imgs/me/order.png'), 'MyOrder')}*/}
                        {/*  {this.itemRow(4, '收货人管理', '姓名、地址等', require('../../imgs/me/ReceivingManager.png'), 'MyReceive', 1)}*/}
                        {this.itemRow(5, '账户安全', '可修改密码', require('../../imgs/me/countSecurity.png'), 'MyAccount')}
                        {this.itemRow(6, '设置', '  ', require('../../imgs/me/mineSet.png'), 'MySetting')}
                        {/*
                        {this.itemRow(7, '分享', '  ', require('../../imgs/me/share.png'))}
                        */}
                        {this.itemRow(8, '联系客服 '.concat(this.customPhone ? this.customPhone : CustomMobile), '  ', require('../../imgs/me/contactPhone.png'))}
                    </ScrollView>
                    <ShareModalView
                        key={'app_share'}
                        {...this.props}
                        visible={this.state.modalVisible}
                        closeModal={() => this.setModalVisible(false)}
                        loginAfter={() => this.loginAfter()}
                    />
                </View>
            );
        }
    }

    judgeLogin(fun) {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        if (isLoginIn) {
            fun()
        } else {
            LoginAlerts(this.props.navigation, {
                callback: () => this.loginAfter()
            })
        }
    }


    jumpScoreUse() {
        const {navigate} = this.props.navigation;
        navigate("ScoreUserListView", {
            title: '积分记录'
        });
    }

    renderItem(str, score, onPress, img) {
        return (
            <ATouchableHighlight style={{flex: 1}} onPress={onPress}>
                <View style={{height: scaleSize(100), alignItems: 'center', justifyContent: 'center'}}>
                    {score ? <Text style={{
                        alignSelf: 'center',
                        color: '#353535',
                        fontSize: px2dp(PlatfIOS ? 18 : 16),
                    }}>{score}</Text> : null}
                    {img && <Image source={img} style={{
                        width: scaleSize(47), height: scaleSize(47),
                        alignSelf: 'center'
                    }}/>}
                    {str ? <Text style={{
                        fontSize: px2dp(PlatfIOS ? 14 : 12),
                        paddingTop: scaleSize(8), color: 'gray',
                    }}>{str}</Text> : null}
                </View>
            </ATouchableHighlight>)
    }

    loginAfter() {
        this.MyHeader && this.MyHeader.getWrappedInstance().setUserInfo()
    }

    itemActionIndex(position, title, name, that) {/*条目点击事件*/
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        this.setState({
            isJpush: false
        });
        switch (position) {
            // case 3://如果有其他的不同的地方。请在这里写
            //     navigate("Demo", {
            //         title: 'Demo'
            //     });
            //     break;
            case 7://分享
                this.setModalVisible(true);
                break;
            case 8://打电话
                this.customPhone &&
                MobileAlerts('拨打客服电话？', this.customPhone, () => {
                    Linking.openURL("tel:" + this.customPhone)
                });
                break;
            case 1:
                // this.props.callbackParent(3);
                AsyncStorage.setItem(NOMESSAGECOUNT, JSON.stringify(0));
                if (Platform.OS === 'android') {
                    //如果 是Android 那么我们在跳转聊天的时候，判断未读消息是否有，如果有直接对lauchicon上的小红点数量进行替换
                    AsyncStorage.getItem(AndroidBadge, (error, res) => {
                        let badge = res ? JSON.parse(res) : 0;
                        if (this.state.messageIsReadCount > 0) {
                            badge = badge - this.state.messageIsReadCount;
                            badge = (badge > 0 ? badge : 0);
                        }
                        BadgeAndroid.setBadge(badge);
                        AsyncStorage.setItem(AndroidBadge, JSON.stringify(badge));
                    });
                    JPushModule.clearAllNotifications();
                }
            default:
                isLoginIn ?
                    InteractionManager.runAfterInteractions(() => {
                        navigate(name, {
                            name: name,
                            title: title,
                            callBack: name === 'MyMessage' ? () => this.refreshView() : name === 'MyChatMsgList' ? () => this.getSiLiaoUnRead() : () => null,
                            callbackParent: name === 'CollectionView' ? this.props.callbackParent : () => null
                        })
                    })
                    : LoginAlerts(that.props.navigation, {
                        callback: () => {
                            this.MyHeader && this.MyHeader.getWrappedInstance().setUserInfo()
                        }
                    });
                break;
        }
    }

    itemRow(onPressIndex, title, titleInfo, icon, name, count = 0) {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let that = this;
        return (
            <CommonMineItemView
                pushTodetail={() => that.itemActionIndex(onPressIndex, title, name, that)}
                title={title}
                detailTitle={titleInfo}
                isReadCount={isLoginIn ? count : 0}
                leftImage={icon}
                isJpush={this.state.isJpush}
            />
        )
    }

    callback(item) {
        this.props.callbackParent(item);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: Platform.OS === 'ios' ? deviceHeight - 37 : deviceHeight - 50,
        backgroundColor: "white"
    },

    topViewStyle: {
        width: deviceWidth,
        height: Platform.OS === 'ios' ? 150 : 100,
        backgroundColor: BGTextColor,
        flexDirection: 'row',
        padding: 10
    },

    topLeftViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Platform.OS === 'ios' ? 30 : 10
    },

    topRightViewStyle: {
        marginLeft: 10,
        justifyContent: 'center',
        width: deviceWidth - 120
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        loginAction: bindActionCreators(LoginAction, dispatch),
        meAction: bindActionCreators(MeAction, dispatch)
    }), null, {withRef: true}
)(MeView);