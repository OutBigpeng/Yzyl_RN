/**
 * Created by Monika on 2018/7/23.
 */


'use strict';
import React, {Component} from "react";
import {Clipboard, Image, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import {
    _,
    AvatarStitching,
    BGColor,
    bindActionCreators, commentWord,
    connect,
    deviceWidth,
    Loading,
    LoginAlerts,
    PlatfIOS,
    px2dp,
    toastShort
} from "../../common/CommonDevice";
import ChildTextInput from "./ChildTextInput";
import ShowCopyModal from "./ShowCopyModal";
import GridImageShow from "./GridImageShow";
import {getDiscussDetailMessage, getDiscussSaveComment} from "../../dao/DiscussDao";
import {scaleSize} from "../../common/ScreenUtil";
import * as DiscussAction from "../../actions/DiscussAction";
import * as LoginAction from "../../actions/LoginAction";
import Keyparcer from "react-native-keyboard-spacer";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import SuspendView from "./SuspendView";
import {PageTypeEnum} from "./SendContentView";
import Images from "../../themes/Images";
import FotAwesome from "react-native-vector-icons/FontAwesome";
import ShareDiscussLinkItem from "./ShareDiscussLinkItem";
import {cloneObj, ShowTwoButtonAlerts} from "../../common/CommonUtil";
import JPushModule from "jpush-react-native";
import Toast from "react-native-root-toast";
import NavigatorView from "../../component/NavigatorView";

let isSend = -1;//-1是初始值。是-1时是可以发布内容的。
let isLikeOption = -1;//-1是初始值。是-1时是可以点赞
let copyData = ['删除'];

const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];
let iconWid = scaleSize(90);
const OptionType = {
    Del: 'delete',//删除
    Like: 'like',//点赞
    Reply: 'reply',//回复或评论
};

