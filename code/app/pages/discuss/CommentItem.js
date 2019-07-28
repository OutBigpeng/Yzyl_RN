/**
 * Created by Monika on 2018/7/30.
 */

'use strict';
import React, {Component} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {_, AvatarStitching, connect, PlatfIOS} from "../../common/CommonDevice";
import Images from "../../themes/Images";
import {scaleSize} from "../../common/ScreenUtil";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {px2dp} from "../../common/CommonUtil";

let iconWid = scaleSize(90);

class CommentItem extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    };

    componentDidMount() {
    }

    render() {
        const {isLoginIn, userObj: {logo: userLogo = '', userid}, domainObj} = this.props.state.Login;
        let {rowData} = this.props;
        let {nickName = '', logo = '',  createTime = '', typeName = '', comment = '', commentCount = 0, likeCount = 0,viewCount=0, certifiedType, creatorId} = rowData;
        let url = (isLoginIn && creatorId === userid) ? userLogo.indexOf('http') > -1 ? userLogo : AvatarStitching(userLogo, domainObj.avatar) : logo;//rowData.logo +`-640x640`;
        let head = logo ? {uri: url} : Images.discussDefaultHead;
        return (
            <ATouchableHighlight onPress={null}>
                <View style={{flexDirection: 'row', paddingTop: scaleSize(10)}}>
                    <Image source={head}
                           style={styles.imageStyle}/>
                    <View style={{
                        flex: 1,
                        paddingHorizontal: scaleSize(15),
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}>
                        <View style={{
                            flexDirection: 'column',
                            height: iconWid,
                            justifyContent:'center'
                        }}>
                            <View style={{flexDirection: 'row',}}>
                                {certifiedType && certifiedType !== 'undefined' &&
                                <Image source={Images.discussAuthentication} style={{
                                    marginRight: scaleSize(6),
                                    width: scaleSize(30),
                                    height: scaleSize(30)
                                }}/>}
                                <Text style={{color: '#576b95'}}
                                      numberOfLines={1}
                                      ellipsizeMode={'middle'}>{nickName}  </Text>
                            </View>
                            <Text style={[styles.grayText,{paddingTop:scaleSize(6)}]}>{createTime}</Text>
                        </View>
                        <Text style={{color: '#353535',paddingVertical:scaleSize(6), lineHeight: scaleSize(PlatfIOS?40:45)}}>{comment}</Text>
                        {this.linkItem()}
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingTop:scaleSize(6)
                        }}>
                            <Text style={styles.grayText}>{typeName}</Text>
                            <Text
                                style={styles.grayText}>{`${viewCount} 看 · ${likeCount} 赞 · ${commentCount} 评论`}</Text>
                        </View>
                    </View>
                </View>
            </ATouchableHighlight>
        );
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
                callback: () =>{
                    userOnPress&&userOnPress()
                }
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

    setContent() {
        let {rowData: {title = '', content = '', imgUrls = '', shareParam = ''}} = this.props;
        return `[原文]  ${title}${content ? content : !_.isEmpty(imgUrls) ? '[分享图片]' : shareParam ? '[分享链接]' : '点击查看'}`
    }

    linkItem() {
        let {rowData: {title, content, msgId, type}, rowID, pageParams} = this.props;
        content = this.setContent();

        return (
            <ATouchableHighlight onPress={() => {
                const {navigate, state} = this.props.navigation;
                if (type !== 'qa') {
                    navigate('DiscussDetailView', {
                        name: 'DiscussDetailView',
                        title: '详情',
                        msgId,
                        // itemData: rowData,
                        rowID,
                        pageParams,
                    });
                } else {
                    navigate('DiscussQaDetailView', {
                        name: 'DiscussQaDetailView',
                        title: '详情',
                        msgId,
                        // itemData: rowData,
                        rowID,
                        pageParams,
                    });
                }
            }}>
                <View style={[{
                    flexDirection: 'row',
                    backgroundColor: '#eeeeee',
                    padding: scaleSize(12),
                    alignItems: "center",
                    marginVertical: scaleSize(12),
                }]}>
                    <View style={{flex: 1}}>
                        <Text numberOfLines={1}
                              ellipsizeMode={'middle'}>{content}</Text>
                    </View>
                </View>
            </ATouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageStyle: {
        width: iconWid,
        height: iconWid,
    },
    grayText: {
        fontSize:px2dp(PlatfIOS?14:12),
        color: '#aaaaaa'}
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(CommentItem);