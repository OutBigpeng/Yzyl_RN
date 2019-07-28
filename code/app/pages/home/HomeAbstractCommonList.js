//主页文章或者企业简介的界面

import React, {Component} from 'react';
import {Image, ListView, StyleSheet, Text, View} from 'react-native';

import {_, BGTextColor, bindActionCreators, Colors, connect, px2dp, Sizes} from '../../common/CommonDevice';
import *as HomeAction from '../../actions/HomeAction';
import {CommonNavTitleView} from "../../component/CommonAssembly";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {FooterIngView, FooterWanView} from "../../component/CommonListHeaderFooter";
import {scaleSize} from "../../common/ScreenUtil";


let pageSize = 10;
let page = 1;
let canLoadMore;
let loadMoreTime = 0;

// let array = ['最新动态', '产品', '问答'];
class HomeAbstractCommonList extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            rows: 4,
            dataSource: ds,
            array: this.props.currentUser && this.props.currentUser.cetifiedReturns,
            firstName: this.props.FirstName || '最新动态',
            isCurrentUser: false
        };
    }

    render() {
        return (
            this.ListHeaderView()
        )
    }

    ListHeaderView() {
        const {navigate, state} = this.props.navigation;
        const {currentUser} = this.props;
        const {homeFollowStatus, homeMyListData} = this.props.state.Home;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let isFollow = isLoginIn && homeFollowStatus;
        let rows, certifiedInfos, certifiedTypeName, cetifiedReturns;
        if (currentUser) {
            rows = currentUser.certifiedInfo && currentUser.certifiedInfo.length > 150;
            certifiedInfos = currentUser.certifiedInfo ? currentUser.certifiedInfo : '暂无简介';
            certifiedTypeName = currentUser.certifiedTypeName;
            cetifiedReturns = currentUser.cetifiedReturns;
        }
        return (
            <View>
                <View style={{backgroundColor: 'white'}}>
                    <CommonNavTitleView
                        title='介绍'
                        fontsize={px2dp(Sizes.listSize)}
                        Color={Colors.textColor}
                    />

                    <View style={{padding: 10, paddingTop: 0}}>
                        <Text
                            numberOfLines={rows ? this.state.rows : 0}
                            style={styles.firstTextStyle}>
                            {certifiedInfos}
                        </Text>

                        <ATouchableHighlight onPress={() => this.setState({rows: 0})}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                {this.state.rows !== 0 ? rows ? <Text style={styles.secondTextStyle}>
                                    [查看更多]
                                </Text> : null : null}
                            </View>
                        </ATouchableHighlight>

                    </View>

                    <View style={styles.TopBottomViewStyle}>
                        <ATouchableHighlight onPress={this.props.askPushToView}>
                            <View style={styles.TopBottomTextViewStyle}>
                                <Text style={{color: 'white', fontSize: px2dp(Sizes.searchSize)}}>向他提问</Text>
                            </View>
                        </ATouchableHighlight>

                        <ATouchableHighlight
                            onPress={this.props.FollowData}>
                            <View style={[styles.follViewStyle, {
                                backgroundColor: isFollow ? Colors.line : Colors.transparent,
                                borderWidth: isFollow ? 0 : 1,
                                borderColor: isFollow ? Colors.transparent : BGTextColor
                            }]}>
                                <Text
                                    style={[styles.follViewTextStyle, {color: isFollow ? Colors.ExplainColor : Colors.redColor}]}>{isFollow ? '已关注' : '＋ 关注'}</Text>
                            </View>
                        </ATouchableHighlight>
                    </View>
                </View>

                <View style={{
                    backgroundColor: 'white',
                    marginTop: 5,
                    height: 40,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e8e8e8',
                    paddingLeft: 10,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    {/*{!_.isEmpty(homeMyListData) && certifiedTypeName == '官方号' ? this.commonTabView('最新动态') : null}*/}
                    {/*{certifiedTypeName == '供应商' ? this.commonTabView('产品') : null}*/}
                    {!_.isEmpty(cetifiedReturns) && cetifiedReturns.map((item, index) => {
                        return (
                            this.commonTabView(item, index, cetifiedReturns)
                        )
                    })}
                </View>
            </View>
        )
    }

    commonTabView(title, index, cetifiedReturns = []) {
        let name;
        if (title === 'article') {
            name = '最新动态';
        } else if (title === 'product') {
            name = '产品'
        } else {
            name = '问答'
        }
        return (
            <ATouchableHighlight key={index} onPress={() => this.props.onPressTab(title)}>
                <View style={{
                    borderBottomColor: cetifiedReturns.length > 1 && cetifiedReturns[index] === this.props.FirstName ? BGTextColor : 'transparent',
                    borderBottomWidth: cetifiedReturns.length > 1 && cetifiedReturns[index] === this.props.FirstName ? 2 : 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    marginRight: 20,
                }}>
                    <Text style={{
                        fontSize: px2dp(Sizes.listSize),
                        // fontWeight: cetifiedReturns.length > 1 && cetifiedReturns[index] == this.props.FirstName ? 'bold' : 'normal'
                    }}>{name}</Text>
                </View>
            </ATouchableHighlight>
        )
    }

    onPressTab(title) {
        this.setState({
            firstName: title,
        })
    }

    //底部刷新
    renderFooter() {
        const {homeIsLoadMore, homeMyDataArray, homeMyListData} = this.props.state.Home;
        if (homeMyListData.length >= 10) {
            if (homeMyListData.length >= homeMyDataArray.count) {
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
    firstTextStyle: {
        marginTop: 8,
        color: Colors.contactColor,
        fontSize: px2dp(Sizes.searchSize),
        lineHeight: 20
    },

    secondTextStyle: {
        color: '#1e6ebe',
        fontSize: px2dp(Sizes.searchSize),
        marginTop: 5
    },

    follViewStyle: {
        width: 60,
        height: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        marginLeft: 10
    },

    follViewTextStyle: {
        color: BGTextColor,
        fontSize: px2dp(Sizes.searchSize)
    },

    TopBottomViewStyle: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'flex-end',
        marginRight: 15,
        marginBottom: 10
    },

    TopBottomTextViewStyle: {
        backgroundColor: BGTextColor,
        // padding:PlatfIOS?10:10,
        flexDirection:'row',
        borderRadius: scaleSize(6),
        width: px2dp(120 / 2),
        alignItems: 'center',
        height: scaleSize(50),
        justifyContent: 'center'
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(HomeAction, dispatch),
    })
)(HomeAbstractCommonList);