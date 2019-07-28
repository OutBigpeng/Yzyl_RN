/**
 * Created by coatu on 2017/7/13.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ActivityIndicator, Modal, StyleSheet, View, Text} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer';
import {_, PlatfIOS, deviceWidth} from "../common/CommonDevice";
import ATouchableHighlight from "./ATouchableHighlight";
import FotAwesome from "react-native-vector-icons/FontAwesome";
import {scaleSize} from "../common/ScreenUtil";

export default class ImageModal extends Component {

    static defaultProps = {
        isEnable: true,
        isSave: false,
        imageUrls: [],
        position: 0
    };
    static propTypes = {
        isEnable: PropTypes.bool,
        isSave: PropTypes.bool,
        imageUrl: PropTypes.string,
        imageUrls: PropTypes.array,
        position: PropTypes.number
    };

    render() {
        let {imageUrl, imageUrls, position} = this.props;
        let data;
        let suffix = '-640x640';
        if (imageUrl) {
            // if(imageUrl.endsWith("-640x640")){
            //     imageUrl = imageUrl.split("-640x640")[0]
            // }
            data = [{url: imageUrl}]
        } else if (!_.isEmpty(imageUrls)) {
            data = imageUrls;
        }
        return (
            <Modal
                visible={this.props.modalVisible}
                onRequestClose={() => this.props.modalVisible}
                transparent={true}>
                <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <ATouchableHighlight onPress={this.props.onPress}>
                        <View style={{height: PlatfIOS ? 55 : 45}}>
                            <FotAwesome name={'close'} size={25} style={[styles.textStyle, {color: 'white'}]}/>
                        </View>
                    </ATouchableHighlight>
                    <ImageViewer imageUrls={data}
                                 enableImageZoom={this.props.isEnable} // 是否开启手势缩放
                                 saveToLocalByLongPress={this.props.isSave}
                                 index={position} // 初始显示第几张
                                 loadingRender={() => {
                                     return <ActivityIndicator size="small" color="white"/>
                                 }}
                                 onClick={this.props.onPress}
                                 failImageSource={require("../imgs/other/defaultimg.png")}
                    />
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        position: 'absolute',
        right: 20,
        top: PlatfIOS ? 33 : 10,
        width: 18,
        height: 18
    },
    textStyle: {
        position: 'absolute',
        right: PlatfIOS ? 12 : 20,
        top: PlatfIOS ? 30 : 10,
    }
});