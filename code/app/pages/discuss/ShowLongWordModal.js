/**
 * Created by Monika on 2018/7/12.
 */


'use strict';
import React, {Component} from "react";
import {Modal, ScrollView, Text} from "react-native";
import {px2dp} from "../../common/CommonUtil";
import {PlatfIOS, actionBar} from "../../common/CommonDevice";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {scaleSize} from "../../common/ScreenUtil";
import {StyleSheet} from '../../themes'


class ShowLongWordModal extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    };

    render() {
        let {content, onPress} = this.props;
        return (
            <Modal
                visible={this.props.modalVisible}
                animationType={"none"}
                transparent={true}
                onRequestClose={() => onPress()}
            >
                <ScrollView style={styles.container}>
                    <ATouchableHighlight style={styles.all} onPress={() => onPress()}>
                        <Text style={{lineHeight: scaleSize(50), fontSize: px2dp(PlatfIOS ? 16 : 14)}}>{content}</Text>
                    </ATouchableHighlight>
                </ScrollView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        ios: {
            marginTop: 25
        }
    },
    all: {
        padding: scaleSize(20),
        flex: 1,
    }

});

export default ShowLongWordModal;