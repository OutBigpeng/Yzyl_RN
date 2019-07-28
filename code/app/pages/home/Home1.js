import React, {Component} from 'react'
import {Animated, StyleSheet, View} from 'react-native'

import HomeList from './HomeList'
import {
    _,
    actionBar,
    BGColor,
    BGTextColor,
    bindActionCreators,
    Colors,
    connect,
    deviceHeight,
    Loading,
    LoginAlerts,
    PlatfIOS,
    px2dp,
    Sizes
} from '../../common/CommonDevice'
import BrannerView from '../../component/BrannerView'
import RecommendedBrand from '../find/RecommendedBrand'
import *as HomeAction from '../../actions/HomeAction'
import *as FindAction from "../../actions/FindAction";
import {getListAppLabel, getListShowGroupByCode} from "../../dao/HomeDao";
import HomeTypeView from './HomeTypeView'
import ProductNavigator from '../find/ProductNavigator'
import {NoDataView} from '../../component/CommonAssembly'
import {StringData} from '../../themes'
import NavigatorView from '../../component/NavigatorView'
import {scaleSize} from "../../common/ScreenUtil";
import {CircleSuspend} from "../../component/CircleSuspend";

let typeLabelBts = [];

class Home1 extends Component {
    header = () => {
        return (
            <View style={{width: '100%'}}>
                <BrannerView key={'home_brannerView'}{...this.props} type={0}/>
                {!_.isEmpty(this.state.labelData) ?
                    <HomeTypeView
                        {...this.props}
                        callback={this.callback.bind(this)}
                        isImage={true}
                        AllHeight={150}
                        boxHeight={75}
                        BGColor={'white'}
                        itemArray={this.state.labelData}//this.state.labelData
                        titleColor={Colors.textColor}
                        MarginTop={5}
                        MarginBottom={5}
                        viewType="Home"
                    /> : <View/>}
                <RecommendedBrand
                    {...this.props}
                    type={1}
                />
            </View>
        )
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            scrollY: new Animated.Value(0),
            headType: false,
            labelData: [],
            isNetWork: true,
            isRefreshing: false
        };
        this._isMounted;
    }

    getLoading() {
        return this.refs['loading'];
    }

    componentDidMount() {
        this._isMounted = true;
        this.getNetwork();
    }

    getNetwork() {
        this.getLoading().show();
        this.props.homeAction.fetchHomeRecommendIfNeeded({}, true);
        this.props.findAction.fetchBrannerIfNeeded(0);

        let {navigate} = this.props.navigation;
        getListAppLabel(this.props.navigation, (res) => {
            this._isMounted && this.setState({
                labelData: res,
                isNetWork: true,
                isRefreshing: false
            });
        }, (error) => {
            this.getLoading().dismiss();
            this._isMounted && this.state.isNetWork && this.setState({
                isNetWork: false
            })
        });

        getListShowGroupByCode("home", 0, (res) => {
            if (res) {
                typeLabelBts = res;
                if (res[0]) {
                    let typeDatum = res[0];
                    this.props.homeAction.selectedLabelInfo(typeDatum, 'home', false);
                }
            }
        }, (error) => {
            this._isMounted && this.state.isNetWork && this.setState({
                isNetWork: false
            })
        })
    }

    componentWillReceiveProps(nextProps) {
        const {Home} = nextProps.state;
        if (Home.homeRecommendData.length > 0 && !_.isEmpty(this.state.labelData)) {
            this.getLoading().dismiss();
        }
        setTimeout(() => {
            if (this.getLoading()) {
                this.getLoading().dismiss();
            }
        }, 1000);
    }

    componentWillUnmount() {
        this._isMounted = false;
        // this.props.state.Home.homeRecommendData = [];
    }

    render() {//height:deviceHeight  >
        return (
            <View style={[{backgroundColor: BGColor, height: deviceHeight, flex: 1}]}>
                {this.setActionBar()}
                {this.state.isNetWork ? !_.isEmpty(typeLabelBts) ?
                    this.typeList(typeLabelBts) :
                    this.state.isNetWork ? <View/> : <NoDataView title={'请重试'} type={1} style={{marginTop: actionBar}}
                                                                 onPress={() => this.getNetwork()}
                    />
                    : this.state.isNetWork ?
                        this.noDataView(1) :
                        this.noDataView(2)}
                <CircleSuspend
                    {...this.props}
                    text={`积分\n任务`}
                    onPress={() => this.pushToView()}
                />
                <Loading ref={'loading'}/>
            </View>
        )
    }

    pushToView() {
        let {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        if (isLoginIn) {
            navigate('ScoreTaskView', {title: '积分任务'})
        } else {
            LoginAlerts(this.props.navigation)
        }
    }

    noDataView(option) {
        return (
            <View style={{flex: 1}}>
                {/*  <NavigatorView
                    {...this.props}
                    contentTitle=''
                    isShowTabBar={true}
                    leftImageSource={false}
                />*/}
                <NoDataView title={option === 2 ? StringData.noNetWorkText : "数据"} onPress={() => this.getNetwork()}
                            type={option === 2 ? 1 : 2}/>
            </View>
        )
    }

    setActionBar() {/*<View key="sticky-header"
                  style={{
                    paddingTop:0,
                    width: 0,
                    height: 0,
                    opacity: 0,position:'absolute',top:0}} ref={(c) => this._view = c}>
                <Text style={styles.stickySectionText}>主页</Text>
            </View>*/
        let lbsOpaticy = this.state.scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: ['rgba(228,57,60,0)', 'rgba(228,57,60,1)']
        });
        return (
            <ProductNavigator
                {...this.props}
                lbsOpaticy={lbsOpaticy}
                page='home'
                isNetWork={this.state.isNetWork}
                searchOnPress={() => this.pushToSearchView()}
            />
        )
    }

    pushToSearchView() {
        const {navigate} = this.props.navigation;
        navigate('SearchFirstView', {
            rightImageSource: true,
            selectItem: 'Home',
            paged: 5
        })
    }

    callback(index, data) {
        this.props.callbackParent(index, data);
    }

    typeList(data) {
        return (
            <HomeList
                ref={(c) => this._list = c}
                {...this.props}
                header={this.header}
                typeData={typeLabelBts}
                viewType="Home"
                bgStyle={{flex: 1}}
                scroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                //bgStyle={{marginBottom:PlatfIOS?0:0}}//72
                // scrollCallbak={(item)=>this.scrollCallBack(item)}
                getNetwork={() => this.getNetwork()}
            />
        )
    }

    // scrollCallBack(item) {
    //     if (item > 128) {
    //         this._view.setNativeProps({
    //             style: {
    //                 height: actionBar,
    //                 width: deviceWidth,
    //                 backgroundColor: BGTextColor,
    //                 opacity: 1,
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //                 paddingTop: 0,
    //                 position: 'absolute',
    //                 top: 0
    //             }
    //         })
    //     } else {
    //         if (item < 128) {
    //             this._view.setNativeProps({
    //                 style: {
    //                     width: 0,
    //                     height: 0,
    //                     opacity: 0,
    //                     paddingTop: 0,
    //                     position: 'absolute', top: 0
    //                 }
    //             })
    //         }
    //     }
    // }
}

const styles = StyleSheet.create({
    stickySection: {
        height: actionBar,
        backgroundColor: BGTextColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stickySectionText: {
        color: 'white',
        fontSize: px2dp(Sizes.navSize),
        alignSelf: 'center',
        marginTop: PlatfIOS ? 10 : 0
    },
    positionViewStyle: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        position: 'absolute',
        bottom: scaleSize(100),
        right: scaleSize(20),
        backgroundColor: BGTextColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        findAction: bindActionCreators(FindAction, dispatch),
        homeAction: bindActionCreators(HomeAction, dispatch),
    })
)(Home1);