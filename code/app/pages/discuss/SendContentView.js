/**
 * Created by Monika on 2018/6/19.
 */


'use strict';
import React, {Component} from "react";
import {Alert, Image, Platform, ScrollView, Slider, StyleSheet, Text, TextInput, View} from "react-native";
import {
    _,
    bindActionCreators, commentWord,
    connect,
    deviceHeight,
    deviceWidth,
    Loading,
    LoginAlerts,
    PlatfIOS,
    px2dp,
    textHeight
} from "../../common/CommonDevice";
import {scaleSize} from "../../common/ScreenUtil";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import GridImageShow from "./GridImageShow";

import ImagePicker from 'react-native-image-crop-picker';
import {cloneObj} from "../../common/CommonUtil";
import {toastShort} from "../../common/ToastUtils";
import {getQiuNiuTokenData} from "../../dao/QiniuDao";
import {getDiscussSendMessage} from "../../dao/DiscussDao";
import ShareDiscussLinkItem from "./ShareDiscussLinkItem";
import MD5 from "../../common/Md5";
import * as DiscussAction from "../../actions/DiscussAction";
import PermissionUtil from "../../common/PermissionUtil";
import MultilineTextInput from "../../containers/MultilineInput";
import SuspendView from "./SuspendView";
import {sendQueryValueBySCKey} from "../../dao/SysDao";
import Toast from "react-native-root-toast";
import * as MeAction from "../../actions/MeAction";

export const PageTypeEnum = {
    SHARE: 'share',
    DYNAMICS: 'dynamics',
    QA: 'qa',
};

const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];
let cols = 3;
let boxW = deviceWidth / cols - scaleSize(35);
let dataToPost = [];
let isSend = -1;//-1是初始值。是-1时是可以发布内容的。

class SendContentView extends Component {

