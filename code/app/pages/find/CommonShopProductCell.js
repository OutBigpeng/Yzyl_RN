/**购物车的item
 * Created by coatu on 2016/12/22.
 */
import React, {Component} from "react";
import {Alert, Image, InteractionManager, Platform, StyleSheet, Text, View} from "react-native";
import {
    BGTextColor,
    bindActionCreators,
    borderColor,
    connect,
    deviceWidth,
    MobclickAgent,
    px2dp,
    Sizes
} from "../../common/CommonDevice";
import CommonXunjia from "./CommonXunjia";
import * as FindAction from "../../actions/FindAction";

import Swipeout from 'react-native-swipeout';
import ATouchableHighlight from "../../component/ATouchableHighlight";
import Colors from "../../themes/Colors";
import ProductItem from "./ProductItem";

class CommonShopProductCell extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isOpen: false
        };
    }

    render() {
        let rowData = this.props.rowData;
        let swipeoutBtns = [
            {
                text: '删除',
                backgroundColor: BGTextColor,
                color: 'white',
                onPress: () => Alert.alert(
                    '',
                    `确定将该产品从收藏夹中移除?`,
                    [
                        {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                        {text: '确定', onPress: () => this.deleteShop(rowData.productid)},
                    ]
                )
            }
        ];
        return (
            <View style={{backgroundColor: 'white', width: deviceWidth, flex: 1}}>
                <Swipeout autoClose={true} right={swipeoutBtns} backgroundColor='white'>
                  {/*  <ATouchableHighlight onPress={() => this.pushToDetaill(rowData)}>
                        <View style={styles.productViewStyle}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={styles.leftViewStyle}>
                                    <View style={styles.topLeftViewStyle}>
                                        <Image
                                            source={rowData.thumb ? {uri: rowData.thumb} : require('../../imgs/other/defaultimg.png')}
                                            style={styles.leftImageStyle}
                                            resizeMode={Image.resizeMode.contain}
                                        />
                                    </View>
                                </View>

                                <View style={styles.rightViewStyle}>
                                    <Text numberOfLines={2}
                                          style={{
                                              fontSize: px2dp(Sizes.listSize),
                                              color: Colors.titleColor
                                          }}>{rowData.brandname} {rowData.name}</Text>
                                    <CommonXunjia
                                        {...this.props}
                                        rowData={rowData}
                                        view="collect"/>
                                </View>
                            </View>
                        </View>
                    </ATouchableHighlight>*/}
                    <ProductItem
                        {...this.props}
                        rowData={rowData}
                        callback={()=>console.log('')}
                    />
                </Swipeout>
            </View>
        )
    }

    /**
     *
     */
    pushToDetaill(rowData, type) {
        const {navigate} = this.props.navigation;
        if (type) {
            InteractionManager.runAfterInteractions(() => {
                navigate('ProductForSample', {
                    name: "ProductForSample",
                    productName: (rowData.brandname || "") + rowData.name,
                    productDetail: '',
                    pid: rowData.productid
                })
            })
        } else {
            let data = {'name': rowData.brandname + rowData.name};
            MobclickAgent.onEvent("yz_product", data);
            InteractionManager.runAfterInteractions(() => {
                navigate('ProductDetail', {
                    name: "ProductDetail",
                    title: '产品详情',
                    pid: rowData.productid,
                    rightImageSource: true
                })
            })
        }
    }

    deleteShop(proId) {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let data = {
            "userid": userObj.userid,
            "productid": proId,
            "isCollect": false
        };
        this.props.actions.fetchAddCollectProduct(data, navigate, (t) => {
        }, "del")
    }
}

const styles = StyleSheet.create({
    productViewStyle: {
        width: deviceWidth,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        backgroundColor: 'white',
    },

    leftViewStyle: {
        marginRight: 10,
    },

    leftImageStyle: {
        width: 90,
        height: 90,
        marginLeft: 5,
        paddingLeft: 3,
    },

    rightViewStyle: {
        width: deviceWidth - 120,
    },

    rightImageStyle: {
        width: Platform.OS === 'ios' ? 55 : 52,
        height: Platform.OS === 'ios' ? 16 : 15,
        marginTop: 5,
    },

    bottomViewStyle: {
        flexDirection: 'row',
        width: deviceWidth,
        padding: 10,
        alignItems: 'center',
        marginLeft: 10
    },

    topLeftViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectView: {
        width: 20,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageStyle: {
        width: Platform.OS === 'ios' ? 22 : 18,
        height: Platform.OS === 'ios' ? 22 : 18
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(FindAction, dispatch)
    })
)(CommonShopProductCell);