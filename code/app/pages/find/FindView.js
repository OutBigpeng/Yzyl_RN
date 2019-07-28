import React, {Component} from 'react';
import {Animated, Dimensions, Image, SectionList, StyleSheet, View} from 'react-native';
import ProductNavigator from "../find/ProductNavigator";
import {
    _,
    BGColor,
    bindActionCreators,
    borderColor,
    Colors,
    connect,
    deviceHeight,
    deviceWidth,
    Loading
} from "../../common/CommonDevice";
import * as FindAction from "../../actions/FindAction";
import * as LoginAction from "../../actions/LoginAction";
import {getProductList, queryListBrandFirstPY} from "../../dao/FindDao";
import BrannerView from "../../component/BrannerView";
import RecommendedBrand from "../find/RecommendedBrand";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {scaleSize} from "../../common/ScreenUtil";
import {Images} from "../../themes";
import NavigatorView from "../../component/NavigatorView";
import {NoDataView} from "../../component/CommonAssembly";
import StringData from "../../themes/StringData";
import ModalDropdown from '../../component/ModalDropdown';
import {getListFirstPYByParentKey, getSysDictionaryData} from "../../dao/SysDao";
import {px2dp} from "../../common/CommonUtil";
import ProductItem from "./ProductItem";
import {FooterIngView, FooterWanView} from "../../component/CommonListHeaderFooter";
import {_renderActivityIndicator} from "../../component/CommonRefresh";

const dimension = Dimensions.get('window');

let pageIndex = 1;
let pageSize = 10;
let isReqData = 1;

let imgSortDownWidth = scaleSize(25);

class FindView extends Component {
    _renderSectionHeader = (info) => {
        // let lbsOpaticy = this.state.scrollY.interpolate({
        //     inputRange: [150, 400],
        //     outputRange: ['#cccccc44', Colors.situColor]
        // });
        let data = info.section.keys;
        return (
            <Animated.View style={{
                flexDirection: 'row', backgroundColor: 'white',
                width: deviceWidth, borderBottomColor: borderColor, borderBottomWidth: scaleSize(2)
            }}>
                {data.map((obj, pos) => {
                    let {keyName, keyValue, item} = obj;
                    let showValue = keyValue;
                    if (item && (item.keyValue || item.name)) {
                        showValue = item.keyValue || item.name;
                    }
                    return (
                        <View key={pos} style={{alignItems: "center", width: deviceWidth / data.length}}>
                            {!pos ?
                                this.optionModal(obj, pos, data)
                                :
                                <ATouchableHighlight onPress={() => this.clickIndex(obj, pos, data, info)}>
                                    {this.btView(showValue, data)}
                                </ATouchableHighlight>}
                        </View>
                    )
                })}
            </Animated.View>
        )
    };
    _renderItem = ({item: rowData}) => {
        let {noData} = rowData;
        if (!noData) {
            return (
                <ProductItem
                    {...this.props}
                    rowData={rowData}
                />
            )
        } else {
            return this.noData();
        }
    };
    noData = () => {
        return (
            <NoDataView title="数据" height={{marginTop: 100, height: deviceHeight}}
                        onPress={() => this.getNetWorkPage(1)}/>
        )
    };

// 构造
    constructor(props) {
        super(props);
        let data = {
            keys: [
                {keyName: 'intellSort', keyValue: '智能排序'},
                {keyName: 'applArea', keyValue: '应用领域'},
                {keyName: 'pp', keyValue: '品牌'},
                {keyName: 'fl', keyValue: '分类'}
            ],
            data: []
        };
        // 初始状态
        this.state = {
            modalVisible: false,
            productKeywords: [],
            scrollY: new Animated.Value(0),
            isRefreshing: false,
            headType: false,
            isNetWork: true,
            isShow: false,
            sortingData: [],
            sortingDataSelectObj: data.keys[0] || {},
            sections: data,
            resObj: {},
        };
        this.reqSelectObj = {};
        this.selectObjABC = {};
        this._isMounted;
    }

    btView(name, data) {
        return (
            <View style={styles.viewStyle}>
                <Animated.Text numberOfLines={1}
                               style={{
                                   color: Colors.titleColor,
                                   textAlign: 'center',
                                   width: deviceWidth / data.length - imgSortDownWidth * 2
                               }}>{name}</Animated.Text>
                <Image ref={com => this.sortImg = com}
                       source={Images.sortGrayDown}
                       style={{
                           width: imgSortDownWidth,
                           height: imgSortDownWidth,
                       }}/>
            </View>
        )
    }

