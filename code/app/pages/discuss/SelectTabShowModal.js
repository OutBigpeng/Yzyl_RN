/**
 * Created by Monika on 2018/7/18.
 */


'use strict';
import React, {Component} from "react";
import {FlatList, Image, Modal, StyleSheet, Text, View} from "react-native";
import {actionBar, connect, deviceWidth} from "../../common/CommonDevice";
import {scaleSize} from "../../common/ScreenUtil";
import ATouchableHighlight from "../../component/ATouchableHighlight";

let itemHeight = scaleSize(100);

class SelectTabShowModal extends Component {

    renderRow = ({item, index}) => {
        let {list = [], onPress, selectHead} = this.props;
        let {keyName, keyValue} = item;

        return (
            <ATouchableHighlight key={index} style={{}}
                                 onPress={() => onPress(index, item)}>
                <View style={{
                    height: itemHeight,
                    width: deviceWidth,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    borderBottomWidth: scaleSize(1),
                    borderBottomColor: '#eeeeee'
                }}>
                    <Text style={{
                        color: selectHead === keyName ? 'red' : 'black'
                    }}>{keyValue}</Text>
                </View>
            </ATouchableHighlight>
        )
    };
    _footer = () => {
        let {list = [], onPress, selectHead} = this.props;
        return (
            <View style={{backgroundColor: "white",
                borderBottomWidth: scaleSize(1),
                borderBottomColor: '#eeeeee'}}>
                <View style={{
                    height: scaleSize(1),
                    width: deviceWidth,
                    backgroundColor: '#dfdfdf',
                }}/>
                <ATouchableHighlight style={{
                    width: deviceWidth, alignItems: 'center',
                    justifyContent: 'center', height: itemHeight
                }}
                                     onPress={() => onPress()}>
                    <Image source={require('../../imgs/delete_64px.png')}
                           style={{width: scaleSize(50), height: scaleSize(50)}}/>
                </ATouchableHighlight>
            </View>
        )
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    };

    componentDidMount() {

    }

    render() {
        let {list = [], onPress, selectHead} = this.props;

        return (
            <Modal
                // style={{alignItems: 'center', justifyContent: 'center'}}
                visible={this.props.modalVisible}
                animationType={"none"}
                transparent={true}
                onRequestClose={() => onPress()}
            >
                <View style={styles.bgViewStyle}>
                    <FlatList
                        // ListHeaderComponent={this._header}
                        ListFooterComponent={this._footer}
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => item.keyValue}
                        contentContainerStyle={{backgroundColor: "white"}}
                        getItemLayout={(data, index) => ({length: 100, offset: (100 + 2) * index, index})}
                        data={list}/>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgViewStyle: {
        backgroundColor: '#rgba(0,0,0,0.5)',
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: actionBar,
    },

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(SelectTabShowModal);