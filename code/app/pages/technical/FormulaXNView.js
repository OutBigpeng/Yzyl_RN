/**配方 页面
 * Created by coatu on 2017/8/24.
 */
import React, {Component} from 'react'
import {Image, Modal, StyleSheet, Text, View} from 'react-native'

import *as LoginAction from '../../actions/LoginAction'
import {
    bindActionCreators,
    Colors,
    connect,
    deviceHeight,
    deviceWidth,
    ImageStitching,
    Loading,
    LoginAlerts,
    Metrics,
    Sizes, subString
} from '../../common/CommonDevice'
import {CommonButton} from '../../component/CommonAssembly'
import {getFormulaPFById, getFormulaXNById} from "../../dao/CoatingUniversityDao";
import ImageModal from "../../component/ImageModal";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {toastShort} from "../../common/ToastUtils";
import ShareModalView from "../../component/ShareModalView";
import {getIsCollectData} from '../../dao/HomeDao'
import {px2dp} from "../../common/CommonUtil";
import Toast from "react-native-root-toast";

let isSelectedCollect;
let defaultImg400 = require('../../imgs/other/defaultimg.png');

class FormulaXNView extends Component {
    rightOnPress = () => {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        if (!isLoginIn) {
            this.jumpLogin()
        } else {
            let data = {
                "articleId": this.state.detailData.id,
                "type": "formula"
            };
            // this.getLoading().show();
            getIsCollectData(data, this.props.navigation, (res) => {
                if (res.result == 1) {
                    toastShort('收藏成功!');
                } else {
                    toastShort('取消收藏！');
                }
                this.navImage(res.result)
            }, (err) => {
                toastShort('收藏失败!');
                console.log('失败')
            })
        }
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            modalVisible: false,
            imgModalVisible: false,
            shareModalVisible: false,
            detailData: {},
            isSelectedImageUrl: require('../../imgs/shop/shoucang.png')
        };

        this._isMounted;
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    componentWillUnmount() {
        const {state} = this.props.navigation;
        if (state.params && state.params.callback) {
            state.params.callback(isSelectedCollect, state.params.id);
        }
        isSelectedCollect = '';
        this._isMounted = false
    }

    componentDidMount() {
        this._isMounted = true;
        this.getNetWork()
    }

    getNetWork() {
        const {navigate} = this.props.navigation;

        if (this._isMounted) {
            if (this.getLoading()) {
                this.getLoading().show();
            }
            let {state, goBack} = this.props.navigation;
            let data = {'id': state.params.id, "view": true};
            getFormulaXNById(data, this.props.navigation, (res) => {
                this.navImage(res.isCollect);
                if (this.getLoading()) {
                    this.getLoading().dismiss();
                }
                this.setState({
                    detailData: res,
                })
            }, (err) => {
                if (this.getLoading()) {
                    this.getLoading().dismiss();
                }
                console.log('err', err);
                toastShort("数据有异，稍后再试！！", Toast.positions.CENTER);
                goBack();
            });
        }
    }

    navImage(type) {
        isSelectedCollect = type;
        this.props.navigation.setParams({
            rightRightImage: type == 1 ? require('../../imgs/me/shoucang.png') : require('../../imgs/shop/shoucang.png'),
            rightOnPress: this.rightOnPress
        })
    }

