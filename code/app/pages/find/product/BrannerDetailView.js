/**图片
 * Created by Monika on 2017/5/2.
 */

'use strict';
import React, {Component} from "react";
import {StyleSheet, View, Platform, CameraRoll,ScrollView} from "react-native";
// 引入外部组件
import ImagePro from "../../../common/ImageProgress";

import RNFS from "react-native-fs";
import NavigatorView from "../../../component/NavigatorView";
import {
    BGColor,
    deviceHeight,
    deviceWidth,
    Loading,
    toastLong,
    toastShort,
    TransformView,


} from "../../../common/CommonDevice";
import MD5 from "../../../common/Md5";
export default class BrannerDetailView extends Component {

    componentDidMount() {
        this.props.navigation.setParams({
            rightOnPress:this.downloadImg,
        })
    }
    render() {
       const {width,height,imageUrl,view} = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <ScrollView style={{flex:1}}>
                <TransformView
                    style={{
                        backgroundColor: 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: view ==1?deviceHeight:deviceHeight - 100
                    }}
                    minScale={0.5}
                    maxScale={3}
                    magnetic={true}
                >
                    <ImagePro style={{
                        marginTop:view ==1?20:0,
                        width: width ?width : deviceWidth - 100,
                        height: height ? height : deviceWidth
                    }}
                              source={{uri:imageUrl}}/>
                </TransformView>
                </ScrollView>
                <Loading ref={'loading'} text={'正在保存....'}/>
            </View>
        );
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    downloadImg = () => {
        var imgURL = this.props.navigation.state.params.imageUrl
        if (Platform.OS === 'ios') {
            toastShort('正在保存，请稍后');
            var promise = CameraRoll.saveToCameraRoll(imgURL);
            promise.then(function(result) {
                toastShort('保存成功,请去相册查看');
            }).catch(function(error) {
                toastShort('保存失败，图片地址有误');
            });
        } else {
            this.getLoading().show();
            let downloadBegin = (response) => {
                let jobId = response.jobId;
                console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
            };

            let downloadProgress = (response) => {
                // var percentage = Math.floor((response.totalBytesSent / response.totalBytesExpectedToSend) * 100);
                // console.log('UPLOAD IS ' + percentage + '% DONE!');
                // console.log("ksksk")
            };
            let path = RNFS.PicturesDirectoryPath + "/" + MD5.hex_md5(imgURL) + ".jpg";
            RNFS.downloadFile({
                fromUrl: imgURL,
                toFile: path,
                // method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                begin: downloadBegin,
                progress: downloadProgress
            }).promise.then((response) => {
                this.getLoading().dismiss();
                if (response && response.statusCode == 200) {
                    toastLong("图片保存成功" + path);
                    console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
                } else {
                    toastShort("图片保存失败");
                    console.log('SERVER ERROR');
                }
            })
                .catch((err) => {
                    this.getLoading().dismiss();
                    if (err.description === "cancelled") {
                        // cancelled by user
                    }
                    console.log(err);
                });
        }
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

