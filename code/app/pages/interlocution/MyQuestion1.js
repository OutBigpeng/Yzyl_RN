import React, {Component} from "react";
import {AsyncStorage, ListView, StyleSheet, Text, View} from "react-native";

import {bindActionCreators, Colors, connect, PlatfIOS, px2dp, Sizes,} from "../../common/CommonDevice";
import * as QuestionAction from "../../actions/QuestionAction";
import *as LoginAction from '../../actions/LoginAction'
import ATouchableHighlight from "../../component/ATouchableHighlight";
import CommonQuestionListView from './CommonQuestionListView'

let pageSize = 10;
let page = 1;
let canLoadMore;
let loadMoreTime = 0;

let aa = true;
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class MyQuestion1 extends Component {

    renderItem = (rowData) => {
        return (
            <View style={styles.rowViewStyle}>
                <ATouchableHighlight onPress={() => this.pushToDetail(rowData)}>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{
                            fontSize: px2dp(Sizes.listSize),
                            padding: 10,
                            color: Colors.titleColor
                        }}>{rowData.title}</Text>
                        <View style={styles.moreViewStyle}>
                            <Text style={styles.textDel}>{rowData.replyCount}个回答</Text>
                        </View>
                    </View>
                </ATouchableHighlight>
            </View>
        )
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: ds,
            pageIndex: 1,
            movieCount: 0,
            refreshing: false,
            isSearchData: true
        };
        canLoadMore = false;
        this._isMounted;
    }

    getLoading() {
        return this.refs['loading'];
    }

    componentDidMount() {
        this._isMounted = true;
    }


    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <CommonQuestionListView
                {...this.props}
                renderItem={this.renderItem}
                view={2}
            />
        )
    }

    pushToDetail(rowData) {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        this.commonPush(navigate, rowData)
    }

    commonPush(navigate, rowData) {
        navigate('QuestionDetail', {
                title: '问题详情',
                id: rowData.id,
                replyCount: rowData.replyCount,
                key: 'myQuest',
            }
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        // height:300
        // marginBottom: PlatfIOS ? 70 : 75
        // flex:1
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
        QuestionAction: bindActionCreators(QuestionAction, dispatch),
        loginAction: bindActionCreators(LoginAction, dispatch)
    })
)(MyQuestion1);

