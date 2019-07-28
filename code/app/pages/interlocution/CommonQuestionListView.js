import React, {Component} from "react";
import {DeviceEventEmitter, ListView, RefreshControl, StyleSheet, View} from "react-native";

import {StringData} from '../../themes';

import {_, bindActionCreators, Colors, connect, Loading, PlatfIOS, px2dp, Sizes,} from "../../common/CommonDevice";
import * as QuestionAction from "../../actions/QuestionAction";
import {NoDataView} from '../../component/CommonAssembly';
import ImageModal from '../../component/ImageModal'
import *as LoginAction from '../../actions/LoginAction'
import {FooterIngView, FooterWanView} from "../../component/CommonListHeaderFooter";
import {_renderFooter, _renderHeader} from "../../component/CommonRefresh";
import PullToRefreshListView from "react-native-smart-pull-to-refresh-listview";

let pageSize = 15;
let page = 1;
let canLoadMore;
let loadMoreTime = 0;
let key;
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let isLoadMore = false;
class CommonQuestionListView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: ds,
            refreshing: false,
            modalVisible: false,
            isSearchData: true
        };
        canLoadMore = false;
        this._isMounted;
        this.subscription = DeviceEventEmitter.addListener('goBack', () => this.getNetwork(0));
    }

    getLoading() {
        return this.refs['loading'];
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    componentDidMount() {
        this._isMounted = true;
        this.getNetwork(0)
    }


    //网络请求
    getNetwork(option) {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        if (isLoginIn)
            this.loadNetWork(0)
    }

    loadNetWork(option) {
        if (this.getLoading()) {
            this.getLoading().show();
        }
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        const {navigate} = this.props.navigation;
        if (page > 1) {
            page = 1
        }
        let data = {};
        if (userObj.userid) {
            if (this.props.view == 1) {
                key = 'hotRecommendKey';
                data = {
                    "pageIndex": page,
                    "pageSize": pageSize,
                }
            } else if (this.props.view == 2) {
                key = 'myQuest';
                data = {
                    "pageIndex": page,
                    "pageSize": pageSize,
                    "status": 0,
                    "createUserId": userObj.userid
                };
            } else if (this.props.view == 3) {
                key = 'askQuestion';
                data = {
                    "pageIndex": page,
                    "pageSize": pageSize,
                    "userId": userObj.userid
                }
            }
            if (option === 0) {
                this.props.questionAction.fetchQuestionList(data, this.props.navigation, false, true, false, true, key)
            } else {
                this.props.questionAction.fetchQuestionList(data, this.props.navigation, true, false, false, true, key)
            }
        }
    }


    componentWillUnmount() {
        // this.pro/ps.state.Question.hotQuestionArray[key] = [];
        pageSize = 10;
        page = 1;
        canLoadMore = false;
        loadMoreTime = 0;
        key = '';
        this._isMounted = false
    }

    // 服务器有没有更多数据
    isMore() {
        const {hotQuestionList, hotQuestionArray} = this.props.state.Question;
        if (!_.isEmpty(hotQuestionList[key])) {
            return hotQuestionList[key].length !== hotQuestionArray[key].count;
        }
    }


    onEndReached() {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        const {hotQuestionArray, hotIsQuestLoadMore} = this.props.state.Question;
        if (!this.isMore() || hotIsQuestLoadMore[key]) {
        } else {
            // const time = Date.parse(new Date()) / 1000;
            if (page < hotQuestionArray[key].pageCount) {
                // if (canLoadMore && time - loadMoreTime > 1) {
                page++;
                let data = {};
                if (this.props.view == 1) {
                    key = 'hotRecommendKey';
                    data = {
                        "pageIndex": page,
                        "pageSize": pageSize,
                    }
                } else if (this.props.view == 2) {
                    key = 'myQuest';
                    data = {
                        "pageIndex": page,
                        "pageSize": pageSize,
                        "status": 0,
                        "createUserId": userObj.userid
                    }
                } else if (this.props.view == 3) {
                    key = 'askQuestion';
                    data = {
                        "pageIndex": page,
                        "pageSize": pageSize,
                        "userId": userObj.userid
                    }
                }
                this.props.questionAction.fetchQuestionList(data, this.props.navigation, false, false, true, true, key);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const {hotQuestionList, hotQuestionArray, hotIsQuestNetWork} = nextProps.state.Question;
        // console.log('hotQuestionList, hotQuestionArray, hotIsQuestNetWork',hotQuestionList, hotQuestionArray, hotIsQuestNetWork)
        if (!_.isEmpty(hotQuestionList[key])) {
            if (hotQuestionList[key].length > 0 && !_.isEmpty(hotQuestionArray[key]) && hotQuestionArray[key].data.length > 0) {
                this.setState({
                    isSearchData: true
                });
                if (this.getLoading()) {
                    this.getLoading().dismiss();
                }
            }
            if (hotIsQuestNetWork == false) {
                this.setState({
                    isSearchData: false
                });
            } else {
                this.setState({
                    isSearchData: true
                });
            }
        } else {
            if (hotIsQuestNetWork == false) {
                this.setState({
                    isSearchData: false
                });
                if (this.getLoading()) {
                    this.getLoading().dismiss();
                }
            }
        }
    }

    //下拉刷新 & 上啦加载
    _onRefresh = () => {
        this.getNetwork(1);
    };
    _onLoadMore = () => {
        isLoadMore = true;
        this.getNetwork(2);
    };

    render() {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        return (
            this._renderData()
        )
    }

    _renderData() {
        const {hotQuestionList, hotIsQuestRefreshing} = this.props.state.Question;
        const {renderItem, onRefresh, getNetwork, onEndReached} = this.props;
        let title;
        let aa = [];
        if (this.props.view == 2) {
            aa = hotQuestionList['myQuest'];
            title = StringData.noQuestionText
        } else if (this.props.view == 3) {
            aa = hotQuestionList['askQuestion'];
            title = StringData.noSetQuestionText
        } else {
            aa = hotQuestionList['hotRecommendKey']
        }

            return (
                <View style={styles.container}>
                    {this.state.isSearchData || !_.isEmpty(aa) ?
                        <ListView
                            initialListSize={10}
                            dataSource={ds.cloneWithRows(!_.isEmpty(aa) ? aa : [])}
                            renderRow={renderItem}
                            style={styles.listView}
                            onEndReached={() => this.onEndReached()}
                            onEndReachedThreshold={1}
                            renderFooter={() => this.renderFooter()}
                            enableEmptySections={true}
                            refreshControl={
                                <RefreshControl
                                    refreshing={hotIsQuestRefreshing[key] == 1}
                                    onRefresh={onRefresh ? onRefresh : () => this._onRefresh(1)}
                                />
                            }
                        />
                        : <NoDataView title={title} onPress={() => this.getNetwork(1)} type={1}/>}

                    <ImageModal
                        modalVisible={this.state.modalVisible}
                        imageUrl={this.state.imageUrl}
                        onPress={() => this.cloneModal()}
                    />
                    <Loading ref={'loading'}/>
                </View>
            );
    }

    cloneModal() {
        this.setModalVisible(!this.state.modalVisible)
    }


    _onRefresh() {
        this.loadNetWork(1)
    }

    renderFooter() {
        const {hotQuestionList, hotQuestionArray} = this.props.state.Question;
        let aa = [], list = [];
        if (this.props.view == 2) {
            list = hotQuestionList['myQuest'];
            aa = hotQuestionArray['myQuest']
        } else if (this.props.view == 3) {
            list = hotQuestionList['askQuestion'];
            aa = hotQuestionArray['askQuestion']
        } else {
            list = hotQuestionList['hotRecommendKey'];
            aa = hotQuestionArray['hotRecommendKey'];
        }

        if (list) {
            if (!_.isEmpty(list) && aa.count >= 10) {
                if (list.length >= aa.count) {
                    return (
                        <FooterWanView/>
                    )
                } else {
                    return (
                        <FooterIngView/>
                    )
                }
            } else {
                // console.log('111')
            }
            return null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        // height:300
        marginBottom: PlatfIOS ? 40 : 43,
        flex: 1
    },
    rowViewStyle: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 5
    },

    textDel: {
        fontSize: px2dp(Sizes.searchSize),
        color: Colors.ExplainColor,
        padding: PlatfIOS ? 0 : 1,
    },

    moreViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
    },

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        questionAction: bindActionCreators(QuestionAction, dispatch),
        loginAction: bindActionCreators(LoginAction, dispatch)
    })
)(CommonQuestionListView);

