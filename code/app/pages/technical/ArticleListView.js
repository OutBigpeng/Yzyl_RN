/** 大学页面顶部搜索
 * Created by coatu on 2017/1/4.
 */
import React, {Component} from "react";
import {ListView, Platform, StyleSheet, Text, View} from "react-native";
import {CommonNavTitleView, NoDataView} from '../../component/CommonAssembly';
import {Alerts} from "../../common/CommonUtil";
import {
    _,
    actionBar,
    BGColor,
    BGTextColor,
    borderColor,
    borderRadius,
    Colors,
    connect,
    deviceWidth,
    Loading,
    LoginAlerts,
    MobclickAgent,
    px2dp,
    Sizes
} from "../../common/CommonDevice";
import PullToRefreshListView from "react-native-smart-pull-to-refresh-listview";
import {_renderFooter, _renderHeader} from "../../component/CommonRefresh";
import CommonHomeListView from "../../component/CommonHomeListView";
import {getHomeListData} from "../../dao/HomeDao";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {pushToHomeDetail} from "../home/HomeJumpUtil";

let defaultSearchName = '';//文本框输入的参数
let searchContent = '';//和defaultSearchName 意义一样 用于区分是文本框的值 还是从别处传过来的值
let paged = 0;//1、用户输入是搜索 2、品牌产品  3、分类  4、 5、从热门搜索进来 默认为关键字搜索。
//views:2  来自主页  1：大学
let page = 1;
let pageSize = 10;
let isLoadMore = false;

let oldText = '', newText = '';
let fromPaged = '';

let dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});


class CommonRadiuButton extends Component {
    render() {
        const {title, viewStyle, onPress} = this.props;
        return (
            <ATouchableHighlight onPress={() => onPress(title)}>
                <View style={[styles.radiusButtonViewStyle, viewStyle]}>
                    <Text style={styles.radiusButtonTextStyle}>{title}</Text>
                </View>
            </ATouchableHighlight>
        )
    }
}

class ArticleListView extends Component {
    _renderRow = (rowData) => {
        const {navigate} = this.props.navigation;
        if (rowData === searchContent) {
            return (
                this._renderEmptyView()
            )
        } else {
            if (rowData && rowData.title) {
                return (
                    <CommonHomeListView
                        {...this.props}
                        item={rowData}
                        imgSizeType={"80"}
                        onPress={() => {
                            // this.pushToDetail(rowData)
                            rowData ? pushToHomeDetail(navigate, rowData, "") : null
                        }}/>
                );
            } else {
                return (<View/>)
            }
        }
    };
    _callback = (defaultText) => {
        // if (defaultText) {
        defaultSearchName = defaultText;
        paged = 4;
        // }
    };
    search = () => {
        if (paged === 4) {
            searchContent = defaultSearchName;
        } else if (paged === 5) {
        } else {
        }
        if (!searchContent) {
            Alerts('请输入搜索内容');
        } else {
            // paged = 2;
            this.setState({
                dataSource: dataSource,
                dataList: [],
            });

            this.getNetwork(1)
        }
    };
    _onChangeVisibleRows = (visibleRows, changedRows) => {
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

        let dataList = [];
        searchContent = "";
        defaultSearchName = searchContent;
        this.state = {
            searchName: this.props.navigation.state.params.searchName || searchContent,//传过来的搜索参数
            modalVisible: false,
            rowData: {},
            dataSource: dataSource,
            dataList: dataList,
            isNetWork: true,
            listKeyword: []
        };
        searchContent = this.props.navigation.state.params.searchName || this.props.searchName || '';
        paged = this.props.navigation.state.params.paged || this.props.paged;
        oldText = this.props.searchName;
        fromPaged = this.props.fromPaged;
    }

    componentWillUnmount() {
        defaultSearchName = "";
        searchContent = '';
    }

    backView() {
        const {goBack, state} = this.props.navigation;
        goBack();
    }

