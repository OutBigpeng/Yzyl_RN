/**
 * Created by coatu on 2017/7/6.
 */
import React, {Component} from 'react';
import {Image, Platform, StyleSheet, Text, View} from 'react-native'
import {AvatarStitching, Colors, PlatfIOS, px2dp, Sizes, subString} from '../common/CommonDevice'
import Images from "../themes/Images";
import ATouchableHighlight from "./ATouchableHighlight";

export default class CommonHeaderJumpView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
        this._isMounted;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        let title, timer, logo;
        const {Data, type, isReply} = this.props;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        if (type == 1) {
            title = Data.createUserName;
            timer = Data.createDate ? subString(Data.createDate) : '';
            logo = AvatarStitching(Data.createUserLogo, domainObj.avatar);
        } else if (type == 2) {
            let replayTimer = Data.replyDate ? subString(Data.replyDate) : '';
            let replayLogo = AvatarStitching(Data.replyUserLogo, domainObj.avatar);
            title = Data.replyUserName;
            timer = replayTimer;
            logo = replayLogo
        }
        return (
            <View style={[styles.container, type==1&&{
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',padding:8,
            },type==2&&{paddingTop: 8,
                paddingRight: 8,
                paddingLeft: 8,}]}>
                <View style={styles.leftViewStyle}>
                    <Image source={logo ? {uri: logo} : Images.defaultAvatar}
                           style={[isReply ? styles.smallImageStyle : styles.imageStyle]}/>
                    <View style={{justifyContent: 'center'}}>
                        <Text
                            style={[styles.textStyle, {fontSize: isReply || type == 2 ? px2dp(Sizes.searchSize) : px2dp(Sizes.listSize)}]}>{title}</Text>
                        <Text
                            style={[styles.textStyle, {fontSize: isReply || type == 2 ? px2dp(Sizes.otherSize) : px2dp(Sizes.screenSize),marginTop: 3}]}>{timer}</Text>
                    </View>

                </View>

                {isReply ?
                    <ATouchableHighlight onPress={this.props.replyOnpress}>
                        <View style={styles.replayView}>
                            <Image source={Images.replay}
                                   resizeMode={Image.resizeMode.contain}
                                   style={{
                                       width: PlatfIOS ? 17 : 15,
                                       height: PlatfIOS ? 17 : 15,
                                       marginTop: PlatfIOS ? 5 : 2
                                   }}/>
                        </View>
                    </ATouchableHighlight> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    leftViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    textStyle: {
        marginLeft: 10,
        color: Colors.ExplainColor,
        fontSize:  px2dp(PlatfIOS ? 16 : 10),
        // padding:3,
    },

    imageStyle: {
        width: 30,
        height: 30,
        borderRadius: 15
    },

    smallImageStyle: {
        width: PlatfIOS ? 25 : 20,
        height: PlatfIOS ? 25 : 20,
        borderRadius: PlatfIOS ? 25 / 2 : 10,
    },

    replayTextStyle: {
        marginLeft: 4,
        fontSize: px2dp(Sizes.searchSize),
        color: Colors.ExplainColor
    },

    replayView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});