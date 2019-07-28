/**
 * Created by Monika on 2018/6/19.
 */


'use strict';
import React, {Component} from "react";

import {Clipboard, ListView, StyleSheet, View} from "react-native";
import *as DiscussAction from '../../actions/DiscussAction'
import Keyparcer from "react-native-keyboard-spacer";

import {
    _,
    BGColor,
    bindActionCreators, commentWord,
    connect,
    Loading,
    LoginAlerts,
    PlatfIOS,
    toastShort
} from "../../common/CommonDevice";
import PullToRefreshListView from "react-native-smart-pull-to-refresh-listview";
import {NoDataView} from "../../component/CommonAssembly";
import {getDiscussSaveComment} from "../../dao/DiscussDao";
import {_renderActivityIndicator, _renderFooter, _renderHeader} from "../../component/CommonRefresh";
import {ShowTwoButtonAlerts} from "../../common/CommonUtil";
import ShowCopyModal from "./ShowCopyModal";
import GridImageShow from "./GridImageShow";
import ChildItem from "./ChildItem";
import ChildTextInput from './ChildTextInput'
import *as LoginAction from "../../actions/LoginAction";
import ShowLongWordModal from "./ShowLongWordModal";

let dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

let page = 1;
let pageSize = 10;
let isLoadMore = false;
let lineHeights = {};

const inputComponents = [];
let copyData = ['删除'];


let isSend = -1;//-1是初始值。是-1时是可以发布内容的。
let isLikeOption = -1;//-1是初始值。是-1时是可以点赞
let pageParams = 'release';//是广场（release）还是我的发布（myrelease）
let isProsRefresh = -1;
let isRefreshEnd = -1;

class DiscussListView extends Component {

    _renderRow = (rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) => {
        let {inputIsShow} = this.state;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let {nickName = '', id, logo, content = '', imgUrls = '', createTimeStr, isLike, creatorId, likes = [], comments = []} = rowData;
        let key = `isShow${id}`;
        if (id) {
            return (
                <View key={id} style={{
                    backgroundColor: 'white',
                    padding: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: "#aaaaaa66",
                }}
                      ref={`item-${id}`}
                      onLayout={(e) => this.viewLayout(e, id)}>
                    <ChildItem
                        {...this.props}
                        rowData={rowData}
                        rowID={rowID * 1}
                        pageParams={pageParams}
                        pageType={'discussListView'}
                        //删除自己的发布
                        delMessageOnPress={() => {
                            ShowTwoButtonAlerts('提示', '确定要删除吗？', () => {
                                this.props.actions.fetchDiscussDelMessage(pageParams, {id: id}, rowID)
                            }, '删除', '取消')
                        }}
                        onPress={null}
                        //全文的点击
                        onContentShow={(content) => {
                            this._isMounted && this.setState({
                                inputIsShow: false,
                                longContentModalVisible: true,
                                longContent: content
                            })
                        }}
                        userOnPress={() => {
                            this.getNetwork(1, '', '', 'noScollTop')
                        }}
                        //评论列表的点击
                        commentOnPress={(type, commentObj, isSelf, parentId) => {
                            if (isLoginIn) {
                                if (type === 'selfOption') {
                                    if (isSelf) {//如果 是自己的显示 删除
                                        //commentObj.parentId = parentId > -1 ? parentId : commentObj.msgId;
                                        this.showCopy(commentObj, true, isSelf)
                                    } else {//是别人的显示 输入框
                                        commentObj.isChildReply = 1;
                                        this._isMounted && this.setState({
                                            inputIsShow: true,
                                            selectComment: commentObj
                                        }, () => {
                                        })
                                    }
                                } else if (type === 'child') {
                                }
                            } else {
                                this.jumpLogin();
                            }
                        }}
                        imgOnPress={(pos, urls) => {
                            this._isMounted && this.setState({
                                inputIsShow: false,
                                imgPosition: pos,
                                imgDataList: urls,
                                imgModalVisible: true
                            });
                        }}
                        //操作的子View
                        childOnPress={(type) => {
                            // const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
                            if (isLoginIn) {
                                if (type === 'like') {//点赞
                                    if (isLikeOption < 0) {
                                        isLikeOption = 1;
                                        this.props.actions.fetchDiscussIsLike(pageParams, id, isLike, rowID * 1, rowData, userObj, () => {
                                            isLikeOption = -1;
                                        });
                                    }
                                } else {
                                    this._isMounted && this.setState({
                                        inputIsShow: true,
                                        selectComment: rowData
                                    }, () => {
                                    })
                                }
                            } else {
                                this.jumpLogin();
                            }
                        }}
                    />
                </View>
            )
        } else {
            return (<View/>)
        }
    };

