/**问题Tab
 * Created by Monika on 2017/6/26.
 */
import React, {Component} from "react";
import {Alert, DeviceEventEmitter, ScrollView, StyleSheet, Text, View} from "react-native";

import {
    _,
    BGColor,
    BGTextColor,
    bindActionCreators,
    connect,
    deviceHeight,
    deviceWidth,
    LoginAlerts,
    PlatfIOS,
    px2dp,
    Sizes,
    toastShort
} from "../../common/CommonDevice";
import MyQuestion from "./MyQuestion1";
import AskMeQuestion from "./AskMeQuestion1";
import NavigatorView from "../../component/NavigatorView";
import *as QuestionAction from "../../actions/QuestionAction";
import *as LoginAction from "../../actions/LoginAction";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import HotRecommendationView from './HotRecommendationView'
import {unReadChatMsg} from '../../dao/ChatCustomDao'
import {StringData} from "../../themes";
import {NoDataView} from "../../component/CommonAssembly";
import {CircleSuspend} from "../../component/CircleSuspend";

let isRefresh = true;
let page = 1;
let pageSize = 10;

class InterlocutionView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectItem: 'first',
            isHidden: true,
            selectIndex: 1,
            MsgCount: 0
        };
        this._isMounted;
        this.subscription = DeviceEventEmitter.addListener('ChatMsg', (status) => {
            this.setState({MsgCount: 0})
        });
    }

    componentDidMount() {
        this._isMounted = true;
        // this.loadNetWork(0)
        // this.getUserInfoData();
        // this.initIntervalID = setInterval(() => {
            this.getUserInfoData();
        // }, 30 * 1000);
    }

    // loadNetWork(option) {
    //     const {navigate} = this.props.navigation;
    //     if (page > 1) {
    //         page = 1
    //     }
    //
    //     let data = {
    //         "pageIndex": 1,
    //         "pageSize": pageSize,
    //     };
    //
    //     this.props.QuestionAction.fetchQuestionList(data, navigate, false, true, false, true, 'hotRecommendKey')
    // }

    // componentWillReceiveProps(nextProps) {
    //     console.log('this.state.selectIndex ', this.state.selectIndex)
    //     console.log('nextProps.state.Question.hotQuestionList ', nextProps.state.Question.hotQuestionList)
    //     // if (this.state.selectIndex == 1) {
    //     if (this.state.selectIndex == 1 && _.isEmpty(nextProps.state.Question.hotQuestionList['hotRecommendKey'])) {
    //         this.setState({
    //             selectItem: 'second',
    //             isHidden: true
    //         })
    //     } else{
    //             this.setState({
    //                 selectItem: 'first',
    //                 isHidden: false
    //             })
    //         }
    //
    // }

    componentWillReceiveProps(nextProps) {
        if (this.state.selectIndex == 1) {
            if (_.isEmpty(nextProps.state.Question.questionObj['hotRecommendKey'])) {
                this.setState({
                    selectedIndex: 2,
                    selectItem: 'second',
                    isHidden: true,
                })
            } else {
                this.setState({
                    selectedIndex: 1,
                    selectItem: 'first',
                    isHidden: false,
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getUserInfoData() {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        if (isLoginIn) {
            let data = {"userId": userObj.userid};
            unReadChatMsg(data, 0, (res) => {
                if (this._isMounted) {
                    this.setState({
                        MsgCount: res
                    })
                }
            }, (err) => {
            })
        }
    }

    render() {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        return (
            <View style={styles.container}>
                <NavigatorView
                    {...this.props}
                    // leftImageSource={false}
                    contentTitle='问答'
                    rightTitle={isLoginIn ? '私信' : ''}
                    rightMsgCount={this.state.MsgCount}
                    onRightPress={() => this.pushToView(1)}
                />
                {isLoginIn ?
                    <View>
                        <ScrollView
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            horizontal={true}
                            style={[styles.topViewStyle, {flexDirection: 'row'}]}>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: deviceWidth,
                                flexDirection: 'row'
                            }}>
                                {this.state.isHidden ? null : this.commonTopView(() => this.setState({
                                    selectItem: 'first',
                                    selectIndex: 1
                                }), 'first', '热门推荐')}
                                {this.commonTopView(() => this.setState({
                                    selectItem: 'second',
                                    selectIndex: 2
                                }), 'second', '我的问题')}
                                {this.commonTopView(() => this.setState({
                                    selectItem: 'three',
                                    selectIndex: 3
                                }), 'three', '@我的')}

                            </View>
                        </ScrollView>
                        <View style={{height: deviceHeight - 72}}>
                            {this.justToView()}
                        </View>

                        <CircleSuspend
                            {...this.props}
                            text="提问"
                            style={styles.positionViewStyle}
                            onPress={() => this.pushToView()}
                        />


                    </View>
                    :
                    <NoDataView title={StringData.noLoginText} type={1} onPress={() => this.pushToLoginView()}/>
                }
            </View>
        )
    }

    onRightPress() {
        const {navigate} = this.props.navigation;
        navigate('ChatCustom', {
            name: "ChatCustom",
            title: '客服',
            callback: this.callBack.bind(this)
        })
    }

    callBack() {
        this.getUserInfoData()
    }


    commonTopView(onPress, item, name) {
        return (
            <ATouchableHighlight onPress={onPress}>
                <View
                    style={[styles.topBoxViewStyle, {borderBottomColor: this.state.selectItem == item ? BGTextColor : 'transparent'}]}>
                    <Text style={{
                        fontSize: px2dp(PlatfIOS ? Sizes.listSize : Sizes.searchSize),
                        fontWeight: this.state.selectItem == item ? 'bold' : 'normal'
                    }}>{name}</Text>
                </View>
            </ATouchableHighlight>
        )
    }

    justToView() {
        switch (this.state.selectItem) {
            case 'first':
                return (
                    <HotRecommendationView
                        ref={(hot) => {
                            this.HotRecommendationView = hot
                        }}
                        {...this.props}
                    />
                );
                break;
            case 'second':
                return (
                    <MyQuestion
                        ref={(res) => {
                            this.MyQuestion = res
                        }}
                        {...this.props}
                    />
                );
                break;
            case 'three':
                return (
                    <AskMeQuestion
                        ref={(res) => {
                            this.AskMeQuestion = res
                        }}
                        {...this.props}
                    />
                );
                break;
            default:
                break;
        }
    }

    pushToLoginView() {
        const {navigate} = this.props.navigation;
        navigate('LoginView', {
            title: '登录',
            rightTitle: '注册',
        })
    }

    pushToView(type) {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        if (type) {
            if (!isLoginIn) {
                LoginAlerts(this.props.navigation)
            } else {
                this.onRightPress()
            }
        } else {
            this.commonView(userObj)
        }
        // }
    }

    commonView(item) {
        let str = '.*[1]\\d{10}.*';
        if (item.nickname) {
            if (item.nickname.match(str)) {
                Alert.alert('必须先修改昵称才能进行提问', '是否现在去修改昵称',
                    [{text: '否', onPress: () => console.log('')},
                        {text: '是', onPress: () => this.pushToDetail(item)}])
            } else {
                const {navigate} = this.props.navigation;
                navigate('PutQuestions', {
                    title: '提问',
                    rightTitle: '发布',
                    leftTitle: '取消',
                    type: 1
                })
            }
        } else {
            Alert.alert('暂无昵称，不能进行提问', '是否现在去修改昵称',
                [{text: '否', onPress: () => console.log('')},
                    {text: '是', onPress: () => this.pushToDetail(item)}])
        }
    }

    pushToDetail(item) {
        const {navigate} = this.props.navigation;
        navigate('ModifyMeHeaderView', {
            title: '修改昵称',
            rightTitle: '保存',
            name: item.nickname,
            callback: () => this.getUserInfoData()
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
    },
    view_content: {
        marginTop: 8,
        backgroundColor: 'red',
    },
    listView: {},

    topViewStyle: {
        width: deviceWidth,
        height: 40,
        flexDirection: 'row',
        marginTop: 1,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#rgba(219,224,230,1)',
    },

    topBoxViewStyle: {
        borderBottomWidth: 2,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 25,
    },

    topTextStyle: {
        fontSize: px2dp(PlatfIOS ? 16 : 14)
    },
    positionViewStyle: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        position: 'absolute',
        bottom: 140,
        right: 10,
        backgroundColor: BGTextColor,
        alignItems: 'center',
        justifyContent: 'center'
    },

    lTimeScrollView: {},

    radiusButtonView: {
        width: 7,
        height: 7,
        backgroundColor: 'white',
        position: 'absolute',
        right: 16,
        top: -3,
        borderRadius: 3.5
    },

});
export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        QuestionAction: bindActionCreators(QuestionAction, dispatch),
        loginAction: bindActionCreators(LoginAction, dispatch)
    })
)(InterlocutionView);
