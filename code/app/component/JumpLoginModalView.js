/**分享弹窗
 * Created by coatu on 2016/12/29.
 */
import React, {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {BGTextColor, deviceHeight, deviceWidth, PlatfIOS} from "../common/CommonDevice";
import PropTypes from 'prop-types';
import {px2dp} from "../common/CommonUtil";
import {scaleSize} from "../common/ScreenUtil";

export default class JumpLoginModalView extends Component {
    static propTypes = {
        isShowCancel: PropTypes.bool,
        isShowSure: PropTypes.bool,
        cancelText: PropTypes.string,
        sureText: PropTypes.string,
        titleText: PropTypes.string,
        contentText: PropTypes.string,
        surePress: PropTypes.func,
        isShowContent: PropTypes.bool
    };
    static defaultProps = {
        isShowCancel: true,
        isShowSure: true,
        isShowContent: true,
        cancelText: '取消',
        sureText: '确定',
        titleText: '登录才能操作哦！',
        contentText: "确定去登录？"
    };


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        let {titleText, contentText, cancelText, sureText, isShowCancel = true, isShowSure = true, isShowContent = true} = this.props;
        let modalWidth = deviceWidth / 5 * 4;
        let modalHeight = deviceHeight / 4;
        let btHeight = 40;
        return (
            <View style={{flex: 1, backgroundColor: '#aaaaaa11', alignItems: 'center', justifyContent: 'center'}}>
                <View style={{
                    backgroundColor: 'white',
                    width: modalWidth,
                    height: modalHeight,
                    borderRadius: scaleSize(15),
                    alignItems: 'center',
                }}>
                    <View style={{
                        marginTop: scaleSize(10),
                        alignItems: 'center',
                        justifyContent: "center",
                        flex: 1,
                        paddingHorizontal: scaleSize(10)
                    }}>
                        <View style={{flex: 1, justifyContent: "center"}}>
                            <Text style={{
                                fontSize: px2dp(PlatfIOS ? 20 : 18),
                                color: '#rgba(0,0,0,0.8)',
                            }}>{titleText}</Text>
                        </View>
                        <View style={{flex: 1, justifyContent: "center"}}>
                            {isShowContent && <Text style={{
                                fontSize: px2dp(PlatfIOS ? 18 : 17),
                                color: '#rgba(0,0,0,0.8)',
                                marginTop: scaleSize(10),
                            }}>{contentText}</Text>
                            }
                        </View>
                    </View>
                    <View style={{
                        backgroundColor: '#99999966',
                        height: 0.5,
                        width: modalWidth - 10,
                        position: 'absolute',
                        bottom: btHeight + 20,
                        flex: 1
                    }}/>
                    <View style={{flexDirection: 'row', flex: 1, alignItems: 'flex-end'}}>
                        {isShowCancel && <TouchableOpacity
                            style={[styles.btStyle, {
                                height: btHeight,
                                margin: 10,
                            }]}
                            activeOpacity={0.8}
                            onPress={() => this.props.onPress()}>
                            <Text style={{fontSize: 16, color: 'white'}}>{cancelText}</Text>
                        </TouchableOpacity>}
                        {isShowSure && <TouchableOpacity
                            style={[styles.btStyle, {
                                height: btHeight,
                                marginRight: 10,
                                marginBottom: 10,
                                marginTop: 10,
                            }]}
                            activeOpacity={0.8}
                            onPress={() => this.props.surePress() || null}>
                            <Text style={{fontSize: 16, color: 'white'}}>{sureText}</Text>
                        </TouchableOpacity>}
                    </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    bgViewStyle: {
        flex: 1,
        height: deviceHeight,
        backgroundColor: '#rgba(0,0,0,0.2)'
    },
    btStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: deviceWidth / 3,
        backgroundColor: BGTextColor,
        borderRadius: 5,
    },
});
