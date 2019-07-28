/**
 * Created by Monika on 2017/11/28.
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
    PixelRatio,
    Platform,
    StyleSheet,
    Text,
    View
} from "react-native";

import {Images,StringData} from "../../themes";

import BaseListView from "../../chat/view/BaseListView";
import {BGColor, bindActionCreators, connect, Loading, PlatfIOS, toastShort} from "../../common/CommonDevice";
import ShowCopyModal from "../discuss/ShowCopyModal";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {readChatMsg} from '../../dao/ChatCustomDao'
import * as ChatCustomAction from "../../actions/ChatCustomAction";
import JPushModule from "jpush-react-native";
import {px2dp, randomID} from "../../common/CommonUtil";
import CustomMsgView from "../CustomMsgView";
import CustomCustomerInput from "../CustomCustomerInput";
import {pushToHomeDetail} from "../home/HomeJumpUtil";

let BadgeAndroid = (Platform.OS === 'ios' ? '' : require('react-native-android-badge'));

const dismissKeyboard = require('dismissKeyboard');

const {width, height} = Dimensions.get('window');
let pageSize = 10;
let page = 1;
let count = 0;
let messageArray = [];

class ChatCustom extends Component {
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
    }

    // ------------ lifecycle ------------
    componentDidMount() {
        this._isMounted = true;
        this.props.navigation.setParams({
            navigatePress: this.back,
        });
        this.requestFirst(1);
        this.initIntervalID = setInterval(() => {
            this.requestFirst();
        }, 8 * 1000);
    }

    requestFirst(option) {
        setTimeout(() => {
            this._isMounted && this.setState({isRefreshing: true});
            this.refs['baselist'] && this.refs['baselist'].refs['list'].scrollToEnd();
        }, 1000);
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        if (isLoginIn) {
            this.requestNetWork(1, 1);
            option && this.setRead(userObj.userid)
        }
    }

    setRead(userid) {
        let datas = {"userId": userid};
        readChatMsg(datas, 0, (res) => {
        }, (err) => {
        });
    }

    requestNetWork(pageIndex, type) {
        let {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let data = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            fromId: userObj.userid
        };
        this.props.chatCustomAction.fetchMessageList(data, this.props.navigation, type);
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
        this.back();
        this.clearTime();
        this._isMounted = false;
        if (Platform.OS === 'ios') {
            JPushModule.setBadge(0, (cb) => {
            })
        } else {
            BadgeAndroid.setBadge(0);
        }
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
        this.props.chatCustomAction.fetchSendMessage(userObj.userid,
            obj,
            this.props.navigation);
        this._isMounted && this.setState({
            height: 34,
            autoScroll: true
        });
        callback();
    }

    _renderRow(rowData) {//rowId
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        if (rowData.fromId === userObj.userid) {
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
        return (//resizeMode='cover'
            <View style={[styles.row, styles.directionEnd]}>
                <Image source={Images.userQuiz} resizeMode='cover' style={[styles.rowLogo, styles.rowLogoRight]}/>
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
        return (
            <View style={styles.row}>
                <Image source={Images.customQuiz} resizeMode='cover' style={[styles.rowLogo, {marginRight: 5,}]}/>
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
                                <Text selectable={PlatfIOS ? true : false}
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
        const {messageList} = this.props.state.ChatCustom;
        return (
            <View style={[styles.container, {flex: 1, flexDirection: 'column'}]}>
                <BaseListView
                    ref={"baselist"}
                    autoScroll={this.state.autoScroll}
                    data={messageList}
                    handleRefresh={this.handleRefresh.bind(this)}
                    renderRow={(rowData) => this._renderRow(rowData)}
                    renderSeparator={() => null}
                />
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
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: BGColor
    },

    topViewStyle: {
        width: width,
        height: 64,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    search: {
        marginTop: 5,
        flexDirection: 'column',
        // padding: 10,
        backgroundColor: 'white',
        borderTopWidth: PixelRatio.roundToNearestPixel(0.4),
        borderTopColor: 'rgba(173, 185, 193, 0.5)'
    },

    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 4,
        paddingBottom: 2,
        paddingHorizontal: 12,
        borderBottomWidth: PixelRatio.roundToNearestPixel(0.4),
        borderBottomColor: 'rgba(173, 185, 193, 0.5)'
    },
    iconTouch: {
        padding: 8,
    },

    searchIcon: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    searchFocus: {
        flex: 0,
        width: 20,
        alignItems: 'center'
    },

    searchPlus: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // message left
    row: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 10,
    },
    rowLogo: {
        width: Platform.OS === 'ios' ? 35 : 25,
        height: Platform.OS === 'ios' ? 35 : 25,
        borderRadius: Platform.OS === 'ios' ? 17.5 : 12.5
    },
    rowImage: {},
    rowLogoRight: {
        marginLeft: 5
    },
    rowMessage: {},
    nameText: {
        // ...Fonts.normal,
        fontSize: px2dp(11),
        color: 'rgba(64, 94, 122, 1)',
        marginLeft: 12,
        marginBottom: 7
    },
    message: {
        maxWidth: 250,
        borderRadius: 8,
        backgroundColor: 'white',
        padding: 8,
    },
    messageImage: {
        width: 250,
        backgroundColor: 'transparent',
        padding: 0
    },
    messageRight: {
        backgroundColor: 'rgba(50,140,210,1)'
    },
    messageText: {
        color: 'rgba(12, 18, 24, 1)',
        paddingBottom: 2,
        // textAlign: 'center'
        // textAlignVertical: 'center'
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
        marginRight: 8
    },
    wrapper: {
        backgroundColor: '#e8ebef'
    },
    slide: {
        height: 120,
        paddingTop: 5,
        paddingHorizontal: 11,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        flexWrap: 'wrap'
    },
    slideRow: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 30,
    },
    sendRow: {
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },

    send: {
        marginRight: 12,
        paddingVertical: 8,
        width: 50,
    }
});


export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        chatCustomAction: bindActionCreators(ChatCustomAction, dispatch),
    })
)(ChatCustom);