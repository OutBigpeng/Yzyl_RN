/**
 * 正文
 * Created by coatu on 2017/6/26.
 */
import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native'

import {getHomeArticleData, getIsCollectData} from '../../dao/HomeDao'
import ShareModalView from "../../component/ShareModalView";
import {
    _,
    AvatarStitching,
    BGColor,
    BGTextColor,
    bindActionCreators,
    Colors,
    connect,
    defName,
    Loading,
    LoginAlerts,
    PlatfIOS,
    px2dp,
    Sizes,
    subString,
    toastShort,
    webScript
} from '../../common/CommonDevice'
import {getFollowData} from '../../common/FollowUtil';
import *as LoginAction from "../../actions/LoginAction";
import AutoHeightWebView from "../../component/autoHeightWebView/index";

import ATouchableHighlight from "../../component/ATouchableHighlight";
import *as HomeAction from '../../actions/HomeAction';
import {typeJump} from "./HomeJumpUtil";
import {Alerts, cloneObj, HTMLSource} from "../../common/CommonUtil";
import Toast from "react-native-root-toast";
import GridImageShow from "../discuss/GridImageShow";
import VideoPlayView from "../me/mine/VideoPlayView";
import {scaleSize} from "../../common/ScreenUtil";
import PlayVideoModal from "./PlayVideoModal";
import Orientation from "react-native-orientation";

const dismissKeyboard = require('dismissKeyboard');
let isSelectedCollect;

class HomeArticleView extends Component {
    // webview: WebView
    leftOnPress = () => {
        const {state, goBack} = this.props.navigation;
        // state.params.callback();
        dismissKeyboard();
        if (state.params && state.params.callback) {
            state.params.callback(isSelectedCollect, state.params.sn);
        }
        goBack();
    };

