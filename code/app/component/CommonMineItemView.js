/**首页——我的——条目
 * Created by coatu on 2016/12/23.
 */
import React, {Component} from "react";
import {Image, Platform, StyleSheet, Text, View} from "react-native";
import {
    BGTextColor,
    bindActionCreators,
    borderColor,
    borderRadius,
    connect,
    deviceWidth,
    px2dp, Sizes,
    textHeight
} from "../common/CommonDevice";
import *as MeAction from '../actions/MeAction'
import Images from "../themes/Images";
import ATouchableHighlight from "./ATouchableHighlight";
import {scaleSize, setSpText} from "../common/ScreenUtil";

var isCollection = false;

class CommonMineItemView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        // this.state = {
        //     isJpush:false
        // };

    }

    // componentWillUnmount(){
    //     this.subscription.remove();
    // }
    render() {
        return (
            <ATouchableHighlight onPress={this.props.pushTodetail}>
                <View style={styles.container}>
                    <View style={styles.leftViewStyle}>
                        {this.ImageView()}
                        <Text
                            style={{
                                marginLeft: Platform.OS === 'ios' ? 8 : 18,
                                fontSize: Platform.OS === 'ios' ? px2dp(Sizes.listSize) : px2dp(Sizes.searchSize),
                                color: '#353535',
                            }}>{this.props.title}</Text>
                    </View>

                    <View style={styles.leftViewStyle}>
                        <Text style={{color: 'gray', fontSize: setSpText(22)}}>{this.props.detailTitle}</Text>
                        {this.props.title.indexOf("客服") < 0 ? <Image source={Images.right_arrow}
                                                                     style={{width: 10, height: 15, marginLeft: 8}}/> :
                            <View/>}
                    </View>
                </View>
            </ATouchableHighlight>
        )
    }

    ImageView() {
        if (this.props.title === '我的关注' || this.props.title === '收藏夹' || this.props.title === '我的消息'||this.props.title==='我的私聊') {
            return (
                <View>
                    <Image source={!isCollection ? this.props.leftImage : require('../imgs/me/shoucang2.png')}
                           style={styles.img}/>
                    {this.props.isReadCount ? this.isMsgCount() : null}
                </View>
            )
        } else if (this.props.title === '优惠券') {
            return (
                <Image source={this.props.leftImage} style={{width: 20, height: 14, marginRight: 1}}/>
            )
        }
        else {
            return (
                <Image source={this.props.leftImage} style={styles.img}/>
            )
        }
    }
    // ()
    // componentWillReceiveProps(nextProps) {
    //     AsyncStorage.getItem('SHOPCOUNT', (err,id)=>{
    //         var item = JSON.parse(id);
    //         console.log('item',item)
    //         if(item < nextProps.state.ShopCart.ShopCount){
    //             console.log('item23232323233232')
    //             isCollection = true
    //         }else {
    //             isCollection = false
    //         }
    //     });
    // }

    isMsgCount() {
        return (
            this.props.isJpush || this.props.isReadCount > 0 ?<View style={styles.msgViewStyle}/>:null
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: deviceWidth,
        padding: 15,
        borderBottomColor: borderColor,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: textHeight
    },

    leftViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        width: 18,
        height: 18,
        marginRight: 3,
        resizeMode: Image.resizeMode.stretch
    },
    msgViewStyle: {
        borderRadius: borderRadius,
        backgroundColor: 'red',
        position: 'absolute',
        top: -3,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: scaleSize(12),
        height: scaleSize(12)
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(MeAction, dispatch)
    })
)(CommonMineItemView);