class DiscussQaDetailView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            imgModalVisible: false,
            copyModalVisible: false,
            modalVisible: false,
            inputIsShow: false,
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
            this.setState({
                detailData: res,
                selectComment: res,
            }, () => {
                this.props.actions.fetchDiscussDetailOption(pageParams, 'setData', res);
            })
        }, (err) => {
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

    render() {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let {rowID, pageParams, msgId} = this.props.navigation.state.params;
        let {imgModalVisible, imgPosition, imgDataList, showList, inputIsShow, copyModalVisible, detailData} = this.state;
        let {nickName = '', id, logo, content = '', imgUrls = '', creatorId, createTimeStr, createTime, type, rewardScore, isFinish, winners = [], logoUrl, typeName = '', isLike, title, likes = [], comments = [], certifiedType, shareParam = ''} = detailData;
        let {currentClickObj = {}} = pageParams === 'release' ? this.props.state.Discuss : this.props.state.Me;
        if (currentClickObj.id && currentClickObj.id === id) {
            detailData = currentClickObj;
        }
        if (shareParam) shareParam = JSON.parse(shareParam);
        let url = (isLoginIn && creatorId === userObj.userid) ? userObj.logo.indexOf('http') > -1 ? userObj.logo : AvatarStitching(userObj.logo, domainObj.avatar) : logo;//rowData.logo +`-640x640`;
        let urls = imgUrls ? JSON.parse(imgUrls) : [];
        let head = logo ? {uri: url} : Images.discussDefaultHead;
        const {navigate, state} = this.props.navigation;
        return (//
            <View style={styles.container}>
                <NavigatorView
                    {...this.props}
                    rightTitle={isLoginIn && creatorId === userObj.userid ? '删除' : ''}
                    contentTitle={`${typeName}详情`}
                    onTitleOnPress={() => {
                        this.scollToTop()
                    }}
                    onRightPress={() => {
                        ShowTwoButtonAlerts('提示', '确定要删除吗？', () => {
                            this.props.actions.fetchDiscussDelMessage(pageParams, {id: msgId}, rowID, (res) => {
                                if (res && res === 'err') {
                                } else {
                                    toastShort('删除成功');
                                    this.props.navigation.goBack()
                                }
                            })
                        }, '删除', '取消')
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
                    contentContainerStyle={styles.scrollViewStyle}>
                    {type === PageTypeEnum.QA && <SuspendView
                        {...this.props}
                        typeStr={'专家分获得规则'}
                        onPress={() => {
                        }}
                    />}
                    <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}
                          style={{alignItems: 'center'}}>
                        <View style={{
                            flexDirection: 'row',
                            paddingLeft: scaleSize(20),
                            paddingRight: scaleSize(14),
                            paddingTop: scaleSize(25),
                            paddingBottom: scaleSize(10),
                            backgroundColor: 'white'
                        }}>
                            <ATouchableHighlight onPress={() => {
                                this.jumpPersonHome(creatorId)
                            }}>
                                <Image source={head}
                                       style={styles.imageStyle}/>
                            </ATouchableHighlight>
                            {/*昵称*/}
                            <View style={{
                                paddingHorizontal: scaleSize(10),
                                paddingBottom: scaleSize(10),
                                width: deviceWidth - iconWid - scaleSize(30),
                            }}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    {this.setCertiviedType(certifiedType)}
                                    <Text style={{color: '#576b95', paddingTop: scaleSize(5)}}
                                          onPress={() => this.jumpPersonHome(creatorId)}>{nickName}  </Text></View>
                                {title ? <Text
                                    style={[{
                                        paddingVertical: scaleSize(10),
                                        color: '#353535', fontWeight: 'bold'
                                    }]}>{isFinish ?
                                    <Text style={[styles.tvContent, {
                                        color: '#aaaaaa',
                                        fontWeight: 'normal'
                                    }]}>{' [已结帖] '}</Text> : ''}{title}</Text> : null}
                                {content ? <Text
                                    numberOfLines={null}
                                    ref={(c) => this._tview = c}
                                    // selectable = {true}
                                    style={[styles.tvContent, {
                                        paddingVertical: scaleSize(5),
                                        color: '#353535',
                                    }]}>{content}</Text> : null}

                                {!_.isEmpty(urls) ? this.setGridView(urls) : <View/>}
                                {shareParam ? <ShareDiscussLinkItem
                                    {...this.props}
                                    linkObj={shareParam}
                                    pageType='detail'
                                    style={[{marginTop: scaleSize(12)}]}
                                /> : <View/>}

                                <View style={{
                                    flexDirection: 'column',
                                    // justifyContent: "space-between",
                                    alignItems: "flex-end",
                                    paddingTop: scaleSize(10)
                                }}>
                                    <Text
                                        style={{fontSize: px2dp(12), paddingVertical: scaleSize(5)}}>{createTime}</Text>
                                    {this.setOption(detailData, (type) => this.setChildOnpress(type))}
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop: scaleSize(1), width: deviceWidth}}>
                            {/*这里写点赞与评论列表*/}
                            {!_.isEmpty(likes) && this.likesView(likes)}
                            {!_.isEmpty(winners) && this.setWinners(winners)}
                            {!_.isEmpty(comments) && this.commentView(comments)}
                        </View>
                        {type === 'qa' && isLoginIn && creatorId === userObj.userid && this.setFinishPost(detailData, winners)}
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

                {inputIsShow ? this.renderInput(detailData) :
                    <ATouchableHighlight onPress={() => {
                        if (isLoginIn) {
                            this.setState({
                                inputIsShow: true
                            })
                        } else {
                            this.jumpLogin();
                        }
                    }}>
                        <View style={styles.replayView}>
                            <View style={styles.replayCView}>
                                <Image source={require('../../imgs/problem/reply.png')}
                                       style={{
                                           width: scaleSize(40),
                                           height: scaleSize(40),
                                           marginRight: scaleSize(20),
                                       }}/>
                                <Text style={styles.textStyle}>我来回答</Text></View>
                        </View>
                    </ATouchableHighlight>}
                {PlatfIOS && <Keyparcer/>}
                <Loading ref={'loading'}/>
            </View>
        );
    }

    scollToTop() {
        this._scrollView.scrollTo({x: 0, y: 0, animated: true})
    }

    scrollToEnd() {
        this._scrollView.scrollToEnd({animated: true})
    }


    setCertiviedType(certifiedType) {
        if (certifiedType && certifiedType !== 'undefined') {
            return <Image source={Images.discussAuthentication} style={{
                marginRight: scaleSize(6),
                width: scaleSize(30),
                height: scaleSize(30)
            }}/>;
        } else
            return null
    }

    setWinners(winners) {
        let winnersStr = winners.map(({nickName, score}, pos) => {
            return `${nickName}获得${score}分`
        }).join(' , ');
        return (
            <View style={{
                backgroundColor: 'white',
                flexWrap: 'wrap',
                marginTop: scaleSize(10),
                flexDirection: 'row',
                padding: scaleSize(15),
            }}>
                <Text style={{paddingLeft: scaleSize(10)}}>{winnersStr}</Text>
            </View>
        )
    }

    likesView(likes) {
        return (
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                padding: scaleSize(15),
                alignItems: 'center',
                backgroundColor: 'white',
            }}>
                <Text style={{fontSize: px2dp(PlatfIOS ? 13 : 12), color: '#576b95', lineHeight: px2dp(20)}}>
                    <FotAwesome name={'heart-o'} size={px2dp(11)}/> {this.setTextChildItem(likes)}
                </Text>
            </View>
        )
    }

    setTextChildItem(texts) {
        return texts.map(({likeNickName, likeUserId}, pos) => {
            return (
                <Text key={pos} style={{fontSize: px2dp(PlatfIOS ? 13 : 12), color: '#576b95'}}
                      onPress={() => this.jumpPersonHome(likeUserId)}>
                    {likeNickName}{pos + 1 === texts.length ? '' : ' , '}
                </Text>
            )
        })
    }

