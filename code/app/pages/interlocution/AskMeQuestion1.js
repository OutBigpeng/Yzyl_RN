import React, {Component} from "react";
import {Image, ListView, Text, View} from "react-native";

import Images from "../../themes/Images";

import {
    _,
    AvatarStitching,
    bindActionCreators,
    Colors,
    connect,
    deviceWidth,
    PlatfIOS,
    px2dp,
    Sizes,
    subString,
    webScript,
    domainObj as lDomainObj
} from "../../common/CommonDevice";
import * as QuestionAction from "../../actions/QuestionAction";
import ImageModal from '../../component/ImageModal'
import AutoHeightWebView from "../../component/autoHeightWebView/index";
import *as LoginAction from '../../actions/LoginAction'
import {StyleSheet} from '../../themes';
import ATouchableHighlight from "../../component/ATouchableHighlight";
import CommonQuestionListView from './CommonQuestionListView'
import {typeJump} from "../home/HomeJumpUtil";
import {HTMLSource} from "../../common/CommonUtil";

let pageSize = 10;
let page = 1;
let canLoadMore;
let loadMoreTime = 0;
let isSmallView = true;

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class AskMeQuestion1 extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: ds,
            pageIndex: 1,
            movieCount: 0,
            refreshing: false,
            modalVisible: false,
            isSearchData: true
        };
        canLoadMore = false;
        this._isMounted;
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible,
        });
    }

    getLoading() {
        return this.refs['loading'];
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    //网络请求
    getNetwork(option) {
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <CommonQuestionListView
                    {...this.props}
                    renderItem={this.renderItem}
                    //onRefresh = {()=>this._onRefresh()}
                    //onEndReached = {()=>this.onEndReached()}
                    view={3}
                />

                <ImageModal
                    modalVisible={this.state.modalVisible}
                    imageUrl={this.state.imageUrl}
                    onPress={() => this.cloneModal()}
                />
            </View>

        )
    }

    cloneModal() {
        this.setModalVisible(false)
    }

    _onRefresh() {
        this.loadNetWork(1)
    }


    renderItem = (rowData) => {
        const {isLoginIn,userObj={},domainObj} = this.props.state.Login;
       let  url = rowData.answerUserLogo ? AvatarStitching(rowData.answerUserLogo, domainObj.avatar) : null;
        let time = rowData.answerDate ? subString(rowData.answerDate) : '';

        return (
            <View style={styles.rowDataViewStyle}>
                <ATouchableHighlight onPress={() => this.pushToDetail(rowData)}>
                    <View style={styles.rowDataTitleViewStyle}>
                        <Text numberOfLines={1}
                              style={{fontSize: px2dp(PlatfIOS ? 16 : 14)}}>{rowData.title ? rowData.title : ''}</Text>
                    </View>
                </ATouchableHighlight>

                {rowData.answerUserName ?
                    <View style={styles.replayViewStyle}>
                        <View style={styles.replayBoxViewStyle}>
                            <View style={styles.replayLeftViewStyle}>
                                <Image source={url?{uri: url}: Images.defaultAvatar} style={styles.imageStyle}/>
                                <Text style={styles.textStyle}>{rowData.answerUserName}</Text>
                                <Text style={styles.textStyle}>{time}</Text>
                            </View>
                            <ATouchableHighlight onPress={() => this.pushToDetail(rowData)}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={require('../../imgs/problem/replay.png')}
                                           style={{width: 16, height: 16, marginTop: 4}}/>
                                    <Text style={styles.textStyle}>回复</Text>
                                </View>
                            </ATouchableHighlight>
                        </View>

                        {this.commonRowView(rowData)}
                    </View> : null}
            </View>
        )
    };


    commonRowView(rowData) {
        let str = rowData.answerContent ? rowData.answerContent : rowData.questionContent;
        const {isLoginIn,userObj={},domainObj} = this.props.state.Login;
        let content = domainObj && domainObj.info && str.replaceAll(lDomainObj.info, domainObj.info) || str;
        let html = '<div>'+ content + '</div>' + webScript;
        return (
            <View style={styles.rowViewStyle}>
                    <AutoHeightWebView
                        contentContainerStyle={{paddingLeft: 10, paddingRight: 10, marginBottom: PlatfIOS?15:10,}}
                        style={[{paddingLeft:10,paddingRight: 10, }]}
                        source={{html:HTMLSource('', content, 2,'<style> div,input {' + 'letter-spacing:0.3px;line-height:25px;word-break:break-all;font-size:' +px2dp(Sizes.listSize) + 'px;color:' + Colors.textColor + '}</style>')}}
                        onMessage={(e) => this.onBridgeMessage(e)}
                    />
            </View>
        )
    }

    onBridgeMessage(e) {
        const {navigate} = this.props.navigation;
        if (e && e.nativeEvent && e.nativeEvent.data) {
            let data = JSON.parse(e.nativeEvent.data);
            if (data && data.type) {
                this.jumpPerson(data);
            }
        }
    }

    jumpPerson(data) {
        const {navigate} = this.props.navigation;
        if(data.id) {
            switch (data.type) {
                case "AT":
                    navigate('HomeAbstractView', {
                            title: ' ',
                            id: data.id,
                            callback: () => console.log("")
                        }
                    );
                    break;
                    case "Chain":
                        let item = data.id;
                        typeJump(item.type, item.id, navigate, "性能", 2);
                    break;
                    case "image":
                        this.setState({
                            imageUrl: data.id
                        });
                        this.setModalVisible(true);
                    break;
                default:break;
            }
        }
    }


    pushToDetail(rowData) {
        const {navigate} = this.props.navigation;
        const {isLoginIn,userObj={},domainObj} = this.props.state.Login;
        navigate('QuestionDetail', {
                title: '问题详情',
                id: rowData.questionId,
                data: rowData,
                callback: () => console.log(""),
                key: 'askQuestion',
            }
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        // flex: 1,
        // marginBottom: PlatfIOS ? 70 : 75
    },

    refreshTextStyle: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row'
    },

    textDel: {
        fontSize: px2dp(PlatfIOS ? 14 : 12),
        color: 'gray',
        padding: PlatfIOS ? 0 : 3,
    },

    rowViewStyle: {
        flex: 1,
        // marginTop: 5,
        // marginLeft: 5
    },

    moreViewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10
    },

    rowDataViewStyle: {
        backgroundColor: 'white',
        marginTop: 8
    },

    rowDataTitleViewStyle: {
        // marginTop: 5,
        padding: 10,
    },

    rowDataImageViewSytle: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 10,
        alignItems: 'center'
    },

    textStyle: {
        color: Colors.contactColor,
        fontSize: px2dp(Sizes.searchSize),
        marginLeft: 5
    },

    replayViewStyle: {
        paddingLeft: 10,
        paddingTop: 10,
        paddingRight: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.line,
    },

    replayBoxViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    imageStyle: {
        width: 20,
        height: 20,
        borderRadius: 10
    },

    replayLeftViewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        QuestionAction: bindActionCreators(QuestionAction, dispatch),
        loginAction: bindActionCreators(LoginAction, dispatch)
    })
)(AskMeQuestion1);
