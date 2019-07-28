/**
 * Created by Monika on 2017/7/3.
 */
import React, {PureComponent} from "react";
import {Modal, StyleSheet, Text, View} from "react-native";
import {deviceWidth} from "../../common/CommonDevice";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {px2dp} from "../../common/CommonUtil";
import {scaleSize} from "../../common/ScreenUtil";

export default class ShowCopyModal extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        let {list = [], onPress} = this.props;
        return (
            <Modal
                visible={this.props.modalVisible}
                animationType={"none"}
                transparent={true}
                onRequestClose={() => onPress()}
            >
                <View style={styles.bgViewStyle} onPress={() => onPress()}>
                    <View style={{alignSelf: 'flex-end', width: deviceWidth / 4}}>
                        <ATouchableHighlight onPress={() => onPress()}>
                            <View style={{
                                borderRadius: scaleSize(23), borderColor: 'white',
                                width: scaleSize(46), height: scaleSize(46),
                                backgroundColor: 'white',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{fontSize: px2dp(15)}}>Ｘ</Text>
                            </View>
                        </ATouchableHighlight>
                    </View>
                    {list.map((item, pos) => {
                        return (
                            <View key={pos} style={{backgroundColor: 'white'}}>
                                <ATouchableHighlight style={[(pos + 1) % list.length !== 0 ? {
                                    borderBottomColor: '#eeeeee',
                                    borderBottomWidth: scaleSize(1),
                                } : {}]} onPress={() => onPress(pos, item)}>
                                    <View style={{
                                        width: deviceWidth / 2,
                                        paddingVertical: scaleSize(25),
                                        alignItems: 'center',
                                        borderRadius: scaleSize(2)
                                    }}>
                                        <Text style={{color: 'rgba(0,0,0,0.8)'}}>{item.keyValue || item}</Text>
                                    </View>
                                </ATouchableHighlight>
                            </View>)
                    })}
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    bgViewStyle: {
        backgroundColor: '#rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

});
