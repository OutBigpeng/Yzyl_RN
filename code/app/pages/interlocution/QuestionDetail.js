/**问题详情
 * Created by Monika on 2017/6/27.
 */
import React, {Component} from "react";

import {Image, ListView, StyleSheet, Text, View} from "react-native";

import AutoHeightWebView from "../../component/autoHeightWebView/index";
import ImageModal from '../../component/ImageModal'
import {
    _,
    BGColor,
    bindActionCreators,
    Colors,
    connect,
    deviceWidth,
    domainObj as lDomainObj,
    Loading,
    PlatfIOS,
    px2dp,
    Sizes,
    textHeight,
    webScript,
} from "../../common/CommonDevice";
import *as QuestionAction from "../../actions/QuestionAction";
import {getQuestion} from "../../dao/InterlocutionDao";
import CommonHeaderJumpView from "../../component/CommonHeaderJumpView";
import CommentListView from "./CommentListView";
import {FooterIngView, FooterWanView} from "../../component/CommonListHeaderFooter";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {typeJump} from "../home/HomeJumpUtil";
import {HTMLSource} from "../../common/CommonUtil";

let page = 1;
let canLoadMore = false;
let loadMoreTime = 0;
let pageSize = 10;

class QuestionDetail extends Component {
    rightPushCustom = () => {
        const {navigate} = this.props.navigation;
        navigate('ChatCustom', {
            name: "ChatCustom",
            title: '客服',
        })
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds,
            currentData: [],
            isContact: false,
            modalVisible: false,
            imageUrl: null,
        };
        let {params} = this.props.navigation.state;
        this.current = params.data;
        this.id = params.id;
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    componentDidMount() {
        this.loadNetWork(0);
        let data = {id: this.id};
        getQuestion(data, (res) => {
            this.setState({
                currentData: res
            })
        }, (err) => {
        });
    }

