/**
 * Created by Monika on 2017/4/10.
 */
import React, {Component} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import NavigatorView from "../../component/NavigatorView";
import {BGColor} from "../../common/CommonDevice";
import {Images} from "../../pstyle";

export default class TechnicalFormula extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentView}>
                    <Image
                        source={Images.iconWaiting} style={styles.uploadAvatar}/>
                    <Text>更多惊喜，敬请期待！</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },
    contentView: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 5,
        backgroundColor: 'white'
    },
    uploadAvatar: {
        resizeMode: 'contain',
        width: 80,
        height: 59,
        marginBottom: 10
    }
});
