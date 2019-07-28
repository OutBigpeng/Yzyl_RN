import React, {Component} from "react";
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native'


import SectionListContacts from './SectionListContacts'
import {actionBar, BGTextColor, deviceHeight} from "../../common/CommonDevice";
import {scaleSize} from "../../common/ScreenUtil";
import {px2dp} from "../../common/CommonUtil";

export default class SectionListView extends Component {

    constructor(props) {
        super(props);

        let paramsData = this.props.navigation.state.params.data;
        let data = [];
        for (let key in paramsData) {
            let obj = {key, data: paramsData[key]};
            data.push(obj)
        }
        this.state = {
            dataArray: data,
        }
    }

    render() {
        let {state: {params: {headObj}}} = this.props.navigation;

        return (
            <View style={styles.container}>
                {this.headerView()}
                <SectionListContacts
                    ref={s => this.sectionList = s}
                    stickySectionHeadersEnabled={true}
                    selectItemDefaultValue={headObj.item&&headObj.item.keyValue}
                    sectionListData={this.state.dataArray}
                    initialNumToRender={this.state.dataArray.length}
                    showsVerticalScrollIndicator={false}
                    showName={'keyValue'}
                    SectionListClickCallback={(item, index) => {
                        let {state: {params: {callback}}, goBack} = this.props.navigation;
                        callback && callback({item, index});
                        goBack();
                    }}
                    letterViewStyle={{height: deviceHeight - actionBar}}
                />
            </View>
        )
    }

    headerView() {
        let {state: {params: {headObj, callback}}, goBack} = this.props.navigation;
        return (
            <TouchableWithoutFeedback onPress={() => {
                callback && callback({item: {}, index: -1});
                goBack();
            }}>
                <View style={[styles.itemStyle, {paddingVertical: scaleSize(20)}]}>
                    <Text style={[styles.artistText,!(headObj.item&&headObj.item.keyValue)&&{color:BGTextColor}]}>不限</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemStyle: {
        backgroundColor: '#FFFFFF',
        borderBottomColor: '#E4E4E4',
        borderBottomWidth: scaleSize(2),
        paddingHorizontal: scaleSize(20),
        justifyContent: 'center',
        width: '100%'
    },
    artistText: {
        fontSize: px2dp(15),
        color: '#4B4B4B'
    },

});