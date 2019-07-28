/**
 * 我的发现主页与我的动态列表公用View
 * Created by Monika on 2018/6/19.
 */

'use strict';
import React, {Component} from "react";

import {Clipboard, ListView, StyleSheet, View} from "react-native";
import *as DiscussAction from '../../../../actions/DiscussAction'

import {
    _,
    BGColor,
    bindActionCreators, commentWord,
    connect,
    deviceWidth,
    Loading,
    LoginAlerts,
    PlatfIOS,
    toastShort
} from "../../../../common/CommonDevice";
import PullToRefreshListView from "react-native-smart-pull-to-refresh-listview";
import {NoDataView} from "../../../../component/CommonAssembly";
import {getDiscussSaveComment} from "../../../../dao/DiscussDao";
import {_renderFooter, _renderHeader} from "../../../../component/CommonRefresh";
import {scaleSize} from "../../../../common/ScreenUtil";
import {ShowTwoButtonAlerts} from "../../../../common/CommonUtil";
import ChildItem from "../../../discuss/ChildItem";
import ShowCopyModal from "../../../discuss/ShowCopyModal";
import GridImageShow from "../../../discuss/GridImageShow";
import Keyparcer from "react-native-keyboard-spacer";
import ChildTextInput from '../../../discuss/ChildTextInput'
import ChildTabView from "../../../discuss/ChildTabView";
import CommentItem from "../../../discuss/CommentItem";

let dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

let page = 1;
let pageSize = 10;
let isLoadMore = false;
let lineHeights = {};

const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];
let pageParams = 'myrelease';//是广场（release）还是我的发布（myrelease）

let copyData = ['删除'];
const TypeParams = {
    Mine: 'mine',
    IComment: 'icomment',
    ILike: 'ilike'
};
let headData = {
    three: [{keyValue: '我发布的', keyName: TypeParams.Mine}, {keyValue: '我评论的', keyName: TypeParams.IComment}, {
        keyValue: '我点赞的',
        keyName: TypeParams.ILike
    }],
    two: [{keyValue: 'TA发布的', keyName: TypeParams.Mine}, {keyValue: 'TA评论的', keyName: TypeParams.IComment}]
};
let isOption = 0;
let isSend = -1;//-1是初始值。是-1时是可以发布内容的。
let isLikeOption = -1;//-1是初始值。是-1时是可以点赞
class MyDiscussListView extends Component {

