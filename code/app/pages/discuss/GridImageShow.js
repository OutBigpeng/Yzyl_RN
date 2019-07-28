/**
 * Created by Monika on 2018/6/19.
 */


'use strict';
import React, {Component} from "react";
import {ActivityIndicator, Alert, CameraRoll, Image, Modal, Text, View} from "react-native";
import {deviceWidth, Loading, PlatfIOS, toastShort} from "../../common/CommonDevice";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {scaleSize} from "../../common/ScreenUtil";
import {ImageViewer} from "react-native-image-zoom-viewer";
import {StyleSheet} from '../../themes'
import RNFS from "react-native-fs";
import ShowCopyModal from "./ShowCopyModal";
import {downFile} from "../../common/RNFSDownloadUtil";

let newPosition = -1;
let defaultImg400 = require('../../imgs/other/defaultimg.png');

export default class GridImageShow extends Component {

    static defaultProps = {
        isShowDel: true,
        isSave: true
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            saveModalVisible: false,
            currentImgObj: {},
            grathPosition: '',
            params: {
                data: [],
                position: -1
            },
        };
    };

    componentWillMount() {
        const {params, isShowDel} = this.props;
        newPosition = params.position;
        this.setState({params})
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    showToast(text) {
        toastShort(text)
    }

    render() {
        let that = this;
        let {grathPosition, currentImgObj} = this.state;
        let {params: {position = -1, data = []}, suffix = "", isShowDel, isSave} = this.props;
        let showData = [];
        this.setData(data, grathPosition, suffix, showData);
        return (
            <Modal
                visible={this.props.modalVisible}
                onRequestClose={() => this.props.onClose()}
                transparent={true}>
                <View style={styles.container}>
                    <ImageViewer imageUrls={showData}
                                 saveToLocalByLongPress={true}
                                 onSave={(imgURL) => {
                                     if (isSave && PlatfIOS) {
                                         //that.showToast('正在保存，请稍后...');
                                         let promise = CameraRoll.saveToCameraRoll(this.getOrigUrl(imgURL, suffix));
                                         promise.then(function (result) {
                                             Alert.alert('保存成功', result);
                                         }).catch(function (error) {
                                             Alert.alert('保存失败，请稍后重试...');
                                         });
                                     }
                                 }}
                                 onLongPress={isSave ? (res) => {
                                     position = newPosition;
                                     !isShowDel && !PlatfIOS && this.setState({
                                         saveModalVisible: true,
                                         params: Object.assign(this.state.params, {position}),
                                         currentImgObj: res
                                     }, () => {
                                     });
                                 } : null}
                                 menuContext={{saveToLocal: '保存到图库', cancel: '取消'}}
                                 onClick={() => {
                                     this.props.onClose(true)
                                 }}
                                 onChange={(e) => {
                                     newPosition = e
                                 }}
                                 index={position} // 初始显示第几张
                                 loadingRender={() => {
                                     return <ActivityIndicator size="small" color="white"/>
                                 }}
                                 footerContainerStyle={{
                                     width: deviceWidth,
                                     alignItems: 'flex-end',
                                     justifyContent: 'center',
                                     flex: 1,
                                 }}
                                 renderFooter={(index) => {
                                     // index = index+'';
                                     if (!isShowDel && grathPosition.indexOf(index + "") < 0) {
                                         return <ATouchableHighlight onPress={() => {
                                             if (grathPosition.indexOf(index + "") < 0) {
                                                 grathPosition = grathPosition.split(',');
                                                 grathPosition.push(index + "");
                                                 position = index;
                                                 this.setState({
                                                     grathPosition: grathPosition.join(','),
                                                     params: Object.assign(this.state.params, {position, data})
                                                 }, () => {
                                                 });
                                             }
                                         }}>
                                             <Text style={{
                                                 color: '#576b95',
                                                 padding: scaleSize(30),
                                             }}>查看原图</Text>
                                         </ATouchableHighlight>
                                     } else {
                                         return (<View/>)
                                     }
                                 }
                                 }
                                 failImageSource={defaultImg400}
                    />
                    {isShowDel && <View style={styles.rightStyle}>
                        <ATouchableHighlight onPress={() => {//删除
                            if (data.length == 1) {
                                data.shift()
                            } else {
                                data.splice(newPosition, 1)
                            }
                            position = position === data.length ? position - 1 : position;
                            newPosition = position;
                            if (data.length == 0) {
                                this.props.onClose(true)
                            } else {
                                this.setState({
                                    params: Object.assign(this.state.params, {position, data})
                                })
                            }
                        }}>
                            <Image style={styles.delImageStyle}
                                   source={require('../../imgs/discuss/Trash_Can_96px.png')}/>
                        </ATouchableHighlight>
                    </View>}
                    <ShowCopyModal
                        modalVisible={this.state.saveModalVisible}
                        list={['保存到图库']}
                        onPress={(pos) => {
                            const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
                            switch (pos) {
                                case 0:
                                    this.downloadImg(this.state.currentImgObj.url, suffix);
                                    break;
                                default:
                                    break;
                            }
                            this.setState({
                                saveModalVisible: false,
                            });
                        }}
                    />
                </View>
                <Loading ref={'loading'} text={'正在保存....'}/>
            </Modal>
        );
    }

    setData(data, grathPosition, suffix, showData) {
        data.map((item, position) => {
            if (item && item.url) {
                if (grathPosition && grathPosition.indexOf(position) > -1) {
                    if (item.url.lastIndexOf(suffix) > -1) {
                        item.url = item.origUrl;
                        if (item.props && item.props.source && item.props.source.uri) {
                            try {
                                Object.assign(item.props, {source: {uri: item.origUrl}});
                            } catch (e) {
                                console.log("--------------", e)
                            }
                        }
                    }
                } else {
                    if (item.url.lastIndexOf(suffix) <= -1) {//里面没有带这个后缀的东西。。
                        item.origUrl = item.url;
                        item.url = `${item.url}${suffix}`;
                    } else {//带了这个后缀
                        item.origUrl = item.url.split(suffix)[0];
                    }
                }
                showData.push(item);
            }
        });
    }

    getOrigUrl(imgURL, suffix) {
        if (imgURL.lastIndexOf(suffix) > -1) {
            return imgURL.split(suffix)[0]
        }
        return imgURL;
    }

    downloadImg(imgURL, suffix) {
        imgURL = this.getOrigUrl(imgURL, suffix);
        if (!PlatfIOS) {
            this.getLoading().show();
            downFile({url: imgURL, saveUrl: RNFS.PicturesDirectoryPath}, () => {
                this.getLoading().dismiss();
            }, () => {
                this.getLoading().dismiss();
            })
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    leftViewStyle: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    rightStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
        padding: scaleSize(30),
        ios: {
            marginTop: scaleSize(64 / 2)
        }
    },

    delImageStyle: {
        width: scaleSize(50),
        height: scaleSize(50),
    }
});