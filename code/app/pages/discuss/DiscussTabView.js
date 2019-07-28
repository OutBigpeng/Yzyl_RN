/**
 * 发现 操作第一个View
 * Created by Monika on 2018/7/16.
 */


'use strict';
import React, {Component} from "react";
import {Alert, Image, StyleSheet, Text, View} from "react-native";
import {
    BGColor,
    bindActionCreators,
    connect,
    deviceWidth,
    Loading,
    LoginAlerts,
    PlatfIOS,
    px2dp
} from "../../common/CommonDevice";
import {getSysDictionaryData} from "../../dao/SysDao";
import NavigatorView from "../../component/NavigatorView";
import DiscussListView from "./DiscussListView";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {NoDataView} from "../../component/CommonAssembly";
import {StringData} from "../../themes";
import SendBeforeModal from "./SendBeforeModal";
import * as DiscussAction from "../../actions/DiscussAction";
import SelectTabShowModal from "./SelectTabShowModal";
import {scaleSize} from "../../common/ScreenUtil";
import * as MeAction from "../../actions/MeAction";
import {getDiscussNotice} from "../../dao/DiscussDao";
import Images from "../../themes/Images";
import * as LoginAction from "../../actions/LoginAction";
import FromStart from "./FromStart";

let tabData = [{keyName: '', keyValue: '全部'}, {keyName: 'qa', keyValue: '悬赏问答'},];
const headData = [{keyName: '', keyValue: '全部', icon: ''},
    {
        keyName: 'dynamics',
        keyValue: '动态',
        icon: require('../../imgs/discuss/discuss_icon.png')
    },
    {keyName: 'job', keyValue: '求职', icon: require('../../imgs/discuss/job_icon.png')},
    {keyName: 'recruit', keyValue: '招聘', icon: require('../../imgs/discuss/recruit_icon.png')},
    {keyName: 'buy', keyValue: '求购', icon: require('../../imgs/discuss/buy_icon.png')},
    {keyName: 'supply', keyValue: '供应', icon: require('../../imgs/discuss/supply_icon.png')},
];