//评论以后显示 的View
    commentView(comments) {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        return (
            <View style={{
                marginVertical: scaleSize(10),
                backgroundColor: 'white',
            }}>
                {comments.map((item, pos) => {
                    let {
                        id, msgId, content, beReplyCertifiedType, replyCertifiedType, replyGradeImg, replyGradeName,
                        replyLogo, createTime, beReplyLogo, pContent, beReplyNickName = '', replyNickName = '', replyUserId, beReplyUserId
                    } = item;
                    let isSelf = isLoginIn && replyUserId === userObj.userid;
                    /* let selectObj =/!* !isSelf ? {
                         parentId: id,
                         msgId: msgId,
                         replyNickName: replyNickName,
                         obj: item
                     } : *!/item;*/
                    return (
                        <View key={pos} style={{
                            borderBottomColor: BGColor,
                            borderBottomWidth: scaleSize(1),
                            paddingHorizontal: scaleSize(15),
                            paddingTop: scaleSize(25),
                            paddingBottom: scaleSize(15),
                        }}>
                            {this.commentMen(pos, {
                                id: replyUserId,
                                name: replyNickName,
                                logo: replyLogo,
                                createTime,
                                replyGradeImg,
                                replyCertifiedType
                            }, content, item, isSelf, msgId, beReplyUserId ? {
                                beId: beReplyUserId,
                                beName: beReplyNickName,
                                pContent, beReplyLogo
                            } : {})}
                        </View>
                    )
                })}
            </View>
        )
    }

