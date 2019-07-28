/**首页产品的头部
 * Created by coatu on 2016/12/26.
 */
import React, {PureComponent} from "react";
import {Animated, Image, InteractionManager, Platform, Text, View} from "react-native";
import {
    actionBar,
    BGTextColor,
    bindActionCreators,
    borderRadius,
    connect,
    deviceWidth,
    LoginAlerts,
    PlatfIOS,
    px2dp,
    Sizes
} from "../../common/CommonDevice";
import TypeView from "./type/TypeView";
import {StyleSheet} from '../../themes';
import ATouchableHighlight from "../../component/ATouchableHighlight";
import *as LoginAction from "../../actions/LoginAction";
import *as FindAction from "../../actions/FindAction";
import {scaleSize} from "../../common/ScreenUtil";
import ShareModalView from "../../component/ShareModalView";
import {Alerts} from "../../common/CommonUtil";

let WeChat = require('react-native-wechat');

class ProductNavigator extends PureComponent {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            opacity: new Animated.Value(0),
            modalVisible: false
        };
        this._isMounted;
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    render() {
        const {type, lbsOpaticy, searchOnPress} = this.props;
        let count = this.props.state.Find.collectProductCount || 0;
        let isLogin = this.props.state.Login.isLoginIn;
        let color;
        // if (!isNetWork) {
        color = 'rgba(228,57,60,1)';
        // } else {
        //     color = lbsOpaticy;
        // }
        return (
            <Animated.View style={[styles.container, {backgroundColor: color/*,paddingTop: StatusBar.currentHeight*/}]}>
                <View style={[styles.searchbg]}>
                    {!type ? <ATouchableHighlight onPress={() => this.pushToDetail(1)}>
                        <View style={styles.leftViewStyle}>
                            <Image source={require('../../imgs/shop/artboard.png')}
                                   style={[styles.category]}/>
                            <Text style={styles.leftTextStyle}>分类</Text>
                        </View>
                    </ATouchableHighlight> : null}

                    <ATouchableHighlight
                        onPress={searchOnPress ? searchOnPress : () => this.pushToDetail(2)}>
                        <View style={[styles.textInputViewStyle, {/*{backgroundColor: '#rgba(255,255,255,0.6)'}*/}]}>
                            <Image source={require('../../imgs/navigator/seek.png')}
                                   style={styles.searchImageStyle}/>
                            <Text style={styles.placeholderText}>优众优料任你选</Text>
                        </View>
                    </ATouchableHighlight>
                    <ATouchableHighlight onPress={() => this.pushToDetail(4)}>
                        <View style={styles.leftViewStyle}>
                            <Image source={require('../../imgs/shop/share.png')}
                                   style={[styles.category]}/>
                            <Text style={styles.leftTextStyle}>分享</Text>
                        </View>
                    </ATouchableHighlight>
                    {/*{!type ? <ATouchableHighlight onPress={() => this.pushToDetail(3)}>
                        <View style={[styles.leftViewStyle,styles.collectionViewStyle]}>
                            <Image source={require('../../imgs/shop/shoucang.png')}
                                   style={styles.category}/>
                            {isLogin && count > 0 ?
                                <View style={styles.collectionCircleViewStyle}>
                                    <Text
                                        style={styles.collectionTextStyle}>{count > 10 ? '···' : count}</Text>
                                </View> : <View/>}
                            <Text style={{marginTop: 2, color: 'white', fontSize: px2dp(Sizes.otherSize)}}>收藏夹</Text>
                        </View>
                    </ATouchableHighlight> : <View/>}*/}
                </View>
                {this.state.modalVisible && <ShareModalView
                    key={'app_share'}
                    {...this.props}
                    visible={this.state.modalVisible}
                    closeModal={() => this.setModalVisible(false)}
                    isAppShare={true}
                    loginAfter={() => {
                    }}
                />}
            </Animated.View>
        )
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    pushToDetail(type) {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 1:
                this.jump('TypeView', '全部分类', true);
                break;
            case 2:
                // this.jump('ProductList', '', true, 1);
                this.jump('SearchFirstView', '', true, 5, "Pro");
                break;
            case 3:
                const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

                if (!isLoginIn) {
                    LoginAlerts(this.props.navigation, {
                        callback: () => this.props.findAction.fetchCollectProductCount({}, 0)
                    })
                } else {
                    this.jump('CollectionView', '收藏夹', false);
                }
                break;
            case 4://分享
                WeChat.isWXAppInstalled().then((isInstalled) => {
                    if (isInstalled) {
                        this.setModalVisible(true);
                    } else {
                        Alerts('微信未安装，请您安装微信再分享!');
                    }
                }).catch((err) => {
                });
                break;
            default:
                break
        }

    }

    jump(name, title, rightImageSource, paged, selectItem) {
        const {navigate} = this.props.navigation;
        InteractionManager.runAfterInteractions(() => {
            navigate(name, {
                name: name,
                title: title,
                paged: paged,
                selectItem: selectItem,
                rightImageSource: rightImageSource
            })
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: Platform.OS === 'ios' ? 64 : actionBar,
        backgroundColor: BGTextColor,
        flexDirection: 'row',
        // position: 'absolute',
        // top: 0
    },

    textInputViewStyle: {
        width: deviceWidth / 4 * 3,
        backgroundColor: 'white',
        padding: scaleSize(5),
        borderRadius: scaleSize(45),
        ios: {
            height: 35,
            marginTop: 22,
            paddingTop: 1
        },
        android: {
            flexDirection: 'row',
            alignItems: 'center'
        },
    },

    placeholderText: {
        ios: {
            marginTop: scaleSize(PlatfIOS ? 18 : 20),
            color: 'gray',
            fontSize: px2dp(Sizes.listSize),
            marginLeft: scaleSize(70)
        },
        android: {
            margin: 5,
            color: 'gray',
            fontSize: px2dp(Sizes.searchSize)
        }
    },

    leftViewStyle: {
        ios: {
            marginTop: scaleSize(53),
        },
        android: {
            // marginTop: 2,
        },
        paddingHorizontal: scaleSize(24),
        alignItems: 'center',
    },
    leftTextStyle: {
        marginTop: scaleSize(PlatfIOS ? 6 : 2),
        color: 'white',
        fontSize: px2dp(Sizes.otherSize)
    },
    searchImageStyle: {
        marginLeft: scaleSize(PlatfIOS ? 30 : 25),
        ios: {
            position: 'absolute',
            top: 10,
            width: 16,
            height: 16
        },
        android: {
            height: 13,
            width: 13,
        }
    },

    category: {
        width: scaleSize(30),
        height: scaleSize(30),
        android: {
            alignSelf: 'center',
            alignItems: 'center'
        },
    },

    searchbg: {
        ios: {
            flexDirection: 'row',
            width: deviceWidth,
            justifyContent: 'center'
        },
        android: {
            flexDirection: 'row',
            alignItems: 'center',
            width: deviceWidth,
            justifyContent: 'center',
        },
    },

    collectionCircleViewStyle: {
        ios: {
            position: 'absolute',
            right: scaleSize(14),
            top: -scaleSize(8),
            width: scaleSize(32),
            height: scaleSize(32),
            borderWidth: 0.5,
            borderRadius: scaleSize(16)
        },
        android: {
            position: 'absolute',
            right: 1,
            top: 6,
            width: scaleSize(24),
            height: scaleSize(24),
            borderWidth: 0.3,
            borderRadius: 6,
        },
        backgroundColor: 'white',
        borderColor: 'red',
        alignItems: 'center',
        justifyContent: "center"
    },

    collectionViewStyle: {
        paddingHorizontal: scaleSize(20),
    },

    collectionTextStyle: {
        fontSize: px2dp(PlatfIOS ? 8 : 8),
        color: BGTextColor,
        // ios: {marginTop: 1,},
    },

    textViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        loginAction: bindActionCreators(LoginAction, dispatch),
        findAction: bindActionCreators(FindAction, dispatch),
    })
)(ProductNavigator);