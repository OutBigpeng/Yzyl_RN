/**
 * Created by Monika on 2018/07/31.
 */


'use strict';
import React, {Component} from "react";
import {Animated, ListView, RefreshControl, StyleSheet, View} from "react-native";
import {BGColor, bindActionCreators, connect} from "../../common/CommonDevice";
import {pushToHomeDetail} from "../home/HomeJumpUtil";
import CommonHomeListView from "../../component/CommonHomeListView";
import CommonArticleTypeView from "../home/CommonArticleTypeView";
import * as CoatingUniversityAction from "../../actions/CoatingUniversityAction";
import * as HomeAction from "../../actions/HomeAction";
import {FooterIngView, FooterWanView} from "../../component/CommonListHeaderFooter";
import {isEmptyObject} from "../../common/CommonUtil";
import {_renderActivityIndicator} from "../../component/CommonRefresh";
import {scaleSize} from "../../common/ScreenUtil";

let page = 1;
let pageSize = 10;
let isReq = 0;

class ClassifyListView extends Component {

    renderRow = (rowData, sectionId, rowId) => {
        const {reqData: {articleType}} = this.props.state.CoatingUniversity;
        return this.itemView(articleType, rowData, rowId * 1)
    };

    // 构造
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        // 初始状态
        this.state = {
            dataSource: ds,
            scrollY: new Animated.Value(0),
            homeScrollY: new Animated.Value(0),
            isRefreshing: false
        };
    };

    itemView(type, rowData, key = '') {
        const {navigate} = this.props.navigation;
        return (
            <CommonHomeListView
                {...this.props}
                key={key}
                view={type}
                item={rowData}
                pageType='Coating'
                onPress={() => {
                    pushToHomeDetail(navigate, rowData, type, this.props.viewType !== 'Coating' ? 0 : 3)
                }}/>
        )
    }

    componentDidMount() {
        this.loadData(0)
    }

    componentWillReceiveProps(nextProps) {
        let {fromType, selectCoatingLabel: selectCoatingLabelN, selectCoatingChildLabel: selectCoatingChildLabelN} = nextProps.state.CoatingUniversity;
        let {selectCoatingLabel, selectCoatingChildLabel} = this.props.state.CoatingUniversity;
        if (fromType && (selectCoatingLabel !== selectCoatingLabelN || selectCoatingChildLabel !== selectCoatingChildLabelN)) {
            this.props = nextProps;
            this.loadData(1)
        }
    }

    render() {
        const {isClickRefreshing, coatingListDataObj = [], selectCoatingLabel = {}, selectCoatingChildLabel = {}} = this.props.state.CoatingUniversity;
        let {bgStyle} = this.props;
        let {isRefreshing} = this.state;
        let key = selectCoatingLabel.value ? `${selectCoatingLabel.value}-${selectCoatingChildLabel.value}` : '';
        let coatingListData = !isEmptyObject(coatingListDataObj) && key ? coatingListDataObj[key] ? coatingListDataObj[key] : [] : [];
        return (
            <View style={[bgStyle, {backgroundColor: BGColor,}, {flex: 1}]}>
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(isClickRefreshing ? ['22'] : coatingListData)}
                    renderRow={isClickRefreshing ? () =>
                        <View style={{alignItems: "center", justifyContent: 'center', marginTop: scaleSize(10)}}>
                            {_renderActivityIndicator()}
                        </View> : this.renderRow}
                    scrollEventThrottle={16}
                    initialListSize={pageSize}
                    pageSize={pageSize}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold={1}
                    renderFooter={() => this.renderFooter()}
                    renderHeader={() => this.renderHeader()}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => this.onRefresh()}
                        />
                    }
                />
            </View>
        );
    }

    renderFooter() {
        const {isRefreshing, coatingListDataObj, receiveDataObj, coatingKey} = this.props.state.CoatingUniversity;
        return (
            this.commonFooterView(receiveDataObj, coatingListDataObj[coatingKey])
        )
    }

    commonFooterView({isLoadMore, count}, listData = []) {
        const {receiveDataObj: {tagKey}, coatingKey, isClickRefreshing} = this.props.state.CoatingUniversity;
        if (!isClickRefreshing && isLoadMore) {
            if (tagKey === coatingKey && listData.length > 8) {
                if (listData.length >= count) {
                    return (
                        <FooterWanView/>
                    )
                } else {
                    return (
                        <FooterIngView/>
                    )
                }
            } else {
                return null;
            }
        }
        return null;
    }

    renderHeader() {
        return (
            <View style={{flex: 1}}>
                {this.props.viewType !== 'NewsView' ? this.props.header() : null}
                {this.typeLabel()}
            </View>
        )
    }

    typeLabel() {
        const {selectCoatingLabelList, selectCoatingLabel} = this.props.state.CoatingUniversity;
        return (
            <CommonArticleTypeView
                {...this.props}
                callBacks={(item, type, selectObj) => this.callBacks(item, type, selectObj)}
                listData={selectCoatingLabelList}
                selectedView={selectCoatingLabel.value}
                ref={(home) => {
                    this.ArticleType = home
                }}
                viewType="Coating"
            />)
    }

    callBacks(item, selectObj) {
        if (!isReq) {
            isReq = 1;
            this.props.coatingUniversityAction.fetchSetSelectCoatingChildLabel(item, selectObj);
            this.loadData(2)
        }
    }

    loadData(option) {
        const {navigate} = this.props.navigation;
        page = 1;
        this.reqNetwork(option);
    }

    reqNetwork(option) {
        const {
            selectCoatingLabel: {value = '', type = '', key = '', articleType},
            selectCoatingChildLabel: {key: cKey, articleType: cArticleType, type: cType, value: cValue}
        } = this.props.state.CoatingUniversity;
        // console.log(value, key, type, articleType)
        // console.log(cValue, cKey, cType, cArticleType)
        let data = {
            pageSize: pageSize,
            pageIndex: page,
            label: key || cKey,
            type: key ? type : cType,
            scope: 'university',
            articleType: key ? articleType : cArticleType,
            tagKey: `${value}-${cValue}`,
            option
        };
        this.props.coatingUniversityAction.fetchCoatingList(data, this.props.navigation, () => {
            setTimeout(() => {
                this.setState({
                    isRefreshing: false
                });
            }, 2 * 1000);
            isReq = 0;
        })//从第三个开始 isrefreshing isLoadMore,type
    }

// 服务器有没有更多数据
    isMore() {
        const {coatingListData, receiveDataObj: {count, isLoadMore, page, pageCount}} = this.props.state.CoatingUniversity;
        return isLoadMore && count !== undefined && coatingListData.length <= count && page <= pageCount;
    }

    onRefresh() {
        this.setState({
            isRefreshing: true
        }, () => {
            this.loadData(3)
        })
    }

    onEndReached() {
        const {isLoadMore} = this.props.state.CoatingUniversity;
        if (!this.isMore() || isLoadMore) {

        } else {
            this.commonOnEndReached()
        }
    }

    commonOnEndReached() {
        const {navigate} = this.props.navigation;
        const {receiveDataObj: {pageCount, tagKey}, coatingKey} = this.props.state.CoatingUniversity;
        if (tagKey === coatingKey && page < pageCount) {
            page++;
            this.reqNetwork(page, 1)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        homeAction: bindActionCreators(HomeAction, dispatch),
        coatingUniversityAction: bindActionCreators(CoatingUniversityAction, dispatch),
    })
)(ClassifyListView);