/**
 * Created by Monika on 2018/08/22.
 */
import React, {Component} from "react";
import {
    ActivityIndicator,
    Clipboard,
    DeviceEventEmitter,
    Dimensions,
    Image,
    Keyboard,
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    View
} from "react-native";

import {Images, StringData} from "../../../../themes";

import BaseListView from "../../../../chat/view/BaseListView";
import {
    _,
    BGColor,
    bindActionCreators,
    connect,
    Loading,
    LoginAlerts,
    PlatfIOS,
    toastShort
} from "../../../../common/CommonDevice";
import ShowCopyModal from "../../../discuss/ShowCopyModal";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";
import * as ChatMsgAction from "../../../../actions/ChatMsgAction";
import JPushModule from "jpush-react-native";
import {px2dp, randomID} from "../../../../common/CommonUtil";
import CustomMsgView from "../../../CustomMsgView";
import CustomCustomerInput from "../../../CustomCustomerInput";
import {pushToHomeDetail} from "../../../home/HomeJumpUtil";
import {scaleSize} from "../../../../common/ScreenUtil";
import NavigatorView from "../../../../component/NavigatorView";
import {_renderActivityIndicator} from "../../../../component/CommonRefresh";

let BadgeAndroid = (Platform.OS === 'ios' ? '' : require('react-native-android-badge'));

const dismissKeyboard = require('dismissKeyboard');

const {width, height} = Dimensions.get('window');
let pageSize = 10;
let page = 1;

class ChatMsgView extends Component {
    keyboardDidShow = (e) => {
        // Animation chatTypes easeInEaseOut/linear/spring
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        let newSize = (width < height ? height : width) - e.endCoordinates.height;
        this._isMounted && this.setState({
            keyboardHeight: e.endCoordinates.height,
            visibleHeight: newSize,
        })
    };
    keyboardDidHide = (e) => {
        // Animation chatTypes easeInEaseOut/linear/spring
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this._isMounted && this.setState({
            keyboardHeight: 0,
            visibleHeight: width < height ? height : width
        })
    };
    back = () => {
        const {state, goBack} = this.props.navigation;
        if (state.params && state.params.callback) {
            state.params.callback();
        }
        goBack();
    };

    constructor(props) {
        super(props);
        this.state = {
            height: 34,
            modalVisible: false,
            txtCopy: '',
            autoScroll: true,
            visibleHeight: width < height ? height : width,
        };
        this._isMounted;
        this.subscription = DeviceEventEmitter.addListener('ChatRefresh', () => {
            if (!PlatfIOS) {
                JPushModule.clearAllNotifications();
            }
        });
        let params = this.props.navigation.state.params;
        // this.personObj = params.personObj;
        this.personId = params.personId;
    }

    // ------------ lifecycle ------------
    componentDidMount() {
        this._isMounted = true;
        // this.props.navigation.setParams({
        //     navigatePress: this.back,
        // });
        // if (this.personObj) {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        this.props.chatMsgAction.fetchSetChatKey(`${userObj.userid}-${this.personId}`);
        this.requestFirst(1);
        // } else {
        //     this.getLoading() && this.getLoading().show();
        //     getHomeUserWithCertifiedData({id: this.personId}, 0, (res) => {
        //         this.getLoading() && this.getLoading().dismiss();
        //         this.requestFirst(1);
        //         this.personObj = res;
        //     }, () => {
        //         this.props.navigation.goBack()
        //         this.getLoading() && this.getLoading().dismiss()
        //     });
        // }

        this.initIntervalID = setInterval(() => {
            this.requestFirst();
        }, 8 * 1000);
    }

    requestFirst(option) {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        if (isLoginIn) {
            setTimeout(() => {
                this._isMounted && this.setState({isRefreshing: true});
                this.refs['baselist'] && this.refs['baselist'].refs['list'].scrollToEnd();
            }, 1000);

            this.requestNetWork(1, 1);
        } else {
            LoginAlerts(this.props.navigation, {
                callback: () => this.requestNetWork(1, 1)
            })
        }
    }

    requestNetWork(pageIndex, type) {
        let {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let data = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            toId: this.personId
        };
        this.props.chatMsgAction.fetchChatMsgList(data, this.props.navigation, type);
    }

