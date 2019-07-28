/**
 * 规则弹窗
 * Created by Monika on 2018/8/6.
 */


'use strict';
import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {connect, deviceWidth, PlatfIOS} from "../../common/CommonDevice";
import {scaleSize} from "../../common/ScreenUtil";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {getSysAgreement} from "../../dao/SysDao";
import {Alerts, px2dp} from "../../common/CommonUtil";
import ShowAlertModal from "./ShowAlertModal";


class SuspendView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            content: '',
            modalVisible: false,
        };
    };

    componentDidMount() {
        getSysAgreement(this.props.typeStr, (res) => {
            this.setState({
                content: res.content
            })
        }, () => {
            this._view.setNativeProps({
                style: {opacity: 0, width: 0, height: 0}
            })
        })
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }


    render() {
        let {content, modalVisible} = this.state;
        let {text, onPress = {}, typeStr, style} = this.props;
        return (
            <View style={[{
                /*position: 'absolute',
                top: 0, right: 0, left: 0,*/ opacity: 1
            }, style]} ref={(c) => this._view = c}>
                {content ? <ATouchableHighlight onPress={() => {
                    this.setModalVisible(true)
                    // Alerts('3rrwer','qeqweqwr')
                }}>
                    <View style={{
                        backgroundColor: '#FEFBCF', flexDirection: 'row', justifyContent: 'space-between',
                        padding: scaleSize(16), alignItems: 'center'
                    }}>
                        <Text numberOfLines={1} ellipsizeMode={'middle'} style={[{
                            color: '#A58B4D',
                            fontSize: px2dp(PlatfIOS ? 14 : 13), width: deviceWidth - scaleSize(70)
                        }, PlatfIOS && {paddingVertical: scaleSize(5)}]}>{typeStr}</Text>
                        <ATouchableHighlight onPress={() => {
                            this._view.setNativeProps({
                                style: {opacity: 0, width: 0, height: 0}
                            })
                        }}>
                            <Text style={[{
                                paddingHorizontal: scaleSize(10),
                                color: '#A58B4D'
                            }, PlatfIOS && {fontSize: px2dp(16)}]}>ｘ</Text>
                        </ATouchableHighlight>
                    </View>
                </ATouchableHighlight> : null}
                <ShowAlertModal
                    modalVisible={modalVisible}
                    isShowCancel={false}
                    // title={'我是标题'}
                    content={content}
                    onPress={(flag) => {
                        if (flag) {
                        }
                        this.setModalVisible(false)
                    }}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(SuspendView);