    navHeaderRightView(item) {
        this.props.navigation.setParams({
            headerRightHandle: (
                <ATouchableHighlight onPress={this.rightPushCustom}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('../../imgs/problem/kefu.png')}
                               style={styles.navImageStyle}/>
                        {item > 0 ? <View
                            style={styles.radiusButtonView}/> : null}
                    </View>
                </ATouchableHighlight>
            ),
            // rightOnPress: this.rightPushCustom,
        });
    }

    componentWillUnmount() {
        const {navigate, state} = this.props.navigation;
        this.props.state.Question.commentListData = [];
        this.props.state.Question.DataArray = [];
    }

    loadNetWork(option) {
        const {navigate, state} = this.props.navigation;
        if (page > 1) {
            page = 1
        }
        let data = {
            "pageIndex": page,
            "pageSize": pageSize,
            "questionId": this.id
        };
        let key = state.params.key;
        if (option === 0) {
            this.props.actions.fetchCommentDetailList(data, this.props.navigation, false, true, true, false, this.id, key)
        } else {
            this.props.actions.fetchCommentDetailList(data, this.props.navigation, true, false, false, false, this.id, key);
        }

    }

    // 服务器有没有更多数据
    isMore() {
        const {DataArray, commentListData} = this.props.state.Question;
        return commentListData.length !== DataArray.count;
    }

    onEndReached() {
        const {isLoadMore} = this.props.state.Question;
        if (!this.isMore() || isLoadMore) {

        } else {
            const {navigate, state} = this.props.navigation;
            const {isLoadMore, DataArray, commentListData} = this.props.state.Question;
            if (page < DataArray.pageCount) {
                page++;
                let data = {
                    "pageIndex": page,
                    "pageSize": pageSize,
                    "questionId": this.id
                };
                let key = state.params.key;
                this.props.actions.fetchCommentDetailList(data, this.props.navigation, false, false, false, true, this.id, key);
            }
        }
    }

    // onScroll() {
    //     if (!canLoadMore) {
    //         canLoadMore = true;
    //     }
    // }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        const {commentListData} = this.props.state.Question;
        const {view} = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <CommonHeaderJumpView
                    {...this.props}
                    Data={this.state.currentData}
                    type={1}
                />
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(commentListData)}
                    renderRow={(rowData) => this.renderRow(rowData, view)}
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold={PlatfIOS ? 0 : 20}
                    //onScroll={() => this.onScroll()}
                    renderHeader={() => this.renderHeader()}
                    renderFooter={() => this.renderFooter()}
                    removeClippedSubviews={true}
                    enableEmptySections={true}
                />

                {view != 'hotRecommend' ?
                    <ATouchableHighlight onPress={() => this.pushToView(this.state.currentData, 'TotalResponse')}>
                        <View style={styles.replayView}>
                            <View style={styles.replayCView}>
                                <Image source={require('../../imgs/problem/reply.png')}
                                       style={{
                                           width: PlatfIOS ? 20 : 15,
                                           height: PlatfIOS ? 20 : 15,
                                           marginRight: 10,
                                       }}/>
                                <Text style={styles.textStyle}>写回答</Text></View>
                        </View>
                    </ATouchableHighlight> : <View/>}
                <ImageModal
                    {...this.props}
                    modalVisible={this.state.modalVisible}
                    imageUrl={this.state.imageUrl}
                    onPress={() => this.cloneModal()}
                />
                <Loading ref={'loading'} text={'请稍等...'}/>
            </View>
        );
    }// <View style={styles.lineViewStyle}/>
    cloneModal() {
        this.setModalVisible(!this.state.modalVisible)
    }

    renderRow(rowData, view) {
        return (
            <View>
                {!_.isEmpty(this.props.state.Question.commentListData) &&
                <CommentListView
                    {...this.props}
                    rowData={rowData}
                    currentData={this.state.currentData}
                    onBridgeMessage={(e) => this.onBridgeMessage(e)}
                    replyOnpress={() => this.pushToView(rowData, 'ChildReply', this.state.currentData.createUserId)}
                    view={view}
                />}
            </View>
        )
    }

    onBridgeMessage(message) {
        if (message && message.nativeEvent && message.nativeEvent.data) {
            let data = JSON.parse(message.nativeEvent.data);
            if (data && data.type) {
                this.jumpPerson(data);
            }
        }
    };

    jumpPerson(data) {
        const {navigate} = this.props.navigation;
        if (data.id) {
            switch (data.type) {
                case "AT":
                    navigate('HomeAbstractView', {
                            title: ' ',
                            id: data.id,
                            callback: () => console.log("")
                        }
                    );
                    break;
                case "image":
                    this.setState({
                        imageUrl: data.id
                    });
                    this.setModalVisible(true);
                    break;
                case "Chain":
                    let item = data.id;
                    typeJump(item.type, item.id, navigate, "性能", 2);
                    break;
                default:
                    break;
            }
        }
    }

    pushToView(rowData, status, createUserId) {
        this.setState({
            isContact: true
        });
        const {navigate} = this.props.navigation;
        navigate('PutQuestions', {
            title: '回复',
            rightTitle: '发布',
            leftTitle: '取消',
            type: 2,
            status: status,
            Data: rowData,
            createUserId: createUserId,
            callback: () => this.questionReiceiveList()
        })
    }

    questionReiceiveList() {
        this.loadNetWork(0);
    }

    renderHeader() {
        const {DataArray} = this.props.state.Question;
        const {userObj = {}, domainObj} = this.props.state.Login;

        let {title, content, createUserLogo, createUserId, id, createDate} = this.state.currentData;
        const {navigate, state,} = this.props.navigation;

        content = (content && content.replace(lDomainObj.info, domainObj.info)) || '';
        let temp = title != undefined ? title : '';
        //let htmls = '<div><p style="font-size:' + px2dp(Sizes.listSize) + '; color:' + Colors.titleColor + ';margin:0 0 8px 0">' + temp + '</p><p style="font-size:' + px2dp(Sizes.searchSize) + '; color:' + Colors.contactColor + '">' + content + '</p></div>' + webScript;
        return (
            <View>
                <View style={styles.headerViewStyle}>
                    <AutoHeightWebView
                        {...this.props}
                        contentContainerStyle={{paddingLeft: 8, paddingRight: 8, marginBottom: PlatfIOS?12:10}}
                        source={{html:HTMLSource(temp, content, 2,'<style>div {font-size:'+ px2dp(Sizes.listSize) + 'px; color:' + Colors.titleColor + '} input{font-size:'+px2dp(Sizes.searchSize)+'px;color:' + Colors.contactColor + '}</style>')}}
                        onMessage={(e) => this.onBridgeMessage(e)}
                        startInLoadingState={true}
                    />

                </View>
                {DataArray.count > 0 ? <View style={{padding: 10, justifyContent: 'center'}}>
                    <Text
                        style={{
                            color: Colors.contactColor,
                            fontSize: px2dp(Sizes.searchSize)
                        }}>{DataArray.count}个回答</Text>
                </View> : <View/>}
            </View>
        );
    }

    renderFooter() {
        const {isLoadMore, DataArray, commentListData} = this.props.state.Question;
        if (commentListData.length >= 10) {
            if (commentListData.length >= DataArray.count) {
                return (
                    <FooterWanView/>
                )
            } else {
                return (
                    <FooterIngView/>
                )
            }
        }
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },

    rowViewStyle: {
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
        padding: 5,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    footerStyle: {
        fontSize: px2dp(Sizes.searchSize),
        margin: PlatfIOS ? 10 : 5
    },

    footViewStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },

    textStyle: {
        color: "#7F7F7F",
        fontSize: px2dp(Sizes.searchSize)
    },

    replayView: {
        justifyContent: 'flex-end',//flex-end
        borderTopColor: '#e8e8e8',
        borderTopWidth: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    replayCView: {
        width: deviceWidth - 20,
        flexDirection: 'row',
        padding: 8,
        margin: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        borderBottomColor: "red",
        borderBottomWidth: PlatfIOS ? 1 : 0.3
    },

    lineViewStyle: {
        width: 1,
        height: textHeight - 15,
        backgroundColor: Colors.line,
        marginRight: 5,
    },

    headerViewStyle: {
        backgroundColor: 'white',
        borderBottomColor: Colors.line,
        borderBottomWidth: 1,
        borderTopColor: Colors.line,
        borderTopWidth: 1,
        paddingBottom: 10
    },

    radiusButtonView: {
        width: 7,
        height: 7,
        backgroundColor: 'white',
        position: 'absolute',
        right: 16,
        top: -3,
        borderRadius: 3.5
    },

    navImageStyle: {
        width: 20,
        height: 20,
        marginRight: 20
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(QuestionAction, dispatch)
    })
)(QuestionDetail);