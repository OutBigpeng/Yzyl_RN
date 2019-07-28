/**
 * Created by coatu on 2017/11/1.
 */
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight
} from 'react-native';

import {Colors, PlatfIOS, px2dp, Sizes, AvatarStitching, Domain} from '../common/CommonDevice'
import ATouchableHighlight from './ATouchableHighlight'

export default class HotRecommendationView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
        };
        this._isMounted;
    }

    componentDidMount() {
        this._isMounted = true;

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const {rowData, onPress} = this.props;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        let logo = AvatarStitching(rowData.createUserLogo, domainObj.avatar);
        // console.log("唑---------------", logo);
        return (
            <ATouchableHighlight onPress={onPress}>
                <View style={styles.allViewStyle}>
                    <View
                        style={styles.topViewStyle}>
                        <Image source={{uri:logo}}
                               style={styles.imageStyle}/>
                        <Text style={styles.textStyle}>来自
                            <Text style={styles.nameStyle}>{rowData.createUserName}</Text>
                            的问题</Text>
                    </View>


                    <View style={{paddingLeft:5}}>
                        <Text style={styles.titleStyle}>{`${rowData.title}`}</Text>
                        <Text style={styles.commentStyle}>{`${rowData.replyCount}个人评论`}</Text>
                    </View>
                </View>
            </ATouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    allViewStyle: {
        padding: 10,
        backgroundColor: 'white',
        marginTop: 5
    },

    topViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.line,
        paddingBottom: 5
    },

    imageStyle: {
        width: px2dp(30),
        height: px2dp(30),
        borderRadius: px2dp(15)
    },

    titleStyle: {
        marginTop: 5,
        fontSize: px2dp(Sizes.listSize),
        fontWeight: 'bold'
    },

    commentStyle: {
        marginTop: 10,
        fontSize: px2dp(Sizes.screenSize),
        color: Colors.ExplainColor
    },

    textStyle: {
        marginLeft: 5,
        fontSize: px2dp(Sizes.searchSize),
        color: 'gray'
    },

    nameStyle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: px2dp(Sizes.searchSize)
    }
});