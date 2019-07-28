/**
 * Created by Monika on 2018/7/18.
 */


'use strict';
import React, {Component} from "react";
import {FlatList, Image, Modal, StyleSheet, Text, View} from "react-native";
import {connect, deviceWidth} from "../../common/CommonDevice";
import {scaleSize} from "../../common/ScreenUtil";
import ATouchableHighlight from "../../component/ATouchableHighlight";

let cols = 3;
const showTab = [{
    keyName: 'dynamics',
    keyValue: '动态',
    icon: require('../../imgs/discuss/discuss_icon.png')
},
    {keyName: 'qa', keyValue: '问答', icon: require('../../imgs/discuss/discussWen_icon.png')},
    {keyName: 'job', keyValue: '求职', icon: require('../../imgs/discuss/job_icon.png')},
    {keyName: 'recruit', keyValue: '招聘', icon: require('../../imgs/discuss/recruit_icon.png')},
    {keyName: 'buy', keyValue: '求购', icon: require('../../imgs/discuss/buy_icon.png')},
    {keyName: 'supply', keyValue: '供应', icon: require('../../imgs/discuss/supply_icon.png')},
];

class Comm extends Component {

    renderRow = ({item, index: pos}) => {
        let {list = [], onPress, selectHead} = this.props;
        let {keyName, keyValue} = item;
        let widthView = deviceWidth / 3 * 2;
        return (
            <ATouchableHighlight key={pos}
                                 style={{width: widthView / cols, padding: scaleSize(20),}}
                                 onPress={() => onPress(pos, item)}>
                <View style={{
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: 'center'
                }}>
                    <Image source={item.icon}
                           style={{width: scaleSize(100), height: scaleSize(100)}}/>
                    <Text style={{paddingVertical: scaleSize(20)}}>{keyValue}</Text>
                </View>
            </ATouchableHighlight>
        )
    };
    _footer = () => {
        let {list = [], onPress, selectHead} = this.props;
        return (
            <View style={{position: 'absolute', bottom: scaleSize(20),}}>
                <View style={{
                    height: scaleSize(1),
                    width: deviceWidth,
                    backgroundColor: '#dfdfdf',
                    marginVertical: scaleSize(20)
                }}/>
                <ATouchableHighlight style={{width: deviceWidth, alignItems: 'center'}}
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
        let {onPress} = this.props;

        return (
            <Modal
                visible={this.props.modalVisible}
                animationType={"none"}
                transparent={true}
                onRequestClose={() => onPress()}
            >
                <View style={styles.bgViewStyle}>
                    <FlatList
                        // ListHeaderComponent={this._header}
                        // ListFooterComponent={this._footer}
                        renderItem={this.renderRow}
                        numColumns={cols}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => item.keyName}
                        contentContainerStyle={{alignItems: "center", justifyContent: "center", flex: 1}}
                        getItemLayout={(data, index) => ({length: 100, offset: (100 + 2) * index, index})}
                        data={showTab}/>
                    {this._footer()}
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
        backgroundColor: 'white',//#rgba(0,0,0,0.5)
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(Comm);