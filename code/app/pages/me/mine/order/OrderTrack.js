/**订单跟踪
 * Created by Monika on 2016/12/27.
 */
'use strict';
import React, {Component} from "react";
import {View, StyleSheet, Text, Image, Platform} from "react-native";
import {perJsonOrderTrack} from "../../../../dao/OrderDao";
import NavigatorView from "../../../../component/NavigatorView";
import {Loading, deviceWidth, deviceHeight, BGColor, borderColor, MobclickAgent,px2dp,Sizes} from "../../../../common/CommonDevice";
export default class OrderTrack extends Component {
// 构造
    constructor(props) {
        super(props);

        // 初始状态
        this.state = {
            listData: []
        };
    }

    getLoading() {
        return this.refs['loading'];
    }

    render() {
        const {orderNum,orderStatu} = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'column', width: deviceWidth, backgroundColor: 'white', marginTop: 8}}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 10,
                        borderBottomColor: borderColor,
                        borderBottomWidth: Platform.OS ==='ios'?1:0.3,
                        alignItems:'center'
                    }}>
                        <Text style={{color: 'black', fontSize:px2dp(Sizes.listSize)}}>订单号:{orderNum}</Text>
                        <Text style={{color: '#e5383c', fontSize:px2dp(Sizes.listSize)}}>{orderStatu}</Text>
                    </View>
                    {this.renderRow()}
                </View>
                <Loading ref={'loading'} text={'请等待...'}/>
            </View>
        )
    }


    renderRow() {
        let trackArr = [];
        for (let i = 0; i < this.state.listData.length; i++) {
            trackArr.push(
                <View style={{backgroundColor: 'white'}} key={i}>
                    <View style={styles.track_view}>
                        <Image style={styles.track_iv}
                               source={(i == 0 ? require('../../../../imgs/me/track_red.png') : require('../../../../imgs/me/track_gray.png'))}/>
                        <View style={{
                            padding: 8
                        }}>
                            <Text
                                style={{color: '#rgba(0,0,0,0.8)', fontSize:px2dp(Sizes.listSize)}}>{this.state.listData[i].content}</Text>
                            <Text style={{fontSize:px2dp(Sizes.searchSize),marginTop:7}}>{this.state.listData[i].ctime}</Text>
                        </View>
                    </View>
                </View>
            )
        }
        return trackArr;
    }

    componentDidMount() {
        MobclickAgent.onPageStart('订单追踪');
        this.getLoading().show();
        const {navigate} = this.props.navigation;
        perJsonOrderTrack(this.props.navigation.state.params.orderId, this.props.navigation, (result) => {
            this.getLoading().dismiss();
            this.setState({
                listData: result
            });
        }, (err) => {
            this.getLoading().dismiss();
        });
    }

    componentWillUnmount() {
        MobclickAgent.onPageEnd('订单追踪');
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },
    track_view: {
        flexDirection: 'row',
        width: deviceWidth,
        borderBottomColor: '#rgba(0,0,0,0.1)',
        borderBottomWidth: 0.3,
        paddingLeft: 10
    },
    track_iv: {
        width: 8.54,
        height: 40,
        alignSelf: 'center',
        marginTop: 10,
        resizeMode: 'stretch',
        marginBottom: -3
    },
    listViewStyle: {
        marginTop: 5,
        height: deviceHeight - 220
    }
});