    //下拉刷新 & 上啦加载
    _onRefresh = () => {
        isRefreshEnd = 1;
        this.getNetwork(1);
    };
    _onLoadMore = () => {
        isLoadMore = true;
        isRefreshEnd = 2;
        this.getNetwork(2);
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        this.state = {
            dataSource: dataSource,
            dataListObj: {},
            isSearchDataObj: {},
            isNetWork: true,
            discussListDataObj: {},
            copyModalVisible: false,
            imgModalVisible: false,
            longContentModalVisible: false,
            longContent: '',
            modalVisible: false,
            showList: copyData,
            txtCopy: '',
            value: '',
            selection: {start: 0, end: 0},
            inputIsShow: false,//评论框是否显示
            selectComment: {},//选中的要评论的对象
            inputHeight: 34,
        };
        this._isMounted;
    };


    showCopy(obj, visible, isSelf) {
        this._isMounted && this.setState({
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
            this._isMounted && this.setState({
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

    componentDidMount() {
        this._isMounted = true;
        let {tabType} = this.props;
        const {discussLoadingObj, discussListDataObj} = this.props.state.Discuss;
        let discussListData = discussListDataObj[tabType] || {};
        if (!_.isEmpty(discussListData)) {
        } else {
            isProsRefresh = 1;
            this.refreshView();
        }
    }

    setModalVisible(visible) {
        this._isMounted && this.setState({
            modalVisible: visible
        });
    }

    // 网络数据处理
    componentWillReceiveProps(nextProps) {
        let {tabType} = nextProps;
        const {discussListDataObj = {}, discussResObj, discussLoadingObj = {}, shareRefreshFlag} = nextProps.state.Discuss;
        let discussLoading = discussLoadingObj[tabType];
        if (nextProps.state.Login.isLoginIn && shareRefreshFlag > 0 && !discussLoading && isProsRefresh < 0) {
            isProsRefresh = 1;
            if (tabType && tabType === 'dynamics') {
                this.getNetwork(1, this.getLoading(), 'dynamics')
            } else {
                !tabType && this.getNetwork(1, this.getLoading());

            }
        }
        if (nextProps.state.Login.isLoginIn && nextProps.state.Login.userObj.userid !== this.props.state.Login.userObj.userid) {
            this.getNetwork(1, this.getLoading())
        }
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let {tabType, tabTypeValue} = this.props;
        let {inputIsShow, imgModalVisible, imgPosition, imgDataList, isNetWork, showList, copyModalVisible, isSearchDataObj, longContent, longContentModalVisible, dataListObj} = this.state;
        const {discussLoadingObj, discussListDataObj} = this.props.state.Discuss;
        let discussListData = discussListDataObj[tabType] || [];
        let discussLoading = discussLoadingObj[tabType];
        return (
            <View style={styles.container}>
                {discussLoading ?
                    <View style={{flex: 1, alignItems: "center", justifyContent: 'center'}}>
                        {_renderActivityIndicator()}
                    </View> :
                    <View style={{flex: 1,}}>
                        {!discussLoading && !_.isEmpty(discussListData) ?
                            <PullToRefreshListView
                                ref={(component) => this._pullToRefreshListView = component}
                                viewType={PullToRefreshListView.constants.viewType.listView}
                                contentContainerStyle={{
                                    backgroundColor: 'transparent',
                                    marginBottom: PlatfIOS ? 70 : 75
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
                                    this._isMounted && inputIsShow && this.setState({
                                        inputIsShow: false,
                                    })
                                }}
                                onLayout={this._scollOnLayout.bind(this)}
                                onLoadMore={this._onLoadMore}
                                removeClippedSubviews={false}
                            /> : isSearchDataObj[tabType] ?
                                <NoDataView title={tabTypeValue}
                                            onPress={() => this.getNetwork(1, this.getLoading())}/> :
                                <View/>}

                        {inputIsShow && this.renderInput()}

                    </View>}
                {!_.isEmpty(showList) && <ShowCopyModal
                    {...this.props}
                    key={'DiscussListView_ShowCopyModal'}
                    modalVisible={copyModalVisible}
                    list={showList}
                    onPress={(pos = -1) => {
                        switch (pos) {
                            case 0://删除
                                this.props.actions.fetchDiscussDelComment(pageParams, this.state.selectComment, {});
                                break;
                            default:
                                break;
                        }
                        this._isMounted && this.setState({
                            inputIsShow: false,
                            copyModalVisible: false,
                        });
                    }}
                />}

                {imgModalVisible && <GridImageShow
                    {...this.props}
                    key={'DiscussListView_GridImageShow'}
                    modalVisible={imgModalVisible}
                    suffix={"-640x640"}
                    params={{position: imgPosition, data: imgDataList}}
                    isShowDel={false}
                    onClose={(flag) => {
                        this._isMounted && this.setState({
                            inputIsShow: false,
                            imgModalVisible: false
                        })
                    }}
                />}

                {longContent && longContentModalVisible ? <ShowLongWordModal
                    key={'DiscussListView_ShowLongWordModal'}
                    {...this.props}
                    content={longContent}
                    modalVisible={longContentModalVisible}
                    onPress={() =>
                        this._isMounted && this.setState({
                            inputIsShow: false,
                            longContentModalVisible: false
                        })
                    }
                /> : <View/>
                }
                {PlatfIOS && <Keyparcer height={40}/>}

                <Loading ref={'loading'}/>
            </View>
        );
    }

    scollToTop() {
        this._pullToRefreshListView && this._pullToRefreshListView._scrollView.scrollTo({x: 0, y: 0, animated: true})
    }

    jumpLogin() {
        LoginAlerts(this.props.navigation, {
            callback: () => {
            }
        })
    }

    refreshView(type = '') {
        if (this._pullToRefreshListView) {
            isRefreshEnd = 1;
            this._pullToRefreshListView.beginRefresh()
        } else {
            isRefreshEnd = -1;
            this.getNetwork(1, this.getLoading(), type);
        }
    }

    renderInput() {
        const {value = '', selectComment: {replyNickName = ""}, selection} = this.state;

        return (
            <ChildTextInput
                key={'DiscussListView_ChildTextInput'}
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
        this._isMounted && this.setState({
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
                    replyNickName = "", msgId,parentId, replyUserId,
                    content: pContent, replyLogo,id,isChildReply
                }, value, inputIsShow
            } = this.state;
            let data = {
                msgId: msgId||id,
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
                this._isMounted && this.setState({
                    value: '',
                    inputIsShow: !inputIsShow
                }, () => {
                });
                this.props.actions.fetchDiscussComment(pageParams, data, 'add', userObj);
            }, (err) => {
                isSend = -1
            })
        }
    }

    getNetwork(option, getLoading = '', type = '', scollTop = '') {
        const {state} = this.props.navigation;
        let {isSearchDataObj} = this.state;
        let {tabType = ''} = this.props;

        if (option === 1) {
            !scollTop && this.scollToTop();
            isLoadMore = false;
            this._pullToRefreshListView && this._pullToRefreshListView.endLoadMore(false);
            page = 1
        } else {
            page++;
        }
        let data = {
            "pageIndex": page,
            "pageSize": pageSize,
            tabType: type || tabType
        };
        this.props.actions.fetchDiscussListMessage(pageParams, data, this.props.navigation, option, true, getLoading, (res, err = '') => {
            if (err) {
                this._isMounted && this.setState({
                    isSearchDataObj: Object.assign(isSearchDataObj, {[tabType]: true}),
                    // isNetWork: false,
                }, () => {
                    this.getLoading() && this.getLoading().dismiss();
                    isRefreshEnd > -1 && this._pullToRefreshListView && this._pullToRefreshListView.endRefresh()
                })
            } else {
                let tempData = (this.state.dataListObj[this.props.tabType] || []);
                let newDataList = option === 1 ? [].concat(res.data) : tempData.concat(res.data);
                this.state.dataListObj[tabType] = option === 1 ? _.isEmpty(res.data) ? [] : res.data : newDataList;
                this._isMounted && this.setState({
                    dataListObj: this.state.dataListObj,
                    isSearchDataObj: Object.assign(isSearchDataObj, {[tabType]: true}),
                });

                if (option === 2) {
                    let loadedAll;
                    if (newDataList.length >= res.count) {
                        loadedAll = true;
                        isRefreshEnd > -1 && this._pullToRefreshListView && this._pullToRefreshListView.endLoadMore(loadedAll)
                    } else {
                        loadedAll = false;
                        isRefreshEnd > -1 && this._pullToRefreshListView && this._pullToRefreshListView.endLoadMore(loadedAll)
                    }
                } else {
                    isRefreshEnd > -1 && this._pullToRefreshListView && this._pullToRefreshListView.endRefresh()
                }
            }
            isRefreshEnd = -1;
            isProsRefresh = -1;
        });
    }

    componentWillUnmount() {
        page = 1;
        isRefreshEnd = -1;
        isProsRefresh = -1;
        this._isMounted = false
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(DiscussAction, dispatch),
        loginAction: bindActionCreators(LoginAction, dispatch)
    }), null, {withRef: true}
)(DiscussListView);