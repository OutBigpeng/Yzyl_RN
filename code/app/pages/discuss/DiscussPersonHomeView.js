/**
 * Created by Monika on 2018/7/20.
 */

'use strict';
import React, {Component} from "react";
import {Image, ImageBackground, Text, View} from "react-native";
import {
    connect,
    deviceHeight,
    deviceWidth,
    Loading,
    LoginAlerts,
    PlatfIOS,
    px2dp,
    Sizes
} from "../../common/CommonDevice";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {scaleSize} from "../../common/ScreenUtil";
import Images from "../../themes/Images";
import MyDiscussListView from "../me/mine/discuss/MyDiscussListView";
import {getHomeUserWithCertifiedData} from "../../dao/HomeDao";
import {StyleSheet} from '../../themes'
import {getApplyUserCertification, getMyExpertScore} from "../../dao/MeDao";
import {getIMGetCanChat} from "../../dao/DiscussDao";
import ShowAlertModal from "./ShowAlertModal";
import {toastShort} from "../../common/ToastUtils";
import Toast from "react-native-root-toast";

let iconWid = scaleSize(150);

class DiscussPersonHomeView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            currentUserObj: {},
            expertScore: {},
            isCanChat: 0,
            modalVisible: false
        };
    };

    componentDidMount() {
        const {navigate, state, goBack} = this.props.navigation;

        this.getLoading() && this.getLoading().show();
        let {/*personData: {userName, userId, logo = '', certifiedType},*/userId} = this.props.navigation.state.params;
        getMyExpertScore({userId}, 0, (res) => {
            this.setState({
                expertScore: res
            })
        }, () => {
        });
        getHomeUserWithCertifiedData({id: userId}, 0, (res) => {
            this.getLoading() && this.getLoading().dismiss();
            this.setState({
                currentUserObj: res
            })
        }, () => {
            goBack();
            this.getLoading() && this.getLoading().dismiss()
        });
        getIMGetCanChat({pageUserId: userId}, 0, (res) => {
            this.setState({
                isCanChat: res
            })
        }, () => {

        })
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }


    render() {
        let {
            isCanChat, modalVisible,
            currentUserObj: {id, nickname, username, certifiedType, certifiedInfo, certifiedTypeName, logoUrl},
            expertScore: {gradeName = '', expertScore = 0, gradeImgUrl},
        } = this.state;
        let bgImgHeight = PlatfIOS ? deviceWidth / 16 * 9 : deviceWidth / scaleSize(750) * scaleSize(320);
        return (
            <View style={styles.container}>
                {/*最上面定义的返回按钮*/}
                {username &&
                <ImageBackground source={require('../../imgs/home/bg1.png')} resizeMode={Image.resizeMode.cover}
                                 style={{
                                     width: deviceWidth,
                                     height: bgImgHeight,
                                     backgroundColor: 'transparent',
                                     flexDirection: PlatfIOS ? 'column' : 'row'
                                 }}>
                    <View style={styles.navViewStyle}>
                        <ATouchableHighlight onPress={() => {
                            const {goBack, state} = this.props.navigation;
                            goBack();
                        }}>
                            <Image source={require('../../imgs/navigator/back_btn.png')}
                                   style={styles.navImageStyle}/>
                        </ATouchableHighlight>
                    </View>

                    {/*头部*/}
                    <View style={[styles.headerViewStyle, {}]}>
                        <Image
                            source={logoUrl ? {uri: logoUrl} : Images.discussDefaultHead} style={styles.imageStyle}
                        />
                        <View style={{
                            paddingHorizontal: scaleSize(20),
                            width: deviceWidth - iconWid / 2 * 3,
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                paddingVertical: scaleSize(PlatfIOS ? 30 : 15),
                            }}>
                                {certifiedType && certifiedType !== 'undefined' &&
                                <Image source={Images.discussAuthentication} style={{
                                    marginRight: scaleSize(5), marginTop: scaleSize(PlatfIOS ? 5 : 10),
                                    width: scaleSize(30),
                                    height: scaleSize(30)
                                }}/>}
                                <Text numberOfLines={2}
                                      ellipsizeMode={'middle'}
                                      style={{
                                          color: 'white',
                                          fontSize: px2dp(Sizes.titleSize),
                                          width: deviceWidth - iconWid - scaleSize(145)
                                      }}>{nickname}</Text>
                            </View>
                            <View
                                style={{flexDirection: 'row', alignItems: 'center'}}>
                                {gradeImgUrl && <Image source={{uri: gradeImgUrl}} style={{
                                    width: scaleSize(25),
                                    height: scaleSize(25),
                                    marginRight: scaleSize(6)
                                }}/>}
                                <Text style={[{
                                    color: 'white',
                                    fontSize: px2dp(PlatfIOS ? Sizes.listSize : Sizes.searchSize)
                                }]}>{`${gradeName}  ${expertScore}专家分`}</Text>
                            </View>

                        </View>
                    </View>
                    <View style={{position: 'absolute', bottom: scaleSize(PlatfIOS?30:20), right: scaleSize(30)}}>
                        <ATouchableHighlight onPress={() => {
                            const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
                            if (isLoginIn) {
                                if (isCanChat) {
                                    let {navigate} = this.props.navigation;
                                    navigate('ChatMsg', {
                                        personId: id,
                                    });
                                } else {
                                    this.setModalVisible(true)
                                }
                            } else {
                                LoginAlerts(this.props.navigation, {
                                    // callback: () => this.loginAfter()
                                })
                            }
                        }
                        }>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: scaleSize(10),
                                paddingHorizontal:scaleSize(15),
                                backgroundColor:'#50CF45',
                                borderRadius: scaleSize(8)
                            }}>
                               <Image source={require('../../imgs/discuss/Chat_25px.png')}
                                      style={{width: scaleSize(32), height: scaleSize(32)}}/>
                               <Text style={{color:'white'}}> 私聊</Text>
                           </View>
                        </ATouchableHighlight>
                    </View>
                </ImageBackground>}
                {id && <MyDiscussListView
                    key={'PersonHomeView_MyDiscussListView'}
                    {...this.props}
                    type="discussHomePage"
                    style={{height: deviceHeight - bgImgHeight}}
                    userId={id}
                />}
                <ShowAlertModal
                    modalVisible={modalVisible}
                    // title={'您当前是未认证状态，此功能受限，现在申请认证？'}
                    content={'您当前是未认证状态，此功能受限，现在申请认证？'}
                    placeholder={'请输入认证理由'}
                    isShowInput={true}
                    cancelText={'暂不'}
                    sureText={'现在申请'}
                    onPress={(flag, text) => {
                        if (flag) {
                            if (text) {
                                getApplyUserCertification({content: text}, 0, () => {
                                    toastShort('申请成功，请等待...', Toast.positions.CENTER)
                                }, () => {
                                })
                            } else {
                                toastShort('请输入认证理由...');
                                return
                            }
                        } else {

                        }
                        this.setModalVisible(false)
                    }}
                />
                <Loading ref={'loading'}/>
            </View>
        );
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }


    renderItem(str, num, onPress) {
        return (
            <ATouchableHighlight style={{flex: 1}} onPress={onPress}>
                <View>
                    <Text
                        style={{alignSelf: "center", color: 'white', fontSize: px2dp(PlatfIOS ? 14 : 12)}}>{str}</Text>
                    <Text style={{
                        alignSelf: "center",
                        color: 'white',
                        fontSize: px2dp(PlatfIOS ? 16 : 14),
                        marginBottom: 5
                    }}>{num}</Text>
                </View>
            </ATouchableHighlight>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navViewStyle: {
        ios: {
            marginTop: scaleSize(34),
        },
        android: {},
    },

    navImageStyle: {
        width: scaleSize(48),//21.6
        height: scaleSize(100),//45.6
        marginLeft: scaleSize(25),
    },
    imageStyle: {
        width: iconWid,
        height: iconWid,
        borderRadius: iconWid / 2
    },
    headerViewStyle: {
        flexDirection: 'row',
        flex: 1,
        // width:  deviceWidth ,
        android: {
            alignItems: "center",
            paddingTop: scaleSize(40)
        },
        ios: {
            paddingLeft: scaleSize(80),
            paddingTop: scaleSize(40)
        },
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(DiscussPersonHomeView);