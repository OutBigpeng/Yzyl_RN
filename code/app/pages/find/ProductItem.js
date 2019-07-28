/**产品列表的条目
 * Created by Monika on 2016/12/30.
 */
import React, {PureComponent} from "react";
import {Image, InteractionManager, Platform, StyleSheet, Text, View} from "react-native";
import {borderColor, Colors, deviceWidth, MobclickAgent, px2dp, Sizes} from "../../common/CommonDevice";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import Images from "../../themes/Images";
import {scaleSize} from "../../common/ScreenUtil";
import {formatCurrency} from "../../common/CommonUtil";

export default class ProductItem extends PureComponent {

// 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
        this._isMounted;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        let {rowData: {thumb, brandname, name, inaworddescription, markeunitofmeasurement, markeunittprice = 0}} = this.props;
        return (
            <View style={{backgroundColor: 'white', width: '100%'}}>
                <ATouchableHighlight onPress={() => this.pushToProductDetail()}>
                    <View style={styles.productViewStyle}>
                        <View style={styles.leftViewStyle}>
                            <Image
                                resizeMode={Image.resizeMode.contain}
                                source={thumb ? {uri: thumb} : Images.proDefaultImage}
                                style={styles.leftImageStyle}
                            />
                        </View>

                        <View style={styles.rightViewStyle}>
                            <View>
                                <Text numberOfLines={2}
                                      style={{
                                          fontSize: px2dp(Sizes.listSize),
                                          color: Colors.titleColor
                                      }}>{brandname} {name}</Text>
                                {/* {this.props.view !== 'abstract' ?
                                <CommonXunjia
                                    {...this.props}
                                    rowData={rowData}
                                    view="product"/> : null}*/}
                                <Text numberOfLines={2} style={{
                                    fontSize: px2dp(Sizes.searchSize),
                                    color: Colors.ExplainColor,
                                    paddingTop: scaleSize(8)
                                }}>{inaworddescription}</Text>
                            </View>
                            {markeunittprice ? <Text style={{
                                color: Colors.titleColor,
                                paddingVertical: scaleSize(5),
                                alignSelf: 'flex-end',
                                paddingRight:scaleSize(10),
                                fontSize: px2dp(Sizes.searchSize),
                            }}>指导价：￥{formatCurrency(markeunittprice.toFixed(2))}/{markeunitofmeasurement}</Text> : null}
                        </View>
                    </View>
                </ATouchableHighlight>
            </View>
        );
    }

    pushToProductDetail() {
        const {navigate} = this.props.navigation;
        let {rowData: {brandname, name, productid, thumb}} = this.props;
        let data = {'name': brandname + name};
        MobclickAgent.onEvent("yz_product", data);
        InteractionManager.runAfterInteractions(() => {
            navigate('ProductDetail', {
                name: 'ProductDetail',
                title: '产品详情',
                pid: productid,
                thumb: thumb,
                rightImageSource: true
            })
        })
    }

}
const styles = StyleSheet.create({
    productViewStyle: {
        width: '100%',
        padding: scaleSize(20),
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        backgroundColor: 'white'
    },

    leftViewStyle: {
        // marginHorizontal:scaleSize(20)
        // width: scaleSize(170),
        // height: scaleSize(170),
    },

    leftImageStyle: {
        width: scaleSize(160),
        height: scaleSize(160),
    },

    rightViewStyle: {
        paddingHorizontal: scaleSize(20),
        width: deviceWidth - scaleSize(170),
        justifyContent: 'space-between'
    },
    container: {
        width: '100%',
        marginTop: Platform.OS === 'ios' ? 15 : 5,
        backgroundColor: 'white',
    },
});