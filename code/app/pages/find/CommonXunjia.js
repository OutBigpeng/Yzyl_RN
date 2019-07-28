/**
 * Created by coatu on 2016/12/26.
 */
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {BGTextColor, deviceWidth, LoginAlerts, MobileAlerts, PlatfIOS, px2dp, Sizes} from "../../common/CommonDevice";
import {CustomPhone} from "../../common/CommonUtil";
import {Image, InteractionManager, Linking, StyleSheet, Text, View} from "react-native";
import ATouchableHighlight from "../../component/ATouchableHighlight";

export default class CommonXunjia extends Component {

    static propTypes = {
        isLeftMargin: PropTypes.bool,
        view: PropTypes.string,
        onSharePress: PropTypes.func
    };
    static defaultProps = {
        isLeftMargin: false,
        view: '',//三个类型： collect ,product,productDetail
        onSharePress: null
    };

// 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
        };
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let {isLeftMargin, view} = this.props;
        let viewStyle = view !== 'productDetail' ? {
            position: 'absolute',
            bottom: 0
        } : {};
        return (
            <View style={[styles.priceView, isLeftMargin ? {marginLeft: 20} : {},  viewStyle ]}>
                {this.isXunJia()}
            </View>
        )
    }

    isXunJia() {
        let {view} = this.props;
        return (
            <View style={{flexDirection: 'row'}}>
                {this.showXunjia()}
                {view != 'collect' ?
                    <ATouchableHighlight onPress={() => this.jumpSample()}>
                        <View style={[styles.iconStyle, {
                            backgroundColor: BGTextColor,
                            borderWidth: 0,
                            borderColor: 'transparent',
                            padding: PlatfIOS ? 4 : 5,
                            justifyContent: 'center'
                        }]}>
                            <Image source={require('../../imgs/shop/suoyang.png')} style={{width: 16, height: 16}}/>
                            <Text style={{
                                color: 'white',
                                fontSize: px2dp(Sizes.searchSize),
                                marginLeft: PlatfIOS ? 2 : 4
                            }}>索 样</Text>
                        </View>
                    </ATouchableHighlight> : null}
            </View>
        )
    }

    showXunjia() {
        return (
            <ATouchableHighlight onPress={() => this.isPhone()}>
                <View style={[styles.iconStyle, {justifyContent: 'center', padding: 4}]}>
                    <Image source={require('../../imgs/find/xunjia.png')} style={{width: 12, height: 16}}/>
                    <Text style={styles.textXunjia}>咨 询</Text>
                </View>
            </ATouchableHighlight>
        )
    }

    isPhone() {
        let {rowData = {}} = this.props;

        if (rowData.telephone) {
            MobileAlerts('拨打客服电话？', rowData.telephone, () => {
                Linking.openURL("tel:" + rowData.telephone)
            })
        } else {
            CustomPhone((res) => {
                MobileAlerts('拨打客服电话？', res, () => {
                    Linking.openURL("tel:" + res)
                })
            })
        }
    }

    jumpSample() {
        const {navigate} = this.props.navigation;
        const {rowData, pid} = this.props;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        if (!isLoginIn) {
            LoginAlerts(this.props.navigation,{
                callback:()=>{
                    this.props.callback&&this.props.callback()
                }
            })
        } else {
            InteractionManager.runAfterInteractions(() => {
                navigate('ProductForSample', {
                    name: 'ProductForSample',
                    title: '索样',
                    productName: (rowData.brandname || "") + (rowData.productname || rowData.name),
                    productDetail: rowData.inaworddescription,
                    pid: rowData.productid || pid
                })
            })
        }
    }

}
const styles = StyleSheet.create({
    priceView: {
        flexDirection: 'row',
        width: deviceWidth - 160,
        flexWrap: 'wrap',  //marginTop: 4,
    },
    iconStyle: {
        marginRight: 20,
        width: 60,
        height: 25,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: BGTextColor,
        borderWidth: 1,
        borderRadius: 3,
        alignItems: 'center',
    },
    textXunjia: {
        color: BGTextColor,
        fontSize: px2dp(Sizes.searchSize),
        marginLeft: PlatfIOS ? 3 : 4
    },
});
