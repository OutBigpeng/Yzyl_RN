/**
 * Created by Monika on 2018/9/12.
 */


'use strict';
import React, {Component} from "react";
import {Modal, View} from "react-native";
import {scaleSize} from "../../common/ScreenUtil";
import {StyleSheet} from '../../themes'
import VideoPlayView from "../me/mine/VideoPlayView";
import Orientation from "react-native-orientation";
import {Alerts} from "../../common/CommonUtil";

export default class PlayVideoModal extends Component {

    static defaultProps = {};

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    };

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    playVideo(currentTime) {
        this.videoPlay.setCurrentTime(currentTime)
    }

    render() {
        let {modalVisible, currentTime, onClose} = this.props;
        return (
            <Modal
                visible={modalVisible}
                onRequestClose={() => {
                }}
                transparent={true}>
                <View style={styles.container}>
                    <VideoPlayView
                        key={'modal_video'}
                        ref={(com) => this.videoPlay = com}
                        {...this.props}
                        isSelfOnLayout={true}
                        isHoritation={true}
                        isModal={true}
                        isPlaying={modalVisible}
                        onControlShrinkPress={(currentTime) => {
                            //点击全屏播放
                            onClose && onClose(currentTime, false)
                        }}
                        // callIsFee={()=>{
                        //     if (videoFee) {
                        //         Alerts("当前是收费视频，请下载最新版本体验", '', () => {
                        //         });
                        //         return videoFee;
                        //     }
                        //     return false;
                        // }}
                    />
                </View>
            </Modal>
        );
    }

    componentWillmount() {
        this.props.onClose()
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor:'transparent'
    },
});