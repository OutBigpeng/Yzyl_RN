/**
 * Created by Monika on 2018/7/16.
 */
'use strict';
import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {connect, deviceWidth} from "../../common/CommonDevice";
import ATouchableHighlight from "../../component/ATouchableHighlight";


class ChildTabView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    };

    componentDidMount() {
    }

    render() {
        let {headData = [], selectedHead, onPress = {}, style, selectedColor = 'red'} = this.props;
        return (
            <View style={[styles.allViewStyle, style]}>
                {headData.map(({keyName, keyValue}, pos) => {
                    return (
                        <ATouchableHighlight key={pos} onPress={() => onPress(keyName)}>
                            <View style={styles.ViewStyle}>
                                <View style={[{
                                    borderBottomWidth: selectedHead !== keyName ? 0 : 1,
                                    borderBottomColor: selectedHead === keyName ? selectedColor : 'transparent',
                                }, styles.boxViewStyle]}>
                                    <Text>{keyValue}</Text>
                                </View>
                            </View>
                        </ATouchableHighlight>
                    )
                })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    allViewStyle: {
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
        flexDirection: 'row',
        alignItems: 'center',
        height: 35,
        justifyContent: 'space-around',
        backgroundColor: 'white'
    },

    ViewStyle: {
        width: deviceWidth / 2 - 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    boxViewStyle: {
        width: 70,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(ChildTabView);