    componentDidMount() {
        const {navigate} = this.props.navigation;
        // if (!this.state.searchName) {
        //     getArtListKeyword(this.props.navigation, (res) => {
        //         this.setState({
        //             listKeyword: res
        //         });
        //     }, (error) => {
        //     });
        // }
        if (searchContent) {
            if (this._pullToRefreshListView) {
                this._pullToRefreshListView.beginRefresh()
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        newText = nextProps.searchName;
        if (this.props.searchName) {
            if (this.props.searchName !== nextProps.searchName || this.props.fromPaged !== nextProps.fromPaged) {
                searchContent = nextProps.searchName;
                fromPaged = nextProps.fromPaged;
                this.setReq(searchContent)
            }
        } else {
            if (nextProps.searchName) {
                searchContent = nextProps.searchName;
                fromPaged = nextProps.fromPaged;
                this.setReq(searchContent)
            }
        }
    }

    setReq(searchName) {
        this.setState({
            dataSource: dataSource,
        }, () => {
            if(searchName){
                if (this._pullToRefreshListView) {
                    this._pullToRefreshListView.beginRefresh()
                } else {
                    this.getNetwork(1, searchName)
                }
            }
        })
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }


    scrollToTop() {
        this._pullToRefreshListView && this._pullToRefreshListView._scrollView.scrollTo({x: 0, y: 0, animated: true})
    }


    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        const {state} = this.props.navigation;
        return (
            <View style={styles.container}>
                {this.state.isNetWork ?
                    <PullToRefreshListView
                        ref={(component) => this._pullToRefreshListView = component}
                        viewType={PullToRefreshListView.constants.viewType.listView}
                        contentContainerStyle={{
                            backgroundColor: 'transparent',
                        }}
                        initialListSize={20}
                        enableEmptySections={true}
                        dataSource={this.state.dataSource}
                        pageSize={20}
                        renderRow={this._renderRow}
                        renderHeader={_renderHeader}
                        renderFooter={_renderFooter}
                        onRefresh={this._onRefresh}
                        onLoadMore={this._onLoadMore}
                        onChangeVisibleRows={this._onChangeVisibleRows}
                        removeClippedSubviews={false}
                        scrollEnabled={!_.isEmpty(this.state.dataList)}
                    /> : <NoDataView title="数据" onPress={() => this.getNetwork(1)}/>}
                <Loading ref={'loading'}/>
            </View>
        )
    }

    jumpLogin() {
        const {navigate} = this.props.navigation;
        LoginAlerts(this.props.navigation)
    }

    _renderEmptyView() {
        if (paged === 1) {
            if (!_.isEmpty(this.state.listKeyword)) {
                return (
                    <View style={{flex: 1, backgroundColor: 'white'}}>
                        <CommonNavTitleView
                            title='大家都在搜'
                            viewStyle={{paddingTop: 12}}
                            fontsize={Sizes.listSize}
                        />
                        <View style={{flexDirection: 'row', padding: 8}}>
                            {this.state.listKeyword.map((item, i) => {
                                return (
                                    <CommonRadiuButton
                                        title={item.keyword}
                                        key={i}
                                        viewStyle={{marginLeft: i !== 0 ? 8 : 0}}
                                        onPress={(title) => {
                                            if (title) {
                                                this.props.navigation.setParams({
                                                    defaultValues: title
                                                });
                                                defaultSearchName = title;
                                                paged = 4;
                                                this.search();
                                            }
                                        }}
                                    />
                                )
                            })}
                        </View>
                    </View>
                )
            } else {
                return (
                    <View/>
                )
            }
        } else {
            let emptyContent = searchContent;
            return (
                <View style={styles.emptyView}>
                    <Text style={styles.noDataText}>
                        没有找到与“{emptyContent ? emptyContent : this.props.navigation.state.params.bname}”相关的文章，
                    </Text>
                    <Text style={styles.noDataText}>
                        请换个词再试。
                    </Text>
                </View>
            );
            // defaultSearchName = searchContent = ''
        }
    }

    getNetwork(option, searchname) {
        const {state} = this.props.navigation;
        // if (paged === 1) {//仅仅是搜索
        //     if (this._pullToRefreshListView) {
        //         this._pullToRefreshListView.endRefresh()
        //     }
        // }
        if (option === 1) {
            // this.scrollToTop();
            isLoadMore = false;
            // this._pullToRefreshListView && this._pullToRefreshListView.endLoadMore(false);
            page = 1
        } else {
            page++
        }
        let data = {
            "pageSize": pageSize,
            "pageIndex": page,
            searchkey: searchname ? searchname : searchContent,
            scope: fromPaged === "Home" ? "news" : "university"
        };
        if (searchContent) {
            let temp = {'name': searchContent};
            MobclickAgent.onEvent("yz_airicleSearch", temp);
        }
        if (paged === 1) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(['无数据']),
            });
        }
        if (searchContent !== '') {
            this.getLoadNetWork(option, data)
        }
    }

    getLoadNetWork(option, data) {//oo的出现只是为了刷新数据。让数据可以清空
        const {navigate} = this.props.navigation;

        getHomeListData(data, this.props.navigation, (res) => {
            let newDataList = option === 1 ? [].concat(res.data) : this.state.dataList.concat(res.data);
            this.setState({
                dataList: option === 1 ? _.isEmpty(res.data) ? [] : res.data : newDataList,
                dataSource: this.state.dataSource.cloneWithRows(option === 1 ? _.isEmpty(res.data) ? [searchContent] : res.data : newDataList),
                isNetWork: true
            }, () => {
            });

            if (option === 2) {
                let loadedAll;
                if (newDataList.length >= res.count) {
                    loadedAll = true;
                    this._pullToRefreshListView.endLoadMore(loadedAll)
                }
                else {
                    loadedAll = false;
                    this._pullToRefreshListView.endLoadMore(loadedAll)
                }
            } else {
                this._pullToRefreshListView.endRefresh();
            }
        }, (err) => {
            this.setState({
                isNetWork: false
            });

        })
    }

    componentWillUnmount() {
        searchContent = "";
        fromPaged = "";
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
        // height: deviceHeight
    },

    noDataText: {
        fontSize: Platform.OS === 'ios' ? 16 : 14,
        marginTop: Platform.OS === 'ios' ? 8 : 0,
        color: 'gray'
    },
    emptyView: {
        justifyContent: 'center',
        padding: 20,
        marginTop: 25,
        flex: 1,
        backgroundColor: BGColor,
    },
    searchViewStyle: {
        width: deviceWidth,
        height: Platform.OS === 'ios' ? 64 : actionBar,
        flexDirection: 'row',
        backgroundColor: BGTextColor,
        alignItems: 'center'
    },
    left_img: {
        width: 40,
        height: actionBar,
    },
    textInputStyle: {
        width: deviceWidth - 100,
        borderRadius: 3,
        backgroundColor: 'white',
        margin: 5,
        borderWidth: 1,
        borderColor: borderColor,
        fontSize: 14
    },

    refreshTextStyle: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row'
    },

    radiusButtonViewStyle: {
        padding: 6,
        borderColor: Colors.line,
        borderWidth: 1,
        borderRadius: borderRadius
    },

    radiusButtonTextStyle: {
        fontSize: Sizes.searchSize,
        color: Colors.contactColor
    },

    refreshingTextStyle: {
        color: Colors.ExplainColor,
        fontSize: px2dp(Sizes.searchSize)
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({}), null, {withRef: true}
)(ArticleListView);
/*
 *    pushToDetail(rowData) {
 const {navigate} = this.props.navigation;
 if (rowData.catId) {
 switch (rowData.catId) {
 case 10://课程
 navigate('CurriculumDetailView', {
 title: '课程详情',
 id: rowData.id,
 rightImageSource: true,
 rightImage:require('../../imgs/shop/shoucang.png')
 });
 break;
 case 11://配方
 // AsyncStorage.getItem(BUYINFO, (error, res) => {
 //     if (error) {
 //         this.jumpLogin()
 //     }
 //     if (res) {
 //         let item = JSON.parse(res);
 //         if (item.areaid) {
 navigate('FormulaXNView', {
 title: rowData.title,
 id: rowData.id,
 rightImageSource: true,
 rightImage:require('../../imgs/shop/shoucang.png')
 });
 //     } else {
 //         this.jumpLogin();
 //     }
 // } else {
 //     this.jumpLogin();
 // }
 // });
 break;
 default:
 this.jumpArticle(navigate, rowData);
 break;
 }
 } else {
 this.jumpArticle(navigate, rowData)
 }
 }
 jumpArticle(navigate, rowData) {
 navigate('HomeArticleView', {
 title: '正文',
 sn: rowData.sn,
 rightImageSource: true,
 rightImage: require('../../imgs/home/share.png'),
 isRightFirstImage:true
 })
 }

 *
 *
 *
 * */