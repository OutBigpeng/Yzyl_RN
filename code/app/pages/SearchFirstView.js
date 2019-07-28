/** 搜索总页
 * Created by Monika on 2018/1/8.
 */

'use strict';
import React, {Component} from "react";
import {StyleSheet, Text, View,} from "react-native";
// 引入外部组件
import {
    actionBar,
    BGTextColor,
    connect,
    deviceHeight,
    deviceWidth,
    PlatfIOS,
    Sizes,
    statuBar
} from "../common/CommonDevice";
import {px2dp} from "../common/CommonUtil";
import ATouchableHighlight from "../component/ATouchableHighlight";
// import * as LoginAction from "../actions/LoginAction";
import {toastShort} from "../common/ToastUtils";
import ArticleListView from './technical/ArticleListView';
import ProductListView from './find/search/ProductListView'

const dismissKeyboard = require('dismissKeyboard');

let label = 3;//当前有几个tab
let isSearch = false;

class SearchFirstView extends Component {

    onChangeText = (text) => {
        this.searchText = text;
        this.searchTextStr = text;
        isSearch = false
    };
    _callback = (text) => {
        if (text) {
            this.searchText = text;
            this.searchTextStr = text;
            isSearch = false
        }
    };
    jumpSearchPage = () => {
        isSearch = true;
        const {navigate, state} = this.props.navigation;
        let {selectItem} = this.state;
        switch (selectItem) {
            case 'Article':
                this.jumps(selectItem, true);
                break;
            case 'Home':
                this.jumps(selectItem);
                break;
            case 'Pro':
                this.jumps(selectItem, true);
                break;
            default:
                break;
        }
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.searchTextStr = this.props.navigation.state.params.bname;
        this.categoryid = this.props.navigation.state.params.categoryid || null;
        let item = this.props.navigation.state.params.selectItem || 'Home';
        this.state = {
            selectItem: item,//Home（、Article）、pro、
            isSelected: false,
        };
        this.that = this;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            rightOnPress: this.jumpSearchPage,
            callback: this._callback,
            onChangeText: this.onChangeText,
            defaultValues: this.searchTextStr,
        });
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.allViewStyle}>
                    <View style={styles.commonTopViewStyle}>
                        {this.commonTopView(() => this.clickSet('Home', 1), 'Home', '文章', 1)}
                        {this.commonTopView(() => this.clickSet('Article', 2), 'Article', '大学', 2)}
                        {this.commonTopView(() => this.clickSet('Pro', 3), 'Pro', '产品', 3)}
                    </View>
                </View>
                <View style={{height: PlatfIOS ? deviceHeight - 105 : deviceHeight - actionBar - 40 - statuBar}}>
                    {this.pushToDetail()}
                </View>
            </View>
        );
    };

    clickSet(item, index) {
        // this.refs['baselist'].refs['list'].scrollTo({y: 0, animated: !this.state.isRefreshing});
        // this.listView && this.listView.getWrappedInstance().scrollToTop();
        this.searchTextStr && dismissKeyboard();
        this.setState({
            selectItem: item,
            selectIndex: index
        })
    }

    pushToDetail() {
        const {navigate, state} = this.props.navigation;
        let {selectItem} = this.state;
        switch (selectItem) {
            case 'Home':
            case 'Article':
                return (
                    <ArticleListView
                        // key = {this.state.selectItem}
                        ref={(component) => this.listView = component}
                        {...this.props}
                        paged={state.params.paged}
                        fromPaged={selectItem}
                        searchName={this.searchTextStr}
                        isSearch={isSearch}
                    />
                );
                break;
            case 'Pro':
                return (
                    <ProductListView
                        key={selectItem}
                        {...this.props}
                        paged={5}
                        searchName={this.searchTextStr}
                        type={1}
                        categoryid={this.categoryid}
                    />
                );
                break;
            default:
                break;
        }
    }

    commonTopView(onPress, item, name, index) {
        return (
            <ATouchableHighlight onPress={onPress}>
                <View
                    style={[styles.topBoxViewStyle, {
                        borderBottomColor: this.state.selectItem == item ? BGTextColor : 'transparent',
                        width: deviceWidth / label,
                        borderRightColor: index == 3 ? 'transparent' : '#rgba(0,0,0,0.1)',
                        borderRightWidth: index == 3 ? 0 : PlatfIOS ? StyleSheet.hairlineWidth : 0.3,
                    }]}>
                    <Text style={{
                        fontSize: px2dp(PlatfIOS ? Sizes.listSize : Sizes.searchSize),
                        fontWeight: this.state.selectItem == item ? 'bold' : 'normal'
                    }}>{name}</Text>
                </View>
            </ATouchableHighlight>
        )
    }

    jumps(selected, isSelected) {
        if (this.searchTextStr) {
            this.setState({
                selectItem: selected,
                isSelected: !this.state.isSelected,
            });
        } else {
            toastShort('请输入搜索内容！')
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    view_content: {
        marginTop: 8,
        backgroundColor: 'red',
    },
    topViewStyle: {
        width: deviceWidth,
        height: 40,
        flexDirection: 'row',
        marginTop: 1,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#rgba(219,224,230,1)',
    },

    topBoxViewStyle: {
        borderBottomWidth: 2,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    topTextStyle: {
        fontSize: px2dp(PlatfIOS ? 16 : 14)
    },

    commonTopViewStyle: {
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    allViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: deviceWidth,
        flexDirection: 'row',
        // marginTop:actionBar
    }
});
// export const SearchFirst = compose(connect(state => ({state: state}), (dispatch) => ({}), null, {withRef: true}, SearchFirstView));
export default connect(state => ({
        state: state
    }),
    (dispatch) => ({}), null, {withRef: true}
)(SearchFirstView);

