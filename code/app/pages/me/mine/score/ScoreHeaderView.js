/**
 * 积分任务与积分兑换头部
 * Created by Monika on 2018/5/21.
 */
import Images from "../../../../themes/Images";
import {px2dp} from "../../../../common/CommonUtil";
import {scaleSize} from "../../../../common/ScreenUtil";
import {
    AvatarStitching,
    bindActionCreators,
    connect,
    deviceWidth,
    PlatfIOS,
    Sizes
} from "../../../../common/CommonDevice";
import {Image, Platform, StyleSheet, Text, View} from "react-native";
import React, {Component} from "react";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";
import *as MeAction from '../../../../actions/MeAction'

let url;

class ScoreHeaderView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {myScore: 0};
    }

    componentDidMount() {
        this.props.meAction.fetchMyScore()
    }

    render() {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let {myScore = 0} = this.props.state.Me;

        let {nickname = "", logo = "", userid} = userObj;
        url = logo && logo.indexOf('http') > -1 ? logo : AvatarStitching(logo, domainObj.avatar);
        let {view = "task"} = this.props;
        return (
            <Image source={Images.scoreSmallImg} style={{
                width: deviceWidth, height: scaleSize(140), justifyContent: "center",
            }} resizeMode={Image.resizeMode.cover}>
                <View style={{flexDirection: 'row', padding: 8}}>
                    <Image
                        source={url ? {uri: url} : Images.discussDefaultHead}
                        style={styles.avatar}/>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "column",
                            paddingLeft: 5,
                            justifyContent: 'center',
                            backgroundColor: 'transparent'
                        }}>
                        <Text style={{
                            color: 'white',
                            fontSize: px2dp(PlatfIOS ? Sizes.navSize : Sizes.titleSize)
                        }}>{nickname}</Text>

                        <ATouchableHighlight onPress={() => this.jumpScoreUse()}>
                            <Text style={[{
                                color: 'white',
                                marginTop: 2,
                                fontSize: px2dp(Sizes.searchSize)
                            }]}>{`${myScore} 积分`}</Text>
                        </ATouchableHighlight>
                    </View>
                    {view == "mall" &&
                    <ATouchableHighlight style={{alignSelf: 'center'}} onPress={this.props.onPress || null}>
                        <View style={{
                            width: scaleSize(230),
                            height: scaleSize(60),
                            borderRadius: scaleSize(30),
                            backgroundColor: "#ffc400",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Text style={{
                                fontSize: px2dp(14),
                                color: 'white'
                            }}>我的礼品订单</Text>
                        </View>
                    </ATouchableHighlight>}
                </View>
            </Image>
        )
    }

    jumpScoreUse() {
        const {navigate} = this.props.navigation;
        navigate("ScoreUserListView", {
            title: '积分记录'
        });
    }

    getScore() {
        this.props.meAction.fetchMyScore()
    }
}

const styles = StyleSheet.create({
    avatar: {
        borderRadius: Platform.OS === 'ios' ? scaleSize(60) : scaleSize(50),
        width: Platform.OS === 'ios' ? scaleSize(120) : scaleSize(100),
        height: Platform.OS === 'ios' ? scaleSize(120) : scaleSize(100),
        margin: 3
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        meAction: bindActionCreators(MeAction, dispatch)
    })
)(ScoreHeaderView);