class DiscussTabView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedHead: headData[0].keyName,
            selectedHeadValue: headData[0].keyValue,
            selectedHeadPos: 0,
            modalVisible: false,
            selectTabmodalVisible: false,
            isNetWork: true,
            isPushMsg: false,
            noticeObj: {}
        };
        this._isMounted;
    };

    componentDidMount() {
        this._isMounted = true;
        this.getNetWork(1)
    }

    getNetWork(option) {
        if (!option) {
            this.getLoading().show()
        }
        getSysDictionaryData({"parentKey": "messageType"}, (res) => {
            !option && this.getLoading().dismiss();
            this._isMounted && this.setState({
                isNetWork: true,
            }, () => {
            });
        }, () => {
            this._isMounted && this.setState({
                isNetWork: false
            });
            !option && this.getLoading().dismiss()
        });
        setTimeout(() => {
            this.getNoticeMsg();
        }, 500);
        this._isMounted && setInterval(() => {
            this.getNoticeMsg();
        }, 20000)
    }

    getNoticeMsg() {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        isLoginIn && getDiscussNotice((res) => {
            // {  "logo":"http://avatar.qntest.youzhongyouliao.com/ece7f440-d1c0-43fc-913d-2dd22c50da20.jpeg",
            // "unReadCount":3}
            let {unReadCount = 0} = res;
            if (unReadCount * 1 > 0) {
                this.setState({
                    isPushMsg: true,
                    noticeObj: res
                });
            }
        }, () => {
        })
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let {noticeObj: {logo = '', unReadCount = 0}, selectedHead = '', modalVisible, selectTabmodalVisible, selectedHeadValue = '', selectedHeadPos, isNetWork, isPushMsg} = this.state;
        let listHead = selectedHeadPos === 0 ? selectedHead : 'qa';
        let listHeadV = selectedHeadPos === 0 ? selectedHeadValue : '问答';
        return (
            <View style={styles.container}>
                {isNetWork ? <NavigatorView
                    {...this.props}
                    leftImageSource={true}
                    contentTitleView={() => this.setContentTitleView()}
                    rightTitle={'发布'}
                    leftTitle={'我的'}
                    leftOnPress={() => this.pushToView(1)}
                    onTitleOnPress={() => {
                        this.getListRefView().scollToTop();
                    }}
                    onRightPress={() => this.pushToView(2)}
                /> : <View/>}
                {isPushMsg && <View style={{
                    height: scaleSize(150),
                    alignItems: 'center',
                    justifyContent: "center",
                    backgroundColor: 'white'
                }}>
                    <ATouchableHighlight onPress={() => {
                        const {navigate} = this.props.navigation;
                        this.setState({
                            isPushMsg: false
                        }, () => {
                            navigate('DiscussMessage', {
                                title: '消息',
                                callback: () => {
                                    this.setState({
                                        isPushMsg: false
                                    })
                                }
                            })
                        })
                    }}>
                        <View style={{
                            backgroundColor: '#575757',
                            borderRadius: scaleSize(5),
                            paddingRight: scaleSize(30),
                            paddingVertical: scaleSize(20),
                            flexDirection: "row",
                            alignItems: 'center'
                        }}>
                            <Image source={logo ? {uri: logo} : Images.discussDefaultHead} style={{
                                width: scaleSize(40),
                                height: scaleSize(40),
                                marginHorizontal: scaleSize(20)
                            }}/>
                            <Text style={{color: 'white'}}>{`您有${unReadCount}新消息`}</Text>
                        </View>
                    </ATouchableHighlight>
                </View>}
                {isNetWork ?
                    <DiscussListView
                        ref={listHead}
                        key={listHead}
                        {...this.props}
                        tabType={listHead}
                        tabTypeValue={listHeadV}
                    />
                    : this.noDataView()
                }
                {modalVisible && <SendBeforeModal
                    modalVisible={modalVisible}
                    onPress={(pos, item) => {
                        if (pos !== undefined) {
                            switch (pos) {
                                case 1://问答
                                    const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
                                    let {myScore = 0} = this.props.state.Me;
                                    if (myScore > 0) {
                                        this.jumpSend(item);
                                    }else {
                                        this.getLoading().show();
                                        isLoginIn && this.props.meAction.fetchMyScore((res) => {
                                            this.getLoading().dismiss();
                                            this.jumpSend(item);
                                        });
                                    }
                                    break;
                                case 0://动态
                                default:
                                    this.jumpSend(item);
                                    break;
                            }
                        }
                        this._isMounted && this.setState({
                            modalVisible: false,
                        });
                    }}
                />}
                {selectTabmodalVisible && <SelectTabShowModal
                    modalVisible={selectTabmodalVisible}
                    list={headData}
                    selectHead={selectedHead}
                    onPress={(pos = -1, item) => {
                        if (pos < 0) {
                            this._isMounted && this.setState({
                                selectTabmodalVisible: false,
                            }, () => {
                            });
                        } else {
                            let {keyName = '', keyValue = ''} = item;
                            this._isMounted && this.setState({
                                selectedHead: keyName,
                                selectedHeadValue: keyValue,
                                selectTabmodalVisible: false,
                            }, () => {
                                this.props.actions.fetchDiscussSwitchTabType(keyName);
                                this.getListRefView().getNetwork(1, '', keyName);
                            });
                        }
                    }}
                />}
                {PlatfIOS && <FromStart {...this.props}/>}
                <Loading ref={'loading'}/>
            </View>
        );
    }

    noDataView() {
        return (
            <View style={{flex: 1}}>
                <NavigatorView
                    {...this.props}
                    contentTitle='发现'
                    leftImageSource={true}
                />
                <NoDataView title={StringData.noNetWorkText} onPress={() => this.getNetWork()} type={1}/>
            </View>
        )
    }

    pushToView(option = -1) {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        if (isLoginIn) {
            if (option === 1) {
                navigate('MyDiscussList', {
                    name: 'MyDiscussList',
                    title: '我的发布',
                    type: 'list',
                    callback: () => {
                        this.getListRefView().getNetwork(1);
                        let {selectedHead} = this.state;
                        tabData.map(({keyName, keyValue}, pos) => {
                            if (selectedHead !== keyName)
                                this.getListRefView().getNetwork(1, '', keyName);
                        });
                        this.getListRefView().scollToTop();
                    }
                })
            } else {
                this.commonView(userObj)
            }
        } else {
            this.jumpLogin();
        }
    }

    jumpLogin() {
        LoginAlerts(this.props.navigation, {
            callback: () => {
                console.log("........3333");
                // this.refreshView()
            }
        })
    }

    commonView(item) {
        let str = '.*[1]\\d{10}.*';
        let nickname = item.nickname || "";
        if (nickname) {
            let isCompany = item.certifiedType && item.certifiedType === 'undefined' && (nickname.indexOf('公司') > -1 || nickname.indexOf('厂') > -1);
            if (nickname.match(str) || isCompany) {
                this.setAlert('必须先修改昵称才能发布哦', '是否现在去修改昵称', item);
            } else {
                this._isMounted && this.setState({
                    modalVisible: true
                })
            }
        } else {
            this.setAlert('暂无昵称，不能发布', '是否现在去修改昵称', item)
        }
    }

    setAlert(title, content, item) {
        Alert.alert(title, content,
            [{text: '否', onPress: () => console.log('')},
                {text: '是', onPress: () => this.pushToDetail(item)}])
    }

    pushToDetail(item) {
        const {navigate} = this.props.navigation;
        navigate('ModifyMeHeaderView', {
            title: '修改昵称',
            rightTitle: '保存',
            name: item.nickname,
            callback: () => {
            }
        })
    }

    getListRefView() {
        let {selectedHeadPos, selectedHead} = this.state;
        return this.refs[selectedHeadPos === 1 ? 'qa' : selectedHead].getWrappedInstance();
    }

    jumpSend({keyName, keyValue}) {
        const {state, navigate} = this.props.navigation;
        navigate('SendContentView', {
            title: `发表-${keyValue}`,
            pageType: keyName,
            callback: () => {
                this.setState(Object.assign({
                    selectedHeadPos: keyValue === '问答' ? 1 : 0
                }, keyValue !== '问答' ? {selectedHead: keyName, selectedHeadValue: keyValue,} : {}), () => {
                    this.getListRefView().getNetwork(1, '', keyName);
                })
            }
        })
    }

    setContentTitleView() {
        let {selectedHead = '', selectedHeadPos, modalVisible, selectedHeadValue, selectTabmodalVisible} = this.state;
        return (
            <View style={{width: deviceWidth / 2, flexDirection: 'row', flex: 1,}}>
                {tabData.map(({keyName, keyValue}, pos) => {
                    return (
                        <ATouchableHighlight key={pos} style={{marginRight:scaleSize(10),
                            alignItems: pos===0?'flex-end':'flex-start', flex: 1, justifyContent: 'flex-end'
                        }} onPress={() => {
                            if (pos === 1) {//是问答
                                this.setSelectValue(pos, keyName);
                            } else {
                                if (selectedHeadPos === pos) {
                                    this._isMounted && this.setState({
                                        selectedHeadPos: pos,
                                        selectTabmodalVisible: !selectTabmodalVisible,
                                    });
                                } else {
                                    this.setSelectValue(pos, selectedHead);
                                }
                            }
                        }}>
                            <View style={[{alignItems: 'center',}]}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: scaleSize(PlatfIOS ? 14 : 15)
                                    }}>
                                    <Text numberOfLines={1} style={{
                                        fontSize: px2dp(16),
                                        color: selectedHeadPos === pos ? 'white' : '#ffffff88',
                                    }}>{pos === 0 ? selectedHeadValue : keyValue}</Text>
                                    {pos === 0 ? <Image source={require('../../imgs/discuss/Sort_Down_48px.png')}
                                                        style={{
                                                            width: scaleSize(40),
                                                            height: scaleSize(40),
                                                        }}/> : <View style={{height: scaleSize(40)}}/>}
                                </View>
                                {selectedHeadPos === pos ?
                                    <Image source={require('../../imgs/discuss/jt.png')}
                                           style={[{
                                               width: scaleSize(21),
                                               height: scaleSize(11),
                                           }, pos === 0 && {marginRight: scaleSize(40)}]}/> :
                                    <View style={{width: scaleSize(21), height: scaleSize(11)}}/>}
                            </View>
                        </ATouchableHighlight>
                    );
                })
                }
            </View>
        )
    }

    setSelectValue(pos, value) {
        this._isMounted && this.setState({
            selectedHeadPos: pos,
        }, () => {
            this.props.actions.fetchDiscussSwitchTabType(value);
        });
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
    },

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(DiscussAction, dispatch),
        meAction: bindActionCreators(MeAction, dispatch),
        loginAction: bindActionCreators(LoginAction, dispatch),
    }), null, {withRef: true}
)(DiscussTabView);