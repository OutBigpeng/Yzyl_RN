/**
 * Created by Monika on 2017/9/29.
 */

import React, {Component} from 'react';
import {Dimensions, Image, View} from 'react-native';
import TabNavigator from './containers/custabbar/TabNavigator';
import {Colors, Images, StyleSheet} from './themes/index';
import *as LoginAction from "./actions/LoginAction";

import Product from './pages/find/FindView';
import Mine from './pages/me/MeView';
import University from './pages/technical/Technical';
import Home from './pages/home/Home1';

import * as TabSwitchAction from "./actions/TabSwitchAction";
import * as HomeAction from "./actions/HomeAction";
import * as FindAction from "./actions/FindAction";
import {bindActionCreators, connect, PlatfIOS} from './common/CommonDevice'
import * as MeAction from "./actions/MeAction";
import {isUpdate} from "./common/UpdateVersion";
import * as DiscussAction from "./actions/DiscussAction";
import DiscussTabView from "./pages/discuss/DiscussTabView";
import {isEmptyObject} from "./common/CommonUtil";
import * as CoatingUniversityAction from "./actions/CoatingUniversityAction";

const {width, height} = Dimensions.get('window');

const basePx = 375;

function px2dp(px) {
    return px * width / basePx
}

let homeObj = [
    {
        position: 0,
        title: '主页',
        icon: Images.home,
        selectedIcon: Images.homeSel,
        selectTab: 'HOME',
        component: Home
    },
    {
        position: 1,
        title: '产品',
        icon: Images.findProduct,
        selectedIcon: Images.findProductSel,
        selectTab: 'PRODUCT',
        component: Product
    },
    {
        position: 2,
        title: '发现',
        icon: Images.discussCircle,
        selectTab: 'INTERLOCUTION',
        component: DiscussTabView,
        isCenter: true
    },
    {
        position: 3,
        title: '大学',
        icon: Images.university,
        selectedIcon: Images.universitySel,
        component: University,
        selectTab: 'UNIVERSITY'
    },
    {
        position: 4,
        title: '我的',
        icon: Images.mine,
        selectedIcon: Images.mineSel,
        component: Mine,
        selectTab: 'MINE'
    }];
//默认启动哪一个页面
let defaultPage = 2;

class TabHome extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态props&&||
        let {state: {params}} = this.props.navigation;
        let index = this.props.index;
        this.state = {
            modalVisible: false,
            selectedTab: (index !== undefined && index > -1) ? index : defaultPage
        };
    }

    componentWillReceiveProps(nextProps) {
        const {index, isFromJpush} = nextProps.state.TabSwitch;
        if (isFromJpush && this.props.state.TabSwitch.index !== index) {
            this.setState({selectedTab: index});
            this.props.tabSwitchAction.chageJpush(false);
        }
        if (this.props.state.TabSwitch.isTabSwitch) {
            this.setState({selectedTab: 1});
            this.props.tabSwitchAction.chageGoBack(false);
        }
    }

    componentDidMount() {
        this.callback()
    }

    callback() {
        !PlatfIOS && isUpdate({props: this.props, type: '', callback: this.callback.bind(this)})
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    tabItem(tabObj, key) {
        let centerStyle = [styles.iconStyle, {}];
        let tabStyle = [styles.tabStyle];
        return (
            <TabNavigator.Item
                key={key}
                selected={this.state.selectedTab === tabObj.position}
                title={tabObj.title}
                tabStyle={tabStyle}
                titleStyle={{color: 'white'}}
                // renderBadge = {()=>this.setBadge(44)}
                //badgeText={9}
                // style={{backgroundColor: 'red'}}
                selectedTitleStyle={{color: Colors.redColor}}
                centerIsCircle={tabObj.isCenter}
                renderIcon={() => this.returnIcon(tabObj, false, tabObj.isCenter ? centerStyle : {})}
                renderSelectedIcon={() => this.returnIcon(tabObj, true, tabObj.isCenter ? centerStyle : {})}
                onPress={() => this.tabSwitch(tabObj.position)}>
                <tabObj.component {...this.props} callbackParent={this.onChildChanged.bind(this)}/>
            </TabNavigator.Item>
        )
    }

    tabSwitch(pos) {
        this.setState({selectedTab: pos}, () => {
        });
        this.props.tabSwitchAction.switchTabIndex('switch', pos);
    }

    /**
     * 子组件的回调
     * @param index  当前要跳转的tab 的index
     * @param data  当前对该tab页的子组件 点击传送的数据
     */
    onChildChanged(index, data = {}) {
        switch (index) {
            case 0:
                // this.Home;
                this.setState({selectedTab: 0});
                break;
            case 1:
                // this.Product
                this.setState({selectedTab: 1});
                break;
            case 2:
                // this.广场
                this.setState({selectedTab: 2});
                break;
            case 3:
                // this.Technical && this.Technical.switchType(data);
                this.setState({selectedTab: 3});
                if (!isEmptyObject(data)) {//pIndex:4,pChildIndex:0
                    this.props.coatingUniversityAction.fetchSetSelectCoatingChildLabelValue(data.pValue, data.pChildValue, 'switch');
                }
                break;
            case 4:
                // this.Mine
                this.props.meAction.fetchMyScore();
                this.props.meAction.fetchMyExpertScore((res) => {
                    this.props.loginAction.updateUserInfo(res);
                });
                this.setState({selectedTab: 4});
                break;
            default:
                break;
        }
    }

    /** { homeObj.map((item, index) => {
return this.tabItem(item,index)
})*/
    render() {
        return (
            <TabNavigator style={styles.container}
                          tabBarShadowStyle={{backgroundColor: 'transparent'}}
            >
                {homeObj.map((item, index) => {
                    return this.tabItem(item, index)
                })}
            </TabNavigator>
        );
    }

    // setBadge(badge) {
    //     if (badge !== 0) {
    //         return (
    //             <CustomBadge children={badge}/>
    //         )
    //     }
    // }

    returnIcon(obj, select, style = {}) {
//          <View style={{width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center',backgroundColor:'red'}}>
        if (obj.position === 2) {
            return (
                <View style={[styles.iconView, {
                    marginBottom: -3, width: 40, height: 40, borderRadius: 20,
                    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.tabBarColor
                }]}>
                    <Image
                        style={[{width: 30, height: 30, margin: 3}]}
                        resizeMode='cover'
                        source={obj.icon}/>
                </View>)
        } else {
            return (
                <View style={[styles.iconView]}>
                    <Image style={[{width: 22.8, height: 21.3}]}
                           resizeMode='stretch' source={select ? obj.selectedIcon : obj.icon}/>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.tabBarColor,
    },
    titleStyle: {fontSize: px2dp(12)},
    iconView: {alignItems: 'center', padding: 2},
    iconStyle: {alignItems: 'center'},
    tabStyle: {
        backgroundColor: Colors.tabBarColor,
        justifyContent: 'flex-end',
        alignItems: 'center',
        // ios: {
        //     height: 40
        // }
    },
});
export default connect(state => ({
        state: state,
        routes: state.nav.routes,
    }),
    (dispatch) => ({
        tabSwitchAction: bindActionCreators(TabSwitchAction, dispatch),
        homeAction: bindActionCreators(HomeAction, dispatch),
        findAction: bindActionCreators(FindAction, dispatch),
        meAction: bindActionCreators(MeAction, dispatch),
        discussAction: bindActionCreators(DiscussAction, dispatch),
        loginAction: bindActionCreators(LoginAction, dispatch),
        coatingUniversityAction: bindActionCreators(CoatingUniversityAction, dispatch),
    })
)(TabHome);