    componentWillMount() {
        // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
        // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
        if (Platform.OS === 'ios') {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide)
        } else {
            // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
            // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
        }
    }

    componentWillUnmount() {
        // this.back();
        this.clearTime();
        this._isMounted = false;
        if (Platform.OS === 'ios') {
            JPushModule.setBadge(0, (cb) => {
            })
        } else {
            BadgeAndroid.setBadge(0);
        }
        let {state} = this.props.navigation;
        state.params.callback && state.params.callback();
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener && this.keyboardDidHideListener.remove()
    }

    clearTime() {
        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
            this.timeoutID = undefined;
        }
        if (this.initIntervalID) {
            clearInterval(this.initIntervalID);
            this.initIntervalID = undefined;
        }
    }

    handleRefresh() {
        this._isMounted && this.setState({isRefreshing: true, autoScroll: false});
        page++;
        this.requestNetWork(page, 2);
        setTimeout(() => {
            this._isMounted && this.setState({isRefreshing: false});
            this.refs['baselist'].refs['list'].scrollTo({y: 0, animated: !this.state.isRefreshing});
        }, 1000)
    }

    handleFocusSearch() {
        this._isMounted && this.setState({
            autoScroll: true,
        })
    }

    handleSend(value, temp = [], callback) {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        if (!value || !value.trim()) return;
        let obj = temp.length > 0 ? JSON.stringify({content: value.trim(), data: temp}) : value.trim();

        this.props.chatMsgAction.fetchSendChatMsg({toId: this.personId, content: obj},
            this.props.navigation);
        this._isMounted && this.setState({
            height: 34,
            autoScroll: true
        });
        callback();
    }

    _renderRow(rowData) {//rowId
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        if (rowData.toId !== userObj.userid) {
            return this._renderRightRow(rowData)
        } else {
            return this._renderLeftRow(rowData)
        }
    }

    _renderRightRow(rowData) {
        return this._renderRightTxt(rowData)
    }

    _renderRightTxt(rowData = {}) {
        let {ctime, content} = rowData;
        const loading = rowData.status === 'sending' ? (
            <ActivityIndicator style={{
                margin: 3, alignItems: 'center',
                justifyContent: 'center',
            }} size="small" color={'rgba(50,140,210,1)'}/>
        ) : null;
        const {isLoginIn, userObj: {logo, userid, logoUrl}, domainObj} = this.props.state.Login;
        console.log("-534534--------------", logo, logoUrl);
        return (//resizeMode='cover'
            <View style={[styles.row, styles.directionEnd]}>
                <Image source={logo ? {uri: logo} : Images.discussDefaultHead} resizeMode='cover'
                       style={[styles.rowLogo, styles.rowLogoRight]}/>
                <View style={styles.rowMessage}>
                    <ATouchableHighlight
                        onLongPress={!PlatfIOS ? () => this.showCopy(true, content, true) : null}>
                        <View style={[styles.message, styles.messageRight]}>
                            <Text selectable={PlatfIOS}
                                  style={[styles.messageText, styles.messageTextRight]}>{content}</Text>
                        </View>
                    </ATouchableHighlight>
                    <Text style={[styles.timeText, styles.textRight]}>{ctime}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    width: 28,
                    height: 20,
                    alignSelf: 'center',
                    marginRight: 5,
                    marginBottom: 5
                }}>
                    {loading}
                </View>
            </View>
        )
    }

    showCopy(isCopy, txt, visible) {
        if (isCopy) {
            this._isMounted && this.setState({
                modalVisible: visible,
                txtCopy: txt
            });
        } else {
            toastShort(StringData.noCopyText)
        }
    }

    onLongPressCopyClipboard(txt) {
        if (txt) {
            Clipboard.setString(txt.toString());
            toastShort("已复制");
            this.showCopy(true, '', false);
        }
    }

    _renderLeftRow(rowData) {
        return this._renderLeftTxt(rowData)
    }

    _renderLeftTxt(rowData = {}) {
        let {ctime, content} = rowData;
        let obj, isContain;
        if (content.indexOf('{') > -1 && content.indexOf("}") > -1) {
            obj = JSON.parse(content);
            isContain = typeof obj === "object" && obj.data.length > 0;
        }
        const {resObj, currentChatKey} = this.props.state.ChatMsg;
        let tempObj = resObj[currentChatKey] || {};
        let {personObj: {nickname, certifiedType, logo}} = tempObj;
        return (
            <View style={styles.row}>
                <Image source={logo ? {uri: logo} : Images.discussDefaultHead}
                       resizeMode='cover'
                       style={[styles.rowLogo, {marginRight: 5,}]}/>
                <View style={styles.rowMessage}>
                    <ATouchableHighlight
                        onLongPress={!PlatfIOS ? () => this.showCopy(!isContain, content, true) : null}>
                        <View style={styles.message}>
                            {isContain ?
                                <CustomMsgView
                                    ref="CustomViews"
                                    chainColor="rgba(50,140,210,1)"
                                    key={obj.content + randomID()}
                                    value={obj.content}
                                    onClick={(type, str) => this.onClick(type, str, obj.data)}
                                /> :
                                <Text selectable={PlatfIOS}
                                      style={styles.messageText}>{content}</Text>}
                        </View>
                    </ATouchableHighlight>
                    <Text style={styles.timeText}>{ctime}</Text>
                </View>
            </View>
        );
    }

    onClick(type, str, data) {
        const {navigate} = this.props.navigation;
        let arrayFilter = data.filter(function (item) {
            return item.content.trim() === str.trim();
        });
        let obj = arrayFilter[0];
        // console.log(type, str, data);
        switch (type) {
            case "chain":
                pushToHomeDetail(navigate, obj, "", 0);
                // alert(JSON.stringify(obj))
                break;
            default:
                break;
        }
    }

    _renderMessageBar() {
        const {value = ''} = this.state;
        return (
            <CustomCustomerInput
                {...this.props}
                // value = {this.state.value}
                handleSend={(value, data, callback) => this.handleSend(value, data, callback)}
                // handleChangeText = {(v)=>{this.setState({value:v})}}
                handleFocusSearch={this.handleFocusSearch.bind(this)}
            />
        )
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        const {keyboardHeight} = this.state;
        const {messageListObj, currentChatKey, resObj} = this.props.state.ChatMsg;
        let messageList = messageListObj[currentChatKey] || [];
        let personObj = resObj[currentChatKey] && resObj[currentChatKey].personObj || {};
        if (personObj.nickname) {
            return (
                <View style={[styles.container, {flex: 1, flexDirection: 'column'}]}>
                    {personObj.nickname && <NavigatorView
                        {...this.props}
                        contentTitle={personObj.nickname ? personObj.nickname : ''}
                        // onTitleOnPress={()=>{
                        //     this.scollToTop()
                        // }}
                    />}
                    {!_.isEmpty(messageList) ? <BaseListView
                        ref={"baselist"}
                        autoScroll={this.state.autoScroll}
                        data={messageList}
                        handleRefresh={this.handleRefresh.bind(this)}
                        renderRow={(rowData) => this._renderRow(rowData)}
                        renderSeparator={() => null}
                    /> : <View style={{
                        flex: 1,
                        backgroundColor: '#EBEBEB',
                    }}/>}
                    {this._renderMessageBar()}
                    <ShowCopyModal
                        modalVisible={this.state.modalVisible}
                        list={['复制']}
                        onPress={(pos = -1) => {
                            switch (pos) {
                                case 0:
                                    this.onLongPressCopyClipboard(this.state.txtCopy);
                                    break;
                                default:
                                    break;
                            }
                            this.setState({
                                modalVisible: false,
                            });
                        }}
                    />
                    <Loading ref={'loading'}/>
                    <View style={{height: keyboardHeight}}/>
                </View>
            )
        } else {
            return (
                <View style={{flex: 1, alignItems: "center", justifyContent: 'center'}}>
                    {_renderActivityIndicator()}
                </View>
            )
        }

    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: BGColor
    },
    // message left
    row: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 10,
    },
    rowLogo: {
        width: scaleSize(60),
        height: scaleSize(60),
        borderRadius: scaleSize(10)
    },
    rowImage: {},
    rowLogoRight: {
        marginLeft: scaleSize(10)
    },
    rowMessage: {},

    message: {
        maxWidth: 250,
        borderRadius: 8,
        backgroundColor: 'white',
        padding: 8,
    },

    messageRight: {
        backgroundColor: 'rgba(50,140,210,1)'
    },
    messageText: {
        color: 'rgba(12, 18, 24, 1)',
        paddingBottom: scaleSize(4),
    },
    messageTextRight: {
        color: 'white'
    },
    timeText: {
        // ...Fonts.normal,
        fontSize: px2dp(11),
        color: 'rgba(112, 126, 137, 1)',
        marginTop: 3,
        marginLeft: 6,
    },
    directionEnd: {
        flexDirection: 'row-reverse'
    },
    textRight: {
        textAlign: 'right',
        marginRight: scaleSize(15)
    },

});


export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        chatMsgAction: bindActionCreators(ChatMsgAction, dispatch),
    })
)(ChatMsgView);