//评论的第一个人，可点击
    commentMen(pos, {
        id, name, logo, createTime, replyGradeImg,
        replyCertifiedType
    }, content, item, isSelf, msgId, {beId, beName, pContent, beReplyLogo}) {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let iconHeight = scaleSize(80);
        let {isLike, likeCount} = item;
        return (//flag ? {width: deviceWidth / 6 * 5 - 10} : {}commentOnPress('child')
            <View style={{flexDirection: 'row', marginBottom: scaleSize(10),}}>
                <ATouchableHighlight onPress={() => {
                    this.jumpPersonHome(id)
                }}>
                    <Image source={logo ? {uri: logo} : Images.discussDefaultHead}
                           style={{height: iconHeight, width: iconHeight}}/>
                </ATouchableHighlight>
                <View style={{paddingHorizontal: scaleSize(10), width: deviceWidth - scaleSize(80) - scaleSize(25)}}>
                    <View style={{height: iconHeight, justifyContent: 'center'}}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: "center",
                            width: deviceWidth - scaleSize(80) - scaleSize(90)
                        }}>
                            {this.setCertiviedType(replyCertifiedType)}
                            {replyGradeImg && <Image source={{uri: replyGradeImg}} style={{
                                width: scaleSize(25),
                                height: scaleSize(25),
                                marginRight: scaleSize(6)
                            }}/>}
                            <Text style={{color: '#576b95'}} numberOfLines={1}
                                  ellipsizeMode={'middle'}
                                  onPress={() => this.jumpPersonHome(id)}
                            >{name}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: scaleSize(8)}}>
                            <Text style={{fontSize: px2dp(12)}}>{createTime}</Text>
                            {/* {isLoginIn && id === userObj.userid &&
                            <ATouchableHighlight
                                onPress={isSelf ? () => this.commentOnPress(OptionType.Del, item, isSelf) : null}>
                                <Text
                                    style={{color: '#576b95', fontSize: px2dp(10)}}> 删除 </Text>
                            </ATouchableHighlight>
                            }*/}
                        </View>
                    </View>
                    {beId && <View style={{
                        flexDirection: 'row',
                        alignItems: "center",
                        marginVertical: scaleSize(10),
                        paddingHorizontal: scaleSize(10),
                        paddingVertical: scaleSize(10),
                        borderRadius: scaleSize(2),
                        backgroundColor: '#F7F7F7'
                    }}>
                        <Text style={{
                            color: '#9C9C9C',
                            lineHeight: scaleSize(PlatfIOS ? 35 : 45),
                            fontSize: px2dp(PlatfIOS ? 14 : 13),
                        }}>
                            评论 {beName} : {pContent}</Text>
                    </View>}
                    <Text style={styles.tvContent}>{content}</Text>
                    {
                        <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
                            {this.commentOptionView(OptionType.Like, isLike ? require('../../imgs/discuss/Heart_red_52px.png') : require('../../imgs/discuss/Heart_52px.png'), likeCount || (isLike ? '' : '赞'), item, isSelf, pos)}
                            {isLoginIn && isSelf && this.commentOptionView(OptionType.Del, require('../../imgs/discuss/trash_gray_can_50px.png'), '删除', item, isSelf)}
                            {!isSelf && this.commentOptionView(OptionType.Reply, require('../../imgs/discuss/Chat_Bubble_50px.png'), '评论', item, isSelf)}
                        </View>
                    }
                </View>
            </View>
        )
    }

    commentOptionView(type, img, text, item, isSelf, pos) {
        return (
            <ATouchableHighlight style={{padding: scaleSize(10)}}
                                 onPress={() => this.commentOnPress(type, item, isSelf, pos)}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={img}
                           style={{width: scaleSize(30), height: scaleSize(30)}}/>
                    <Text style={{fontSize: px2dp(PlatfIOS ? 14 : 13)}}> {text}</Text>
                </View>
            </ATouchableHighlight>)
    }

    jumpPersonHome(userId) {
        let {navigate} = this.props.navigation;
        let {userOnPress} = this.props;
        const {isLoginIn, userObj = {}} = this.props.state.Login;
        if (isLoginIn && userId === userObj.userid) {
            navigate('MyDiscussList', {
                name: 'MyDiscussList',
                title: '我的发布',
                type: 'list',
                callback: () => {
                }
            })
        } else {
            navigate('DiscussPersonHome', {
                name: 'DiscussPersonHome',
                title: '发现个人主页',
                userId: userId,
                rightTitle: "",
            });
        }
    }

    setOption(rowData, childOnPress) {
        let {isLike, likeCount = 0, rewardScore, viewCount = 0} = rowData;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        let isTLike = isLoginIn && isLike > 0;
        return (
            <View style={{flexDirection: "row", alignItems: "center"}}>
                {rewardScore > 0 && <Text
                    style={{
                        color: 'gold', textAlign: 'center',
                        fontWeight: 'normal', fontSize: px2dp(14), marginRight: scaleSize(3)
                    }}>{rewardScore} <FotAwesome name={'hand-o-left'}
                                                 size={px2dp(14)}/>
                </Text>}
                {this.setChildOption(() => {
                }, viewCount, require('../../imgs/discuss/Eye_75px.png'), {})}

                {/*点赞*/}
                {this.setChildOption(() => childOnPress('like'), likeCount || (isTLike ? '' : '赞'), isTLike ? require('../../imgs/discuss/Heart_red_52px.png') : require('../../imgs/discuss/Heart_52px.png'),
                    {})}
                {/*评论*/}
                {this.setChildOption(() => childOnPress('comment'), '回答', require('../../imgs/discuss/Chat_Bubble_50px.png'))}
            </View>
        )
    }

    //  点击操作按钮，有点赞与评论
    setChildOption(childOnPress, text, img, style = {}) {
        return (
            <ATouchableHighlight onPress={childOnPress}>
                <View style={[{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: scaleSize(8),
                    padding: scaleSize(6),
                }, style]}>
                    <Image source={img}
                           style={{width: scaleSize(30), height: scaleSize(30)}}/>
                    <Text style={{
                        fontSize: px2dp(PlatfIOS ? 14 : 13),
                        paddingLeft: scaleSize(8)
                    }}>{text}</Text>
                </View>
            </ATouchableHighlight>
        );
    }

    //评论列表的点击
    commentOnPress(type, commentObj, isSelf, pos = -1) {
        const {isLoginIn, userObj, domainObj} = this.props.state.Login;
        if (isLoginIn) {
            switch (type) {
                case OptionType.Del:
                    this.showCopy(commentObj, true, isSelf);
                    break;
                case OptionType.Reply:
                    commentObj.isChildReply = 1;
                    this.setState({
                        inputIsShow: true,
                        selectComment: commentObj
                    }, () => {
                        this.refs.input.focus();
                    });
                    break;
                case OptionType.Like:
                    let {pageParams} = this.props.navigation.state.params;
                    let {id, isLike} = commentObj;
                    if (isLikeOption < 0) {
                        isLikeOption = 1;
                        this.props.actions.fetchDiscussCommentIsLike(pageParams, id, isLike, pos, commentObj, userObj, () => {
                            isLikeOption = -1;
                        });
                    }
                    break;
            }
        } else {
            this.jumpLogin();
        }
    }

    imgOnPress(pos, urls) {
        this.setState({
            imgPosition: pos,
            imgDataList: urls,
            imgModalVisible: true
        });
    }

    setChildOnpress(type) {
        const {isLoginIn, userObj, domainObj} = this.props.state.Login;
        let {rowID, pageParams} = this.props.navigation.state.params;
        let {id, isLike} = this.state.detailData;

        if (isLoginIn) {
            if (type === OptionType.Like) {//点赞
                if (isLikeOption < 0) {
                    isLikeOption = 1;
                    this.props.actions.fetchDiscussIsLike(pageParams, id, isLike, rowID, this.state.detailData, userObj, () => {
                        isLikeOption = -1;
                    });
                }
            } else {//评论
                this.setState({
                    inputIsShow: true,
                    selectComment: this.state.detailData
                }, () => {
                    this.refs.input.focus();
                })
            }
        } else {
            this.jumpLogin();
        }
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
        const {value = '', selectComment: {replyNickName = "", isSelf}, inputIsShow} = this.state;
        return (
            <ChildTextInput
                key={'DiscussQaDetailView_ChildTextInput'}
                ref='input'
                {...this.props}
                value={value}
                autoFocus={inputIsShow}
                onChangeText={this.handleChangeText.bind(this)}
                placeholder={replyNickName ? (isSelf ? '回答' : `评论 ${replyNickName}`) : '回答'}
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
        const {isLoginIn, userObj: {logo: userLogo = '', userid}, domainObj} = this.props.state.Login;
        if (isLoginIn) {
            let {detailData: {id}} = this.state;

            let {itemData, rowID, pageParams} = this.props.navigation.state.params;
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
                        content: pContent, replyLogo, id: rId, isChildReply
                    }, value, inputIsShow
                } = this.state;
                console.log(this.state.selectComment, msgId, id);

                let data = {
                    msgId: msgId || id,
                    parentId: isChildReply ? rId : null,
                    content: value,
                };
                isSend = 1;
                console.log(data);

                getDiscussSaveComment(data, this.props.navigation, (id) => {
                    isSend = -1;
                    data.commentId = id;
                    Object.assign(data, {
                        pContent,
                        replyNickName,
                        replyUserId,
                        replyLogo,
                    });
                    // data.obj = this.state.selectComment;
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
        } else {
            LoginAlerts(this.props.navigation, {
                callback: () => {
                    // this.refreshView()
                }
            })
        }
    }

//图片的View
    setGridView(urls) {
        let len = urls.length;
        let cols = len > 2 ? 3 : 2.5;
        let boxW = (deviceWidth - iconWid - scaleSize(32)) / cols - scaleSize(20);
        let commSty = {width: boxW, height: boxW};
        return (
            <View style={{justifyContent: 'center'}}>
                <View style={{
                    paddingVertical: scaleSize(8),
                    flexDirection: 'row', //设置主轴方向
                    flexWrap: 'wrap', //超出换行
                    alignItems: "center",
                }}>
                    {urls.map((item, pos) => {
                        return item && item.url ? (
                            <View key={pos}
                                  style={{padding: scaleSize(4)}}>
                                <ATouchableHighlight onPress={() => this.imgOnPress(pos, urls)}>
                                    <Image
                                        source={{uri: urls.length === 1 ? `${item.url}-200x200` : `${item.url}-150x150cj`}}
                                        style={commSty}/>
                                </ATouchableHighlight>
                            </View>) : <View key={pos}/>;
                    })}
                </View>
            </View>
        )
    }

    setFinishPost(data, winners) {
        const {isLoginIn, userObj: {logo: userLogo = '', userid}, domainObj} = this.props.state.Login;
        let {id, rewardScore, isFinish, comments = []} = data;
        //isFinish 0 表示未结帖 1表示已结帖
        let isJieTie = isFinish === 0 && !_.isEmpty(comments);
        let jieTieColor = isJieTie ? '#F16761' : '#eeeeee';
        return (
            <ATouchableHighlight style={{
                position: "absolute",
                top: scaleSize(15),
                right: scaleSize(25),
            }} onPress={isJieTie ? () => {//
                let {navigate} = this.props.navigation;
                let pass = (item) => {
                    return item.replyUserId !== userid;
                };
                if (comments.some(pass)) {
                    navigate('ReplierList', {
                        name: 'ReplierList',
                        title: '结帖',
                        msgId: id,
                        rewardScore,
                        callback: (obj) => {
                            let {itemData = {}, rowID, pageParams} = this.props.navigation.state.params;
                            this.state.detailData.winners = obj;
                            this.state.detailData.isFinish = 1;
                            itemData.isFinish = 1;
                            this.setState({
                                detailData: cloneObj(this.state.detailData)
                            })
                        }
                    });
                } else {
                    toastShort("无他人评价，暂不能结帖")
                }
            } : null/*() => {
                let winnersStr = winners.map(({nickName, score}, pos) => {
                    return `${nickName}获得${score}分`
                }).join(' , ');
                Alerts(winnersStr, '结帖分配')
            }*/}>
                <View style={{
                    paddingHorizontal: scaleSize(15),
                    paddingVertical: scaleSize(8),
                    borderRadius: scaleSize(5),
                    borderColor: jieTieColor,
                    borderWidth: scaleSize(2)
                }}>
                    <Text style={{color: jieTieColor}}>{isFinish === 1 ? '已结帖' : '结帖'}</Text>
                </View>
            </ATouchableHighlight>
        )
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
        backgroundColor: BGColor,
    },
    scrollViewStyle: {
        width: deviceWidth,
        paddingBottom: scaleSize(180)

    },
    tvContent: {
        paddingVertical: scaleSize(10),
        color: '#353535',
        lineHeight: scaleSize(PlatfIOS ? 40 : 45),
    },
    imageStyle: {
        width: iconWid,
        height: iconWid,
    },
    textStyle: {
        color: "#7F7F7F",
        fontSize: px2dp(13)
    },

    replayView: {
        justifyContent: 'flex-end',//flex-end
        borderTopColor: '#e8e8e8',
        borderTopWidth: scaleSize(2),
        alignItems: 'center',
        backgroundColor: 'white',
        padding: scaleSize(10),
    },
    replayCView: {
        width: deviceWidth - scaleSize(40),
        flexDirection: 'row',
        padding: scaleSize(16),
        backgroundColor: 'white',
        alignItems: 'center',
        borderBottomColor: "red",
        borderBottomWidth: scaleSize(2),
        marginBottom: scaleSize(5)
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(DiscussAction, dispatch),
        loginAction: bindActionCreators(LoginAction, dispatch)
    })
)(DiscussQaDetailView);