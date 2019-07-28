import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native'
import AutoHeightWebView from "../../component/autoHeightWebView/index";
import CommonHeaderJumpView from '../../component/CommonHeaderJumpView'
import {
    Colors,
    deviceWidth,
    domainObj as lDomainObj,
    PlatfIOS,
    px2dp,
    Sizes,
    webScript,
} from '../../common/CommonDevice'
import {HTMLSource} from "../../common/CommonUtil";

export default class CommentListView extends Component {
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
        const {rowData, currentData, onBridgeMessage, replyOnpress, view} = this.props;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        let content = rowData.content && rowData.content.replace(lDomainObj.info, domainObj.info);
        return (
            <View style={{marginBottom: 5}}>
                <View>
                    {rowData.replyContent ?
                        <View style={styles.ViewStyle}>
                            <CommonHeaderJumpView
                                {...this.props}
                                Data={rowData}
                                type={1}
                                isReply={true}
                                replyOnpress={replyOnpress}
                            />
                            {this.commonContentView(onBridgeMessage, content, 3)}

                            <View style={styles.boxViewStyle}>
                                <CommonHeaderJumpView
                                    {...this.props}
                                    Data={rowData}
                                    type={2}
                                    isReply={false}
                                    replyOnpress={replyOnpress}
                                />
                                {this.commonContentView(onBridgeMessage, rowData.replyContent, 1)}
                            </View>
                        </View>
                        : <View style={{backgroundColor:"white"}}>
                            <CommonHeaderJumpView
                                {...this.props}
                                Data={rowData}
                                type={1}
                                isReply={view ? false : true}
                                replyOnpress={replyOnpress}
                            />
                            {this.commonContentView(onBridgeMessage, content, 2)}
                        </View>}
                </View>
            </View>
        )
    }

    commonContentView(onBridgeMessage, content, type) {
        // let html = '<div style='+px2dp(Sizes.listSize)+'px;'+'><p style="color:' + Colors.contactColor + ';font-size:' + px2dp(Sizes.listSize) + 'px;line-height: 20px">' + content + '</p></div>' + webScript;
        return (
            <View
                style={[{alignItems:'flex-start', justifyContent:'flex-start'},{/*type!=1&&{paddingTop:5,paddingLeft:5},{paddingBottom:5}*/}]}>
                <AutoHeightWebView
                    {...this.props}
                    contentContainerStyle={{paddingLeft: 10, paddingRight: 10, marginBottom: PlatfIOS?15:10}}
                    style={[PlatfIOS?{}:type!=1?{paddingRight: 5,paddingLeft:5}:{paddingLeft:10,paddingRight: 10, }]}
                    source={{html:HTMLSource('', content, 2,'<style> div,input {' + 'letter-spacing:0.3px;line-height:'+(PlatfIOS?20:25)+'px;word-break:break-all;font-size:' +px2dp(Sizes.listSize) + 'px;color:' + Colors.textColor + '}</style>')}}
                    onMessage={onBridgeMessage}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    titleStyle: {
        lineHeight: 15,
        fontSize: Sizes.searchSize,
        color: Colors.contactColor
    },

    imageStyle: {
        width: 25,
        height: 25,
        borderRadius: 12.5
    },

    ViewStyle: {
        backgroundColor: 'white',
    },

    boxViewStyle: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        borderRadius: 4,
        backgroundColor: Colors.line,
    },

    avatarTitleStyle: {
        lineHeight: 15,
        fontSize: px2dp(Sizes.otherSize),
        color: Colors.ExplainColor
    }
});