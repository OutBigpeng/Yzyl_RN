/**
 * Created by Monika on 2018/6/22.
 */

'use strict';
import React, {Component} from "react";
import PropTypes from 'prop-types';

import {Image, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import FotAwesome from "react-native-vector-icons/FontAwesome";

import {_, AvatarStitching, deviceWidth, domainObj, PlatfIOS} from "../../common/CommonDevice";
import {scaleSize} from "../../common/ScreenUtil";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {px2dp} from "../../common/CommonUtil";
import Images from "../../themes/Images";
import ShareDiscussLinkItem from "./ShareDiscussLinkItem";

let iconWid = scaleSize(90);

export default class ChildItem extends Component {
    static propTypes = {//设置静态属性
        onPress: PropTypes.func,//整体点击
    };
    static defaultProps = {
        isShowLine: false,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {isOpen: false, text: '全文'};

        this._isMounted;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    render() {
        const {rowData, rowID, childOnPress, delMessageOnPress, view = 'list', pageParams, pageType = '', pageUserId = -1} = this.props;
        let {inputIsShow} = this.state;
        const {isLoginIn, userObj: {logo: userLogo = '', userid}, domainObj = domainObj} = this.props.state.Login;

        let {nickName = '', id, logo, content = '', imgUrls = '', creatorId, createTimeStr, createTime, type, rewardScore, isFinish, winners = [], logoUrl, typeName, isLike, title, likes = [], comments = [], certifiedType, shareParam = ''} = rowData;
        if (shareParam) shareParam = JSON.parse(shareParam);
        let url = (isLoginIn && creatorId === userid) ? userLogo.indexOf('http') > -1 ? userLogo : AvatarStitching(userLogo, domainObj.avatar) : logo;//rowData.logo +`-640x640`;
        let urls = imgUrls ? JSON.parse(imgUrls) : [];
        let head = logo ? {uri: url} : Images.discussDefaultHead;
        const {navigate} = this.props.navigation;
        let isList = view === 'list';
        return (//
            <ATouchableHighlight style={{width: '100%'}} onPress={isList && type === 'qa' ? () => {
                navigate('DiscussQaDetailView', {
                    name: 'DiscussQaDetailView',
                    title: '详情',
                    msgId: id,
                    itemData: rowData,
                    rowID: rowID,
                    pageParams: pageParams,
                });
            } : null}>
                <View style={{flexDirection: 'row', paddingTop: scaleSize(10)}}>
                    <ATouchableHighlight onPress={() =>this.jumpBeforeJudge(creatorId)}>
                        <Image source={head}
                               style={styles.imageStyle}/>
                    </ATouchableHighlight>
                    <View style={{
                        paddingLeft: scaleSize(15),
                        paddingRight: scaleSize(3),
                        paddingBottom: scaleSize(10),
                        width: (deviceWidth - iconWid - scaleSize(30))
                    }}>
                        <View style={{flexDirection: 'row', alignItems: "center"}}>
                            {certifiedType && certifiedType !== 'undefined' &&
                            <Image source={Images.discussAuthentication} style={{
                                marginRight: scaleSize(6),
                                width: scaleSize(30),
                                height: scaleSize(30)
                            }}/>}
                            <Text style={{color: '#576b95'}} numberOfLines={1}
                                  ellipsizeMode={'middle'}
                                  onPress={() =>  this.jumpBeforeJudge(creatorId)}>{nickName}  </Text>
                        </View>
                        {title ? <Text
                            style={[styles.tvContent, {fontWeight: 'bold'}]}>{isFinish ?
                        <Text
                            style={{color: '#aaaaaa', fontWeight: 'normal'}}>{'[已结帖] '}</Text>:''}{title}</Text> : null}
                        {content ? <Text
                            numberOfLines={isList ? 6 : null}
                            ref={(c) => this._tview = c}
                            // selectable = {true}
                            style={[styles.tvContent]}>{content}</Text> : null}
                        {/*缩略文字*/}
                        {content && isList ? this.setShowMore(content) : null}

                        {!_.isEmpty(urls) ? this.setGridView(urls) : <View/>}

                        {shareParam ? <ShareDiscussLinkItem
                            {...this.props}
                            linkObj={shareParam}
                            pageType='list'
                            style={[{marginTop: scaleSize(12)}]}
                        /> : <View/>}

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: scaleSize(15)
                        }}>
                            <View style={{flexDirection: 'row', alignItems: "center", paddingVertical: scaleSize(5)}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    {isList && typeName && <View style={{
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
                                    <Text style={{fontSize: px2dp(12)}}>{isList ? createTimeStr : createTime}</Text>
                                </View>
                                {isLoginIn && isList && creatorId === userid && pageType !== 'discussHomePage' &&
                                <ATouchableHighlight onPress={delMessageOnPress}>
                                    <Text
                                        style={{color: '#576b95', fontSize: px2dp(12)}}> 删除</Text>
                                </ATouchableHighlight>
                                }
                            </View>
                            {type !== 'qa' ? this.setOption(rowData, childOnPress) : isList ? this.setOptionCount(rowData) : this.setOption(rowData, childOnPress)}
                        </View>
                        {/*这里写点赞与评论列表*/}
                        {isList && type === 'qa' ? null : <View style={{
                            backgroundColor: '#eeeeee',
                            marginTop: (!_.isEmpty(likes) || !_.isEmpty(comments)) ? scaleSize(20) : 0
                        }}>
                            {!_.isEmpty(likes) && this.likesView(likes)}
                            {!isList && !_.isEmpty(winners) && <View
                                style={{
                                    height: scaleSize(1),
                                    backgroundColor: '#aaaaaa44',
                                    marginHorizontal: scaleSize(10)
                                }}/>}
                            {!isList && !_.isEmpty(winners) && this.setWinners(winners)}
                            {!_.isEmpty(comments) && <View
                                style={{
                                    height: scaleSize(1),
                                    backgroundColor: '#aaaaaa44',
                                    marginHorizontal: scaleSize(10)
                                }}/>}
                            {!_.isEmpty(comments) && this.commentView(comments)}
                        </View>}
                    </View>
                </View>
            </ATouchableHighlight>
        )
    }

    setOptionCount(rowData) {
        let {commentCount = 0, likeCount = 0,viewCount=0, isFinish, rewardScore} = rowData;
        let text1 = `${viewCount} 看`;
        let text = `${likeCount} 赞`;
        let text2 = `${commentCount} 回答`;
        let temp =  `${text1} · ${text} · ${text2}`;

        return (
            <View style={{flexDirection: "row", alignItems: "center"}}>
                {rewardScore > 0 ? <Text style={{
                    color: 'gold',//sco
                    fontWeight: 'normal', fontSize: px2dp(PlatfIOS ? 13 : 12)
                }}>{rewardScore} <FotAwesome name={'hand-o-left'} size={px2dp(PlatfIOS ? 13 : 12)}/> · </Text> : null}
                <Text style={{
                    // color: '#rgba(0,0,0,0.8)',
                    fontSize: px2dp(PlatfIOS ? 13 : 12),
                    paddingLeft: scaleSize(8)
                }}>{temp}</Text>
            </View>
        )
    }

    setOption(rowData, childOnPress) {
        let {likes = [], comments = [], likeCount = 0,viewCount=0} = rowData;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        function pass({likeUserId}) {
            return likeUserId === userObj.userid;
        }

        let isTLike = isLoginIn && likes.some(pass);//&& !_.isEmpty(likes) && likes.some(pass) ||
        return (
            <View style={{flexDirection: "row", alignItems: "center"}}>
                {this.setChildOption(() =>{}, viewCount,  require('../../imgs/discuss/Eye_75px.png'), {})}
                {/*点赞*/}
                {this.setChildOption(() => childOnPress('like'), likeCount || (isTLike ? '' : '赞'), isTLike ? require('../../imgs/discuss/Heart_red_52px.png') : require('../../imgs/discuss/Heart_52px.png'),
                    {})}
                {/*评论*/}
                {this.setChildOption(() => childOnPress('comment'), '评论', require('../../imgs/discuss/Chat_Bubble_50px.png'))}
            </View>
        )
    }

//设置全文与收起
    setShowMore(content) {
        let {onContentShow} = this.props;
        let sp = content.split('\n') || [];
        let len = sp.length - 1;
        if (content.length > 100 || len > 4) {
            return (
                <ATouchableHighlight onPress={() => {
                    if (onContentShow && content.length > 500) {
                        onContentShow(content);
                    } else {
                        this._tview.setNativeProps({
                            numberOfLines: !this.state.isOpen ? null : 6,
                        });
                        this.setState({
                            isOpen: !this.state.isOpen,
                            text: !this.state.isOpen ? '收起' : '全文'// "↑收起" : "↓查看更多"
                        })
                    }
                }}>
                    <Text style={{
                        justifyContent: 'flex-end',
                        textAlign: 'left',
                        padding: content.length > 120 ? scaleSize(6) : 0,
                        color: '#576b95',
                    }}>{this.state.text}</Text>
                </ATouchableHighlight>
            )
        } else {
            return <View/>
        }

    }

//点击操作按钮，有点赞与评论
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
                        // color: '#rgba(0,0,0,0.8)',
                        fontSize: px2dp(PlatfIOS ? 13 : 12),
                        paddingLeft: scaleSize(8)
                    }}>{text}</Text>
                </View>
            </ATouchableHighlight>
        );
    }

//点赞以后显示 的View
    likesView(likes) {
        let likesStr = (likes.map((item, pos) => {
            return item.likeNickName
        })).join(' , ');
        return (
            <View style={{flexDirection: 'row', flexWrap: 'wrap', padding: scaleSize(10), alignItems: 'center'}}>
                <Text
                    style={{fontSize: px2dp(PlatfIOS ? 13 : 12), color: '#576b95', lineHeight: px2dp(18)}}>
                    <FotAwesome name={'heart-o'} size={px2dp(11)}/> {this.setTextChildItem(likes)}
                </Text>
            </View>
        )
    }

    setTextChildItem(texts) {
        return texts.map(({likeNickName, likeUserId}, pos) => {
            return (
                <Text key={pos} style={{fontSize: px2dp(PlatfIOS ? 13 : 12), color: '#576b95'}}
                      onPress={() =>this.jumpBeforeJudge(likeUserId)}>
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
                padding: scaleSize(10),
            }}>
                {comments.map((item, pos) => {
                    /**
                     *    {
                            "content":"第2条回复评论",
                            "id":8,
                            "createTime":"2018-06-20 17:43:38",
                            "parentId":5,
                            "beReplyCompany":"2",
                            "replyUserId":141,
                            "msgId":6,
                            "replyCompany":"抚州市临川区红海化工厂",
                            "beReplyNickName":"测试0423_5",
                            "replyNickName":"抚州市临川区红海化工厂",
                            "beReplyUserId":140
                        },{content}
                     */
                    let {id, msgId, content, beReplyNickName = '', replyNickName = '', replyUserId, beReplyUserId} = item;
                    let isSelf = isLoginIn && replyUserId === userObj.userid;

                    // let selectObj = /*!isSelf ? {
                    //     parentId: id,
                    //     msgId: msgId,
                    //     replyNickName: replyNickName,
                    //     obj: item
                    // } : */item;
                    return (
                        <View key={pos} style={{}}>
                            {this.commentMen({
                                id: replyUserId,
                                name: replyNickName
                            }, content, item, isSelf, msgId, beReplyUserId ? {
                                beId: beReplyUserId,
                                beName: beReplyNickName
                            } : {})}
                        </View>
                    )
                })}
            </View>
        )
    }

//评论的第一个人，可点击
    commentMen({id, name}, content, item, isSelf, msgId, {beId = -1, beName = ''}) {
        let {commentOnPress} = this.props;
        item['isSelf'] = isSelf;

        return (//flag ? {width: deviceWidth / 6 * 5 - 10} : {}commentOnPress('child')
            <Text style={{color: '#576b95', paddingVertical: scaleSize(PlatfIOS ? 3 : 2)}} onPress={() => {
                commentOnPress('selfOption', item, isSelf, msgId)
            }}>
                <Text onPress={() => this.jumpPersonHome(id)}>{name}</Text>
                {beId > -1 && <Text style={{color: '#rgba(0,0,0,0.8)',}}
                                    onPress={() => commentOnPress('selfOption', item, isSelf, msgId)}>回复</Text>}
                {beId > -1 &&
                <Text style={{color: '#576b95'}} onPress={() => this.jumpBeforeJudge(beId)}>{beName}</Text>}
                <Text style={{color: '#rgba(0,0,0,0.8)',}}>: </Text>
                {<Text style={{color: '#rgba(0,0,0,0.8)'}} selectable={true} onPress={() => {
                    commentOnPress('selfOption', item, isSelf, msgId)
                }}>{content.length < 6 ? `${content}        ` : content}</Text>}
            </Text>
        )
    }

    jumpBeforeJudge(id){
        let { pageUserId = -1} = this.props;
        pageUserId!==id&&this.jumpPersonHome(id)
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
                callback: () =>
                    userOnPress()
            })
        } else {
            navigate('DiscussPersonHome', {
                name: 'DiscussPersonHome',
                title: '发现个人主页',
                userId: userId,
                // personData: cloneObj({userId: userId}),
                rightTitle: "",
            });
        }

    }

//图片的View
    setGridView(urls) {
        let {imgOnPress} = this.props;
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
                                <TouchableHighlight onPress={() => imgOnPress(pos, urls)}>
                                    <Image
                                        source={{uri: urls.length === 1 ? `${item.url}-200x200` : `${item.url}-150x150cj`}}
                                        style={commSty}/>
                                </TouchableHighlight>
                            </View>) : <View key={pos}/>;
                    })}
                </View>
            </View>
        )
    }

    setWinners(winners) {
        let winnersStr = winners.map(({nickName, score}, pos) => {
            return `${nickName}获得${score}分`
        }).join(' , ');
        return (
            <View
                style={{margin: scaleSize(10), flexWrap: 'wrap', flexDirection: 'row'}}>
                <Text style={{}}>{winnersStr}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tvContent: {
        paddingTop: scaleSize(6), color: '#353535',
        lineHeight: scaleSize(PlatfIOS ? 40 : 45),
    },
    imageStyle: {
        width: iconWid,
        height: iconWid,
    },
});