    componentDidMount() {
        this._isMounted = true;
        this.reqData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    reqData(option) {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        this.props.findAction.fetchBrannerIfNeeded(2);
        this.getData(option);
        this.reqOption()
    }

    reqOption() {
        let {sortingDataSelectObj: {keyValue}} = this.state;
        let data = {parentKey: "IntelligentSorting"};
        getSysDictionaryData(data, (res) => {
            if (res && res[0]) {
                this.setState({
                    sortingData: res,
                    sortingDataSelectObj: res[0]
                });
            }
        }, () => {
        })
    }

    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let {isLoginIn} = this.props.state.Login;
        let {isNetWork} = this.state;

        return (
            <View style={styles.container}>
                {isNetWork ? <View style={{flex: 1, width: '100%'}}>
                    <ProductNavigator
                        {...this.props}
                        page='product'
                        // lbsOpaticy={lbsOpaticy}
                    />
                    {this.isData()}
                </View> : this.noDataView()}

                <Loading ref={'loading'}/>
            </View>
        );
    }

    noDataView() {
        return (
            <View style={{flex: 1, width: '100%'}}>
                <NavigatorView
                    {...this.props}
                    contentTitle='产品'
                    leftImageSource={true}
                />
                <NoDataView title={StringData.noNetWorkText} onPress={() => this.reqData()} type={1}/>
            </View>
        )
    }

    isData() {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let {sections, isRefreshing,isClickRefresh} = this.state;
        return (
            <SectionList
                key='find_section'
                renderSectionHeader={this._renderSectionHeader}
                renderItem={isClickRefresh?() =>
                    <View style={{alignItems: "center", justifyContent: 'center', marginTop: scaleSize(10)}}>
                        {_renderActivityIndicator()}
                    </View>:this._renderItem}
                sections={[sections]}
                onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                refreshing={isRefreshing}
                onRefresh={() => this._onRefresh()}
                // refreshControl={
                //     <RefreshControl
                //         refreshing={this.state.isRefreshing}
                //         onRefresh={this._onRefresh.bind(this)}
                //         // colors={['#ddd', '#0398ff']}
                //         // progressBackgroundColor="#ffffff"
                //     />}
                // ListEmptyComponent={()=>{//这个方法会把数据头给搞没。并不是单纯的只显示 没有list
                //   return(<Text>你好</Text>)
                // }
                // }
                keyExtractor={(item, index) => (`index-${index}-${item.id}`)}
                enableEmptySections={true}
                // scrollEventThrottle={16}
                onEndReachedThreshold={0.05}
                initialNumToRender={5}
                stickySectionHeadersEnabled={true}
                onEndReached={() => this.onEndReached()}
                ListFooterComponent={() => this.renderFooter()}
                ListHeaderComponent={() => this.listHeaderComponent()}
            />
        );

    }

