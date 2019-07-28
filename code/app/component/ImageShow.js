/**
 * Created by Monika on 2017/9/1.
 */

import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {BGColor} from "../common/CommonDevice";

let defaultImg400 = require('../imgs/other/defaultimg.png');

export default class ImageShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            imageIndex: 1,
        };
    }

    componentWillMount() {
        // 上个界面传来的照片集合
        const {state} = this.props.navigation;
        if (state.params && state.params.params) {
            const params = state.params.params;
            const images = params.image;
            const pageNum = params.num;
            this.setState({
                images: images,
                imageIndex: pageNum,
            });
        }else {
            this.setState({
                images: this.props.images,
            });
        }

    }

    render() {
        const {goBack} = this.props.navigation;

        return (
            <View style={styles.container}>
                <ImageViewer
                    imageUrls={this.state.images} // 照片路径
                    enableImageZoom={true} // 是否开启手势缩放
                    index={this.state.imageIndex} // 初始显示第几张
                    failImageSource={defaultImg400} // 加载失败图片
                    onChange={(index) => {
                    }} // 图片切换时触发
                    onClick={() => { // 图片单击事件
                        if (goBack) {
                            goBack();
                        }
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
    },
    page: {
        height: 220.5,
        width: 220.5,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    imageViewsStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 64
    }
});