    _renderRow = (rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) => {
        let {inputIsShow} = this.state;
        const {isLoginIn, userObj, domainObj} = this.props.state.Login;
        let {nickName = '', id, logo, content = '', imgUrls = '', createTimeStr, isLike, certifiedType, creatorId, likes = [], comments = []} = rowData;
        let key = `isShow${id}`;
        let {selectedHead} = this.state;
        // let url = (isLoginIn && creatorId === userid) ? userLogo.indexOf('http') > -1 ? userLogo : AvatarStitching(userLogo, domainObj.avatar) : logo;//rowData.logo +`-640x640`;
        // let head = logo ? {uri: url} : Images.discussDefaultHead;
        return (
            <View key={id} style={{
                backgroundColor: 'white',
                padding: 8,
                borderBottomWidth: 1,
                borderBottomColor: "#aaaaaa66",
            }}
                  ref={`item-${id}`}
                  onLayout={(e) => this.viewLayout(e, id)}>
                {this.pageUserId !== userObj.userid && selectedHead === TypeParams.IComment ?
                    <CommentItem
                        {...this.props}
                        rowData={rowData}
                        rowID={rowID * 1}
                        pageType={this.props.type}/>
                    :
                    <ChildItem
                        {...this.props}
                        pageUserId={this.pageUserId}
                        rowData={rowData}
                        rowID={rowID * 1}
                        pageType={this.props.type}
                        //删除自己的评论
                        delMessageOnPress={() => {
                            ShowTwoButtonAlerts('提示', '确定要删除吗？', () => {
                                isOption = 1;
                                this.props.actions.fetchDiscussDelMessage(pageParams, {id: id}, rowID)
                            }, '删除', '取消')
                        }}
                        userOnPress={() => {
                            this.callback()
                        }}
                        //评论列表的点击
                        commentOnPress={(type, commentObj, isSelf, parentId) => {
                            if (isLoginIn) {
                                isOption = 1;
                                if (type === 'selfOption') {
                                    if (isSelf) {
                                        // commentObj.parentId = parentId > -1 ? parentId : commentObj.msgId;
                                        this.showCopy(commentObj, true, isSelf)
                                    } else {
                                        commentObj.isChildReply = 1;
                                        this.setState({
                                            inputIsShow: true,
                                            selectComment: commentObj
                                        })
                                    }
                                } else if (type === 'child') {
                                }
                            } else {
                                LoginAlerts(this.props.navigation)
                            }
                        }}
                        imgOnPress={(pos, urls) => {
                            this.setState({
                                inputIsShow: false,
                                imgPosition: pos,
                                imgDataList: urls,
                                imgModalVisible: true
                            });
                        }}
                        //操作的子View
                        childOnPress={(type) => {
                            if (isLoginIn) {
                                isOption = 1;
                                if (type === 'like') {//点赞
                                    if (isLikeOption < 0) {
                                        isLikeOption = 1;
                                        this.props.actions.fetchDiscussIsLike(pageParams, id, isLike, rowID * 1, rowData, userObj, () => {
                                            isLikeOption = -1;
                                        });
                                    }
                                } else {
                                    this.setState({
                                        inputIsShow: true,
                                        selectComment: rowData
                                    })
                                }
                            } else {
                                LoginAlerts(this.props.navigation)
                            }
                        }}
                    />
                }
            </View>
        )
    };
    //下拉刷新 & 上啦加载
    _onRefresh = () => {
        this.getNetwork(1);
    };
    _onLoadMore = () => {
        isLoadMore = true;
        this.getNetwork(2);
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: dataSource,
            dataListObj: {},
            isSearchData: true,
            isNetWork: true,
            discussListDataObj: {},
            copyModalVisible: false,
            imgModalVisible: false,
            showList: copyData,
            txtCopy: '',
            focused: false,
            value: '',
            inputIsShow: false,//评论框是否显示
            selectComment: {},//选中的要评论的对象
            inputHeight: 34,
            selectedHead: 'mine'//ilike icomment
        };
        this._isMounted;
    };


    showCopy(obj, visible, isSelf) {
        this.setState({
            inputIsShow: false,
            copyModalVisible: visible,
            txtCopy: obj.content,
            selectComment: obj,
            showList: isSelf ? copyData : []
        });
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

    viewLayout(event, id) {
        //获取根View的宽高，以及左上角的坐标值
        let {x, y, width, height} = event.nativeEvent.layout;
        lineHeights[id] = height;
        this.refs[`item-${id}`] && this.refs[`item-${id}`].setNativeProps({
            style: {
                height: lineHeights[id],
            }
        });
    }

    componentWillMount() {
        const {navigate, state} = this.props.navigation;
        let {type} = this.props;
        this.pageType = type && type === 'discussHomePage';
        if (this.pageType) {
            this.headData = headData.two;
        } else {
            // this.title = state.params && state.params.title || '广场';
            this.type = state.params && state.params.type || 'other';
            this.headData = headData.three;
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.pageUserId = this.props.userId;
        if (this._pullToRefreshListView) {
            this._pullToRefreshListView.beginRefresh()
        } else {
            this.getNetwork(1, this.getLoading())
        }
    }

    // 网络数据处理
    componentWillReceiveProps(nextProps) {

    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let {style = {}} = this.props;
        let {inputIsShow, imgModalVisible, selectedHead, imgPosition, imgDataList, showList, copyModalVisible, isSearchData} = this.state;
        let {myDiscussLoadingObj, discussListDataObj, currentType} = this.props.state.Me;
        let type = `${this.props.userId}-${selectedHead}`;
        let discussListData = discussListDataObj[type] || [];
        let loading = myDiscussLoadingObj[type] || true;
        return (
            <View style={[styles.container, style]}>
                {!_.isEmpty(this.headData) && <ChildTabView
                    key={'MyDiscussListView_ChildTabView'}
                    headData={this.headData}
                    selectedHead={selectedHead}
                    onPress={(key) => {
                        this.setState(Object.assign({
                            selectedHead: key,
                            isSearchData: true,
                        }, inputIsShow ? {inputIsShow: !inputIsShow} : {}), () => {
                            currentType = selectedHead;
                            this.getNetwork(1, this.getLoading())
                        })
                    }}
                />}
                {!loading || !_.isEmpty(discussListData) ?
                    <PullToRefreshListView
                        ref={(component) => this._pullToRefreshListView = component}
                        viewType={PullToRefreshListView.constants.viewType.listView}
                        contentContainerStyle={{
                            backgroundColor: 'transparent',
                        }}
                        initialListSize={pageSize}
                        enableEmptySections={true}
                        dataSource={this.state.dataSource.cloneWithRows(_.isEmpty(discussListData) ? [] : discussListData)}
                        pageSize={pageSize}
                        renderRow={this._renderRow}
                        renderHeader={_renderHeader}
                        renderFooter={_renderFooter}
                        onRefresh={this._onRefresh}
                        onScrollBeginDrag={() => {
                            inputIsShow && this.setState({
                                inputIsShow: false,
                            })
                        }}
                        onLayout={this._scollOnLayout.bind(this)}
                        onLoadMore={this._onLoadMore}
                        removeClippedSubviews={false}
                    /> :
                    !isSearchData ?
                        <NoDataView
                            title={selectedHead === TypeParams.Mine ? this.pageType ? 'TA发布的' : "我发布的" : selectedHead === TypeParams.ILike ? this.pageType ? 'TA点赞的' : '我点赞的' : this.pageType ? 'TA评论的' : "我评论的"}
                            onPress={() => this.getNetwork(1, this.getLoading())}/> : <View/>}


                {inputIsShow && this.renderInput()}

                {!_.isEmpty(showList) && <ShowCopyModal
                    key={'MyDiscussListView_ShowCopyModal'}
                    modalVisible={copyModalVisible}
                    list={showList}
                    onPress={(pos) => {
                        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
                        switch (pos) {
                            case 0:
                                isOption = 1;
                                this.props.actions.fetchDiscussDelComment(pageParams, this.state.selectComment, userObj);
                                break;
                            default:
                                break;
                        }
                        this.setState({
                            inputIsShow: false,
                            copyModalVisible: false,
                        });
                    }}
                />}

                {imgModalVisible && <GridImageShow
                    {...this.props}
                    key={'MyDiscussListView_GridImageShow'}
                    modalVisible={imgModalVisible}
                    params={{position: imgPosition, data: imgDataList}}
                    suffix={"-640x640"}
                    isShowDel={false}
                    onClose={(flag) => {
                        this.setState({
                            inputIsShow: false,
                            imgModalVisible: false
                        })
                    }}
                />}
                {PlatfIOS && <Keyparcer/>}

                <Loading ref={'loading'}/>
            </View>

        )
    }

    scollToTop() {
        this._pullToRefreshListView && this._pullToRefreshListView._scrollView.scrollTo({x: 0, y: 0, animated: true})
    }

    jump() {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        if (isLoginIn) {
            this.jumpSend()
        } else {
            LoginAlerts(this.props.navigation)
        }
    }

    jumpSend() {
        const {state, navigate} = this.props.navigation;
        navigate('SendContentView', {
            title: '发表',
            callback: () => {
                if (this.state.selectedHead === TypeParams.Mine) {
                    if (this._pullToRefreshListView) {
                        this._pullToRefreshListView.beginRefresh()
                    }
                }
            }
        })
    }

    renderInput() {
        const {value = '', selectComment: {replyNickName = ""}} = this.state;
        return (
            <ChildTextInput
                key={'MyDiscussListView_ChildTextInput'}
                {...this.props}
                value={value}
                onChangeText={this.handleChangeText.bind(this)}
                placeholder={replyNickName ? `回复 ${replyNickName}` : ''}
                onPress={this.handleSend.bind(this)}
            />
        )
    }

    _scollOnLayout(event) {
        inputComponents.push(event.nativeEvent.target);
    }

    handleChangeText(v) {
        this.setState({
            value: v
        })
    }

    handleSend() {
        if (!this.state.value || !this.state.value.trim()) return;
        if (this.state.value.length > commentWord) {
            toastShort('您输入的内容过长！！！');
            return;
        }
        if (isSend < 0) {
            const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
            let {
                selectComment: {
                    replyNickName = "", msgId, parentId, replyUserId,
                    content: pContent, replyLogo, id, isChildReply
                }, value, inputIsShow
            } = this.state;
            let data = {
                msgId: msgId || id,
                parentId: isChildReply ? id : null,
                content: value,
            };
            isSend = 1;
            getDiscussSaveComment(data, this.props.navigation, (id) => {
                isSend = -1;
                data.commentId = id;
                Object.assign(data, {
                    pContent,
                    replyNickName,
                    replyUserId,
                    replyLogo,
                });
                this.props.actions.fetchDiscussComment(pageParams, data, 'add', userObj);
                this.setState({
                    value: '',
                    inputIsShow: !inputIsShow
                });
            }, (err) => {
                isSend = -1
            })
        }
    }

    getNetwork(option, getLoading = '') {
        const {state} = this.props.navigation;
        const {isLoginIn, userObj: {userid}, domainObj} = this.props.state.Login;

        let {selectedHead} = this.state;
        if (option === 1) {
            isLoadMore = false;
            this._pullToRefreshListView && this._pullToRefreshListView.endLoadMore(false);
            page = 1
        } else {
            page++;
        }
        let data = Object.assign({
            "pageIndex": page,
            "pageSize": pageSize,
            pageUserId: this.pageUserId,
            type: selectedHead,
            isSelf: isLoginIn && userid === this.pageUserId
        }, {});
        this.props.actions.fetchDiscussListMessage(pageParams, data, this.props.navigation, option, false, getLoading, (res, err = '') => {
            if (err) {
                this._isMounted && this.setState({
                    isSearchData: false
                }, () => {
                    this.getLoading() && this.getLoading().dismiss();
                });
            } else {
                let type = `${this.pageUserId}-${selectedHead}`;
                let tempData = (this.state.dataListObj[type] || []);
                let newDataList = option === 1 ? [].concat(res.data) : tempData.concat(res.data);
                this.state.dataListObj[type] = option === 1 ? _.isEmpty(res.data) ? [] : res.data : newDataList;
                this._isMounted && this.setState({
                    dataListObj: this.state.dataListObj,
                    isSearchData: false
                }, () => {
                });

                if (option === 2) {
                    let loadedAll;
                    if (newDataList.length >= res.count) {
                        loadedAll = true;
                        this._pullToRefreshListView && this._pullToRefreshListView.endLoadMore(loadedAll)
                    } else {
                        loadedAll = false;
                        this._pullToRefreshListView && this._pullToRefreshListView.endLoadMore(loadedAll)
                    }
                } else {
                    this._pullToRefreshListView && this._pullToRefreshListView.endRefresh()
                }
            }
        });
    }

    callback() {
        const {navigate, state} = this.props.navigation;
        if (this.type === 'list' && state.params.callback && isOption > 0) {
            state.params.callback();
            isOption = 0;
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        page = 1;
        this.callback()

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
    },

    allViewStyle: {
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
        flexDirection: 'row',
        alignItems: 'center',
        height: scaleSize(70),
        justifyContent: 'space-around',
        backgroundColor: 'white'
    },

    ViewStyle: {
        width: deviceWidth / 2 - 5,
        alignItems: 'center',
        justifyContent: 'center'
    },

    boxViewStyle: {
        width: scaleSize(140),
        height: scaleSize(70),
        alignItems: 'center',
        justifyContent: 'center'
    },

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(DiscussAction, dispatch)
    })
)(MyDiscussListView);