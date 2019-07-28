import React, {Component} from 'react';
import {Animated, ListView, RefreshControl, StyleSheet, View} from 'react-native';
import *as HomeAction from '../../actions/HomeAction'
import {BGColor, bindActionCreators, connect} from '../../common/CommonDevice'
import CommonArticleTypeView from './CommonArticleTypeView'
import {FooterIngView, FooterWanView} from '../../component/CommonListHeaderFooter'
import CommonHomeListView from '../../component/CommonHomeListView'
import {pushToHomeDetail} from "./HomeJumpUtil";
import * as CoatingUniversityAction from "../../actions/CoatingUniversityAction";

let page = 1;
let pageSize = 10;

class HomeList extends Component {
    renderRow = (rowData) => {
        const {navigate} = this.props.navigation;
        return (
            <CommonHomeListView
                {...this.props}
                item={rowData}
                imgSizeType={"80"}
                onPress={() => {
                    const {homeSelectedLabel, technicalSelectedLabel, newSelectedLabel} = this.props.state.Home;
                    let label;
                    if (this.props.viewType === 'Home') {
                        label = homeSelectedLabel
                    } else if (this.props.viewType === 'Coating') {
                        label = technicalSelectedLabel
                    } else {
                        label = newSelectedLabel
                    }
                    pushToHomeDetail(navigate, rowData, label, this.props.viewType !== 'Coating' ? 0 : 3)
                }}/>
        )
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds,
            isRefreshing: false,
            isLoad: false,
            isLoadingMore: false,
            maxId: '',
            isMores: false,
            dataArray: [],
            headType: false,
            scrollY: new Animated.Value(0),
            homeScrollY: new Animated.Value(0),
        };
        this._isMounted;

    }

    componentDidMount() {
        this._isMounted = true;
        this.loadData(0)
    }

    loadData(maxtime, option) {
        let type = !option ? this.props.viewType === 'Coating' ? 'coating' : this.props.viewType === 'Home' ? 'home' : 'new' : option;
        const {navigate} = this.props.navigation;
        const {newSelectedLabelName, homeSelectedLabelName, technicalSelectedId, homelabelType,
            technicallabelType,
            newlabelType, } = this.props.state.Home;
        page = 1;
        let data = {
            "pageSize": pageSize,
            "pageIndex": page,
            'label': type === 'home' ? homeSelectedLabelName : type === 'new' ? newSelectedLabelName : type === 'coating' ? technicalSelectedId : null,
            type: type === 'home' ? homelabelType : type === 'new' ? newlabelType : type === 'coating' ? technicallabelType : null,
        };
        if (maxtime === 1) {
            this.props.homeAction.fetchHomeListInfo(data, this.props.navigation, type, true, false, page)//从第三个开始 isrefreshing isLoadMore,type
        } else if (maxtime === 0) {
            this.props.homeAction.fetchHomeListInfo(data, this.props.navigation, type, false, false, page)//从第三个开始 isrefreshing isLoadMore,type
        }
    }

    // 服务器有没有更多数据
    isMore() {
        const {homeListData, homeListArray, technicalListData, technicalListArray, newListData, newListArray} = this.props.state.Home;
        if (this.props.viewType === 'Home') {
            return homeListData.length !== homeListArray.count;
        } else if (this.props.viewType === 'Coating') {
            return technicalListData.length !== technicalListArray.count;
        } else {
            return newListData.length !== newListArray.count;
        }
    }

    onEndReached() {
        const {isLoadMore} = this.props.state.Home;
        if (!this.isMore() || isLoadMore) {

        } else {
            const {homeListArray, technicalListArray, newListArray} = this.props.state.Home;
            let type = this.props.viewType === 'Coating' ? 'coating' : this.props.viewType === 'Home' ? 'home' : 'new';
            if (type === 'home') {
                this.commonOnEndReached(homeListArray, type)
            } else if (type === 'coating') {
                this.commonOnEndReached(technicalListArray, type)
            } else {
                this.commonOnEndReached(newListArray, type)
            }
        }
    }

    commonOnEndReached(listArray, type,) {
        const {navigate} = this.props.navigation;
        const {homePages, newPages, technicalPages, newSelectedLabelName, homeSelectedLabelName, technicalSelectedId,  homelabelType,
            technicallabelType,
            newlabelType,} = this.props.state.Home;
        let page = 1;
        if (type === 'home') {
            page = homePages
        } else if (type === 'coating') {
            page = technicalPages
        } else {
            page = newPages
        }

        if (page < listArray.pageCount) {
            page++;
            let data = {
                "pageSize": pageSize,
                "pageIndex": page,
                'label': type === 'home' ? homeSelectedLabelName : type === 'new' ? newSelectedLabelName : type === 'coating' ? technicalSelectedId : null,
                type: type === 'home' ? homelabelType : type === 'new' ? newlabelType : type === 'coating' ? technicallabelType : null,
            };
            this.props.homeAction.fetchHomeListInfo(data, this.props.navigation, type, false, true, page)
        }
    }

    onScroll(e) {
        this.listMoveHeight = e.nativeEvent.contentOffset.y;
        if (this.props.viewType === 'Home' && this.props.scrollCallbak) {
            this.props.scrollCallbak(this.listMoveHeight)
        }
    }

    callBacks(item) {
        if (this.props.viewType === 'Home') {
            this.props.homeAction.selectedLabelInfo(item, 'home', false);
        } else if (this.props.viewType === 'Coating') {
            this.props.homeAction.selectedLabelInfo(item, 'coating', false);
        } else if (this.props.viewType === 'NewsView') {
            this.props.homeAction.selectedLabelInfo(item, 'new', false);
        }
        // this.selectedLabel = this.props.viewType == 'Coating' ? item.name : item.keyName;
        // this.selectedCatId = this.props.viewType == 'Coating' ? item.id : null;

        this.loadData(0);
    }

    componentWillReceiveProps(nextProps) {

        // if ( this.props.viewType == 'Coating') {
        //     this.props.scrollCallbak(this.state.scrollY)
        //     // this.getLoading().dismiss()
        // }
        const {selectedLabelStatus, technicalSelectedId, loginTechnicalStatus} = nextProps.state.Home;
        if (selectedLabelStatus === true) {
            this.selectedCatId = technicalSelectedId;
            this.loadData(0, 'coating');
        }
    }

    render() {
        const {homeListData, isRefreshing, technicalListData, newListData} = this.props.state.Home;
        const {bgStyle} = this.props;
        let data;
        if (this.props.viewType === 'Coating') {
            data = technicalListData
        } else if (this.props.viewType === 'Home') {
            data = homeListData
        } else {
            data = newListData
        }
        return (
            <View style={[bgStyle, {backgroundColor: BGColor,}, this.props.viewType !== "Home" ? {flex: 1} : {}]}>
                <ListView
                    contentContainerStyle={{marginTop: this.props.viewType === 'NewsView' ? 0 : -20}}
                    dataSource={this.state.dataSource.cloneWithRows(data)}
                    renderRow={this.renderRow}
                    onScroll={this.props.viewType === 'Coating' || this.props.viewType === 'Home' ? this.props.scroll : null}//: ? (e) => this.onScroll(e)
                    scrollEventThrottle={16}
                    initialListSize={5}
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

    renderHeader() {
        return (
            <View style={{flex: 1}}>
                {this.props.viewType !== 'NewsView' ? this.props.header() : null}
                {this.typeLabel()}
            </View>
        )

    }

    typeLabel() {
        const {newSelectedLabelName} = this.props.state.Home;
        return (
            <CommonArticleTypeView
                {...this.props}
                callBacks={(item) => this.callBacks(item)}
                listData={this.props.typeData}
                selectedView={newSelectedLabelName}
                ref={(home) => {
                    this.ArticleType = home
                }}
                viewType={this.props.viewType}
            />)
    }

    onRefresh() {
        // this.props.getNetwork();
        this.loadData(1)
    }

    renderFooter() {
        const {homeListData, homeListArray, newListData, technicalListData, technicalListArray, newListArray} = this.props.state.Home;
        if (this.props.viewType === 'Coating') {
            return (
                this.commonFooterView(technicalListData, technicalListArray)
            )
        }
        if (this.props.viewType === 'Home') {
            return (
                this.commonFooterView(homeListData, homeListArray)
            )
        } else {
            return (
                this.commonFooterView(newListData, newListArray)
            )
        }
    }

    commonFooterView(listData, listArray) {
        if (listData.length >= 8) {
            if (listData.length >= listArray.count) {
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

    componentWillUnmount() {
        this._isMounted = false
    }
}

const styles = StyleSheet.create({
    loadDataStyle: {
        marginVertical: 20
    },
    loadMoreStyle: {
        marginVertical: 20
    },
});


export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        homeAction: bindActionCreators(HomeAction, dispatch),
        coatingUniversityAction: bindActionCreators(CoatingUniversityAction, dispatch),

    })
)(HomeList);