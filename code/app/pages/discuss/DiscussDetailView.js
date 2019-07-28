/**
 * Created by Monika on 2018/7/23.
 */

'use strict';
import React, {Component} from "react";
import {Clipboard, Dimensions, Platform, ScrollView, StyleSheet, View} from "react-native";
import {
    _,
    bindActionCreators, commentWord,
    connect,
    deviceWidth,
    Loading,
    LoginAlerts,
    PlatfIOS,
    toastShort
} from "../../common/CommonDevice";
import ChildItem from "./ChildItem";
import ChildTextInput from "./ChildTextInput";
import ShowCopyModal from "./ShowCopyModal";
import GridImageShow from "./GridImageShow";
import {getDiscussDetailMessage, getDiscussSaveComment} from "../../dao/DiscussDao";
import {scaleSize} from "../../common/ScreenUtil";
import * as DiscussAction from "../../actions/DiscussAction";
import * as LoginAction from "../../actions/LoginAction";
import Keyparcer from "react-native-keyboard-spacer";
import Toast from "react-native-root-toast";
import JPushModule from "jpush-react-native";
import NavigatorView from "../../component/NavigatorView";

let isSend = -1;//-1是初始值。是-1时是可以发布内容的。
let isLikeOption = -1;//-1是初始值。是-1时是可以点赞
let copyData = ['删除'];

const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];
const {width, height} = Dimensions.get('window');

class DiscussDetailView extends Component {

    // 构造
    constructor(props) {
        super(props);
        let {itemData, rowID, pageParams} = this.props.navigation.state.params;

        // 初始状态
        this.state = {
            imgModalVisible: false,
            copyModalVisible: false,
            modalVisible: false,
            showList: copyData,
            txtCopy: '',
            value: '',
            detailData: {},
            selectComment: {}//选中的要评论的对象
        };
    };

    componentDidMount() {//
        let {msgId, pageParams} = this.props.navigation.state.params;
        this.getLoading && this.getLoading().show();
        getDiscussDetailMessage({msgId}, this.props.navigation, (res) => {
            this.getLoading && this.getLoading().dismiss();
            this.props.actions.fetchDiscussDetailOption(pageParams, 'setData', res);
            this.setState({
                detailData: res,
                selectComment: res,
            }, () => {
            })
        }, () => {
            this.getLoading && this.getLoading().dismiss();
            toastShort("详情不存在或已被删除！！！", Toast.positions.CENTER);
            this.props.navigation.goBack()
        })
    }

    //键盘的方法
    _onStartShouldSetResponderCapture(event) {
        let target = event.nativeEvent.target;
        if (!inputComponents.includes(target)) {
            dismissKeyboard();
        }
        return false;
    }

    _inputOnLayout(event) {
        inputComponents.push(event.nativeEvent.target);
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    scollToTop() {
        this._scrollView.scrollTo({x: 0, y: 0, animated: true})
    }

    render() {
        let {rowID, pageParams} = this.props.navigation.state.params;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let {imgModalVisible, imgPosition, imgDataList, showList, copyModalVisible, detailData} = this.state;
        let {currentDetailObj = {}} = this.props.state.Me;// pageParams==='release'?this.props.state.Discuss: this.props.state.Me;
        let {nickName = '', id, logo, content = '', imgUrls = '', typeName = '', createTimeStr, isLike, creatorId, likes = [], comments = []} = detailData;
        if (currentDetailObj.id && currentDetailObj.id === id) {
            detailData = currentDetailObj;
        }
        return (
            <View style={styles.container}>
                <NavigatorView
                    {...this.props}
                    contentTitle={`${typeName}详情`}
                    onTitleOnPress={() => {
                        this.scollToTop()
                    }}
                />
                <ScrollView
                    ref={(con) => {
                        this._scrollView = con
                    }}
                    onScroll={() => {
                        this.setState({
                            inputIsShow: false
                        })
                    }}
                    contentContainerStyle={styles.scrollViewStyle} keyboardShouldPersistTaps='always'>
                    <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}
                          style={{alignItems: 'center'}}>
                        <ChildItem
                            key={'DiscussDetailView'}
                            {...this.props}
                            rowData={detailData}
                            rowID={rowID}
                            view={'detail'}
                            //全文的点击
                            onContentShow={(content) => {
                                // this.setState({
                                //     longContentModalVisible: true,
                                //     longContent: content
                                // })
                            }}
                            //评论列表的点击
                            commentOnPress={(type, commentObj, isSelf) => {
                                if (isLoginIn) {
                                    if (type === 'selfOption') {
                                        if (isSelf) {//如果 是自己的显示 删除
                                            this.showCopy(commentObj, true, isSelf)
                                        } else {//是别人的显示 输入框
                                            commentObj.isChildReply = 1;
                                            this.setState({
                                                inputIsShow: true,
                                                selectComment: commentObj
                                            }, () => {
                                                this.refs.input.focus();
                                            })
                                        }
                                    } else if (type === 'child') {
                                    }
                                } else {
                                    this.jumpLogin();
                                }
                            }}
                            imgOnPress={(pos, urls) => {
                                this.setState({
                                    imgPosition: pos,
                                    imgDataList: urls,
                                    imgModalVisible: true
                                });
                            }}
                            //操作的子View
                            childOnPress={(type) => {
                                if (isLoginIn) {
                                    if (type === 'like') {//点赞
                                        if (isLikeOption < 0) {
                                            isLikeOption = 1;
                                            this.props.actions.fetchDiscussIsLike(pageParams, id, isLike, rowID, detailData, userObj, () => {
                                                isLikeOption = -1;
                                            });
                                        }
                                    } else {//评论
                                        this.setState({
                                            inputIsShow: true,
                                            selectComment: detailData
                                        }, () => {
                                            this.refs.input.focus();
                                        })
                                    }
                                } else {
                                    this.jumpLogin();
                                }
                            }}
                        />

                    </View>

                </ScrollView>
                {!_.isEmpty(showList) && <ShowCopyModal
                    modalVisible={copyModalVisible}
                    list={showList}
                    onPress={(pos = -1) => {
                        switch (pos) {
                            case 0://删除
                                this.props.actions.fetchDiscussDetailOption(pageParams, 'delComment', this.state.detailData, this.state.selectComment);
                                break;
                            default:
                                break;
                        }
                        this.setState({
                            copyModalVisible: false,
                        });
                    }}
                />}
                {imgModalVisible && <GridImageShow
                    {...this.props}
                    key={'DiscussDetailView'}
                    modalVisible={imgModalVisible}
                    suffix={"-640x640"}
                    params={{position: imgPosition, data: imgDataList}}
                    isShowDel={false}
                    onClose={(flag) => {
                        this.setState({imgModalVisible: false})
                    }}
                />}
                <View style={{justifyContent: "flex-end"}}>
                    {this.renderInput(detailData)}
                </View>
                {PlatfIOS && <Keyparcer/>}

                <Loading ref={'loading'}/>
            </View>
        );
    }