    // 构造
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            content: '',
            rewardScore: 0,
            imgPosition: -1,
            imgModalVisible: false,
            imgDataList: [],
            isEnable: true,
        };
        this.scoreObj = {}
    };

    componentWillMount() {
        const {navigate, state: {params: {pageType = PageTypeEnum.DYNAMICS, shareObj = {}}}} = this.props.navigation;
        this.pageType = pageType;//qa 问答 dynamics 动态  share 分享
        this.shareObj = shareObj;
    }

    _header(type, placeholder, viewStyle, contentStyle) {
        let isAuto = this.pageType === PageTypeEnum.QA ? type === 'title' : true;
        return (
            <View style={[styles.inputbg, viewStyle,]}>
                <MultilineTextInput
                    {...this.props}
                    key={type}
                    editable={this.state.isEnable}
                    value={this.state[type]}
                    style={[styles.tv_content, contentStyle,]}
                    placeholder={placeholder}
                    placeholderTextColor='#aaaaaa66'
                    autoFocus={isAuto}
                    blurOnSubmit={false}
                    multiline={true}
                    // maxLength={commentWord*2}
                    underlineColorAndroid='transparent'
                    onLayout={this._inputOnLayout.bind(this)}
                    onChangeText={(text) => this.textChange(type, text)}
                />
            </View>
        )
    }

    componentDidMount() {
        this.props.navigation.setParams({
            rightTitle: '发布',
            rightOnPress: () => {
                if (isSend < 0) {
                    this.commitContent()
                }
            }
        });
        if (this.pageType === PageTypeEnum.QA) {
            this.getLoading().show();
            sendQueryValueBySCKey('Discuss_QA_score_high,Discuss_QA_score_low,Discuss_QA_score_isOpen', this.props.navigation, (res) => {
                this.getLoading().dismiss();
                // Discuss_QA_score_isOpen: 'Y',
                // I/ReactNativeJS(24089):   Discuss_QA_score_high: '50',
                // I/ReactNativeJS(24089):   Discuss_QA_score_low: '0' }
                let {Discuss_QA_score_high, Discuss_QA_score_low, Discuss_QA_score_isOpen} = res;
                this.isSetScore = Discuss_QA_score_isOpen === 'Y';
                let {myScore = 0} = this.props.state.Me;

                this.scoreObj = {lowScore: Discuss_QA_score_low * 1, highScore: Discuss_QA_score_high * 1};
                if (myScore < this.scoreObj.lowScore) {
                    this.setState({
                        isEnable: false, rewardScore: Discuss_QA_score_low * 1
                    })
                } else {
                    Discuss_QA_score_low * 1 > 0 && this.setState({
                        rewardScore: Discuss_QA_score_low * 1
                    })
                }
            }, () => {
                this.getLoading().dismiss();
            })
        }
    }

    commitContent() {
        let {content = '', imgDataList = [], title = '', rewardScore, isEnable} = this.state;
        let {myScore = 0} = this.props.state.Me;

        let {navigation} = this.props;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        if (!isLoginIn) {
            LoginAlerts(this.props.navigation, {
                callback: () => {
                    this.commitContent()
                }
            });
        } else {
            if (this.pageType === PageTypeEnum.QA) {//是问答
                if (!isEnable) {
                    toastShort("请查看提问悬赏规则", Toast.positions.CENTER);
                    return
                }
                if (!title || !title.trim()) {
                    toastShort("标题不能为空")
                } else if (!content || !content.trim()) {
                    toastShort("内容不能为空")
                } else {
                    if (this.isSetScore && !(rewardScore * 1) && myScore !== 0) {
                        toastShort("请设置悬赏积分");
                        return
                    }
                    this.judgeSend();
                }
            } else if (this.pageType === PageTypeEnum.SHARE) {
                this.judgeSend();
            } else {
                if ((content && content.trim()) || !_.isEmpty(imgDataList)) {
                    this.judgeSend();
                } else {
                    toastShort("文字与图片至少发布一样")
                }
            }
        }
    }

    judgeSend() {
        let {navigation} = this.props;
        let {content = '', imgDataList = [], title} = this.state;
        isSend = 1;
        if (!_.isEmpty(imgDataList)) {
            this.picSend(imgDataList);
        } else {
            this.getLoading().show();
            this.sendContent([]);
        }
    }

    picSend(imgDataList) {
        this.getLoading().show();
        //请求七牛的token
        let data = {'opType': 'info'};
        let uploadIMGList = Array(10);
        for (let i = 0; i < imgDataList.length; i++) {
            getQiuNiuTokenData(data, (res) => {
                let formData = new FormData();
                let url = imgDataList[i].url;
                let index = url.lastIndexOf("\/");
                let name = url.substring(index + 1, url.length);
                let file = {uri: url, type: 'image/jpeg', name: MD5.hex_md5(name)};
                formData.append('file', file);
                formData.append('index', i);
                formData.append('token', res.upToken);
                this._upload(formData, i, uploadIMGList)
            }, (err) => {
                isSend = -1;
                console.log(err);
            })
        }
    }

    sendContent(resData) {
        let {content = '', imgDataList = [], rewardScore, title} = this.state;
        let {navigation} = this.props;
        if (content.length > commentWord * 2) {
            toastShort('您输入的内容过长！！！');
            return;
        }
        let data = Object.assign({
            content: content,
            imgUrls: JSON.stringify(resData),
            title: title,
            type: this.pageType === PageTypeEnum.QA ? PageTypeEnum.QA : this.pageType === PageTypeEnum.SHARE ? PageTypeEnum.DYNAMICS : this.pageType
        }, this.pageType === PageTypeEnum.SHARE ? {shareParam: JSON.stringify(this.shareObj)} : this.isSetScore ? {rewardScore} : {});

        getDiscussSendMessage(data, navigation, (res) => {
            isSend = -1;
            toastShort("发布成功");
            if (this.pageType === PageTypeEnum.SHARE) {
                this.props.discussAction.fetchDiscussShareRefresh(1);
            } else if (this.pageType === PageTypeEnum.QA) {
                this.props.meAction.fetchMyScore()
            }
            let {state: {params: {callback}}, goBack} = navigation;
            callback && callback();
            dataToPost = [];
            goBack();
            this.getLoading().dismiss();
        }, (err) => {
            isSend = -1;
            this.getLoading().dismiss();
            console.log(err);
            toastShort("请检查网络或稍后重试！")
        })
    }

    _upload(body, i, uploadIMGList) {
        let {content = '', imgDataList = [],} = this.state;
        let {navigation} = this.props;

        let xhr = new XMLHttpRequest();
        //上传到七牛云的地址
        //  let url = 'http://upload-z2.qiniu.com';
        let url = 'http://up-z0.qiniu.com';
        // 开启post上传
        // this.setState({
        //     avatarUploading: true,
        //     avatarProgress: 0
        // });
        xhr.open('POST', url);
        //上传成功的返回
        xhr.onload = () => {
            // 状态码如果不等于200就代表错误
            console.log(xhr.status, xhr.responseText);
            if (xhr.status !== 200) {
                this._upload(body, i, uploadIMGList);
                alert('请求失败');
                return;
            }
            if (!xhr.responseText) {
                alert('请求失败');
                this._upload(body, i, uploadIMGList);
                return;
            }

            console.log("xhr.response", xhr.response);
            let response;
            try {
                response = JSON.parse(xhr.response)
            } catch (e) {
                console.log('请求失败', e)
            }

            if (response) {
                // callback(i, response.key);
                let key = response.key;
                if (key) {
                    uploadIMGList.splice(i, 1, key);
                    let tempList = uploadIMGList.filter((item) => {
                        return item
                    });
                    if (tempList.length === imgDataList.length) {
                        let resData = tempList.map((key, pos) => {
                            return {key: key, url: key}
                        });
                        this.sendContent(resData);
                    }
                }
                /**
                 * { hash: 'FjoIDIGEyTDwWlWCj3AlwXKXxDu9',
 key: 'FjoIDIGEyTDwWlWCj3AlwXKXxDu9' }
                 { hash: 'Fh0rEvBYz43IWSfB7qAP0HNZdT7H',
               key: 'Fh0rEvBYz43IWSfB7qAP0HNZdT7H' }

                 */
            }
        };

        if (xhr.upload) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    this.perent = (event.loaded / event.total).toFixed(2);
                }
            }
        }

        // 发送请求
        xhr.send(body);
    }

    pickMultiple() {
        // if (PlatfIOS) {
        ImagePicker.openPicker({
            multiple: true,
            maxFiles: 9 - (dataToPost.length || 0),
            showsSelectedCount: true,
            mediaType: 'photo',
            // compressImageMaxWidth: 480,
            // compressImageMaxHeight: 640,
            compressImageQuality: 0.8,
        }).then(images => {
            for (let i = 0; i < images.length; i++) {
                let img = images[i];
                if (dataToPost.some((item) => {
                    return PlatfIOS ? item.uri === img.sourceURL : item.uri === img.path;
                })) {
                    toastShort("选中图片中已存在相同项")
                } else {
                    dataToPost.length < 9 && dataToPost.push({
                        uri: img.sourceURL || img.path,
                        width: img.width,
                        height: img.height,
                        mime: img.mime,
                        url: img.path
                    });
                }
            }
            this.setState({
                imgDataList: cloneObj(dataToPost)
            });
        }).catch(e =>
            console.log(e)
        );
        // } else {
        //     ImagePicker.openPicker({
        //         cropping: false,
        //         cropperCircleOverlay: false,
        //         mediaType: 'photo',
        //         compressImageMaxWidth: 480,
        //         compressImageMaxHeight: 640,
        //         compressImageQuality: 0.8,
        //         showsSelectedCount: 9,
        //     }).then(image => {
        //         function pass(item) {
        //             return item.url === image.path;
        //         }
        //
        //         if (dataToPost.some(pass)) {
        //             toastShort("选中图片中已存在相同项")
        //         } else {
        //             dataToPost.push({
        //                 uri: image.path,
        //                 width: image.width,
        //                 height: image.height,
        //                 mime: image.mime,
        //                 url: image.path
        //             });
        //             this.setState({
        //                 imgDataList: dataToPost
        //             });
        //         }
        //
        //     }).catch(e => {
        //         console.log(e.message ? e.message : e);
        //     });
        // }
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    checkPermission() {
        PermissionUtil.checkPermission(() => {
            this.pickMultiple();
        }, () => {
            Alert.alert(
                '无法使用！',
                '如需使用，请授予应用【读写手机存储】权限',
                [
                    {
                        text: '确定', onPress: () => {
                        }
                    },
                ], Platform.OS === 'android' ? {cancelable: false} : {}
            );
        }, ["photo"]);
    }

    render() {
        let isDynamic = this.pageType === PageTypeEnum.DYNAMICS;
        let {imgDataList = [], imgPosition, imgModalVisible} = this.state;
        return (
            <View style={styles.container}>
                {this.pageType === PageTypeEnum.QA && <SuspendView
                    typeStr={'提问悬赏规则'}
                    onPress={() => {
                    }}
                />}

                <ScrollView contentContainerStyle={{
                    paddingVertical: scaleSize(20), height: deviceHeight / 7 + deviceHeight
                }}>
                    <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}>
                        {this.pageType === PageTypeEnum.QA && this.setScore()}

                        {this.pageType === PageTypeEnum.QA && this._header('title', '标题', {
                            height: scaleSize(120),
                            borderBottomColor: '#aaaaaa88', borderBottomWidth: scaleSize(2),
                        }, {
                            height: scaleSize(120),
                            fontWeight: 'bold', fontSize: px2dp(PlatfIOS ? 16 : 15)
                        })}

                        {this._header('content', isDynamic ? '这一刻的想法...' : '内容', isDynamic ? {
                            height: scaleSize(300),
                        } : {height: scaleSize(300), marginTop: scaleSize(20)}, {height: scaleSize(300)})}

                        <View style={{
                            paddingBottom: scaleSize(50),
                            paddingHorizontal: scaleSize(20),
                            justifyContent: 'center'
                        }}>
                            {this.pageType !== PageTypeEnum.SHARE && this.setGridImage()}

                            {this.pageType === PageTypeEnum.SHARE && <ShareDiscussLinkItem
                                {...this.props}
                                linkObj={this.shareObj}
                            />}
                        </View>
                    </View>
                </ScrollView>

                {imgModalVisible && <GridImageShow
                    {...this.props}
                    modalVisible={imgModalVisible}
                    params={{position: imgPosition, data: imgDataList}}
                    onClose={(flag) => {
                        if (flag) {
                            dataToPost = [];
                        }
                        this.setState({imgModalVisible: false}, () => {
                            dataToPost = cloneObj(imgDataList);
                        })
                    }}
                />}

                <Loading ref={'loading'}/>
            </View>
        );
    }

    textChange(type, text) {
        this.setState({
            [type]: text,
        });
    }

    _onStartShouldSetResponderCapture(event) {
        let target = event.nativeEvent.target;
        if (!inputComponents.includes(target)) {
            dismissKeyboard();
        }
        return false;
    }

    _inputOnLayout(event) {
        inputComponents.push(event.nativeEvent.target);
    }

    setGridImage() {
        let imageSource = require('../../imgs/discuss/btn_pictureframe.png');
        let mainView;
        let commSty = {width: boxW, height: boxW};
        let {imgDataList = [], imgPosition, imgModalVisible, isEnable} = this.state;
        if (imgDataList != null && imgDataList.length >= 9) {
            mainView = null;
        } else {
            mainView = <ATouchableHighlight
                onPress={isEnable ? () => {
                    this.checkPermission()
                } : null}>
                <Image style={commSty} source={imageSource}/>
            </ATouchableHighlight>
        }
        return (
            <View style={{
                flexDirection: 'row', //设置主轴方向
                flexWrap: 'wrap', //超出换行
                alignItems: "center",
                // justifyContent:'center'
            }}>
                {imgDataList.map((item, pos) => {
                    return (
                        <View key={pos}
                              style={{padding: scaleSize(10)}}>
                            <ATouchableHighlight onPress={() => {
                                let {navigate} = this.props.navigation;
                                this.setState({
                                    imgPosition: pos,
                                    imgModalVisible: true
                                });
                            }}>
                                <Image source={{uri: item.url}}
                                       style={commSty}/>
                            </ATouchableHighlight>
                        </View>);
                })}
                <View style={{padding: scaleSize(10), alignSelf: 'flex-start'}}>
                    {mainView}
                </View>
            </View>
        )
    }

    setScore() {
        let scoreType = 'rewardScore';
        let {lowScore = 0, highScore = 0} = this.scoreObj;

        let {myScore = 0} = this.props.state.Me;
        // if (myScore > 0 && myScore >= lowScore) {
        return (
            <View style={{
                // borderTopWidth: scaleSize(2),
                borderBottomWidth: scaleSize(2),
                borderColor: '#eeeeee',
                paddingVertical: scaleSize(20),
                paddingHorizontal: scaleSize(10)
            }}>
                <Text>{`请选择悬赏积分${lowScore}~${highScore}（当前可用${myScore}积分）：`}</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: textHeight,
                    paddingVertical: scaleSize(5),
                }}>
                    <Slider
                        onSlidingComplete={(v) => {
                            if (v * 1 >= myScore) {
                                toastShort("当前可用积分不支持操作滑动");
                            }
                        }}
                        disabled={!this.state.isEnable}
                        onValueChange={(v) => {
                            this.textChange(scoreType, v + "");
                            // console.log("onValueChange------", v)
                        }}
                        value={this.state[scoreType] * 1 > 0 ? this.state[scoreType] * 1 : null}
                        maximumTrackTintColor={'#57F860'}
                        minimumTrackTintColor={'#A4FDA9'}
                        minimumValue={lowScore}
                        maximumValue={myScore > highScore ? highScore : myScore}
                        step={1}
                        style={{width: deviceWidth / 4 * 3 - scaleSize(10)}}
                        thumbTintColor={'#57F860'}
                    />
                    <TextInput
                        key={scoreType}
                        value={this.state[scoreType] + ''}
                        keyboardType='numeric'
                        editable={this.state.isEnable}
                        style={[{
                            width: deviceWidth / 4.5,
                            fontSize: px2dp(14),
                            height: scaleSize(80),
                            borderColor: '#eeeeee',
                            borderWidth: scaleSize(1),
                            borderRadius: scaleSize(3),
                            textAlign: 'center',
                            padding: 0
                        }]}
                        placeholder={"请输入积分"}
                        placeholderTextColor='#aaaaaa66'
                        maxLength={myScore.length}
                        underlineColorAndroid='transparent'
                        onLayout={this._inputOnLayout.bind(this)}
                        onChangeText={(text) => {
                            if (text * 1 > myScore) {
                                toastShort("悬赏积分不能大于当前可用积分");
                                return
                            }
                            this.textChange(scoreType, text * 1 > myScore ? '' : text)
                        }}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    tv_content: {
        // justifyContent: 'flex-start',
        textAlign: 'left',
        fontSize: px2dp(14),
        textAlignVertical: 'top',
        padding: scaleSize(25),
    },
    inputbg: {
        backgroundColor: 'white',
        justifyContent: "center"
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        discussAction: bindActionCreators(DiscussAction, dispatch),
        meAction: bindActionCreators(MeAction, dispatch),
    })
)(SendContentView);