    commonFooterView({isLoadMore, count}, listData = []) {
        if (listData.length > 8) {
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

// 服务器有没有更多数据
    isMore() {
        const {sections, resObj: {count, isLoadMore, page, pageCount}} = this.state;
        return isLoadMore && count !== undefined && sections.data && !_.isEmpty(sections.data) && sections.data.length <= count && page <= pageCount;
    }

    onEndReached() {
        if (!this.isMore()) {
        } else {
            this.commonOnEndReached()
        }
    }

    renderFooter() {
        const {sections, resObj} = this.state;
        return (
            this.commonFooterView(resObj, sections.data)
        )
    }

    commonOnEndReached() {
        const {resObj: {page, pageCount}} = this.state;
        if (page < pageCount) {
            pageIndex++;
            this.getNetWorkPage(pageIndex)
        }
    }

    listHeaderComponent() {
        return (
            <View style={{}}>
                {/*图片轮播*/}
                <BrannerView
                    // key={'pro_Branner'}
                    {...this.props}
                    type={2}
                    view={1}/>

                {/*品牌产品*/}
                <RecommendedBrand
                    {...this.props}
                />
            </View>
        )
    }

    getData(option) {
        if (!option) {
            if (this.getLoading()) {
                this.getLoading().show();
            }
        }
        const {navigate} = this.props.navigation;
        this.props.findAction.fetchBrandIfNeeded({}, true);
        this.getNetWorkPage(1)
    }

    getNetWorkPage(pageIndex) {
        if (isReqData) {
            isReqData = 0;
            this.reqLoading(pageIndex)
        }
    }

    reqLoading(pageIndex) {
        let {sections, sortingDataSelectObj: {keyName = ''}} = this.state;
        let {categoryid = 0, brandid = 0, applArea = ''} = this.reqSelectObj;
        let data = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            categoryid: categoryid,//单一分类检索
            brandid: brandid,//单个品牌检索
            ocolumn: keyName, /**view_count 浏览量,sample_count 索样量,intellSort 智能排序,newUpShelves 不填，则按照listorder,ctime排序*/
            applArea: applArea ? [applArea] : [],//应用领域
        };
        // console.log(data);
        getProductList(data, this.props.navigation, (res) => {
            this.getLoading() && this.getLoading().dismiss();
            let {count = 0, page, pageCount} = res;
            let {data} = sections;
            let newList = pageIndex === 1 ? _.isEmpty(res.data) ? [{noData: '1'}] : [].concat(res.data) : data.concat(res.data);
            this._isMounted && this.setState({
                isRefreshing: false,
                isClickRefresh: false,
                isNetWork: true,
                sections: Object.assign(sections, {data: newList}),
                resObj: {count, page, pageCount, isLoadMore: (page <= pageCount && newList.length <= count)}
            }, () => {
                isReqData = 1
            })
        }, (err) => {
            console.log(err);
            this.getLoading() && this.getLoading().dismiss();
            this._isMounted && this.setState({
                isClickRefresh: false,
                isRefreshing: false,
                isNetWork: false
            }, () => {
                isReqData = 1
            })
        })
    }

    _onRefresh() {
        this.setState({isRefreshing: true});
        setTimeout(() => {
            pageIndex = 1;
            this.getData(1);
        }, 1500)
    }

    clickIndex(obj, index, data, info) {
        switch (index) {
            case 1://应用体系
                let req = (res) => {
                    this.props.navigation.navigate('SectionList', {
                        data: res, title: `请选择${obj.keyValue}`,
                        headObj: obj,
                        callback: ({item, index}) => {
                            obj.item = item;
                            this.reqSelectObj['applArea'] = index > -1 ? item.keyName : '';
                            this.setReqAndData();
                        }
                    })
                };
                if (this.selectObjABC['applArea']) {
                    req(this.selectObjABC['applArea'])
                } else {
                    getListFirstPYByParentKey({parentKey: "applArea"}, (res) => {
                        req(res);
                        this.selectObjABC['applArea'] = res;
                    }, () => {
                    });
                }

                break;
            case 2://品牌
                let reqBrand = (res) => {
                    this.props.navigation.navigate('SectionList', {
                        data: res, title: `请选择${obj.keyValue}`,
                        headObj: obj,
                        callback: ({item, index}) => {
                            obj.item = item;
                            this.reqSelectObj['brandid'] = index > -1 ? item.keyName : 0;
                            this.setReqAndData();
                        }
                    })
                };
                if (this.selectObjABC['BrandFirstPY']) {
                    reqBrand(this.selectObjABC['BrandFirstPY'])
                } else {
                    queryListBrandFirstPY({}, (res) => {
                        reqBrand(res);
                        this.selectObjABC['BrandFirstPY'] = res;
                    }, () => {
                    });
                }

                break;
            case 3:
                this.props.navigation.navigate('AllType', {
                    title: '选择分类',
                    rightTitle: '不限',
                    callback: ({item, index}) => {
                        obj.item = item;
                        this.reqSelectObj['categoryid'] = index > -1 ? item.id : 0;
                        this.setReqAndData();
                    }
                });
                break;
            default:
                break;
        }
    }

    setReqAndData(option) {
        pageIndex = 1;
        this.getNetWorkPage(pageIndex);
        this.setState(option ? {isClickRefresh: true} : {
            sections: Object.assign(this.state.sections, {data: []}),
            isClickRefresh: true
        })
    }

    optionModal(item, pos, data) {
        let {sortingData, sortingDataSelectObj: {keyValue = ''}} = this.state;
        return (
            <ModalDropdown
                onSelect={(rowid, rowData) => {
                    let obj = sortingData[rowid];
                    this.setState({
                        sortingDataSelectObj: Object.assign(obj)
                    }, () => {
                        this.setReqAndData(1)
                    })
                }}
                children={//上面点击的文字与小箭头
                    this.btView(keyValue, data)
                }
                dropdownTextStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: px2dp(14),
                    color: Colors.titleColor,
                }}
                defaultIndex={0}
                defaultValue={keyValue}
                showName={'keyValue'}
                style={{width: deviceWidth / data.length}}
                modalVisible={(flag) => {
                    this.sortImg.setNativeProps({
                        source: !flag ? Images.sortGrayDown : Images.sortUp
                    })
                }}
                dropdownStyle={{
                    width: deviceWidth / (data.length),
                }}
                modalStyle={{backgroundColor: '#aaaaaa44'}}
                options={sortingData.map(item => {
                    return item.keyValue
                })}
                enableEmptySections={true}
                showsVerticalScrollIndicator={false}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BGColor,
    },
    viewStyle: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
        paddingTop: scaleSize(20),
        paddingBottom: scaleSize(18)
    },
});
export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        findAction: bindActionCreators(FindAction, dispatch),
        loginAction: bindActionCreators(LoginAction, dispatch)
    })
)(FindView);