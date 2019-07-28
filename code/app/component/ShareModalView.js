/**分享弹窗
 * Created by coatu on 2016/12/29.
 *
 */
import React, {Component} from "react";
import {Image, Modal, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {bindActionCreators, connect, deviceWidth, px2dp} from "../common/CommonDevice";
import {Alerts, pushToLogin} from "../common/CommonUtil";
import ATouchableHighlight from "./ATouchableHighlight";
import {getUpdateUserScore} from "../dao/MeDao";
import * as MeAction from "../actions/MeAction";
import {toastLong, toastShort} from "../common/ToastUtils";
import JumpLoginModalView from "./JumpLoginModalView";
import Toast from "react-native-root-toast";
import PropTypes from "prop-types";

let WeChat = require('react-native-wechat');
let wechatCircleFriends = '朋友圈';
let wechatFriends = '微信好友';
let discussCircle = '发现';
let newsShare = Debug ? "http://47.98.140.81:3006" : 'http://activity.youzhongyouliao.com';//课程表分享 分享链接，标题
let actShare = Debug ? "http://47.98.140.81:3006" : 'http://activity.youzhongyouliao.com/share.html';//优众App分享下载
let actProShare = Debug ? "http://47.98.140.81:3006" : 'http://activity.youzhongyouliao.com/share.html';//产品分享
let articleShare = Debug ? "http://47.98.140.81:3006" : 'http://activity.youzhongyouliao.com/news.html';//文章分享
//http://uuadmin.youzhongyouliao.com/PerformanceSharing.html?id=5  配方分享
let shareObj = {};//分享对象
let isShareDiscuss = false;
let isShare = false;
let isAppShare;
class ShareModalView extends Component {
    static propTypes = {
        isAppShare: PropTypes.bool
    };
    static defaultProps = {
        isAppShare: false,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {jumpLoginModal: false, modalText: ''};
        shareObj = {};
        this.isLoginInShare;
        isAppShare = this.props.isAppShare;

    }

    componentWillReceiveProps(nextProps) {
        if (isAppShare !== nextProps.isAppShare) {
            isAppShare = nextProps.isAppShare;
            this.props = nextProps;
        }

    }
    render() {
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => this.props.closeModal()}
            >
                <TouchableHighlight style={{flex: 1}} onPress={() => this.props.closeModal()}>
                    <View style={styles.bgViewStyle}>
                        {!this.state.jumpLoginModal &&
                        <View style={styles.imageViewStyle}>
                            <ATouchableHighlight onPress={() => this.props.closeModal()}>
                                <View style={styles.closeViewStyle}>
                                    <Image source={require('../imgs/other/close.png')}
                                           style={{justifyContent: 'flex-end', width: 18, height: 18}}/>
                                </View>
                            </ATouchableHighlight>
                            <View style={styles.shareViewStyle}>
                                {this.commonShareView(require('../imgs/other/weixin_01.png'), wechatFriends)}
                                {this.commonShareView(require('../imgs/other/pengyou_01.png'), wechatCircleFriends)}
                                {!this.props.isAppShare && this.commonShareView(require('../imgs/navigator/discuss_icon.png'), discussCircle)}
                            </View>
                        </View>
                        }
                        {this.state.jumpLoginModal && <JumpLoginModalView
                            {...this.props}
                            onPress={() => {
                                this.setJumpLoginModal(false);
                                this.props.closeModal()
                            }}
                            titleText={this.state.modalText}
                            contentText={"是否确定？"}
                            jumpLoginModal={this.state.jumpLoginModal}
                            surePress={() => {
                                this.props.closeModal();
                                let that = this;
                                this.setJumpLoginModal(false);
                                let {nav} = this.props;
                                if (nav && nav.routes) {
                                    let routes = nav.routes;
                                    let len = routes.length - 1;
                                    pushToLogin(this.props.navigation, {
                                        sharePageKey: routes[len].key,
                                        sharePageLen: routes.length,
                                        isReLogin: true,
                                        callback: () => {
                                            const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
                                            if (isShareDiscuss) {
                                                isLoginIn && this.jumpSendShare()
                                            } else {
                                                isLoginIn && !isShare && that.shareSuccess();
                                            }
                                        },
                                    })
                                } else {
                                    toastShort('请重试')
                                }
                            }}
                        />}
                    </View>
                </TouchableHighlight>
            </Modal>
        )
    }

    setJumpLoginModal(flag, text = '') {
        // if (flag) isLoginInShare = false;
        this.setState({jumpLoginModal: flag, modalText: text})
    }

    commonShareView(imageSource, name) {
        return (//
            <ATouchableHighlight onPress={() => {
                switch (name) {
                    case discussCircle:
                        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
                        isShareDiscuss = true;
                        if (isLoginIn) {
                            this.props.closeModal();
                            this.jumpSendShare()
                        } else {
                            this.setJumpLoginModal(true, "登录才能分享到发现哦！");
                        }
                        break;
                    default:
                        this.WeChat(name);
                        break;
                }
            }}>
                <View style={{alignItems: 'center'}}>
                    <Image source={imageSource} style={styles.imageStyle}/>
                    <Text style={{marginTop: 7, color: 'gray', fontSize: px2dp(15)}}>{name}</Text>
                </View>
            </ATouchableHighlight>
        )
    }

    jumpSendShare() {
        let {navigate, state} = this.props.navigation;
        navigate('SendContentView', {
            title: '发表-分享',
            pageType: 'share',
            shareObj: this.props.shareDiscuss,
            callback: () => {
                // this.refreshView();
                isShareDiscuss = false;
            }
        });
    }

    WeChat(text) {
        isShare = true;
        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    let url = '', description = '', title = '';
                    let view = this.props.view;
                    if (view !== 'article') {
                        if (view === 'Curriculum') {//课程表分享 分享链接，标题
                            url = newsShare + this.props.subUrl;
                            title = this.props.title;
                            description = this.props.contact
                        } else if (view === 'FormulaXN') {//配方分享  id
                            let id = this.props.id;
                            url = newsShare + "/PerformanceSharing.html?id=" + id;
                            title = '推荐配方';
                            description = this.props.title
                        } else {
                            if (this.props.isProShare) {//产品分享
                                let pid = this.props.pid * 13;
                                url = actProShare + '?id=s' + pid;
                                title = (this.props.data.brandname || "") + " " + this.props.data.productname;
                                description = this.props.data.inaworddescription
                            } else {//分享app
                                url = actShare;
                                title = '涂料产业综合服务平台，极致服务，构建产业新生态。';
                                description = title;
                            }
                        }
                    } else {
                        if (this.props.isProShare) {//产品分享
                            let pid = this.props.pid * 13;
                            url = actProShare + '?id=s' + pid;
                            title = (this.props.data.brandname + this.props.data.productname)
                        } else {//文章分享
                            url = articleShare + '?sn=' + this.props.sn;
                            title = '优众优料' + this.props.label;
                            description = this.props.title
                        }
                    }
                    shareObj = {url, title, description, view};
                    if (text === wechatCircleFriends) {
                        WeChat.shareToTimeline({
                            // title: this.props.isProShare ? title : description,//title
                            title: this.props.isProShare || view === 'Curriculum' ? title : description,//title
                            description: description,
                            thumbImage: 'http://open.dl.youzhongyouliao.com/static/images/wx-share.png',
                            type: 'news',
                            webpageUrl: url
                        })
                            .catch((error) => {
                                console.log(error.message);
                            })
                    } else {
                        WeChat.shareToSession({
                            title: title,
                            description: description,
                            thumbImage: 'http://open.dl.youzhongyouliao.com/static/images/wx-share.png',
                            type: 'news',
                            webpageUrl: url
                        })
                            .catch((error) => {
                                console.log(error.message);
                            })
                    }
                } else {
                    Alerts('微信未安装，请您安装微信再分享');
                }
            })
    }

    componentDidMount() {
        this.setCurrentLogin();
        // const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let that = this;
        WeChat.addListener(
            'SendMessageToWX.Resp',
            (response) => {
                if (isShare) {
                    isShare = false;
                    if (parseInt(response.errCode) === 0) {
                        if (!isAppShare) {
                            const {isLoginIn} = that.props.state.Login;
                            if (isLoginIn) {
                                that.shareSuccess();
                            } else {
                                that.setJumpLoginModal(true, "现在去登录，可获得积分")
                            }
                        } else {
                            isShare = true;
                            toastShort("分享成功~~", Toast.positions.CENTER);
                            that.props.closeModal();
                        }
                    }
                }
            }
        );
    }

    componentWillUnmount() {
        // isLoginInShare = true;
        WeChat.removeAllListeners();
    }

    shareSuccess() {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let tempObj = JSON.stringify(shareObj);
        let data =
            {
                "userId": userObj.userid,
                "taskSn": "share",//任务编码 share分享 sample索样
                "reason": tempObj,//同上
                "remark": shareObj.description //同上
            };
        getUpdateUserScore(data, 0, (res) => {
            //{ result: 0, detailId: 0, score: 0 }
            let {result = 0, score = 0} = res;
            if (result > 0 && score > 0) {
                toastLong(`分享成功~~获得${score}积分`, Toast.positions.CENTER);
            } else {
                this.loginAfter()
            }
            this.props.closeModal();
        }, () => {
            this.loginAfter();
            this.props.closeModal();
        });
    }

    loginAfter() {
        toastShort("分享成功~~", Toast.positions.CENTER);
        !this.isLoginInShare && setTimeout(() => {
            this.props.loginAfter && this.props.loginAfter();
            this.setCurrentLogin()
        }, 500)
    }

    setCurrentLogin() {
        const {isLoginIn: login} = this.props.state.Login;
        this.isLoginInShare = login;
    }
}

const styles = StyleSheet.create({
    bgViewStyle: {
        flex: 1,
        // height: deviceHeight - actionBar / 2,
        backgroundColor: '#rgba(0,0,0,0.2)',
        // justifyContent: 'flex-end'
    },

    imageViewStyle: {
        position: 'absolute',
        bottom: 0,
        height: 130,
        backgroundColor: 'white',
        width: deviceWidth,
    },

    imageStyle: {
        width: 60,
        height: 60
    },

    shareViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: deviceWidth
    },

    closeViewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
        marginRight: 10
    }
});

export default connect(state => ({
        state: state,
        nav: state.nav
    }),
    (dispatch) => ({
        meAction: bindActionCreators(MeAction, dispatch)
    })
)(ShareModalView);