    onBridgeMessage = (event) => {
        const {navigate} = this.props.navigation;
        if (event && event.nativeEvent && event.nativeEvent.data) {
            let data = JSON.parse(event.nativeEvent.data);
            if (data.type) {
                switch (data.type) {
                    case "image":
                        let array = this.state.imageData;
                        if (!_.isEmpty(array)) {
                            let number = 0;
                            array.forEach((item, i) => {
                                if (item.url === data.id) {
                                    number = i;
                                }
                            });
                            this.setState({
                                imageUrls: cloneObj(array),
                                imgPosition: number
                            });
                        } else {
                            this.setState({
                                imageUrls: [{url: data.id}],
                            })
                        }
                        this.setImgModalVisible(true);
                        break;
                    case "Chain":
                        let item = data.id;
                        data.id && item.id && typeJump(item.type, item.id, navigate, "性能", 0);
                        break;
                    case 'PDF':
                        let params = data.params || '';
                        if (params) {
                            navigate('OpenPdfView', {
                                title: '查看PDF',
                                rightTitle: '下载',
                                url: params
                            });
                        }
                        break;
                    case "AT"://At的人
                        data.id && navigate('HomeAbstractView', {
                                title: ' ',
                                id: data.id,
                                callback: () => console.log("")
                            }
                        );
                        break;
                    case 'product':
                        data.params && navigate('ProductDetail', {
                            name: 'ProductDetail',
                            title: '产品详情',
                            pid: data.params,
                            rightImageSource: true,
                            callback: () => console.log('')
                        });
                        break;
                    default:
                        break;
                }
            }
        }
    };
    rightFirstOnPress = () => {
        // 调用接口
        const {navigate, state} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        if (!isLoginIn) {
            this.isLoginView({
                callback: () => this.getNetWork()
            })
        } else {
            let data = {
                articleId: this.state.webViewData.id,
                type: 'article'
            };
            getIsCollectData(data, this.props.navigation, (res) => {
                // this.getLoading().dismiss();
                if (res && res.result === 1) {
                    toastShort('收藏成功！');
                } else {
                    toastShort('取消收藏！');
                }
                this.navigationParams(res.result)
            }, (err) => {
                toastShort('收藏失败！');
                // this.getLoading().dismiss();
            })
        }
    };
    //导航右边点击事件
    navigatePress = () => {
        this.setModalVisible('modalVisible', true)
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            webViewData: {},
            modalVisible: false,
            imgModalVisible: false,
            isFollow: '',
            imageUrls: [],
            imageData: [],
            imgPosition: 0,
            articleData: {},
            isSelected: false,
            imageSlected: false,
            videoModal: false,
            currentTime: 0
        };
        this._isMounted;
    }


    loginAfter() {
        this.getNetWork()
    }

    setModalVisible(key, visible, call) {
        this.setState({
            [key]: visible
        }, () => {
            call && call();
        });
    }

    getLoading() {
        return this.refs['loading'];
    }

    setImgModalVisible(visible) {
        this.setState({
            imgModalVisible: visible
        });
    }

    render() {
        const {state, goBack} = this.props.navigation;
        let {imgModalVisible, imgPosition, imageUrls, videoModal} = this.state;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let {title = "", content = "", publishTime = "", authorLogo = "", authorName = "", authorId, sn, thumb, videoUrl = '', videoFee = '', videoCover = ''} = this.state.webViewData;
        let htmls = ' <div><h3> ' + title + '</h3>' + '<div>' + content + '</div></div>' + webScript;
        let strTime = publishTime ? subString(publishTime) : '';
        let imageUrl;
        if (authorLogo) {
            imageUrl = AvatarStitching(authorLogo, domainObj.avatar);
        }
        // videoFee = 150
        // videoCover = 'https://mmbiz.qpic.cn/mmbiz_jpg/OLicpSibib52E7H1iapjJYg6ibwAzuwzCILsribD9GNE7vAY62WEic1OpLyojze9u9wdsficXWWEygCibIIo71RHJRKnwiaA/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1'
        const {homeFollowStatus} = this.props.state.Home;
        let isFollow = isLoginIn && homeFollowStatus;
        let androidHtmls = HTMLSource(title, content, 1, '<style>div{' + 'letter-spacing:0.3px;line-height:25px;font-size:' + px2dp(Sizes.listSize) + 'px;color:' + Colors.textColor + '}</style>');
        return (
            <View style={styles.container}>
                {authorId ? <View style={styles.topViewStyle}>
                        <ATouchableHighlight onPress={() => this.pushToDetail()}>
                            <View style={styles.ViewStyle}>
                                <Image
                                    source={imageUrl ? {uri: imageUrl} : require('../../imgs/home/defaultVipAvatar.png')}
                                    style={styles.imageStyle}/>
                                <View style={{justifyContent: 'center'}}>
                                    <Text numberOfLines={1}
                                          style={[styles.textStyle,]}>{authorName || defName}</Text>
                                    {strTime ? <Text
                                        style={[styles.textStyle, {
                                            fontSize: px2dp(Sizes.otherSize),
                                            color: Colors.ExplainColor
                                        }]}>{strTime}</Text> : null}
                                </View>
                            </View>
                        </ATouchableHighlight>

                        {/*关注按钮*/}
                        <ATouchableHighlight
                            onPress={() => this.FollowData(2, authorId, !isFollow)}>
                            <View style={styles.follViewStyle}>
                                <Text style={styles.follViewTextStyle}>{isFollow ? '取消关注' : '＋ 关注'}</Text>
                            </View>
                        </ATouchableHighlight>
                    </View>
                    : <View/>
                }
                {/*webview*/}
                <ScrollView
                    ref={(com) => {
                        this.scroll = com
                    }}
                    style={styles.webViewStyle}/* onLayout={(e) => this.videoPlay ? this.videoPlay._onLayout(e) : null}*/>

                    {videoUrl ? <VideoPlayView
                        key={'videoPlay_key'}
                        ref={(com) => this.videoPlay = com}
                        videoUrl={videoUrl}
                        videoFee={videoFee}
                        videoCover={videoCover}
                        isSelfOnLayout={false}
                        isHoritation={false}
                        onControlShrinkPress={(currentTime, isPlaying) => {
                            let {videoModal} = this.state;
                            !videoModal && this.videoPlay.pauseVideo();
                            this.setState({
                                currentTime: currentTime,
                                videoModal: true
                            }, () => {
                                this.videoModal.playVideo(currentTime);
                            })
                        }}
                        // callIsFee={() => {
                        //     if (videoFee) {
                        //         Alerts("当前是收费视频，请下载最新版本体验", '', () => {
                        //         });
                        //         return videoFee;
                        //     }
                        //     return false;
                        // }}
                    /> : null}

                    <View style={{alignItems: "center"}}>
                        <AutoHeightWebView
                            contentContainerStyle={{paddingLeft: 10, paddingRight: 10, marginBottom: 10,}}
                            style={{paddingLeft: 10, paddingRight: 10}}
                            source={{html: androidHtmls}}
                            onMessage={this.onBridgeMessage}
                            startInLoadingState={true}
                            onError={() => <View style={{width: 1, height: 1}}/>}
                        />
                    </View>
                </ScrollView>

                {/*分享*/}
                <ShareModalView
                    key={'article_share'}
                    {...this.props}
                    visible={this.state.modalVisible}
                    closeModal={() => this.setModalVisible('modalVisible', false)}
                    view='article'
                    shareDiscuss={{
                        title: title, sn: sn, authorName: authorId ? authorName : '', time: strTime,
                        thumb: thumb,
                        domain: domainObj.info
                    }}
                    label={state.params && state.params.label ? ("—" + state.params.label) : ''}
                    title={title}
                    sn={sn}
                    content={htmls}
                    loginAfter={() => this.loginAfter()}
                />

                {imgModalVisible && <GridImageShow
                    {...this.props}
                    key={'HomeArticleView_gridImage'}
                    modalVisible={imgModalVisible}
                    suffix={"-640x640"}
                    params={{position: imgPosition, data: imageUrls}}
                    isShowDel={false}
                    isSave={false}
                    onClose={(flag) => {
                        this.setState({imgModalVisible: false})
                    }}
                />}

                {videoUrl && videoModal ? <PlayVideoModal
                    {...this.props}
                    ref={(com) => this.videoModal = com}
                    key={'HomeArticleView_video'}
                    modalVisible={videoModal}
                    videoUrl={videoUrl}
                    videoFee={videoFee}
                    videoCover={videoCover}
                    onClose={(currentTime, isPlaying) => {
                        if (currentTime) {
                            this.setState({
                                videoModal: false,
                                currentTime: currentTime
                            }, () => {
                                setTimeout(() => {
                                    this.videoPlay.setCurrentTime(currentTime);
                                    Orientation.lockToPortrait()
                                }, 300)
                            });
                        } else {
                            this.setModalVisible('videoModal', false)
                        }
                    }}
                /> : null}

                <Loading ref={'loading'}/>
            </View>

        );
    }

    cloneModal() {
        this.setImgModalVisible(!this.state.imgModalVisible)
    }

    componentDidMount() {
        this._isMounted = true;
        //正文接口
        this.getNetWork();
    }

    navigationParams(isSelected) {
        isSelectedCollect = isSelected;
        const {state, navigate} = this.props.navigation;
        this.props.navigation.setParams({
            rightOnPress: this.navigatePress,
            navigatePress: this.leftOnPress,
            rightFirstOnPress: this.rightFirstOnPress,
            rightLeftImage: isSelected === 1 ? require('../../imgs/me/shoucang.png') : require('../../imgs/shop/shoucang.png')
        });
    }

    getNetWork() {
        const {state, navigate, goBack} = this.props.navigation;
        if (this.getLoading()) {
            this.getLoading().show();
        }
        let data = {'sn': state.params.sn, "view": true};
        getHomeArticleData(data, this.props.navigation, (res) => {
            this.navigationParams(res.isCollect);//是否收藏
            if (this.getLoading()) {
                this.getLoading().dismiss();
            }
            if (this.props.state.Login.isLoginIn) {
                this.FollowData(1, res.authorId);
            }
            if (this._isMounted) {
                let array = JSON.parse(res.imgUrls);
                this.setState({
                    webViewData: res,
                    imageData: res && res.imgUrls ? array : []
                });
            }
        }, (err) => {
            if (this.getLoading()) {
                this.getLoading().dismiss();
            }
            console.log('err', err);
            toastShort("数据有异，稍后再试！！", Toast.positions.CENTER);
            goBack();
        })
    }

    componentWillUnmount() {
        isSelectedCollect = '';
        this._isMounted = false;
        Orientation.lockToPortrait()
    }

    //是否关注或者取消关注
    FollowData(option, items, status) {
        const {navigation} = this.props;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        if (!isLoginIn) {
            this.isLoginView()
        } else {
            //是否关注
            getFollowData(option, items, navigation, userObj, this, (res) => {
                this.props.homeAction.fetchHomeFollowInfo(res)
            }, status);
        }
    }

    isLoginView(obj = {}) {
        const {navigation} = this.props;
        LoginAlerts(navigation, obj);
    }

//页面跳转
    pushToDetail() {
        const {navigate} = this.props.navigation;
        let {webViewData: {authorId}, articleData} = this.state;
        navigate('HomeAbstractView', {
                title: ' ',
                id: authorId,
                articleData,
            }
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },

    webViewStyle: {
        paddingHorizontal: scaleSize(10),
        paddingTop: scaleSize(10),
        backgroundColor: 'white',
    },

    follViewStyle: {
        width: 60,
        height: 25,
        borderWidth: 1,
        borderColor: BGTextColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    },

    follViewTextStyle: {
        color: BGTextColor,
        fontSize: px2dp(Sizes.searchSize)
    },

    textStyle: {
        marginLeft: 10,
        fontSize: px2dp(Sizes.otherSize),
        color: Colors.ExplainColor,
    },

    imageStyle: {
        width: PlatfIOS ? 30 : 20,
        height: PlatfIOS ? 30 : 20,
        borderRadius: PlatfIOS ? 15 : 15
    },

    ViewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    topViewStyle: {
        width: '100%',
        height: 50,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8'
    }
});
export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        loginAction: bindActionCreators(LoginAction, dispatch),
        homeAction: bindActionCreators(HomeAction, dispatch)
    })
)(HomeArticleView);
