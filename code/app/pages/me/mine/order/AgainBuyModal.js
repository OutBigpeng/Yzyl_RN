/**再次购买
 * Created by Monika on 2016/12/27.
 */
'use strict';
import React, {Component} from "react";
import {Modal, Platform, StyleSheet, Text, View} from "react-native";
import {borderColor, deviceHeight, deviceWidth} from "../../../../common/CommonDevice";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";

export default class AgainBuyModal extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
        };
    }

    render() {
        return (
            <Modal animationType={'none'}
                   transparent={true}
                   visible={this.props.visible}
                   style={{alignSelf: 'flex-end', flexWrap: 'wrap'}}
                   onRequestClose={() => {
                       this.props.callCloseParent(false)
                   }}>
                <View style={styles.container}>
                    <View style={[styles.innerContainer]}>
                        <View style={{borderBottomWidth: 1, borderColor: borderColor}}>
                            <Text style={{padding: 10, color: '#58D1FD'}}>温馨提示</Text>
                        </View>

                        <View
                            style={{
                                padding: 8,
                                borderBottomWidth: Platform.OS === 'ios' ? 1 : 0.3,
                                borderBottomColor: borderColor
                                ,
                                marginTop: Platform.OS === 'ios' ? 0 : 5
                            }}>
                            <Text style={styles.textStyle}>上次购买金额：￥{this.props.showData.ordermoney}</Text>
                            <Text style={styles.textStyle}>本次购买金额：￥{this.props.showData.newordermoney}</Text>
                            <Text
                                style={styles.textStyle}>{(this.props.showData.countoffshelf > 0) ? "下架商品数量  : " + this.props.showData.countoffshelf + "件" : ''}</Text>
                            <Text style={styles.textStyle}> 确定再次购买吗？</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                            {this.clickView("取消", () => {
                                this.props.callCloseParent(false)
                            })}
                            <View
                                style={{
                                    width: 0.5,
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    height: Platform.OS === 'ios' ? 36 : 38
                                }}/>
                            {this.clickView("确定", () => this.clickSure())}
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    clickView(text, onPress) {
        return (
            <View style={{alignItems: 'center', flex: 1, padding: 6}}>
                <ATouchableHighlight onPress={onPress}>
                    <Text style={{padding: Platform.OS === 'ios' ? 10 : 12}}>{text}</Text>
                </ATouchableHighlight>
            </View>
        )
    }

    clickSure() {
        const {navigate} = this.props.navigation;
        this.props.callCloseParent(false, true);
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    innerContainer: {
        borderRadius: 3,
        width: deviceWidth / 3 * 2,
        height: Platform.OS === 'ios' ? deviceHeight / 4 : deviceHeight / 4 * 1.15,
        backgroundColor: 'white',
        justifyContent: 'space-around',
    },
    line: {
        height: 0.5,
        backgroundColor: '#rgba(235,48,35,0.5)',
        width: deviceWidth, marginTop: 2
    },
    textStyle: {
        color: '#rgba(0,0,0,0.8)'
    }
});