/**
 * Created by Monika on 2016/12/27.
 */

'use strict';
import React, {Component} from "react";
import {Image, InteractionManager, Linking, Text, View} from "react-native";
import {
    _,
    BGColor,
    BGTextColor,
    bindActionCreators,
    connect,
    deviceHeight,
    deviceWidth,
    Loading,
    LoginAlerts,
    MobclickAgent,
    MobileAlerts,
    PlatfIOS,
    px2dp,
    Sizes
} from "../../../common/CommonDevice";
import {CustomPhone} from "../../../common/CommonUtil";
import ProductCenterView from "./ProductCenterView";
import {productDetailById} from "../../../dao/FindDao";
import * as FindAction from "../../../actions/FindAction";
import LoadingView from "../../../common/ActionLoading";
import ShareModalView from "../../../component/ShareModalView";

import {Images} from "../../../pstyle";
import ATouchableHighlight from "../../../component/ATouchableHighlight";
import {StyleSheet} from "../../../themes";
import NavigatorView from "../../../component/NavigatorView";

let alertTitle = '拨打客服电话?';

class ProductDetailView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            packageList: [],
            product: '',
            productDetailObj: {},
            BrannerData: '',
            count: 1,
            isLoading: false,
            modalVisible: false,
            isCollect: null,
            disabled: false
        };
        this._isMounted;
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    render() {
        const {state} = this.props.navigation;
        let {product = {}} = this.state.productDetailObj;

        let {isLoginIn} = this.props.state.Login;
        let isCollect = this.state.isCollect;//已收藏
        let count = this.props.state.Find.collectProductCount;
        return (
            <View style={styles.container}>
                <NavigatorView
                    {...this.props}
                    // leftImageSource={true}
                    contentTitle={'产品详情'}
                    rightImageSource={true}
                    onRightPress={() => this.jumpSearch()}
                />
                {this.productCenter()}

                <View style={styles.bottomStyle}>
                    {/*左边*/}
                    <ATouchableHighlight onPress={() => this.pushToCollectView(product)}>
                        <View style={[{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
                        }, PlatfIOS ? {width: deviceWidth * 4 / 6} : {width: deviceWidth * 4 / 5.5}]}>
                            {this.getTypeData(require('../../../imgs/home/share.png'), '分享', 1)}
                            {this.getTypeData(require('../../../imgs/shop/xunjia2.png'), '咨询', 2)}
                            {this.getTypeData(require('../../../imgs/shop/suoyang.png'), '索样', 3)}

                            {/*收藏夹*/}
                            <View style={[{alignItems: 'center', justifyContent: 'center'}, PlatfIOS ? {flex: 1,} : {
                                height: 50,
                                width: deviceWidth / 5.5,
                            }]}>
                                <Image source={Images.iconShop} style={{width: 22, height: 22}}/>
                                <Text style={styles.iconTextStyle}>收藏夹</Text>

                                {isLoginIn && count > 0 ? <View style={[styles.shopCountStyle, PlatfIOS ? {} : {}]}>
                                    <Text
                                        style={[{
                                            color: BGTextColor,
                                            textAlign: 'center',
                                            fontSize: PlatfIOS ? px2dp(Sizes.searchSize) : px2dp(Sizes.otherSize)
                                        }, PlatfIOS ? {} : {}]}>{count > 99 ? "..." : count}</Text>
                                </View> : null}
                            </View>

                        </View>
                    </ATouchableHighlight>

                    {/*右边*/}
                    <ATouchableHighlight
                        ref={(component) => {
                            this.collectButtom = component
                        }}
                        disabled={this.state.disabled}
                        onPress={() => this.addCollect(isCollect)}>
                        <View style={[styles.RightViewStyle, {backgroundColor: isCollect ? 'gray' : BGTextColor}]}>
                            <Text
                                style={{
                                    color: isCollect ? '#ccc' : 'white',
                                    fontSize: PlatfIOS ? px2dp(Sizes.navSize) : px2dp(Sizes.listSize)
                                }}>{isCollect ? "取消收藏" : "添加收藏"}</Text>
                        </View>
                    </ATouchableHighlight>
                </View>

                {state.params.pid && <ShareModalView
                    key={'pro_share'}
                    {...this.props}
                    visible={this.state.modalVisible}
                    closeModal={() => this.setModalVisible(false)}
                    isProShare={true}
                    pid={state.params.pid}
                    shareDiscuss={{
                        title: `${product.brandname} ${product.productname}`,
                        pid: state.params.pid,
                        thumb: state.params.thumb,
                    }}
                    data={product}
                    loginAfter={() => this.loginAfter()}
                />}
                <Loading ref={'loading'}/>
            </View>
        );
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    getTypeData(imageSource, text, option) {
        return (
            <ATouchableHighlight style={{flex: 1}} onPress={() => this.typeOnPress(option)} key={option}>
                <View style={{alignItems: 'center'}}>
                    <Image source={imageSource} style={{width: 22, height: 22}}/>
                    <Text style={styles.iconTextStyle}>{text}</Text>
                </View>
            </ATouchableHighlight>
        )
    }

    typeOnPress(option) {
        let product = this.state.productDetailObj.product;
        const {navigate, state} = this.props.navigation;
        let {isLoginIn} = this.props.state.Login;
        switch (option) {
            case 1://分享
                // if (isLoginIn) {
                this.setModalVisible(true);
                // } else {
                //     LoginAlerts(this.props.navigation)
                // }
                break;
            case 2://咨询
                this.isPhone();
                break;
            case 3://索样
                if (isLoginIn) {
                    InteractionManager.runAfterInteractions(() => {
                        navigate('ProductForSample', {
                            name: 'ProductForSample',
                            title: '索样',
                            productName: (product.brandname || "") + product.productname,
                            productDetail: product.inaworddescription,
                            pid: state.params.pid
                        })
                    });
                } else {
                    this.jumpLogin()
                }
                break;
        }
    }

    jumpLogin() {
        LoginAlerts(this.props.navigation, {
            callback: () => {
                this.loginAfter()
            }
        });
    }

    loginAfter() {
        this.getLoading() && this.getLoading().show();
        this.props.findAction.fetchCollectProductCount({}, 0);
        this.LoadNetWork(() => {
            this.getLoading() && this.getLoading().dismiss();
        })
    }

    isPhone() {
        let array = this.state.productDetailObj;
        if (array && array.product && array.product.telephone) {
            MobileAlerts('拨打客服电话？', array.product.telephone, () => {
                Linking.openURL("tel:" + array.product.telephone)
            })
        } else {
            CustomPhone((res) => {
                MobileAlerts('拨打客服电话？', res, () => {
                    Linking.openURL("tel:" + res)
                })
            })
        }
    }

    jumpSearch() {
        const {navigate} = this.props.navigation;
        InteractionManager.runAfterInteractions(() => {
            navigate('SearchFirstView', {
                name: "SearchFirstView",
                paged: 5,
                selectItem: "Pro",
                rightImageSource: true
            })
        })
    }

    componentDidMount() {
        this._isMounted = true;
        this.LoadNetWork();
    }

    componentWillUnmount() {
        const {navigate, state} = this.props.navigation;
        this._isMounted = false;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        isLoginIn && state.params.callback && state.params.callback();
    }

    productCenter() {
        const {pid, mobile} = this.props.navigation.state.params;
        if (this.state.isLoading) {
            return (
                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                    <ATouchableHighlight onPress={() => this.errorNotWork()}>
                        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                            <Text style={{fontSize: px2dp(Sizes.navSize), color: 'gray'}}>点击重试</Text>
                        </View>
                    </ATouchableHighlight>
                </View>
            )
        } else {
            if (!_.isEmpty(this.state.productDetailObj)) {
                return (
                    <ProductCenterView
                        {...this.props}
                        productDetailObj={this.state.productDetailObj}
                        packageList={this.state.packageList}
                        BrannerData={this.state.BrannerData}
                        pid={pid}
                        mobile={mobile}
                    />
                )
            }
            else {
                return (
                    <LoadingView/>
                )
            }
        }
    }

    errorNotWork() {
        this.LoadNetWork();
    }

    LoadNetWork(callback = () => {
    }) {
        const {navigate, state} = this.props.navigation;
        let data = {
            "pid": state.params.pid,
            "view": true
        };
        productDetailById(data, this.props.navigation, (res) => {
            let JSONText;
            if (res.product.prodimg) {
                JSONText = JSON.parse(res.product.prodimg);
            } else {
                JSONText = ''
            }
            this._isMounted && this.setState({
                productDetailObj: res,
                packageList: res.packageList,
                product: res.product,
                BrannerData: JSONText,
                isLoading: false,
                isCollect: res.product && res.product.isCollect === 1
            });
            callback();
        }, (error) => {
            callback();
            this._isMounted && this.setState({
                isLoading: true
            })
        })
    }

    //添加收藏
    addCollect(flag) {
        const {navigate} = this.props.navigation;
        let {isLoginIn, userObj = {}} = this.props.state.Login;
        if (isLoginIn) {
            this._isMounted && this.setState({disabled: true});
            this.collectButtom.disabled = true;
            let {productname, productid} = this.state.product;
            let data = {
                "userid": userObj.userid,
                "productid": productid,
                "isCollect": !flag
            };
            let mobData = {"name": productname};
            MobclickAgent.onEvent("yz_addCollectProduct", mobData);

            this.props.findAction.fetchAddCollectProduct(data, this.props.navigation, (t) => {
                this.collectButtom.disabled = false;
                this._isMounted && this.setState({
                    isCollect: !flag,
                    disabled: false
                })
            })
        } else {
            this.jumpLogin()
        }
    }

    pushToCollectView(product) {
        let {isLoginIn} = this.props.state.Login;
        if (isLoginIn) {
            const {navigate} = this.props.navigation;
            navigate('CollectionView', {
                'title': '收藏夹', callback: () => {
                    this.props.findAction.fetchCollectProductFromID(product.productid, (t) => {
                        if (!t)
                            this._isMounted && this.setState({
                                isCollect: false
                            })
                    })
                }
            })
        } else {
            this.jumpLogin()
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: BGColor,
        flex: 1,
        height: deviceHeight
    },

    bottomStyle: {
        position: 'absolute',
        width: deviceWidth,
        height: 50,
        bottom: 0,
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconTextStyle: {
        marginTop: PlatfIOS ? 6 : 3,
        color: 'white',
        fontSize: PlatfIOS ? px2dp(Sizes.searchSize) : px2dp(Sizes.otherSize)
    },
    leftViewStyle: {
        marginLeft: 10,
        height: 50,
        alignItems: 'center',
        paddingRight: PlatfIOS ? 0 : 10,
        justifyContent: 'center'
    },

    contentViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
        // flex:3
    },


    RightViewStyle: {
        backgroundColor: BGTextColor,
        height: 50,
        width: PlatfIOS ? 110 : deviceWidth / 4,
        alignItems: 'center',
        justifyContent: 'center',

    },
    shopCountStyle: {
        position: 'absolute',
        backgroundColor: 'white',
        ios: {
            top: -2,
            right: 8,
            // paddingTop: 2,
            // paddingBottom: 2,
            // paddingLeft: 5,
            // paddingRight: 5,
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
        },
        android: {
            top: 5,
            right: deviceWidth / 5.5 / 2 - 18,
            alignItems: 'center',
            justifyContent: 'center',
            width: 15,
            height: 15,
            padding: 1
        },
        borderRadius: PlatfIOS ? 10 : 7.5,
    },

    jianStyle: {
        backgroundColor: 'white',
        padding: 10,
        borderWidth: 0.5,
        borderColor: '#rgba(236,236,236,1)'
    },

    textStyle: {
        textAlign: 'center',
        backgroundColor: 'white',
        padding: 10,
        width: PlatfIOS ? 50 : 40,
        borderWidth: 0.5,
        borderColor: '#rgba(236,236,236,1)'
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        findAction: bindActionCreators(FindAction, dispatch),
    })
)(ProductDetailView);
