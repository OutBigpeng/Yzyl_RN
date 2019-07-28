/**
 * 我的页面  头部
 * Created by coatu on 2017/7/3.
 */
import React from 'react';
import {Alert, Image, Platform, Text, TouchableOpacity, View} from 'react-native';

import {
    Alerts,
    AvatarStitching,
    bindActionCreators,
    connect,
    deviceWidth,
    LoginAlerts,
    PlatfIOS,
    px2dp,
    Sizes
} from '../../common/CommonDevice'
import ImagePicker from 'react-native-image-picker';
import {getQiuNiuImageData, getQiuNiuTokenData} from '../../dao/QiniuDao'
import uuid from 'uuid'
import * as Progress from 'react-native-progress';
import {Images, StyleSheet} from "../../themes";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import * as LoginAction from "../../actions/LoginAction";
import PermissionUtil from "../../common/PermissionUtil";
import {scaleSize} from "../../common/ScreenUtil";
import {pushToLogin} from "../../common/CommonUtil";

class MeHeaderView extends React.Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        this.state = {
            avatarSource: '',
            qiNiuToken: '',
            avatarProgress: 0,
            avatarUploading: false,
            nickName: "--",
            expertScore: {}
        };
        this._isMounted;
    }

    selectPhotoTapped() {
        const Options = {
            title: '选择头像',
            takePhotoButtonTitle: '拍照上传',
            chooseFromLibraryButtonTitle: '本地上传',
            cancelButtonTitle: "取消",
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(Options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
                if (!PlatfIOS) {
                    Alerts("您拒绝了获取本机图片的权限，若需使用，请先去设置中打开。")
                }
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = {uri: response.uri};

                //请求七牛的token
                let data = {'opType': 'avatar'};
                getQiuNiuTokenData(data, (res) => {
                    let key = uuid.v4();
                    key += '.jpeg';
                    let formData = new FormData();
                    formData.append('token', res.upToken);
                    formData.append('key', key);
                    formData.append('file', {
                        type: 'image/jpeg',
                        name: key,
                        uri: source.uri
                    });
                    this._upload(formData, source)

                }, (err) => {
                    console.log(err);
                })
            }
        });
    }

    checkPermission() {
        PermissionUtil.checkPermission(() => {
            this.selectPhotoTapped();
        }, () => {
            Alert.alert(
                '无法使用！',
                '如需使用，请授予应用【相机】与【读写手机存储】权限',
                [
                    {
                        text: '确定', onPress: () => {
                        }
                    },
                ], Platform.OS === 'android' ? {cancelable: false} : {}
            );
        }, ["camera", "photo"]);
    }

    componentDidMount() {
        this._isMounted = true;
        this.setUserInfo()
    }

    extracted(key = "") {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let {nickname = "", logo = "", userid,} = userObj;
        let url;
        if (!url)
            if (key && domainObj.avatar) {
                return url = `${domainObj.avatar}${key}-640x640`
            } else {
                return url = logo ? logo.indexOf('http') > -1 ? logo : AvatarStitching(logo, domainObj.avatar) : ""
            }
        return url
    }

    render() {//isLoginIn ? nickname || this.state.nickName :
        const {isLoginIn, userObj: {nickname = "", userid,certifiedType}, domainObj} = this.props.state.Login;
        let {myScore = 0, expertScore: {gradeName = '', expertScore = 0, gradeImgUrl = ''}} = this.props.state.Me;
        let name = isLoginIn ? Debug?`${nickname || this.state.nickName}${userid}`:(nickname || this.state.nickName) : '请先登录';
        return (//onPress={this.selectPhotoTapped.bind(this)}
            <View style={styles.topViewStyle}>
                <View style={styles.topLeftViewStyle}>
                    <TouchableOpacity
                        onPress={!isLoginIn ? () => this.pushToLogin() : this.checkPermission.bind(this)}
                        activeOpacity={0.7}>
                        {this.state.avatarUploading
                            ?
                            <Progress.Circle
                                size={80}
                                showsText={true}
                                progress={this.state.avatarProgress}
                                color={'#ee735c'}
                            />
                            :
                            this.avatorImg()
                        }
                    </TouchableOpacity>
                </View>

                <View style={styles.topCenterViewStyle}>
                    <ATouchableHighlight onPress={() => isLoginIn ? this.pushToDetail(nickname) : this.pushToLogin(1)}>
                        <View style={[{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }, PlatfIOS ? {width: deviceWidth / 2 - 5} : {width: deviceWidth / 2 - 10}]}>
                            <Text style={{
                                color: 'white',
                                fontSize: px2dp(PlatfIOS ? Sizes.navSize : (16)),
                            }}
                                  numberOfLines={1}
                                  ellipsizeMode={'middle'}
                            >{name}</Text>
                            {isLoginIn &&
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontSize: px2dp(PlatfIOS ? Sizes.searchSize : (12)),
                                    color: 'orange',
                                    marginLeft: 10,
                                    marginRight: 1,
                                }}>修改</Text>
                                <Image source={Images.mineModify} style={{width: 10, height: 10}}/>
                            </View>}
                        </View>
                    </ATouchableHighlight>
                    {isLoginIn && gradeName ? <View style={{
                        backgroundColor: 'transparent',
                        marginTop: scaleSize(14), flexDirection: 'row', alignItems: 'center'
                    }}>
                        <Text style={[{
                            color: 'white',
                            backgroundColor: 'transparent',
                            fontSize: Platform.OS === 'ios' ? px2dp(Sizes.listSize) : px2dp(Sizes.searchSize)
                        }]}>专家等级 </Text>
                        <Image source={{uri: gradeImgUrl}} style={{
                            width: scaleSize(25),
                            height: scaleSize(25),
                            marginRight: scaleSize(6)
                        }}/>
                        <Text style={[{
                            color: 'white',
                            backgroundColor: 'transparent',
                            fontSize: Platform.OS === 'ios' ? px2dp(Sizes.listSize) : px2dp(Sizes.searchSize)
                        }]}>{gradeName}</Text>
                    </View>:null}
                </View>

                {/*   {isLoginIn && <ATouchableHighlight style={styles.signStyle}
                                                   onPress={() => this.onRightPress(userid)}>
                    <View style={{
                        width: scaleSize(120),
                        height: scaleSize(50),
                        borderRadius: scaleSize(25),
                        backgroundColor: "#FF8600",
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{fontSize: setSpText(26), color: "white", marginRight: 5}}>签到</Text>
                    </View>
                </ATouchableHighlight>}*/}
               {/* {certifiedType && certifiedType !== 'undefined' &&
                <View style={{width:scaleSize(100),height:scaleSize(100), backgroundColor:'white',alignSelf: 'flex-end'}}>
                    <Text>申请</Text>
                </View>}*/}
            </View>
        );
    }

    onRightPress(userid) {
        // DeviceEventEmitter.emit('RootView')
        const {navigate} = this.props.navigation;
        navigate('SignView', {
            title: '签到',
            callback: (score) => this.props.callback(score)
        })
    }

    avatorImg() {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let avatarSource = this.state.avatarSource || this.extracted();
        let isShowAvatar = isLoginIn && userObj && avatarSource;
        return (
            <View style={{flexDirection: 'column', alignItems: 'center',}}>
                <Image
                    source={isShowAvatar ? {uri: avatarSource} : Images.discussDefaultHead}
                    style={styles.avatar}/>
                {!isShowAvatar && <Image source={Images.mineCamero}
                                         style={{
                                             width: scaleSize(32),
                                             height: scaleSize(32),
                                             position: 'absolute',
                                             right: 0,
                                             bottom: PlatfIOS ? 8 : 4
                                         }}/>}
            </View>
        );
    }

    _upload(body) {
        let xhr = new XMLHttpRequest();
        //上传到七牛云的地址
        //  let url = 'http://upload-z2.qiniu.com';
        let url = 'http://up-z0.qiniu.com';
        // 开启post上传
        this._isMounted && this.setState({
            avatarUploading: true,
            avatarProgress: 0
        });
        xhr.open('POST', url);
        //上传成功的返回
        xhr.onload = () => {
            // 状态码如果不等于200就代表错误
            if (xhr.status !== 200) {
                alert('请求失败');
                return;
            }
            if (!xhr.responseText) {
                alert('请求失败');
                return;
            }

            let response;
            try {
                response = JSON.parse(xhr.response)
            } catch (e) {
                console.log('请求失败')
            }

            if (response) {
                this._isMounted && this.setState({
                    avatarUploading: false,
                    avatarProgress: 0,
                });
                this._asyncUser(response.key)
            }
        };

        if (xhr.upload) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    var percent = (event.loaded / event.total).toFixed(2);
                    this.perent = percent;
                    this._isMounted && this.setState({
                        avatarProgress: percent * 1
                    })
                }
            }
        }

        // 发送请求
        xhr.send(body);
    }

    //修改头像接口
    _asyncUser(key) {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let urlData = [{
            url: key,
            key: key
        }];

        let lg = JSON.stringify(urlData);
        let imgUrl = lg.replace('\\', '');
        let data = {
            id: userObj.userid,
            logo: imgUrl
        };
        getQiuNiuImageData(data, (res) => {
            let img = this.extracted(key);
            this.props.loginAction.updateUserInfo({logo: img});
            this._isMounted && this.setState({
                avatarSource: img
            });
        }, (err) => {
            console.log('err', err)
        })
    }

    pushToDetail(nickname) {
        const {navigate} = this.props.navigation;
        navigate('ModifyMeHeaderView', {
            title: '修改昵称',
            rightTitle: '保存',
            name: nickname,
            callback: (name) => {
                this._isMounted && this.setState({nickName: name})
            }
        })
    }

    pushToLogin(option) {
        let {navigation} = this.props;

        if (option) {
            pushToLogin(navigation, {
                callback: () => this.loginAfter()
            })
        } else {
            LoginAlerts(navigation, {
                callback: () => this.loginAfter()
            })
        }
    }

    loginAfter() {
        this.setUserInfo();
        this.props.callback()
    }

    setUserInfo() {
        const {isLoginIn, userObj: {userid, nickname = ''}, domainObj} = this.props.state.Login;
        if (isLoginIn) {
            this._isMounted && this.setState({
                avatarSource: this.extracted(),
                nickName: Debug ? `${nickname}${userid || ""}` : nickname
            })
        } else {
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const styles = StyleSheet.create({
    topViewStyle: {
        // width: deviceWidth,
        flexDirection: 'row',
        paddingLeft: scaleSize(20),
        paddingVertical: scaleSize(20),
        flex: 1,
    },

    topLeftViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        ios: {
            width: scaleSize(190)
        },
        android: {flex: 1.5},
    },

    topCenterViewStyle: {
        justifyContent: 'center',
        ios: {
            width: deviceWidth - scaleSize(190) - scaleSize(115),
        },
        android: {
            flex: 4,
        },
    },
    signStyle: {
        ios: {
            width: scaleSize(120),
            flex: 1
        },
        android: {width: scaleSize(95)},
        justifyContent: 'center'
    },
    avatar: {
        borderRadius: PlatfIOS ? scaleSize(75) : scaleSize(70),
        width: PlatfIOS ? scaleSize(150) : scaleSize(140),
        height: PlatfIOS ? scaleSize(150) : scaleSize(140),
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        loginAction: bindActionCreators(LoginAction, dispatch)
    }), null, {withRef: true}
)(MeHeaderView);