    showCopy(obj, visible, isSelf) {
        this.setState({
            copyModalVisible: visible,
            txtCopy: obj.content,
            selectComment: obj,
            showList: isSelf ? copyData : []
        });
    }

    jumpLogin() {
        LoginAlerts(this.props.navigation, {
            callback: () => {
                console.log("........3333");
                // this.refreshView()
            }
        })
    }

    onLongPressCopyClipboard(txt) {
        if (txt) {
            Clipboard.setString(txt.toString());
            toastShort("已复制");
            this.setState({
                copyModalVisible: false,
            });
        }
    }

    renderInput() {
        const {value = '', selectComment: {replyNickName = "", isSelf}} = this.state;
        return (
            <ChildTextInput
                ref='input'
                key={'DiscussDetailView_ChildTextInput'}
                {...this.props}
                value={value}
                autoFocus={isSelf}
                onChangeText={this.handleChangeText.bind(this)}
                placeholder={replyNickName ? (isSelf ? '评论' : `回复 ${replyNickName}`) : '评论'}
                onPress={this.handleSend.bind(this)}
            />
        )
    }

    handleChangeText(v) {
        this.setState({
            value: v
        })
    }

    handleSend() {
        let {rowID, pageParams} = this.props.navigation.state.params;
        let {detailData: {id}} = this.state;
        dismissKeyboard();
        if (!this.state.value || !this.state.value.trim()) return;
        if (this.state.value.length > commentWord) {
            toastShort('您输入的内容过长！！！');
            return;
        }
        if (isSend < 0) {
            const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
            let {
                selectComment: {
                    replyNickName = "", msgId, replyUserId,
                    content: pContent, replyLogo,id:rId,isChildReply
                }, value, inputIsShow
            } = this.state;

            let data = {
                msgId: msgId || id,
                parentId: isChildReply ? rId : null,
                content: value,
            };
            isSend = 1;
            getDiscussSaveComment(data, this.props.navigation, (id) => {
                isSend = -1;
                data.commentId = id;
                Object.assign(data, {
                    pContent,
                    replyNickName,
                    replyUserId,
                    replyLogo,
                });
                this.props.actions.fetchDiscussDetailOption(pageParams, 'addComment', this.state.detailData, data, userObj,);
                this.setState({
                    value: '',
                    inputIsShow: !inputIsShow,
                    selectComment: {}
                }, () => {
                    this.scrollToEnd();
                });
            }, (err) => {
                console.log(err);
                isSend = -1
            })
        }
    }

    scrollToEnd() {
        this._scrollView.scrollToEnd({animated: true})
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            JPushModule.clearAllNotifications();
        } else {
            JPushModule.setBadge(0, () => {
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewStyle: {
        width: deviceWidth,
        // height: deviceHeight,
        // flex:1,
        padding: scaleSize(20),
        marginBottom: scaleSize(100)
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(DiscussAction, dispatch),
        loginAction: bindActionCreators(LoginAction, dispatch)
    })
)(DiscussDetailView);