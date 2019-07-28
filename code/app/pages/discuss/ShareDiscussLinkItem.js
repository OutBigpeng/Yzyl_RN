/**
 * Created by Monika on 2018/7/3.
 */
'use strict';
import React, {Component} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {pushToHomeDetail} from "../home/HomeJumpUtil";
import {scaleSize} from "../../common/ScreenUtil";
import {connect, ImageStitching, PlatfIOS, px2dp,} from "../../common/CommonDevice";
import Images from "../../themes/Images";
import ATouchableHighlight from "../../component/ATouchableHighlight";


class ShareDiscussLinkItem extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    };

    componentDidMount() {
    }

    render() {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        let {linkObj: {title = "", authorName = '', time = '', thumb = '', domain, campus = '', catId = '', pid = ''}, pageType = "", style = {}} = this.props;
        let local = '';
        if (authorName || campus) {
            local = campus || authorName;
        }
        if (thumb) {
            let isCat = (catId && (catId === 10 || catId === 11));
            domain = pageType !== 'list' ? domain : isCat ? domainObj.prd : domainObj.info;
            thumb = thumb && thumb.indexOf("[") > -1 ? ImageStitching(thumb, domain, true) : thumb;
        }
        // console.log(title, thumb);
        return (
            <ATouchableHighlight onPress={() => {
                const {navigate} = this.props.navigation;
                if (pid) {
                    navigate('ProductDetail', {
                        name: 'ProductDetail',
                        title: '产品详情',
                        pid:pid,
                        thumb:thumb,
                        rightImageSource: true
                    })
                } else {
                    pushToHomeDetail(navigate, this.props.linkObj, '')
                }
            }}>
                <View style={[{
                    flexDirection: 'row',
                    backgroundColor: '#eeeeee',
                    padding: scaleSize(12),
                    alignItems: "center",
                    marginBottom: scaleSize(12),
                }, pageType !== 'list' && {marginRight: scaleSize(25),},style]}>
                    <Image
                        // resizeMode={Image.resizeMode.cover}
                        source={thumb ? {uri: thumb} : Images.articleDefaultImage}
                        style={[{
                            width: scaleSize(80),
                            height: scaleSize(80), marginRight: scaleSize(10)
                        },]}/>
                    <View style={{flex: 1}}>
                        <Text  numberOfLines={1}
                              ellipsizeMode={'middle'}>{title}</Text>
                        {local || time ? <View style={{flexDirection: 'row', paddingTop: scaleSize(8)}}>
                            <Text
                                style={{}}>{local ? `${local}${'    '}${time}` : `${time}`}</Text>
                        </View> : <View/>}
                    </View>
                </View>
            </ATouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(ShareDiscussLinkItem);