    render() {
        let {xnImgUrl='',xnName='',id,campus='',thumb='',publishDate=''} = this.state.detailData;
        const {userObj = {}, domainObj} = this.props.state.Login;
        if (domainObj && xnImgUrl) {
            let domain = domainObj.prd;
            xnImgUrl = ImageStitching(xnImgUrl, domain);
        }
        return (
            <View style={styles.container}>
                {xnImgUrl ?
                    <View style={{flex: 1, marginTop: 10}}>
                        <ATouchableHighlight onPress={() => {
                            this.setState({imgModalVisible: true})
                        }}>
                            <Image
                                style={{width: deviceWidth, height: deviceHeight - 200}}
                                source={{uri: xnImgUrl}} // 照片路径
                                resizeMode={Image.resizeMode.contain}
                            />
                        </ATouchableHighlight>

                        <View style={[styles.bottomViewStyle, styles.bottomBoxViewStyle]}>
                            <ATouchableHighlight
                                onPress={() => this.setState({shareModalVisible: !this.state.shareModalVisible})}>
                                <View style={styles.bottomLeftViewStyle}>

                                    <Image source={require('../../imgs/home/share.png')} style={styles.imageStyle}/>
                                    <Text style={styles.textStyle}>分享</Text>
                                </View>
                            </ATouchableHighlight>


                            <CommonButton
                                title='获取配方'
                                buttonOnPress={() => this.pushToPeiFang()}
                                buttonStyle={[styles.getFormulaStyle]}
                                buttonFlex={1}
                            />
                        </View>
                    </View> : <View/>}

                <Modal
                    animationType={"none"}
                    transparent={true}
                    onRequestClose={() => this.state.modalVisible}
                    visible={this.state.modalVisible}>

                    <View style={styles.modalViewStyle}>
                        <View style={styles.modalTopViewStyle}>
                            <View style={styles.viewBoxStyle}>
                                <Text style={styles.titleStyle}>您还未通过注册审核！请等待！</Text>
                            </View>

                            <CommonButton
                                title='确定'
                                buttonFlex={1}
                                buttonWidth={deviceWidth - 100}
                                buttonOnPress={() => this.setModalVisible(!this.state.modalVisible)}
                                buttonStyle={[styles.buttonStyle]}
                            />
                        </View>
                    </View>
                </Modal>
                <ImageModal
                    modalVisible={this.state.imgModalVisible}
                    imageUrl={xnImgUrl}
                    onPress={() => this.setState({imgModalVisible: !this.state.imgModalVisible})}
                    isEnable={true}
                />
                {/*分享*/}
                <ShareModalView
                    key={'FormulaXN_share'}
                    {...this.props}
                    visible={this.state.shareModalVisible}
                    closeModal={() => this.setState({shareModalVisible: false})}
                    view='FormulaXN'
                    shareDiscuss = {{title:xnName,campus:campus,time:subString(publishDate),id:id,catId:11,thumb:thumb,domain:domainObj.prd}}
                    title={xnName}
                    id={id}
                    loginAfter={() => this.loginAfter()}
                />
                <Loading ref={'loading'}/>
            </View>
        );
    }

    loginAfter() {
        this.getNetWork()
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    pushToPeiFang() {
        const {navigate, state} = this.props.navigation;
        if (this.getLoading()) {
            this.getLoading().show();
        }
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        if (isLoginIn) {
            let data = {'id': state.params.id, userid: userObj.userid, "view": true};
            getFormulaPFById(data, this.props.navigation, (res) => {
                if (this.getLoading()) {
                    this.getLoading().dismiss();
                }
                if (domainObj && res.pfImgUrl) {
                    let prd = domainObj.prd;
                    let url = ImageStitching(res.pfImgUrl, prd);
                    let thumb = ImageStitching(res.thumb, prd);
                    // console.log("res", res);
                    navigate('FormulaView', {
                        name: 'FormulaView',
                        title: '配方详情',
                        imageUrl: url,
                        imageThumb: thumb,
                        isMaterial: res.isMaterial,
                        formulaId: res.id
                    });
                }
            }, (err) => {
                if (this.getLoading()) {
                    this.getLoading().dismiss();
                }
                if (err.code == '637') {
                    toastShort(err.msg)
                }
            })
        } else {
            this.jumpLogin();
        }
    }

    jumpLogin() {
        const {navigate, state} = this.props.navigation;
        if (this.getLoading()) {
            this.getLoading().dismiss();
        }
        // this.props.loginAction.checkLogin();
        LoginAlerts(this.props.navigation, {
            callback: () => this.getNetWork()
        });

    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'white'
    },

    modalViewStyle: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    modalTopViewStyle: {
        backgroundColor: 'white',
        width: deviceWidth - 80,
        height: 150,
        borderRadius: 10,
        alignItems: 'center'
    },

    viewBoxStyle: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.line,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center'
    },

    titleStyle: {
        fontSize: px2dp(Sizes.navSize),
        color: Colors.contactColor
    },

    buttonStyle: {
        width: deviceWidth - 100,
        marginTop: 15
    },

    getFormulaStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
        flex: 1,
        width: deviceWidth - 80
    },
    bottomBoxViewStyle: {
        flexDirection: 'row',
        height: Metrics.buttonHeight,
        // flex: 1
    },
    bottomViewStyle: {
        position: 'absolute',
        bottom: 0,
    },
    bottomLeftViewStyle: {
        flexDirection: 'row',
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        paddingLeft: 15,
        paddingRight: 15
    },

    imageStyle: {
        width: 20,
        height: 20,
        marginRight: 6
    },

    textStyle: {
        color: 'white',
        fontSize: px2dp(Sizes.navSize)
    },
});
export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        loginAction: bindActionCreators(LoginAction, dispatch),
    })
)(FormulaXNView);