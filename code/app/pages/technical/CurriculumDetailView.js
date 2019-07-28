/**
 *  课程详情页面
 * Created by coatu on 2017/8/24.
 */
import React, {Component} from 'react'
import {Image, StyleSheet, Text, View, WebView} from 'react-native'

import {
    BGTextColor,
    bindActionCreators,
    connect,
    deviceWidth,
    Loading,
    LoginAlerts,
    Sizes,
    subString,
    toastShort
} from '../../common/CommonDevice'
import {CommonButton} from '../../component/CommonAssembly'
import {getUniversityCourse} from "../../dao/CoatingUniversityDao";
import ShareModalView from "../../component/ShareModalView";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {getIsCollectData} from '../../dao/HomeDao';
import *as LoginAction from '../../actions/HomeAction'
import {px2dp} from "../../common/CommonUtil";
import Toast from "react-native-root-toast";

let isSelectedCollect;
let newsShare = Debug ? "http://210.16.189.102:3005" : 'http://news.youzhongyouliao.com';

class CurriculumDetailView extends Component {
    rightOnPress = () => {
        if (!this.props.state.Login.isLoginIn) {
            this.jumpLogin();
            return;
        }

        const {navigate} = this.props.navigation;
        let data = {
            "articleId": this.state.detailData.id,
            "type": "course"
        };
        // this.getLoading().show();
        getIsCollectData(data, this.props.navigation, (res) => {
            if (res.result === 1) {
                toastShort('收藏成功!');
            } else {
                toastShort('取消收藏！');
            }
            // if(this.getLoading()){
            //     this.getLoading().dismiss()
            // }
            this.navImage(res.result)
        }, (err) => {
            // if(this.getLoading()){
            //     this.getLoading().dismiss()
            // }
            toastShort('收藏失败!');
            console.log('失败')
        })

    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            detailData: {},
            modalVisible: false,
            jumpLoginModal: false,
        };
        this._isMounted ;

    }

    componentDidMount() {
        this._isMounted = true;

        this.getNetWork()
    }

    getNetWork() {
        let {state, navigate, goBack} = this.props.navigation;
        this.getLoading().show();
        let data = {'id': state.params.id, "view": true};
        getUniversityCourse(data, this.props.navigation, (res) => {
            this.navImage(res.isCollect);
            if (this.getLoading()) {
                this.getLoading().dismiss()
            }
            this._isMounted&&  this.setState({
                detailData: res
            })
        }, (err) => {
            if (this.getLoading()) {
                this.getLoading().dismiss()
            }
            console.log('err', err);
            toastShort("数据有异，稍后再试！！", Toast.positions.CENTER);
            goBack();
        });
    }

    componentWillUnmount() {
        const {state} = this.props.navigation;
        this._isMounted = false;

        if (state.params && state.params.callback) {
            state.params.callback(isSelectedCollect, state.params.id);
        }
        isSelectedCollect = '';
    }

    navImage(type) {
        isSelectedCollect = type;
        this.props.navigation.setParams({
            rightRightImage: type === 1 ? require('../../imgs/me/shoucang.png') : require('../../imgs/shop/shoucang.png'),
            rightOnPress: this.rightOnPress
        })
    }

    jumpLogin() {
        const {navigate, state} = this.props.navigation;
        if (this.getLoading()) {
            this.getLoading().dismiss();
        }
        LoginAlerts(this.props.navigation, {
            callback: () => this.getNetWork()
        })
    }

    render() {//newsShare+this.state.detailData.url
        let {url = '', end = '', coursename = '', campus, opendate, id, thumb} = this.state.detailData;
        const {userObj = {}, domainObj} = this.props.state.Login;

        let contact = "";
        if (campus && opendate) {
            opendate = subString(opendate);
            contact =`${campus} ${opendate}`;
        }

        return (
            <View style={styles.container}>
                {url ? <WebView
                    ref={(c) => {
                        this.web = c
                    }}
                    source={{uri: newsShare + url}}
                    domStorageEnabled={true}
                    javaScriptEnabled={true}
                    scrollEnabled={true}
                    startInLoadingState={true}
                    automaticallyAdjustContentInsets={false}
                /> : <View/>}

                <View style={styles.bottomViewStyle}>
                    {url ? <View style={styles.bottomBoxViewStyle}>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'black'
                        }}>
                            <ATouchableHighlight onPress={() => {
                                this.setModalVisible(true)
                            }
                            }>
                                <View style={styles.bottomLeftViewStyle}>
                                    <Image source={require('../../imgs/home/share.png')} style={styles.imageStyle}/>
                                    <Text style={styles.textStyle}>分享</Text>
                                </View>
                            </ATouchableHighlight>
                        </View>

                        <CommonButton
                            title={end ? '报 名' : '已 结 束'}
                            buttonViewWidth={100}
                            buttonOnPress={end ? () => this.pushToSighUp() : null}
                            buttonStyle={[styles.buttonViewStyle, end ? {
                                backgroundColor: BGTextColor,
                            } : {
                                backgroundColor: 'gray',
                            }]}
                        />
                    </View> : <View/>}
                </View>
                {/*分享*/}
                <ShareModalView
                    key={'Curriculum_share'}
                    {...this.props}
                    visible={this.state.modalVisible}
                    closeModal={() => this.setModalVisible(false)}
                    view='Curriculum'
                    title={coursename}
                    shareDiscuss={{
                        title: coursename,
                        campus: campus,
                        time: opendate,
                        id: id,
                        catId: 10,
                        thumb: thumb,
                        domain: domainObj.prd
                    }}
                    subUrl={url}
                    contact={contact}
                    loginAfter={() => this.loginAfter()}
                />
                <Loading ref={'loading'}/>
            </View>
        )
    }

    loginAfter() {
        this.getNetWork();
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }


    pushToSighUp() {
        const {navigate, state} = this.props.navigation;
        navigate('SignUpView', {
            title: '报 名',
            courseid: state.params.id
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    webView: {
        padding: 10,
        paddingTop: 20

    },
    bottomViewStyle: {
        position: 'absolute',
        bottom: 0
    },

    bottomBoxViewStyle: {
        flexDirection: 'row',
        height: 50,
        width: deviceWidth
    },

    bottomLeftViewStyle: {
        flexDirection: 'row',
        alignItems: "center"
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

    buttonViewStyle: {
        width: deviceWidth - 100,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 0
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        loginAction: bindActionCreators(LoginAction, dispatch),
    })
)(CurriculumDetailView);

