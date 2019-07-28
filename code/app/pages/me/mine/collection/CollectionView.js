/**
 * Created by coatu on 2017/6/29.
 */
import React, {Component} from 'react';
import {ListView, StyleSheet, Text, View} from 'react-native'

import {bindActionCreators, connect, deviceWidth, Loading} from '../../../../common/CommonDevice'
import TimerEnhance from 'react-native-smart-timer-enhance'
import * as TabSwitchAction from "../../../../actions/TabSwitchAction";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";
import ProductCollectionView from './ProductCollectionView';
import ArticleCollectionView from './ArticleCollectionView';

const FIRST = 'first';
const SECOND = 'second';

class CollectionView extends Component {
    // 构造
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        // 初始状态
        this.state = {
            dataSource: ['1', '2', '3', '4', '5'],
            callbackTest: null,
            DataArray: [],
            isSearchData: true,  //判断 orderListData是否有数据，无数据显示无数据页面
            shopListSearchData: [], //判断 orderListData是否有数据，无数据用他代替
            info: {},
            refreshing: false,
            isSelected: 'first'
        };
        this._isMounted;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    getLoading() {
        return this.refs['loading'];
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.allViewStyle}>
                    {this.renderView(FIRST, '产品收藏')}
                    <View style={styles.lineViewStyle}/>
                    {this.renderView(SECOND, '文章收藏')}
                </View>
                {this.pushToDetail()}
                <Loading ref={'loading'}/>
            </View>
        )
    }

    renderView(status, title) {
        const {isSelected} = this.state;
        return (
            <ATouchableHighlight onPress={() => this.selectedOnPress(status)}>
                <View style={styles.ViewStyle}>
                    <View style={[{
                        borderBottomWidth: isSelected != status ? 0 : 1,
                        borderBottomColor: isSelected == status ? 'red' : 'transparent',
                    }, styles.boxViewStyle]}>
                        <Text>{title}</Text>
                    </View>
                </View>
            </ATouchableHighlight>
        )
    }

    pushToDetail() {
        switch (this.state.isSelected) {
            case FIRST:
                return (
                    <ProductCollectionView  {...this.props}/>
                );
                break;
            case SECOND:
                return (
                    <ArticleCollectionView  {...this.props}/>
                );
                break;
            default:
                break;
        }
    }

    selectedOnPress(option) {
        this._isMounted && this.setState({
            isSelected: option
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    allViewStyle: {
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
        flexDirection: 'row',
        alignItems: 'center',
        height: 35,
        justifyContent: 'space-around'
    },

    ViewStyle: {
        width: deviceWidth / 2 - 5,
        alignItems: 'center',
        justifyContent: 'center'
    },

    boxViewStyle: {
        width: 70,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center'
    },

    lineViewStyle: {
        height: 20,
        width: 1,
        backgroundColor: '#e8e8e8'
    }


});

export default connect(state => ({
        state: state,
        routes: state.nav.routes,
    }),
    (dispatch) => ({
        tabSwitchAction: bindActionCreators(TabSwitchAction, dispatch)
    })
)(TimerEnhance(CollectionView));

